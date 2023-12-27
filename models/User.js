const mongoose = require("mongoose");
require("mongoose-type-email");
const { Schema, model } = mongoose;

// Schema to create User model
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    unique: true,
    required: true,
  },
  thoughts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "thought",
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

// Create a virtual field 'friendCount'
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// Initialize our User model
const User = model("user", userSchema);

module.exports = User;
