const mongoose = require('mongoose');

const Page = mongoose.model('pages', {
  url: { type: String, unique: true },
  pageID: Object,
});

module.exports = Page;