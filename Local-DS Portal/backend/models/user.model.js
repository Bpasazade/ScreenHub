const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    password: String,
    companyName: String,
    companyAddress: String,
    mainUserDegree: String,
    numberOfScreens: Number,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;
