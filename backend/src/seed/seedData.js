const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Guest = require('../models/Guest');
const Payment = require('../models/Payment');

dotenv.config();

const usersData = [
  {
    name: 'Eleanor Vance (General Manager)',
    email: 'admin@hotelpro.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Marcus Sterling (Front Desk Lead)',
    email: 'staff@hotelpro.com',
    password: 'staff123',
    role: 'staff',
    phone: '+91 98123 45678',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Sophia Montgomery (Valued Guest)',
    email: 'guest@hotelpro.com',
    password: 'guest123',
    role: 'guest',
    phone: '+91 97112 33445',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
];

const roomsData = [
  {
    roomNumber: '101',
    title: 'Deluxe Garden King Suite',
    type: 'Deluxe',
    pricePerNight: 5499,
    capacity: { adults: 2, children: 1 },
    floor: 1,
    bedType: 'King Bed',
    sizeSqFt: 420,
    amenities: ['High-speed Wi-Fi', 'Garden View', 'Air Conditioning', 'Espresso Maker', 'Smart TV', 'Marble Bath', 'In-room Safe'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    description: 'Immerse yourself in serenity with private patio overlooking our manicured botanic gardens, plush king bed, and artisanal bath amenities.',
    isFeatured: true,
    rating: 4.9,
  },
  {
    roomNumber: '102',
    title: 'Classic Cozy Queen Room',
    type: 'Single',
    pricePerNight: 2499,
    capacity: { adults: 1, children: 0 },
    floor: 1,
    bedType: 'Queen Bed',
    sizeSqFt: 280,
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', 'Work Desk', 'Smart TV', 'Rain Shower'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    description: 'Tailored for the solo business executive or nomad traveler seeking refined tranquility, ergonomic workstation, and premium comfort.',
    isFeatured: false,
    rating: 4.7,
  },
  {
    roomNumber: '201',
    title: 'Executive Panoramic Ocean Suite',
    type: 'Executive',
    pricePerNight: 11999,
    capacity: { adults: 3, children: 1 },
    floor: 2,
    bedType: 'California King',
    sizeSqFt: 620,
    amenities: ['Oceanfront Balcony', 'High-speed Wi-Fi', 'Jacuzzi Tub', 'Complimentary Breakfast', 'Mini Bar', 'Concierge Service'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'occupied',
    description: 'Breathtaking 180-degree coastal horizon views, private sun terrace, soaking jacuzzi bath, and private lounge access.',
    isFeatured: true,
    rating: 5.0,
  },
  {
    roomNumber: '202',
    title: 'Luxury Double Bedroom',
    type: 'Double',
    pricePerNight: 3999,
    capacity: { adults: 2, children: 2 },
    floor: 2,
    bedType: 'Two Queen Beds',
    sizeSqFt: 460,
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', 'Twin Vanity', 'Coffee Maker', 'Mini Fridge', 'Smart 55" TV'],
    images: [
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'cleaning',
    assignedStaff: 'Elena Ramos',
    description: 'Generous living room space featuring two premium plush queen mattresses, designed for traveling companions or small families.',
    isFeatured: false,
    rating: 4.8,
  },
  {
    roomNumber: '301',
    title: 'Royal Presidential Penthouse',
    type: 'Presidential',
    pricePerNight: 24999,
    capacity: { adults: 4, children: 2 },
    floor: 3,
    bedType: 'Emperor Bed + Guest King',
    sizeSqFt: 1450,
    amenities: ['Private Rooftop Terrace', 'Private Heated Infinity Pool', '24/7 Butler Service', 'Full Chef Kitchen', 'Champagne Bar', 'Walk-in Closets'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    description: 'The pinnacle of luxury hospitality. Enjoy top-floor exclusivity, panoramic skyline views, bespoke private dining, and custom VIP concierge.',
    isFeatured: true,
    rating: 5.0,
  },
  {
    roomNumber: '302',
    title: 'Family Grand Residence',
    type: 'Family',
    pricePerNight: 8499,
    capacity: { adults: 4, children: 3 },
    floor: 3,
    bedType: '1 King + 2 Twin Bunks',
    sizeSqFt: 780,
    amenities: ['Kids Play Corner', 'Kitchenette', 'High-speed Wi-Fi', 'Baby Cot on Demand', '2 Smart TVs', 'Dining Nook'],
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    description: 'Harmonious haven for families featuring connected multi-room layout, kids entertainment suite, and fully equipped pantry kitchenette.',
    isFeatured: false,
    rating: 4.85,
  },
  {
    roomNumber: '303',
    title: 'Skyline Junior Suite',
    type: 'Suite',
    pricePerNight: 6999,
    capacity: { adults: 2, children: 1 },
    floor: 3,
    bedType: 'King Bed',
    sizeSqFt: 510,
    amenities: ['City Skyline Views', 'Lounge Seating Area', 'Espresso Bar', 'Cocktail Shaker Set', 'Bluetooth Sound System'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'maintenance',
    maintenanceNote: 'Replacing HVAC filter unit and testing smart thermostat calibration',
    description: 'Chic modern suite featuring floor-to-ceiling glass windows offering glittering night skyline views, private dry bar, and plush living area.',
    isFeatured: false,
    rating: 4.75,
  },
  {
    roomNumber: '401',
    title: 'Heritage Deluxe Balcony Suite',
    type: 'Deluxe',
    pricePerNight: 5999,
    capacity: { adults: 2, children: 1 },
    floor: 4,
    bedType: 'King Bed',
    sizeSqFt: 450,
    amenities: ['Private Balcony', 'High-speed Wi-Fi', 'Deep Soaking Tub', 'Complimentary Breakfast', 'Mini Bar'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    description: 'Charming blend of classic architectural character and 5-star contemporary luxury, boasting panoramic morning sunrise views.',
    isFeatured: true,
    rating: 4.92,
  },
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    console.log(`Connecting to database at ${uri.replace(/:([^:@]+)@/, ':****@')}...`);
    await mongoose.connect(uri);

    console.log('Clearing existing records...');
    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    await Guest.deleteMany();
    await Payment.deleteMany();

    console.log('Seeding Users...');
    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    const [adminUser, staffUser, guestUser] = createdUsers;

    console.log('Seeding Rooms (INR Prices)...');
    const createdRooms = await Room.insertMany(roomsData);

    console.log('Seeding Guests...');
    await Guest.insertMany([
      {
        user: guestUser._id,
        fullName: 'Sophia Montgomery',
        email: 'guest@hotelpro.com',
        phone: '+91 97112 33445',
        idType: 'Passport',
        idNumber: 'P8921839A',
        address: {
          street: 'Marine Drive',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          zipCode: '400020',
        },
        isVIP: true,
        preferences: ['Feather pillows', 'High floor', 'Ocean view', 'Sparkling water on arrival'],
        notes: 'Frequent guest. Prefers express digital check-in.',
        totalBookings: 3,
        totalSpent: 85000,
      },
      {
        fullName: 'Dr. Arthur Pendelton',
        email: 'arthur.pendelton@oxford.edu',
        phone: '+91 98220 11990',
        idType: 'Passport',
        idNumber: 'GB4490192',
        address: {
          street: 'Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          zipCode: '110001',
        },
        isVIP: true,
        preferences: ['Quiet corner room', 'Late check-out'],
        notes: 'Medical conference keynote speaker.',
        totalBookings: 2,
        totalSpent: 42000,
      },
      {
        fullName: 'Camila Rodriguez',
        email: 'camila.rodriguez@gmail.com',
        phone: '+91 99887 76655',
        idType: 'Driving License',
        idNumber: 'DL-908129',
        address: {
          street: 'Koramangala 4th Block',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          zipCode: '560034',
        },
        isVIP: false,
        preferences: ['Early breakfast'],
        notes: 'Family vacation booking.',
        totalBookings: 1,
        totalSpent: 18500,
      },
    ]);

    console.log('Seeding Bookings & Payments in INR...');
    // Active Booking 1: Executive Ocean Suite (Occupied)
    const checkIn1 = new Date();
    checkIn1.setDate(checkIn1.getDate() - 1);
    const checkOut1 = new Date();
    checkOut1.setDate(checkOut1.getDate() + 2);

    const booking1 = await Booking.create({
      bookingNumber: 'HP-2026-1011',
      user: guestUser._id,
      room: createdRooms[2]._id, // 201 Executive Ocean Suite
      checkInDate: checkIn1,
      checkOutDate: checkOut1,
      totalNights: 3,
      numberOfGuests: { adults: 2, children: 0 },
      pricePerNight: 11999,
      subtotal: 35997,
      taxes: 4319.64,
      discount: 0,
      totalAmount: 40316.64,
      specialRequests: 'Anniversary celebration. Welcome flowers in room please.',
      guestInfo: {
        fullName: 'Sophia Montgomery',
        email: 'guest@hotelpro.com',
        phone: '+91 97112 33445',
        idProofType: 'Passport',
        idProofNumber: 'P8921839A',
      },
      status: 'checked-in',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      checkedInAt: checkIn1,
    });

    await Payment.create({
      invoiceNumber: 'INV-2026-1011',
      booking: booking1._id,
      user: guestUser._id,
      amount: 40316.64,
      currency: 'INR',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-984021481-99',
      status: 'completed',
      breakdown: {
        roomCharges: 35997,
        taxes: 4319.64,
        serviceCharges: 0,
        discount: 0,
      },
      paidAt: checkIn1,
    });

    // Confirmed upcoming booking
    const checkIn2 = new Date();
    checkIn2.setDate(checkIn2.getDate() + 5);
    const checkOut2 = new Date();
    checkOut2.setDate(checkOut2.getDate() + 8);

    const booking2 = await Booking.create({
      bookingNumber: 'HP-2026-1012',
      user: guestUser._id,
      room: createdRooms[0]._id, // 101 Garden Suite
      checkInDate: checkIn2,
      checkOutDate: checkOut2,
      totalNights: 3,
      numberOfGuests: { adults: 2, children: 1 },
      pricePerNight: 5499,
      subtotal: 16497,
      taxes: 1979.64,
      discount: 0,
      totalAmount: 18476.64,
      specialRequests: 'Quiet room near garden walkway.',
      guestInfo: {
        fullName: 'Dr. Arthur Pendelton',
        email: 'arthur.pendelton@oxford.edu',
        phone: '+91 98220 11990',
        idProofType: 'Passport',
        idProofNumber: 'GB4490192',
      },
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'UPI',
    });

    await Payment.create({
      invoiceNumber: 'INV-2026-1012',
      booking: booking2._id,
      user: guestUser._id,
      amount: 18476.64,
      currency: 'INR',
      paymentMethod: 'UPI',
      transactionId: 'TXN-771928301-44',
      status: 'completed',
      breakdown: {
        roomCharges: 16497,
        taxes: 1979.64,
        serviceCharges: 0,
        discount: 0,
      },
      paidAt: new Date(),
    });

    // Past completed booking
    const checkInPast = new Date();
    checkInPast.setDate(checkInPast.getDate() - 10);
    const checkOutPast = new Date();
    checkOutPast.setDate(checkOutPast.getDate() - 7);

    const pastBooking = await Booking.create({
      bookingNumber: 'HP-2026-0995',
      user: guestUser._id,
      room: createdRooms[4]._id, // 301 Penthouse
      checkInDate: checkInPast,
      checkOutDate: checkOutPast,
      totalNights: 3,
      numberOfGuests: { adults: 3, children: 0 },
      pricePerNight: 24999,
      subtotal: 74997,
      taxes: 8999.64,
      discount: 0,
      totalAmount: 83996.64,
      specialRequests: 'VIP private butler briefing requested on arrival.',
      guestInfo: {
        fullName: 'Sophia Montgomery',
        email: 'guest@hotelpro.com',
        phone: '+91 97112 33445',
        idProofType: 'Passport',
        idProofNumber: 'P8921839A',
      },
      status: 'checked-out',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      checkedInAt: checkInPast,
      checkedOutAt: checkOutPast,
    });

    await Payment.create({
      invoiceNumber: 'INV-2026-0995',
      booking: pastBooking._id,
      user: guestUser._id,
      amount: 83996.64,
      currency: 'INR',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-110928372-88',
      status: 'completed',
      breakdown: {
        roomCharges: 74997,
        taxes: 8999.64,
        serviceCharges: 0,
        discount: 0,
      },
      paidAt: checkInPast,
    });

    console.log('\n==========================================');
    console.log('✅ HotelPro Database seeded with INR Currency!');
    console.log('==========================================');
    console.log('Demo Credentials:');
    console.log('  👑 Admin:        admin@hotelpro.com / admin123');
    console.log('  🛎️  Reception:    staff@hotelpro.com / staff123');
    console.log('  🧳 Guest:        guest@hotelpro.com / guest123');
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
