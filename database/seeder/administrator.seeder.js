const mongoose = require("mongoose");
const config = require("../../config/index");
const { v4: uuidv4 } = require("uuid");

// connect to mongo db
const mongoUri = config.mongo.host;
const connect = async () => {
  await mongoose.connect(mongoUri, { keepAlive: true });
  mongoose.connection.on("error", (error) => {
    console.log(error);
    throw new Error(`unable to connect to database: ${mongoUri}`);
  });
};
// End mongo DB connection
const close = function () {
  return new Promise((resolve) => {
    mongoose.connection.close(() => {
      console.log("mongodb connection closed");
      resolve();
    });
  });
};
const {CreateAdministrator} = require("../../app/queries");

const seed = {
  async Admin() {
    await CreateAdministrator("NVISIONU Administrator", "admin@nvisionu.com", "Password@123")
  }
}

// node action
const run = async function () {
  // Start Connection
  await connect();
  // List models to seed
  await seed.Admin();

  // End Connection
  await close();
  console.log("successfully seeded data");
};
// run seeder
run();