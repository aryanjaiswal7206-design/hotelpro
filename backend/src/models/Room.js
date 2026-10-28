const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide room number'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide room title/name'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please select room type'],
      enum: ['Single', 'Double', 'Deluxe', 'Suite', 'Executive', 'Family', 'Presidential'],
      default: 'Deluxe',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please provide price per night'],
      min: [1, 'Price per night must be at least 1'],
    },
    capacity: {
      adults: { type: Number, default: 2, min: 1 },
      children: { type: Number, default: 1, min: 0 },
    },
    floor: {
      type: Number,
      default: 1,
    },
    bedType: {
      type: String,
      default: 'King Bed',
    },
    sizeSqFt: {
      type: Number,
      default: 350,
    },
    amenities: {
      type: [String],
      default: ['High-speed Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'En-suite Bathroom'],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'cleaning', 'maintenance'],
      default: 'available',
    },
    description: {
      type: String,
      default: 'A spacious and well-appointed room featuring premium bedding, modern luxury amenities, and scenic views.',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    assignedStaff: {
      type: String,
      default: '',
    },
    maintenanceNote: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
