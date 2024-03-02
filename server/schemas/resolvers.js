const { User } = require('../models');

const resolvers = {
  Query: {
    // GET all users
    getAllUsers: async () => {
      const users = await User.find({});
      return users;
    },
    // GET user by ID

    // GET dealer by ID

    // GET dealer by user

    // GET all dealers

    // GET vehicles by dealer

    authUser: async (_, { token }) => {
      try {
        let decodedToken = authToken(token);
        console.log({ decodedToken });
        if (!decodedToken) {
          return { authed: false, userId: null };
        }
        console.log({ decodedToken });
        return { authed: true, userId: decodedToken.data._id };
      } catch (error) {
        throw new Error(`Auth failed: ${error}`);
      }
    },
  },

  Mutation: {
    // POST new user

    // POST login user

    // DELETE user

    // POST create vehicle

    // PUT update vehicle

    // DELETE vehicle


  }
}