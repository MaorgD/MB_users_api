const mongoose = require("mongoose");

let userVerificationSchema = new mongoose.Schema({
  userId: String,
  uniqueString: String,
  createdAt: { type: Date, default: Date.now()},
  expiresAt: { type: Date, default: Date.now()+ 21600000},
 
})

exports.UserVerificationModel = mongoose.model("verifyusers", userVerificationSchema);
