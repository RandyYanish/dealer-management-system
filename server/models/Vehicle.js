const { Schema, model } = require('mongoose');

const vehicleSchema = new Schema({
  vin: {
    type: String,
    required: true,
    length: 16,
  },
  stock: {
    type: String,
  },
  miles: {
    type: Number,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
  },
});

const Vehicle = model('Vehicle', vehicleSchema);

module.exports = Vehicle;