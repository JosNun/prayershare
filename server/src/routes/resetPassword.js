import bcrypt from 'bcrypt';
import db from '../db';
import mailer from '../mailer';

const resetPassword = async (req, res) => {
  const { hash, password } = req.params;

  const user = await db('UserResetHash')
    .first('userId as id', 'createdAt')
    .where('resetHash', hash);

  const requestIsOld = new Date() - new Date(user.createdAt) > 3600000;

  console.log(`Request is Old: ${requestIsOld}`);

  if (requestIsOld) {
    res.status(410);
    res.send(
      'Sorry, but it has been too long since you requested the reset. Try resetting again.'
    );
    return false;
  }

  const passHash = await bcrypt.hash(password, 12);

  await db('UserResetHash')
    .del()
    .where('userId', user.id);

  await db('users')
    .update('password', passHash)
    .where('id', user.id);

  res.send('Your password has been reset successfully.');
  return false;
};

const generateResetHash = async (req, res) => {
  const { email } = req.params;
  const host = req.get('host');
  if (!email) return res.send('Invalid account');

  const uniqueHash = await bcrypt.hash(email + Math.random(), 12);

  const user = await db('users')
    .first('id')
    .where('email', email)
    .catch(err => {
      res.send('invalid email address');
    });

  const userId = user.id;

  await db('userResetHash')
    .del()
    .where('userId', userId);

  await db('userResetHash').insert({
    userId,
    resetHash: uniqueHash,
  });

  const resetMail = `
    You can reset your PrayerShare password at this link: <a href="https://${host}/password-reset/${uniqueHash}">https://${host}/password-reset/${uniqueHash}</a>
    <br />
    Didn't request a password reset? Then please ignore this email. No action will be taken.
  `;

  const resetMailPlain = `
  You can reset your PrayerShare password at this link: https://${host}/password-reset/${uniqueHash}

  Didn't request a password reset? Then please ignore this email. No action will be taken.
`;

  try {
    await mailer.sendMail({
      to: email,
      subject: 'Reset your password',
      text: resetMailPlain,
      html: resetMail,
    });
  } catch (err) {
    res.send('Uh oh, an error has occured :(');
    return false;
  }

  res.send(`An email has been sent to ${email} with further instructions.`);
};

export { resetPassword, generateResetHash };
