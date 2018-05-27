import { GraphQLServer } from 'graphql-yoga';
import { Prisma } from 'prisma-binding';

import resolvers from './data/resolvers';

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466/prayershare/dev',
    }),
  }),
});

server.start(() =>
  console.log(`GraphQL server is running on http://localhost:4000`)
);

// import express from 'express';
// import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
// import bodyParser from 'body-parser';
// import schema from './data/schema';

// const GRAPHQL_PORT = 3001;

// const graphQLServer = express();

// graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
// graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
// graphQLServer.use('/someurl', (req, res) => {
//   res.send('I work!');
// });

// graphQLServer.listen(GRAPHQL_PORT, () =>
//   console.log(
//     `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
//   )
// );
