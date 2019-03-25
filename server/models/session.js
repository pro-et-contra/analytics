const mongoose = require('mongoose');

const Session = mongoose.model('session', {
  userID: String,
  pageID: String,
  url: String,
  browser: String,
  userAgent: String,
  country: String,
  timestamp: String,
});

module.exports = Session;