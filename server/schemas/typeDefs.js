import { gql } from 'apollo-server-express';

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
    _id: ID!
    user_id: [User!]!
    dealership_name: String!
    address: String
    vehicles: [Vehicle]
  }

  type Vehicle {
    _id: ID!
    vin: String!
    price: Float
    stock: Int
    miles: Int
    make: String
    model: String
    year: Int
    trim: String
    vehicle_type: String
    body_class: String
    doors: Int
    bed_type: String
    cab_type: String
    drive_train: String
    engine: String
    transmission: String
    cylinders: Int
    fuel_type: String
    exterior_color: String
    interior_color: String
    interior_type: String
    description: String
  }

  type Auth {
    token: String!
    user: User
  }

  input Token {
    token: String!
  }

  type AuthUser {
    authed: Boolean!
    userId: ID
  }

  input DealershipInput {
    _id: ID
    user_id: [ID]
    dealership_name: String
    address: String
  }

  input UserInput {
    _id: ID
    first_name: String
    last_name: String
    email: String
    password: String
  }

  input VehicleInput {
    _id: ID
    vin: String
    price: Float
    stock: Int
    miles: Int
    make: String
    model: String
    year: Int
    trim: String
    vehicle_type: String
    body_class: String
    doors: Int
    bed_type: String
    cab_type: String
    drive_train: String
    engine: String
    transmission: String
    cylinders: Int
    fuel_type: String
    exterior_color: String
    interior_color: String
    interior_type: String
    description: String
    dealership_id: ID
  }

  type Query {
    getAllUsers: [User]
    getUserById(userId: ID!): User
    authUser(token: String!): AuthUser!
    getDealershipById(dealershipId: ID!): Dealership
    getDealershipByUser(userId: ID!): Dealership
    getAllDealerships: [Dealership]
    getAllVehiclesByDealershipId(dealershipId: ID!): [Vehicle]
  }

  type Mutation {
    createUser(userInput: UserInput): Auth
    loginUser(email: String!, password: String!): Auth
    deleteUser(userId: ID!): User
    createVehicle(vehicleInput: VehicleInput): Vehicle
    updateVehicle(vehicleInput: VehicleInput): Vehicle
    deleteVehicle(vehicleId: ID!): Vehicle
    createDealership(dealershipInput: DealershipInput): Dealership
    updateDealership(dealershipInput: DealershipInput): Dealership
    deleteDealership(dealershipId: ID!): Dealership
  }
`;

export default typeDefs;
