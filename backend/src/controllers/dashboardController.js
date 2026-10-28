const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Guest = require('../models/Guest');
const User = require('../models/User');

// @desc    Get management & operational metrics
// @route   GET /api/dashboard/stats
// @access  Private/Admin/Staff
const getDashboardStats = async (req, res, next) => {
  try {
    // Rooms metrics
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'available' });
    const occupiedRooms = await Room.countDocuments({ status: 'occupied' });
    const cleaningRooms = await Room.countDocuments({ status: 'cleaning' });
    const maintenanceRooms = await Room.countDocuments({ status: 'maintenance' });

    // Occupancy rate calculation
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Booking metrics
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const checkedInBookings = await Booking.countDocuments({ status: 'checked-in' });
    const checkedOutBookings = await Booking.countDocuments({ status: 'checked-out' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Revenue metrics
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? Math.round(revenueAgg[0].total) : 0;

    // Guest metrics
    const totalGuests = await Guest.countDocuments();
    const vipGuests = await Guest.countDocuments({ isVIP: true });
    const totalUsers = await User.countDocuments();

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('room')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Revenue by last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          paidAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidAt' },
            month: { $month: '$paidAt' },
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format monthly data for front-end charts
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthly = monthlyRevenue.map((item) => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: Math.round(item.revenue),
      bookings: item.count,
    }));

    // Room status distribution
    const roomStatusDist = [
      { name: 'Available', value: availableRooms, color: '#10b981' },
      { name: 'Occupied', value: occupiedRooms, color: '#3b82f6' },
      { name: 'Cleaning', value: cleaningRooms, color: '#f59e0b' },
      { name: 'Maintenance', value: maintenanceRooms, color: '#ef4444' },
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalRooms,
        availableRooms,
        occupiedRooms,
        cleaningRooms,
        maintenanceRooms,
        occupancyRate,
        totalBookings,
        confirmedBookings,
        checkedInBookings,
        checkedOutBookings,
        cancelledBookings,
        totalRevenue,
        totalGuests,
        vipGuests,
        totalUsers,
        recentBookings,
        monthlyRevenue: formattedMonthly,
        roomStatusDist,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
