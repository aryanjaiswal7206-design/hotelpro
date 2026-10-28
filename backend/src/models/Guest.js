const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide guest full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide guest email'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide guest phone number'],
      trim: true,
    },
    idType: {
      type: String,
      enum: ['Passport', 'Driving License', 'National ID', 'Aadhaar / Voter ID', 'Other'],
      default: 'Passport',
    },
    idNumber: {
      type: String,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zipCode: { type: String, default: '' },
    },
    isVIP: {
      type: Boolean,
      default: false,
    },
    preferences: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: '',
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Guest', guestSchema);
