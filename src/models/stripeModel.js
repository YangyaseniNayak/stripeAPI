const mongoose = require('mongoose');

// Define the schema for payments
const stripeModelSchema = new mongoose.Schema({
  cardNumber: { type: String, required: true },
  expMonth: { type: Number, required: true },
  expYear: { type: Number, required: true },
  cvv: { type: String, required: true },
  chargeId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  description: { type: String, required: true },
});

// Create a model from the schema
const StripeModel = mongoose.model('StripeModel', stripeModelSchema);

module.exports = StripeModel;
