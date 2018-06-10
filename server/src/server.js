import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { altairExpress } from 'altair-express-middleware';
import bodyParser from 'body-parser';
import schema from './schema';

const GRAPHQL_PORT = 3001;

const graphQLServer = express();

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
graphQLServer.use('/altair', altairExpress({ endpointURL: '/graphql' }));
graphQLServer.use('/someurl', (req, res) => {
  res.send('I work!');
});

graphQLServer.listen(GRAPHQL_PORT, () =>
  console.log(
    `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql\n` +
      `Oh, and Altair is running on http://localhost:${GRAPHQL_PORT}/altair`
  )
);
