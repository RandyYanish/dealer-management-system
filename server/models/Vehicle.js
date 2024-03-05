import { Schema, model } from 'mongoose';

const vehicleSchema = new Schema({
  vin: {
    type: String,
    required: true,
    length: 17,
  },
  price: Number,
  stock: Number,
  miles: Number,
  make: String,
  model: String,
  year: Number,
  trim: String,
  vehicle_type: String,
  body_class: String,
  doors: Number,
  bed_type: String,
  cab_type: String,
  drive_train: String,
  engine: String,
  transmission: String,
  cylinders: Number,
  fuel_type: String,
  exterior_color: String,
  interior_color: String,
  interior_type: String,
  description: String,
});

const Vehicle = model('Vehicle', vehicleSchema);

export default Vehicle;