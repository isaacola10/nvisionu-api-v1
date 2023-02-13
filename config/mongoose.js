const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');
const config = require('./index');

// connect to using mongoose to mongo db
connect = async () => {
  await mongoose.connect(config.mongo.host, { keepAlive: true });

  mongoose.connection.on('error', (error) => {
    throw new Error(`unable to connect to database`);
  });

  // print mongoose logs in dev env
  if (config.mongooseDebug) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
      debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
    });
  }
}

connect();