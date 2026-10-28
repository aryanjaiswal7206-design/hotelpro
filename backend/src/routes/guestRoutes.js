const express = require('express');
const router = express.Router();
const {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
} = require('../controllers/guestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'staff'), getAllGuests);
router.get('/:id', protect, authorize('admin', 'staff'), getGuestById);
router.post('/', protect, authorize('admin', 'staff'), createGuest);
router.put('/:id', protect, authorize('admin', 'staff'), updateGuest);
router.delete('/:id', protect, authorize('admin'), deleteGuest);

module.exports = router;
