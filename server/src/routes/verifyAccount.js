import db from '../db';

const handleVerify = async (req, res) => {
  const host = req.get('host');
  if (!req.params.id) return res.send('Invalid id');

  await db('users')
    .where('uid', req.params.id)
    .update('verified', 1);

  res.send(
    `Your PrayerShare account has been verified. You will be redirrected to the login page shortly. <br>If you aren't automatically redirected, you can click <a href="https://${host}/login">Here</a>
    
    <script>
      setTimeout(() => {window.location.replace('https://${host}/login')}, 5000);
    </script>
    `
  );
};

export default handleVerify;
