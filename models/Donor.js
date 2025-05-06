const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  donorID: String,
  name: String,
  age: Number,
  bloodGroup: String,
  contactInfo: String,
  organType: {
    type: String,
    enum: ['Eye', 'Heart', 'Kidney', 'Lungs'], // optional: restrict values
    required: true
  },
  hospitalID: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }
});

module.exports = mongoose.model('Donor', donorSchema);
