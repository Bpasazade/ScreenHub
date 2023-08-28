const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    lastname: String,
    mainUserDegree: String,
    email: String,
    phoneNumber: String,
    backupName: String,
    backupLastname: String,
    backUserDegree: String,
    backupPhoneNumber: String,
    companyName: String,
    companyAddress: String,
    numberOfScreens: Number,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;
