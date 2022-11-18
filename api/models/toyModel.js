const mongoose = require('mongoose');

const toysSchema = new mongoose.Schema({
  name: String,
  info: String,
  category: String,
  img_url: String,
  price: Number,
  user_id: String,
  date_created: {
    type: Date, default: Date.now()
  }
})


exports.ToyModel = mongoose.model("Toys", toysSchema);

