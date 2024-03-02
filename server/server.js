// Packages
require('dotenv').config();
import { urlencoded, json } from 'express';
import { ApolloServer } from 'apollo-server-express';
// import path from 'path';
import { authMiddleware } from './utils/auth';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import { createServer } from 'http';
import { SubscriptionServer } from 'graphql-subscriptions';
import { execute, subscribe } from 'graphql'; 

// Files
import { typeDefs, resolvers } from './schemas';
import { once } from './config/connection';

// Initialize Back
const PORT = process.env.PORT || 3001;
const app = exporess();
const httpServer = createServer(app);
const schema = makeExecutableSchema({
  typeDefs, 
  resolvers, 
});
const subServer = SubscriptionServer.create(
  { schema, execute, subscribe },
  {
    server: httpServer,
    path: '/graphql',
  }
);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            subServer.close();
          },
        };
      },
    },
  ],
});

// Initialize Front
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(
  cors({
    origin: '*',
  })
);

// SET UP FRONT END
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// Create new instance of an Apollo Server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call async function to start the server
startApolloServer(typeDefs, resolvers);
