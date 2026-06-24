const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

function rzp() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

exports.createOrder = async (req, res) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const amount = Math.round((course.discountPrice || course.price) * 100);
  if (!amount) return res.status(400).json({ message: 'Course is free' });
  const order = await rzp().orders.create({
    amount, currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
    notes: { courseId: String(course._id), userId: String(req.user._id) },
  });
  const pay = await Payment.create({
    user: req.user._id, course: course._id, amount: amount / 100,
    razorpayOrderId: order.id, status: 'created',
  });
  res.json({ order, payment: pay, keyId: process.env.RAZORPAY_KEY_ID });
};

exports.verify = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  if (expected !== razorpay_signature)
    return res.status(400).json({ message: 'Invalid signature' });
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: 'paid' },
    { new: true }
  );
  // auto-enroll
  if (payment?.course) {
    const exists = await Enrollment.findOne({ student: payment.user, course: payment.course });
    if (!exists) {
      await Enrollment.create({ student: payment.user, course: payment.course, payment: payment._id });
      await Course.findByIdAndUpdate(payment.course, { $inc: { enrollmentCount: 1 } });
    }
  }
  res.json({ ok: true, payment });
};

exports.webhook = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
    .update(body)
    .digest('hex');
  if (signature !== expected) return res.status(400).json({ message: 'Invalid webhook' });
  // handle req.body.event …
  res.json({ ok: true });
};

exports.history = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  res.json(await Payment.find(filter).populate('course', 'title').sort({ createdAt: -1 }));
};
