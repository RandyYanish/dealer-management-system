const { Schema, model } = require('mongoose');

const dealershipSchema = new Schema({
  user_id: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  }],
  dealership_name: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    validate: {
      validator: function (v) {
        const addressPattern = /^[a-zA-z0-9\s,'-]*$/;
        return addressPattern.test(v);
      },
      message: (props) => `${props.value} is not a valid address!`,
    },
  },
  vehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
});

const Dealership = model('Dealership', dealershipSchema);

module.exports = Dealership;