const mongoose = require('mongoose');

const feeSlipSchema = new mongoose.Schema({
  url: { type: String, required: true },
});

module.exports = mongoose.model('FeeSlip', feeSlipSchema);
