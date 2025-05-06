// models/Organ.js
const mongoose = require('mongoose');

const organSchema = new mongoose.Schema({
  organType: String,
  donorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
  storedAt: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }
});

module.exports = mongoose.model('Organ', organSchema);
