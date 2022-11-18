const mongoose = require('mongoose');
const { config } = require("../config/secret");
main().catch(err => console.log(err));


async function main() {
  // if you want use database locali(localhost-3000)
  // await mongoose.connect('mongodb://localhost:27017/black22');

  // use the moongose global( from moongo atlas useing env ${config.userDb},${config.passDb} for securety)

  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.wobuehi.mongodb.net/TOYS`);
  console.log("mongo connect usersApi")
}