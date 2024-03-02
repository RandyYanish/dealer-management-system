const { Schema, model } = require('mongoose');

const dealerSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  dealer_name: {
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
});

const Dealer = model('Dealer', dealerSchema);

module.exports = Dealer;