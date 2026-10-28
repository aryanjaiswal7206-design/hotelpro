const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Get all payments / invoices
// @route   GET /api/payments
// @access  Private/Admin/Staff
const getAllPayments = async (req, res, next) => {
  try {
    const { status, paymentMethod, search } = req.query;
    let filter = {};

    if (req.user.role === 'guest') {
      filter.user = req.user.id;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      filter.paymentMethod = paymentMethod;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { invoiceNumber: searchRegex },
        { transactionId: searchRegex },
      ];
    }

    const payments = await Payment.find(filter)
      .populate({
        path: 'booking',
        populate: { path: 'room' },
      })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single payment & invoice details
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: 'booking',
        populate: [{ path: 'room' }, { path: 'user', select: 'name email phone' }],
      })
      .populate('user', 'name email phone');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    if (req.user.role === 'guest' && payment.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this invoice.',
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment by booking ID
// @route   GET /api/payments/booking/:bookingId
// @access  Private
const getPaymentByBookingId = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId })
      .populate({
        path: 'booking',
        populate: [{ path: 'room' }, { path: 'user' }],
      })
      .populate('user', 'name email phone');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Invoice not found for this booking' });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refund payment
// @route   PATCH /api/payments/:id/refund
// @access  Private/Admin
const refundPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    payment.status = 'refunded';
    await payment.save();

    await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: 'refunded' });

    res.status(200).json({
      success: true,
      message: 'Payment refunded successfully',
      payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  getPaymentByBookingId,
  refundPayment,
};
