const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 5,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },
});

const User = mongoose.model("Users", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
