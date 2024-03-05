// Packages
import dotenv from 'dotenv';
import express, { urlencoded, json } from 'express'; 
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import http from 'http';

// Files
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './utils/auth.js';
import './config/connection.js';

dotenv.config();

// Initialize Back
const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer ({
  schema,
  context: ({ req }) => ({
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
    authMiddleware: authMiddleware({ req }),
  }),
});

// Initialize Front
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors({ origin: '*' }));

// Create new instance of an Apollo Server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  httpServer.once('listening', () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });

  httpServer.listen(PORT);
};

// Call async function to start the server
startApolloServer(typeDefs, resolvers);
