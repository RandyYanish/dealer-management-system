const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
  _id: ID!
  first_name: String
  last_name: String
  email: String!
  password: String!
  dealerships: [Dealership]
  }
  type Dealership {
  
  }
  type Vehicle {
  
  }
`;

module.exports = typeDefs;