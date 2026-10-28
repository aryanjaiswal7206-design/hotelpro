const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');
const Payment = require('../models/Payment');

// Generate unique booking number
const generateBookingNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `HP-${timestamp}-${random}`;
};

// Generate unique invoice number
const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `INV-${year}-${random}`;
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Guest/Staff/Admin)
const createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      guestInfo,
      specialRequests,
      paymentMethod,
    } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide room ID, check-in date, and check-out date.',
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validation
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid check-in or check-out date format.',
      });
    }

    if (checkIn < now) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past.',
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date.',
      });
    }

    // Check room existence
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    if (room.status === 'maintenance') {
      return res.status(400).json({
        success: false,
        message: 'Room is currently under maintenance and cannot be booked.',
      });
    }

    // Real-time collision detection: check if room is already booked for these dates
    const conflictingBookings = await Booking.find({
      room: roomId,
      status: { $in: ['confirmed', 'checked-in'] },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This room is already booked for the selected dates. Please choose another date or room.',
      });
    }

    // Calculation
    const diffTime = Math.abs(checkOut - checkIn);
    const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const subtotal = totalNights * room.pricePerNight;
    const taxes = Math.round(subtotal * 0.12 * 100) / 100; // 12% hotel tax
    const discount = 0;
    const totalAmount = subtotal + taxes - discount;

    const bookingNumber = generateBookingNumber();

    const guestPayload = {
      fullName: guestInfo?.fullName || req.user.name,
      email: guestInfo?.email || req.user.email,
      phone: guestInfo?.phone || req.user.phone || 'N/A',
      idProofType: guestInfo?.idProofType || 'Passport',
      idProofNumber: guestInfo?.idProofNumber || '',
    };

    const booking = await Booking.create({
      bookingNumber,
      user: req.user.id,
      room: room._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights,
      numberOfGuests: numberOfGuests || { adults: 2, children: 0 },
      pricePerNight: room.pricePerNight,
      subtotal,
      taxes,
      discount,
      totalAmount,
      specialRequests: specialRequests || '',
      guestInfo: guestPayload,
      status: 'confirmed',
      paymentStatus: 'paid', // Instant confirmation with payment processing
      paymentMethod: paymentMethod || 'Credit Card',
    });

    // Create payment transaction record
    const invoiceNumber = generateInvoiceNumber();
    const transactionId = `TXN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    await Payment.create({
      invoiceNumber,
      booking: booking._id,
      user: req.user.id,
      amount: totalAmount,
      currency: 'INR',
      paymentMethod: paymentMethod || 'Credit Card',
      transactionId,
      status: 'completed',
      breakdown: {
        roomCharges: subtotal,
        taxes,
        serviceCharges: 0,
        discount,
      },
    });

    // CRM: Update or create Guest profile
    let guest = await Guest.findOne({ email: guestPayload.email });
    if (!guest) {
      guest = await Guest.create({
        user: req.user.id,
        fullName: guestPayload.fullName,
        email: guestPayload.email,
        phone: guestPayload.phone,
        idType: guestPayload.idProofType,
        idNumber: guestPayload.idProofNumber,
        totalBookings: 1,
        totalSpent: totalAmount,
      });
    } else {
      guest.totalBookings += 1;
      guest.totalSpent += totalAmount;
      if (guestPayload.phone && guest.phone === 'N/A') guest.phone = guestPayload.phone;
      await guest.save();
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Reservation created and confirmed successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin/Staff view all, Guest view own)
// @route   GET /api/bookings
// @access  Private
const getAllBookings = async (req, res, next) => {
  try {
    const { status, search, from, to } = req.query;
    let filter = {};

    // If regular guest, only show their bookings
    if (req.user.role === 'guest') {
      filter.user = req.user.id;
    }

    // Filter by status
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Date range filter
    if (from || to) {
      filter.checkInDate = {};
      if (from) filter.checkInDate.$gte = new Date(from);
      if (to) filter.checkInDate.$lte = new Date(to);
    }

    // Search by booking number or guest name/email
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { bookingNumber: searchRegex },
        { 'guestInfo.fullName': searchRegex },
        { 'guestInfo.email': searchRegex },
        { 'guestInfo.phone': searchRegex },
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('room')
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('room')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Ensure only owner or admin/staff can see the booking
    if (
      req.user.role === 'guest' &&
      booking.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking.',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Check-in, Check-out, Cancellation by staff)
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin/Staff
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, cancellationReason } = req.body;
    const validStatuses = ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.status = status;

    if (status === 'checked-in') {
      booking.checkedInAt = new Date();
      // Set room status to occupied
      await Room.findByIdAndUpdate(booking.room._id, { status: 'occupied' });
    } else if (status === 'checked-out') {
      booking.checkedOutAt = new Date();
      // Mark room for cleaning / housekeeping
      await Room.findByIdAndUpdate(booking.room._id, { status: 'cleaning' });
    } else if (status === 'cancelled') {
      booking.cancelledAt = new Date();
      booking.cancellationReason = cancellationReason || 'Cancelled by hotel administration';
      // Mark room back to available
      await Room.findByIdAndUpdate(booking.room._id, { status: 'available' });
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking status successfully updated to ${status}.`,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking by guest
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Check ownership
    if (
      req.user.role === 'guest' &&
      booking.user.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking.',
      });
    }

    if (booking.status === 'checked-in' || booking.status === 'checked-out') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking that is already ${booking.status}.`,
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled.',
      });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason || 'Cancelled by guest';
    booking.paymentStatus = 'refunded';

    await booking.save();

    // Ensure room is set to available
    await Room.findByIdAndUpdate(booking.room, { status: 'available' });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Refund initiated if applicable.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
