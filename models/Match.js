const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  organName: String,
  bloodGroup: String,
  donorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
  recipientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipient' },
  organID: { type: mongoose.Schema.Types.ObjectId, ref: 'Organ' },
//   matchedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }
createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Match', matchSchema);
