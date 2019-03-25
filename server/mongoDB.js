const mongoose = require('mongoose');
const config = require('./config');
const _env = process.env.NODE_ENV || 'production';

module.exports = {
  mongoose,
  connect: async () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(config[_env].DB_NAME,
      { useNewUrlParser: true, useCreateIndex: true });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    //db.dropDatabase();
  },
  disconnect: (done) => {
    mongoose.disconnect(done);
  },

}