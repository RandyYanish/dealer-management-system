const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const Dealership = require("./Dealership");

const userSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  dealerships: [{ type: Schema.Types.ObjectId, ref: 'Dealership'}]
});

// Set up pre-save middleware to create password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  let userInput = this.userInput || {};

  if (userInput.newDealerUser) {
    let newDealership = new Dealership({
      user_id: this._id,
      dealership_name: userInput.dealership_name,
      address: userInput.address,
    });
    await newDealership.save();
  } else {
    delete this.userInput;
  }
  next();
});

// Compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
