import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../services/api';
import {
  Calendar,
  Users,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  X,
  FileText,
  AlertCircle,
} from 'lucide-react';

const BookingModal = ({ room, isOpen, onClose, onBookingSuccess, initialDates }) => {
  const { user, isAuthenticated } = useAuth();

  // Helper date format YYYY-MM-DD
  const formatDate = (d) => d.toISOString().split('T')[0];

  const todayStr = formatDate(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const defaultCheckoutStr = formatDate(tomorrow);

  const [checkInDate, setCheckInDate] = useState(initialDates?.checkIn || todayStr);
  const [checkOutDate, setCheckOutDate] = useState(initialDates?.checkOut || defaultCheckoutStr);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  const [guestInfo, setGuestInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+1 (555) 012-3456',
    idProofType: 'Passport',
    idProofNumber: 'P-9847291',
  });

  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardNumber, setCardNumber] = useState('4532 8920 1823 4901');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('382');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedBooking, setCompletedBooking] = useState(null);

  // Update guest info if user changes
  useEffect(() => {
    if (user) {
      setGuestInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || '+1 (555) 012-3456',
      }));
    }
  }, [user]);

  if (!isOpen || !room) return null;

  // Calculate pricing breakdown
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = end - start;
  const nights = !isNaN(diffTime) && diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 1;
  const subtotal = nights * room.pricePerNight;
  const taxes = Math.round(subtotal * 0.12 * 100) / 100;
  const totalAmount = subtotal + taxes;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates.');
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError('Check-out date must be strictly after check-in date.');
      return;
    }

    if (!guestInfo.fullName || !guestInfo.email || !guestInfo.phone) {
      setError('Please fill in complete guest contact information.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        roomId: room._id,
        checkInDate,
        checkOutDate,
        numberOfGuests: { adults: Number(adults), children: Number(childrenCount) },
        guestInfo,
        specialRequests,
        paymentMethod,
      };

      const res = await bookingAPI.create(payload);
      if (res.data.success) {
        setCompletedBooking(res.data.booking);
        if (onBookingSuccess) {
          onBookingSuccess(res.data.booking);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to complete booking.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1055 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-navy text-white px-4 py-3">
            <div className="d-flex align-items-center gap-2">
              <Calendar className="text-warning" size={22} />
              <div>
                <h5 className="modal-title fw-bold font-serif mb-0">
                  {completedBooking ? 'Reservation Confirmed!' : `Reserve ${room.title}`}
                </h5>
                <span className="small text-muted">Room #{room.roomNumber} • {room.type} Suite</span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            {completedBooking ? (
              /* Success Confirmation Screen */
              <div className="text-center py-4">
                <div className="mb-3 d-inline-flex p-3 bg-success bg-opacity-10 rounded-circle text-success">
                  <CheckCircle size={56} />
                </div>
                <h3 className="fw-bold font-serif text-dark mb-1">Thank You, {completedBooking.guestInfo?.fullName}!</h3>
                <p className="text-muted mb-4">
                  Your reservation is confirmed. A receipt and confirmation has been logged in your account.
                </p>

                <div className="card bg-light border-0 rounded-4 p-4 text-start mb-4 max-w-lg mx-auto shadow-sm">
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <span className="small text-muted d-block">Booking Reference</span>
                      <strong className="fs-6 text-primary">{completedBooking.bookingNumber}</strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="small text-muted d-block">Status</span>
                      <span className="badge bg-success text-uppercase">Confirmed & Paid</span>
                    </div>
                    <div className="col-sm-6">
                      <span className="small text-muted d-block">Check-in</span>
                      <strong>{new Date(completedBooking.checkInDate).toLocaleDateString()}</strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="small text-muted d-block">Check-out</span>
                      <strong>{new Date(completedBooking.checkOutDate).toLocaleDateString()}</strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="small text-muted d-block">Room Booked</span>
                      <strong>Room #{room.roomNumber} ({room.type})</strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="small text-muted d-block">Total Paid</span>
                      <strong className="fs-5 text-dark">₹{completedBooking.totalAmount?.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-navy text-white px-4" onClick={onClose}>
                    Done
                  </button>
                  <a href="/my-bookings" className="btn btn-outline-dark px-4">
                    View in My Bookings
                  </a>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="row g-4">
                  {/* Left Column: Dates & Guest Info */}
                  <div className="col-lg-7">
                    <h6 className="fw-bold text-uppercase small text-gold mb-3 d-flex align-items-center gap-2">
                      <Calendar size={16} /> 1. Stay Dates & Guests
                    </h6>

                    <div className="row g-2 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Check-In Date</label>
                        <input
                          type="date"
                          className="form-control"
                          min={todayStr}
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Check-Out Date</label>
                        <input
                          type="date"
                          className="form-control"
                          min={checkInDate || todayStr}
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="row g-2 mb-4">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Adults</label>
                        <select
                          className="form-select"
                          value={adults}
                          onChange={(e) => setAdults(e.target.value)}
                        >
                          <option value="1">1 Adult</option>
                          <option value="2">2 Adults</option>
                          <option value="3">3 Adults</option>
                          <option value="4">4 Adults</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Children</label>
                        <select
                          className="form-select"
                          value={childrenCount}
                          onChange={(e) => setChildrenCount(e.target.value)}
                        >
                          <option value="0">0 Children</option>
                          <option value="1">1 Child</option>
                          <option value="2">2 Children</option>
                          <option value="3">3 Children</option>
                        </select>
                      </div>
                    </div>

                    <h6 className="fw-bold text-uppercase small text-gold mb-3 d-flex align-items-center gap-2">
                      <Users size={16} /> 2. Guest Information
                    </h6>

                    <div className="mb-2">
                      <label className="form-label small fw-semibold text-muted">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Sophia Montgomery"
                        value={guestInfo.fullName}
                        onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="row g-2 mb-2">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="guest@hotelpro.com"
                          value={guestInfo.email}
                          onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="+1 (555) 012-3456"
                          value={guestInfo.phone}
                          onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">ID Document Type</label>
                        <select
                          className="form-select"
                          value={guestInfo.idProofType}
                          onChange={(e) => setGuestInfo({ ...guestInfo, idProofType: e.target.value })}
                        >
                          <option value="Passport">Passport</option>
                          <option value="Driving License">Driving License</option>
                          <option value="National ID">National ID Card</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Document Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. P-8921839A"
                          value={guestInfo.idProofNumber}
                          onChange={(e) => setGuestInfo({ ...guestInfo, idProofNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Special Requests / Preferences</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="e.g. Quiet floor, extra feather pillows, late check-in..."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  {/* Right Column: Pricing & Payment */}
                  <div className="col-lg-5">
                    <div className="bg-light p-4 rounded-4 border">
                      <h6 className="fw-bold text-dark font-serif mb-3">Reservation Summary</h6>

                      <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                        <img
                          src={room.images?.[0]}
                          alt={room.title}
                          className="rounded-3"
                          style={{ width: '70px', height: '60px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold small text-dark">{room.title}</div>
                          <span className="small text-muted">₹{room.pricePerNight?.toLocaleString('en-IN')} / night</span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>Stay Duration</span>
                        <span className="fw-semibold text-dark">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                      </div>

                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>Room Rate ({nights} x ₹{room.pricePerNight?.toLocaleString('en-IN')})</span>
                        <span className="fw-semibold text-dark">₹{subtotal?.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="d-flex justify-content-between small text-muted mb-3 pb-3 border-bottom">
                        <span>Hotel Tax & Service Fee (12%)</span>
                        <span className="fw-semibold text-dark">₹{taxes?.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="d-flex justify-content-between align-items-baseline mb-4">
                        <span className="fw-bold text-dark">Total Amount Due</span>
                        <span className="fs-4 fw-bold text-gold font-serif">₹{totalAmount?.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Payment Options */}
                      <h6 className="fw-bold text-uppercase small text-muted mb-2 d-flex align-items-center gap-1">
                        <CreditCard size={14} /> Instant Payment Simulation
                      </h6>

                      <div className="mb-3">
                        <div className="btn-group w-100" role="group">
                          <input
                            type="radio"
                            className="btn-check"
                            name="payMethod"
                            id="payCard"
                            checked={paymentMethod === 'Credit Card'}
                            onChange={() => setPaymentMethod('Credit Card')}
                          />
                          <label className="btn btn-outline-secondary btn-sm" htmlFor="payCard">Card</label>

                          <input
                            type="radio"
                            className="btn-check"
                            name="payMethod"
                            id="payUPI"
                            checked={paymentMethod === 'UPI'}
                            onChange={() => setPaymentMethod('UPI')}
                          />
                          <label className="btn btn-outline-secondary btn-sm" htmlFor="payUPI">UPI</label>

                          <input
                            type="radio"
                            className="btn-check"
                            name="payMethod"
                            id="payCash"
                            checked={paymentMethod === 'Cash'}
                            onChange={() => setPaymentMethod('Cash')}
                          />
                          <label className="btn btn-outline-secondary btn-sm" htmlFor="payCash">Front Desk</label>
                        </div>
                      </div>

                      {paymentMethod === 'Credit Card' && (
                        <div className="bg-white p-3 rounded-3 border mb-3">
                          <div className="mb-2">
                            <label className="form-label text-muted" style={{ fontSize: '0.75rem' }}>Card Number</label>
                            <input
                              type="text"
                              className="form-control form-control-sm font-monospace"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                            />
                          </div>
                          <div className="row g-2">
                            <div className="col-6">
                              <label className="form-label text-muted" style={{ fontSize: '0.75rem' }}>Expiry</label>
                              <input
                                type="text"
                                className="form-control form-control-sm text-center font-monospace"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                              />
                            </div>
                            <div className="col-6">
                              <label className="form-label text-muted" style={{ fontSize: '0.75rem' }}>CVV</label>
                              <input
                                type="password"
                                className="form-control form-control-sm text-center font-monospace"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="small text-muted d-flex align-items-center gap-1 mb-3">
                        <ShieldCheck size={16} className="text-success" />
                        <span>Instant confirmation with 256-bit encryption</span>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-gold w-100 py-2 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                            <span>Securing Booking...</span>
                          </>
                        ) : (
                          <span>Confirm & Pay ₹{totalAmount?.toLocaleString('en-IN')}</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
