import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import {
  Calendar,
  Users,
  Search,
  Sparkles,
  ShieldCheck,
  Award,
  Coffee,
  Waves,
  UtensilsCrossed,
  ArrowRight,
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  // Helper date format YYYY-MM-DD
  const formatDate = (d) => d.toISOString().split('T')[0];
  const todayStr = formatDate(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const defaultCheckoutStr = formatDate(tomorrow);

  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(defaultCheckoutStr);
  const [guests, setGuests] = useState('2');
  const [roomType, setRoomType] = useState('all');

  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomAPI.getAll({ limit: 4 });
        if (res.data.success) {
          // pick featured or first 3-4 rooms
          const featured = res.data.rooms.filter((r) => r.isFeatured).slice(0, 3);
          setFeaturedRooms(featured.length > 0 ? featured : res.data.rooms.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch rooms for home page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      checkIn,
      checkOut,
      capacity: guests,
      type: roomType,
    }).toString();
    navigate(`/rooms?${query}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-wrapper text-center px-3">
        <div className="container py-5 my-auto">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill text-uppercase fw-bold mb-3 shadow-sm">
                ★ 5-Star Luxury Hospitality & Resort
              </span>
              <h1 className="display-3 fw-bold text-white mb-3 font-serif">
                Experience Refined Comfort & Unmatched Hospitality
              </h1>
              <p className="lead text-light text-opacity-75 mb-4 max-w-2xl mx-auto">
                Welcome to HotelPro. Where timeless elegance meets digital precision — seamless real-time
                reservations, bespoke guest suites, and exceptional coastal hospitality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Search Bar */}
      <div className="container search-floater mb-5">
        <div className="card border-0 shadow-lg rounded-4 p-3 p-md-4 bg-white">
          <form onSubmit={handleSearch}>
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Calendar size={14} className="text-gold" /> Check-In
                </label>
                <input
                  type="date"
                  className="form-control form-control-lg fs-6"
                  min={todayStr}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Calendar size={14} className="text-gold" /> Check-Out
                </label>
                <input
                  type="date"
                  className="form-control form-control-lg fs-6"
                  min={checkIn || todayStr}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Users size={14} className="text-gold" /> Guests
                </label>
                <select
                  className="form-select form-select-lg fs-6"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted">Category</label>
                <select
                  className="form-select form-select-lg fs-6"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="all">All Suites</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Executive">Executive</option>
                  <option value="Presidential">Presidential</option>
                  <option value="Family">Family</option>
                </select>
              </div>

              <div className="col-md-2">
                <button
                  type="submit"
                  className="btn btn-gold btn-lg w-100 d-flex align-items-center justify-content-center gap-2 fs-6 py-2"
                >
                  <Search size={18} />
                  <span>Check Live</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Suites Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="text-gold text-uppercase fw-bold small tracking-wider">Handcrafted Comfort</span>
              <h2 className="display-6 fw-bold font-serif text-dark mb-0">Signature Accommodations</h2>
            </div>
            <button
              onClick={() => navigate('/rooms')}
              className="btn btn-outline-dark mt-3 mt-md-0 d-inline-flex align-items-center gap-2"
            >
              <span>Explore All Suites</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredRooms.map((room) => (
                <div key={room._id} className="col-lg-4 col-md-6">
                  <RoomCard room={room} onBookNow={(r) => setSelectedRoomForBooking(r)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hotel Highlights & Amenities */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="text-gold text-uppercase fw-bold small tracking-wider">Unrivaled Hospitality</span>
            <h2 className="display-6 fw-bold font-serif text-dark">Why Choose HotelPro</h2>
            <p className="text-muted">
              Designed for travelers seeking effortless luxury, exceptional dining, and peaceful relaxation.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light text-center h-100 border">
                <div className="d-inline-flex p-3 bg-warning bg-opacity-10 text-warning rounded-circle mb-3">
                  <Waves size={32} />
                </div>
                <h5 className="fw-bold font-serif mb-2">Infinity Heated Pools</h5>
                <p className="text-muted small mb-0">
                  Perched over coastal vistas with temperature-controlled waters, private sun cabanas, and poolside bar service.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light text-center h-100 border">
                <div className="d-inline-flex p-3 bg-warning bg-opacity-10 text-warning rounded-circle mb-3">
                  <UtensilsCrossed size={32} />
                </div>
                <h5 className="fw-bold font-serif mb-2">Fine Dining & Bistro</h5>
                <p className="text-muted small mb-0">
                  Culinary masterpieces crafted by international chefs using locally sourced organic produce and vintage wine cellars.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light text-center h-100 border">
                <div className="d-inline-flex p-3 bg-warning bg-opacity-10 text-warning rounded-circle mb-3">
                  <Sparkles size={32} />
                </div>
                <h5 className="fw-bold font-serif mb-2">Bespoke 24/7 Concierge</h5>
                <p className="text-muted small mb-0">
                  Dedicated personal concierges catering to tailored itineraries, private airport transfers, and private dining.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews Banner */}
      <section className="py-5 bg-navy text-white text-center">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="d-flex justify-content-center gap-1 text-warning mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="fs-5">★</span>
                ))}
              </div>
              <blockquote className="blockquote fs-4 font-serif mb-4">
                "HotelPro delivers an extraordinary level of detail. From the seamless digital check-in to the breathtaking oceanfront suite, our stay was truly unforgettable."
              </blockquote>
              <figcaption className="blockquote-footer text-gold mb-0">
                Sophia Montgomery, <cite title="Source Title">San Francisco, CA</cite>
              </figcaption>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedRoomForBooking && (
        <BookingModal
          room={selectedRoomForBooking}
          isOpen={!!selectedRoomForBooking}
          initialDates={{ checkIn, checkOut }}
          onClose={() => setSelectedRoomForBooking(null)}
          onBookingSuccess={() => {
            // refresh or keep open for invoice
          }}
        />
      )}
    </div>
  );
};

export default Home;
