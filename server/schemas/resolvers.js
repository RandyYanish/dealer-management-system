import { User, Dealership, Vehicle } from '../models/index.js';
import { signToken, authToken } from '../utils/auth.js';

const resolvers = {
  Query: {
    // GET all users
    getAllUsers: async () => {
      const allUsers = await User.find({});
      return allUsers;
    },
    // GET user by ID
    getUserById: async (_, { userId }) => {
      const userById = await User.findById(userId);
      return userById;
    },
    // GET verify user by token
    authUser: async (_, { token }, { secret, expiration }) => {
      try {
        let decodedToken = authToken(token, secret, expiration);
        console.log({ decodedToken });
        if (!decodedToken) {
          return { authed: false, userId: null };
        }
        return { authed: true, userId: decodedToken.data._id };
      } catch (error) {
        throw new Error(`Auth failed: ${error}`);
      }
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
    getAllVehiclesByDealershipId: async (_, { dealershipId }) => {
      return await Vehicle({ dealership_id: dealershipId });
    },
  },

  Mutation: {
    // POST new user
    createUser: async (_, { userInput }, { secret, expiration }) => {
      try {
        const foundUser = await User.findOne({ email: userInput.email });
        if (foundUser) {
          throw new Error('User already exists');
        }
        const user = new User(userInput);
        await user.save();
        if (!user) {
          throw new Error({ message: 'Error creating a user' });
        }
        const { token } = signToken(user, secret, expiration);
        return { token, user };
      } catch (error) {
        let err = error.message || 'Error creating a user';
        throw new Error(err)
      }
    },
    // POST login user
    loginUser: async (_, { email, password }, { secret, expiration }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error({ message: 'User does not exist.' });
        }
        const passwordAuthed = await user.isCorrectPassword(password);
        if (!passwordAuthed) {
          throw new Error({ message: 'Incorrect password.' })
        }
        const { token } = signToken(user, secret, expiration);
        return { token, user };
      } catch (error) {
        throw new Error(error)
      }
    },
    // DELETE user
    deleteUser: async (_, { userId }) => {
      return await User.findByIdAndDelete(userId);
    },
    // POST create vehicle
    createVehicle: async (_, { vehicleInput }) => {
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
    // POST create dealership
    createDealership: async (_, { dealershipInput }) => {
      try {
        const dealership = new Dealership(dealershipInput);
        await dealership.save();
        await User.findByIdAndUpdate(dealershipInput.user_id, { $push: { dealerships: dealership._id } });
        return dealership;
      } catch (error) {
        throw new Error(error);
      }
    },
    // PUT update dealership
    updateDealership: async (_, { dealershipInput }) => {
      const { _id, user_id, dealership_name, address, vehicles } = dealershipInput;
      try {
        let foundDealership = await Dealership.findByIdAndUpdate(_id, {
          user_id,
          dealership_name,
          address,
          vehicles
        });
        await foundDealership.save();
        return foundDealership;
      } catch (error) {
        throw new Error(error);
      }
    },
    // DELETE dealership
    deleteDealership: async (_, { dealershipId }) => {
      return await Dealership.findByIdAndDelete(dealershipId);
    }
  }
}

export default resolvers;
