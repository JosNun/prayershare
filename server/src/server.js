import express from 'express';
import jwt from 'express-jwt';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { altairExpress } from 'altair-express-middleware';
import cors from 'cors';
import { formatError } from 'apollo-errors';
import bodyParser from 'body-parser';
import https from 'https';
import fs from 'fs';
import path from 'path';

import schema from './schema';
import googleAuth from './routes/googleAuth';
import verifyAccount from './routes/verifyAccount';
import { resetPassword, generateResetHash } from './routes/resetPassword';

const GRAPHQL_PORT = process.env.PORT || 8080;

const graphQLServer = express();

graphQLServer.use(cors());

graphQLServer.use(
  '/graphql',
  jwt({
    secret: process.env.JWT_SECRET_KEY,
    credentialsRequired: false,
  })
);
graphQLServer.use('/graphql', (req, res, done) => {
  if (req.user) {
    req.context = {
      userId: req.user.sub,
    };
  }
  done();
});
graphQLServer.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    formatError,
    schema,
    context: { ...req.context, req },
    debug: false,
  }))
);
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
graphQLServer.use('/altair', altairExpress({ endpointURL: '/graphql' }));
graphQLServer.use('/verify/:id?', verifyAccount);
graphQLServer.post('/reset/:email?', generateResetHash);
graphQLServer.post('/password-reset/:hash/:password', resetPassword);
graphQLServer.use('/google-auth', bodyParser.json(), googleAuth);
graphQLServer.use(
  express.static(path.join(__dirname, '../..', 'client/build'))
);
graphQLServer.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../..', 'client/build/index.html'))
);

const httpsOptions = {
  key: fs.readFileSync('./server/src/key.pem'),
  cert: fs.readFileSync('./server/src/cert.pem'),
};

graphQLServer.listen(GRAPHQL_PORT, () =>
  console.log(`App listening on port ${GRAPHQL_PORT}!`)
);

// const server = https
//   .createServer(httpsOptions, graphQLServer)
//   .listen(GRAPHQL_PORT, () => {
//     console.log(
//       `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql\n` +
//         `Oh, and Altair is running on http://localhost:${GRAPHQL_PORT}/altair`
//     );
//   });
