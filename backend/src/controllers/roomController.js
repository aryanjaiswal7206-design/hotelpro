const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Get all rooms with filtering, search, and real-time availability
// @route   GET /api/rooms
// @access  Public
const getAllRooms = async (req, res, next) => {
  try {
    const {
      search,
      type,
      minPrice,
      maxPrice,
      status,
      capacity,
      checkIn,
      checkOut,
      sort,
    } = req.query;

    let filter = {};

    // Filter by type
    if (type && type !== 'all') {
      filter.type = type;
    }

    // Filter by status (e.g. available, occupied, cleaning, maintenance)
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    // Filter by minimum capacity
    if (capacity) {
      filter['capacity.adults'] = { $gte: Number(capacity) };
    }

    // Search query on title, roomNumber, or description
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { roomNumber: searchRegex },
        { description: searchRegex },
        { amenities: searchRegex },
      ];
    }

    // Real-time date availability check
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (!isNaN(checkInDate) && !isNaN(checkOutDate) && checkInDate < checkOutDate) {
        // Find bookings that overlap with requested range
        const overlappingBookings = await Booking.find({
          status: { $in: ['confirmed', 'checked-in'] },
          $or: [
            {
              checkInDate: { $lt: checkOutDate },
              checkOutDate: { $gt: checkInDate },
            },
          ],
        }).select('room');

        const bookedRoomIds = overlappingBookings.map((b) => b.room.toString());

        // Also exclude rooms currently undergoing maintenance
        if (bookedRoomIds.length > 0) {
          filter._id = { $nin: bookedRoomIds };
        }
      }
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { pricePerNight: 1 };
    if (sort === 'price-desc') sortOption = { pricePerNight: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'roomNumber') sortOption = { roomNumber: 1 };

    const rooms = await Room.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.status(200).json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private/Admin/Staff
const createRoom = async (req, res, next) => {
  try {
    const { roomNumber } = req.body;
    const existing = await Room.findOne({ roomNumber: roomNumber.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Room #${roomNumber} already exists.`,
      });
    }

    const room = await Room.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private/Admin/Staff
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room status (Housekeeping / Reception quick toggle)
// @route   PATCH /api/rooms/:id/status
// @access  Private/Admin/Staff
const updateRoomStatus = async (req, res, next) => {
  try {
    const { status, assignedStaff, maintenanceNote } = req.body;
    const validStatuses = ['available', 'occupied', 'cleaning', 'maintenance'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updates = { status };
    if (assignedStaff !== undefined) updates.assignedStaff = assignedStaff;
    if (maintenanceNote !== undefined) updates.maintenanceNote = maintenanceNote;

    const room = await Room.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.status(200).json({
      success: true,
      message: `Room status updated to ${status}`,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
  try {
    // Check if room has active bookings
    const activeBookings = await Booking.find({
      room: req.params.id,
      status: { $in: ['confirmed', 'checked-in'] },
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active or checked-in reservations.',
      });
    }

    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
};
