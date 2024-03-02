import { User, Dealership, Vehicle } from '../models';

const resolvers = {
  Query: {
    // GET all users
    getAllUsers: async () => {
      const allUsers = await User.find({});
      return allUsers;
    },
    // GET user by ID
    getUser: async (_, { userId }) => {
      const userById = await User.findById(userId);
      return userById;
    },
    // GET dealership by ID
    getDealershipById: async (_, { dealershipId }) => {
      const dealershipById = await Dealership.findById(dealershipId);
      return dealershipById.populate('vehicles');
    },
    // GET dealership by user
    getDealershipByUser: async (_, { userId }) => {
      const dealershipByUser = await Dealership.find({ user_id: userId });
      return dealershipByUser.populate('vehicles');
    },
    // GET all dealerships
    getAllDealerships: async () => {
      const allDealerships = await Dealership.find({});
      return allDealerships;
    },
    // GET vehicles by dealership
    getAllVehiclesByDealership: async (_, { dealershipId }) => {
      return await Vehicle({ dealership_id: dealershipId });
    },
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
    createUser: async (_, { userInput }) => {
      try {
        const foundUser = await User.findOne({ email: userInput.email });
        if (foundUser) {
          throw new Error('User already exists');
        }
        const user = new User(userInput);
        let token;
        user.userInput = userInput;
        await user.save();
        if (user) {
          token = signToken(user);
        }
        return token;
      } catch (error) {
        let err = error.message || 'Error creating a user';
        throw new Error(error)
      }
    },
    // POST login user
    loginUser: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error({ message: 'User does not exist.' });
        }
        const passwordAuthed = await user.isCorrectPassword(password);
        if (!passwordAuthed) {
          throw new Error({ message: 'Incorrect password.' })
        }
        const token = signToken(user);
        return token;
      } catch (error) {
        throw new Error(error)
      }
    },
    // DELETE user
    deleteUser: async (_, { userId }) => {
      return await User.findByIdAndDelete(userId);
    },
    // POST create vehicle
    addVehicle: async (_, { vehicleInput }) => {
      try {
        const vehicle = new Vehicle(vehicleInput);
        const dealership = await Dealership.findById(vehicleInput.dealership_id);
        if (!dealership) {
          throw new Error('No valid dealership');
        }
        await vehicle.save();
        dealership.vehicles.push(vehicle);
        await dealership.save();
        return vehicle;
      } catch (error) {
        throw new Error(error);
      }
    },
    // PUT update vehicle
    updateVehicle: async (_, { vehicleInput }) => {
      const { _id, vin, price, stock, miles, make, model, year, trim, vehicle_type, body_class, doors, bed_type, cab_type, drive_train, engine, transmission, cylinders, fuel_type, exterior_color, interior_color, interior_type, description } = vehicleInput;
      try {
        let foundVehicle = await Vehicle.findByIdAndUpdate(_id, {
          vin,
          price,
          stock,
          miles,
          make,
          model,
          year,
          trim,
          vehicle_type,
          body_class,
          doors,
          bed_type,
          cab_type,
          drive_train,
          engine,
          transmission,
          cylinders,
          fuel_type,
          exterior_color,
          interior_color,
          interior_type,
          description
        });
        await foundVehicle.save();
        return foundVehicle;
      } catch (error) {
        throw new Error(error);
      }
    },
    // DELETE vehicle
    deleteVehicle: async (_, { vehicleId }) => {
      return await Vehicle.findByIdAndDelete(vehicleId);
    },
  }
}

module.exports = resolvers;
