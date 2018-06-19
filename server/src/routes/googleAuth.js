import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import db from '../db';

const clientId = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(clientId);

function makeToken(uid) {
  const token = new Promise((resolve, reject) => {
    jwt.sign({ sub: uid }, process.env.JWT_SECRET_KEY, (err, newToken) => {
      resolve(newToken);
    });
  });

  return token;
}

const handleGAuth = async (req, res) => {
  const token = req.body.idtoken;
  let userInfo = {};

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    userInfo = {
      email: payload.email,
      profilePhoto: payload.picture,
      firstName: payload.given_name,
      lastName: payload.family_name,
      googleID: payload.sub,
    };
  }
  await verify().catch(err => {
    console.error(err);
    res.status(401);
    res.send('Invalid credentials');
  });

  let user = await db('users')
    .first('uid', 'profilePhoto')
    .where('email', userInfo.email);

  if (!user) {
    // TODO: Create User here
    user = await db('users')
      .insert({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        profilePhoto: userInfo.profilePhoto,
        email: userInfo.email.toLowerCase(),
      })
      .then(userId => {
        const uid = Buffer.from(`users:${userId}`).toString('base64');
        return db('users')
          .where('id', userId)
          .update('uid', uid)
          .select(uid)
          .then(() =>
            db
              .select()
              .from('users')
              .where('id', userId)
              .then(userRows => userRows[0])
          );
      });
  }

  if (!user.profilePhoto) {
    await db('users')
      .where('uid', user.uid)
      .update({
        profilePhoto: userInfo.profilePhoto,
      });
  }

  const userToken = await makeToken(user.uid);

  const responseObj = {
    token: userToken,
    uid: user.uid,
  };

  res.json(responseObj);
};

export default handleGAuth;
