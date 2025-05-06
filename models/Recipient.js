const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema({
  recipientID: String,
  rname: String,
  age: Number,
  bloodGroup: String,
  organNeeded: {
    type: String,
    enum: ['Eye', 'Heart', 'Kidney', 'Lungs'], // optional: restrict values
    required: true
  },
  priorityLevel: {
    type: Number,
    enum: [1, 2, 3],
    required: true
  },
  contactInfo: String,
  hospitalID: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }
});

module.exports = mongoose.model('Recipient', recipientSchema);
