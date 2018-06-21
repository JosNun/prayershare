import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  port: 465,
  host: 'smtp.gmail.com',
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_ACCOUNT,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
    accessToken: process.env.GOOGLE_CLIENT_ACCESS_TOKEN,
  },
});

transport
  .verify()
  .then(() => {
    console.info('nodemailer ready');
  })
  .catch(err => {
    console.error('nodemailer failed to connect!');
    console.log(err);
  });

export default transport;
