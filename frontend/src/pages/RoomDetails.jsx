import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import BookingModal from '../components/BookingModal';
import {
  Bed,
  Users,
  Maximize2,
  Star,
  CheckCircle,
  ShieldAlert,
  Clock,
  ArrowLeft,
  Calendar,
  Sparkles,
} from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await roomAPI.getById(id);
        if (res.data.success) {
          setRoom(res.data.room);
        }
      } catch (err) {
        setError('Room details could not be found.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5 min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger p-4 rounded-4 max-w-md mx-auto">
          <h4>{error || 'Room not found'}</h4>
          <Link to="/rooms" className="btn btn-dark mt-3">Back to Rooms</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light py-4 min-vh-100">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link to="/rooms" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2 mb-2">
            <ArrowLeft size={16} />
            <span>Back to All Suites</span>
          </Link>
        </div>

        {/* Title Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-warning text-dark px-2 py-1">{room.type}</span>
              <span className="badge bg-dark text-white px-2 py-1">Room #{room.roomNumber}</span>
              <span className="badge bg-secondary text-white">Floor {room.floor}</span>
            </div>
            <h1 className="display-6 fw-bold font-serif text-dark mb-1">{room.title}</h1>
            <div className="d-flex align-items-center gap-2 text-muted small">
              <div className="d-flex align-items-center gap-1 text-warning">
                <Star size={16} fill="#f59e0b" />
                <strong className="text-dark">{room.rating || 4.9}</strong>
              </div>
              <span>•</span>
              <span>Exclusive HotelPro Luxury Collection</span>
            </div>
          </div>

          <div className="mt-3 mt-md-0 text-md-end">
            <div className="small text-muted">Starting from</div>
            <div className="fs-2 fw-bold text-dark font-serif">₹{room.pricePerNight?.toLocaleString('en-IN')} <span className="fs-6 text-muted font-sans fw-normal">/ night</span></div>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="row g-3 mb-5">
          <div className="col-lg-8">
            <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: '420px' }}>
              <img
                src={room.images?.[activeImage] || room.images?.[0]}
                alt={room.title}
                className="w-100 h-100 object-fit-cover"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-3 h-100">
              {room.images?.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`rounded-3 overflow-hidden cursor-pointer flex-fill border ${
                    activeImage === idx ? 'border-warning border-2' : 'border-light'
                  }`}
                  style={{ cursor: 'pointer', height: '130px' }}
                >
                  <img src={img} alt="Thumbnail" className="w-100 h-100 object-fit-cover" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content & Booking Action Card */}
        <div className="row g-5">
          {/* Main Info */}
          <div className="col-lg-8">
            {/* Specs row */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 className="fw-bold font-serif mb-3">Room Highlights</h5>
              <div className="row g-3 text-center">
                <div className="col-3 border-end">
                  <Bed size={24} className="text-gold mb-1" />
                  <div className="small text-muted">Bed Type</div>
                  <strong className="text-dark small">{room.bedType || 'King Bed'}</strong>
                </div>
                <div className="col-3 border-end">
                  <Users size={24} className="text-gold mb-1" />
                  <div className="small text-muted">Capacity</div>
                  <strong className="text-dark small">{room.capacity?.adults || 2} Adults</strong>
                </div>
                <div className="col-3 border-end">
                  <Maximize2 size={24} className="text-gold mb-1" />
                  <div className="small text-muted">Room Size</div>
                  <strong className="text-dark small">{room.sizeSqFt || 380} sq ft</strong>
                </div>
                <div className="col-3">
                  <Sparkles size={24} className="text-gold mb-1" />
                  <div className="small text-muted">Status</div>
                  <strong className="text-capitalize small">{room.status}</strong>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 className="fw-bold font-serif mb-3">About this Suite</h5>
              <p className="text-muted leading-relaxed mb-0">{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 className="fw-bold font-serif mb-3">Amenities & Features</h5>
              <div className="row g-3">
                {room.amenities?.map((amenity, index) => (
                  <div key={index} className="col-md-6 d-flex align-items-center gap-2">
                    <CheckCircle size={18} className="text-success flex-shrink-0" />
                    <span className="small text-dark fw-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Policies */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold font-serif mb-3">Hotel Policies</h5>
              <div className="row g-3 small text-muted">
                <div className="col-md-6 d-flex align-items-start gap-2">
                  <Clock size={18} className="text-warning flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-dark d-block">Check-in & Check-out</strong>
                    <span>Check-in from 3:00 PM. Check-out until 11:00 AM. Express front desk available 24/7.</span>
                  </div>
                </div>
                <div className="col-md-6 d-flex align-items-start gap-2">
                  <ShieldAlert size={18} className="text-warning flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-dark d-block">Cancellation Guarantee</strong>
                    <span>Free cancellation up to 24 hours prior to standard check-in time. Instant refund processing.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Booking Action Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
              <div className="d-flex justify-content-between align-items-baseline mb-3">
                <span className="fs-3 fw-bold font-serif text-dark">₹{room.pricePerNight?.toLocaleString('en-IN')}</span>
                <span className="text-muted small">/ night + taxes</span>
              </div>

              <div className="p-3 bg-light rounded-3 mb-4">
                <div className="small text-muted mb-1">Availability Status:</div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${room.status === 'available' ? 'bg-success' : 'bg-warning text-dark'} text-capitalize`}>
                    {room.status}
                  </span>
                  <span className="small text-muted">Verified in real-time</span>
                </div>
              </div>

              <button
                onClick={() => setIsBookingOpen(true)}
                disabled={room.status === 'maintenance'}
                className="btn btn-gold w-100 py-3 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm"
              >
                <Calendar size={18} />
                <span>Reserve This Suite</span>
              </button>

              <div className="text-center small text-muted">
                No upfront charges until you confirm your dates and guest details.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          room={room}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          onBookingSuccess={() => {
            navigate('/my-bookings');
          }}
        />
      )}
    </div>
  );
};

export default RoomDetails;
