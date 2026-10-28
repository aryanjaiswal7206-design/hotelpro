const Guest = require('../models/Guest');
const Booking = require('../models/Booking');

// @desc    Get all guests with search & VIP filtering
// @route   GET /api/guests
// @access  Private/Staff/Admin
const getAllGuests = async (req, res, next) => {
  try {
    const { search, isVIP, sort } = req.query;
    let filter = {};

    if (isVIP !== undefined && isVIP !== '') {
      filter.isVIP = isVIP === 'true';
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { idNumber: searchRegex },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'spent') sortOption = { totalSpent: -1 };
    if (sort === 'bookings') sortOption = { totalBookings: -1 };
    if (sort === 'name') sortOption = { fullName: 1 };

    const guests = await Guest.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      count: guests.length,
      guests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single guest profile with booking history
// @route   GET /api/guests/:id
// @access  Private/Staff/Admin
const getGuestById = async (req, res, next) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest profile not found' });
    }

    // Find all bookings for this guest email
    const bookings = await Booking.find({ 'guestInfo.email': guest.email })
      .populate('room')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      guest,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new guest record
// @route   POST /api/guests
// @access  Private/Staff/Admin
const createGuest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existing = await Guest.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A guest record with this email already exists.',
      });
    }

    const guest = await Guest.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Guest profile created successfully',
      guest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update guest profile & notes
// @route   PUT /api/guests/:id
// @access  Private/Staff/Admin
const updateGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Guest profile updated successfully',
      guest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete guest profile
// @route   DELETE /api/guests/:id
// @access  Private/Admin
const deleteGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Guest profile deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
};
