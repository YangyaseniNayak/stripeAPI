const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const StripeModel = require('../models/stripeModel');  // Correct path

// Handle Stripe payment logic
exports.payment = async (req, res) => {
  const { cardNumber, month, year, cvv } = req.body;

  try {
    // Create token for the card
    const token = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: month,
        exp_year: year,
        cvc: cvv,
      },
    });

    // Create a charge
    const charge = await stripe.charges.create({
      amount: 2000, // Amount in cents
      currency: 'usd',
      source: token.id,
      description: 'My first payment',
    });

    // Optionally save payment info to the database
    const paymentRecord = new StripeModel({
      cardNumber: cardNumber,
      expMonth: month,
      expYear: year,
      cvv: cvv,
      chargeId: charge.id,
      amount: charge.amount,
      currency: charge.currency,
      status: charge.status,
      description: charge.description,
    });
    await paymentRecord.save();

    // Respond with the status
    if (charge.status === 'succeeded') {
      return res.status(200).json({ success: true, message: 'Payment completed.' });
    } else {
      return res.status(400).json({ success: false, message: 'Payment failed.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: `Payment failed: ${error.message}` });
  }
};

// Provide month/year options for frontend (optional)
exports.stripePayment = (req, res) => {
  const Moment = require('moment');
  const MomentRange = require('moment-range');
  const moment = MomentRange.extendMoment(Moment);

  const fromDate = moment();
  const toDate = moment().add(10, 'years');
  const range = moment().range(fromDate, toDate);

  const years = Array.from(range.by('year')).map(m => m.year());
  const months = moment.monthsShort();

  res.json({ months, years });
};
