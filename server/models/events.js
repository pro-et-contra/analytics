const mongoose = require('mongoose');

const Event = mongoose.model('events', {
  event: String,
  options: Object,
});

module.exports = Event;