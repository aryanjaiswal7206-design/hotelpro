const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', protect, authorize('admin', 'staff'), createRoom);
router.put('/:id', protect, authorize('admin', 'staff'), updateRoom);
router.patch('/:id/status', protect, authorize('admin', 'staff'), updateRoomStatus);
router.delete('/:id', protect, authorize('admin'), deleteRoom);

module.exports = router;
