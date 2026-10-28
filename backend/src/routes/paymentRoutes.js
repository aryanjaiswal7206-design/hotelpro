const express = require('express');
const router = express.Router();
const {
  getAllPayments,
  getPaymentById,
  getPaymentByBookingId,
  refundPayment,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getAllPayments);
router.get('/:id', protect, getPaymentById);
router.get('/booking/:bookingId', protect, getPaymentByBookingId);
router.patch('/:id/refund', protect, authorize('admin'), refundPayment);

module.exports = router;
