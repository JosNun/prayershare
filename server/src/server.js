import express from 'express';
import jwt from 'express-jwt';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { altairExpress } from 'altair-express-middleware';
import bodyParser from 'body-parser';
import schema from './schema';

const GRAPHQL_PORT = process.env.PORT;

const graphQLServer = express();

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
    schema,
    context: req.context,
  }))
);
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
graphQLServer.use('/altair', altairExpress({ endpointURL: '/graphql' }));

graphQLServer.listen(GRAPHQL_PORT, () =>
  console.log(
    `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql\n` +
      `Oh, and Altair is running on http://localhost:${GRAPHQL_PORT}/altair`
  )
);