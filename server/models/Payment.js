const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    amount: Number,
    currency: { type: String, default: 'INR' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
    notes: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
