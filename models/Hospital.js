const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  hospitalID: String,
  name: String,
  location: String,
  contactInfo: String
});

module.exports = mongoose.model('Hospital', hospitalSchema);
