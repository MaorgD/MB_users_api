const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  fullName: {
    firstName: String,
    lastName: String
  },
  email: String,
  password: String,
  date_created: {
    type: Date, default: Date.now()
  },
  // role of the user if regular user or admin
  role: {
    type: String, default: "user"
  },
  verified:{ type: Boolean, default:false}
})

exports.UserModel = mongoose.model("users", userSchema);
