import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import InvoiceModal from '../components/InvoiceModal';
import {
  CalendarCheck,
  Receipt,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingAPI.getMy();
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load user reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you wish to cancel this reservation? An automatic refund will be credited.')) {
      return;
    }

    try {
      setActionError(null);
      const res = await bookingAPI.cancel(bookingId, { reason: 'Cancelled by guest via online portal' });
      if (res.data.success) {
        setActionSuccess('Reservation successfully cancelled and refund initiated.');
        fetchBookings();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not cancel booking.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge bg-success text-white text-uppercase px-2 py-1">Confirmed</span>;
      case 'checked-in':
        return <span className="badge bg-primary text-white text-uppercase px-2 py-1">Checked-In</span>;
      case 'checked-out':
        return <span className="badge bg-secondary text-white text-uppercase px-2 py-1">Checked-Out</span>;
      case 'cancelled':
        return <span className="badge bg-danger text-white text-uppercase px-2 py-1">Cancelled</span>;
      default:
        return <span className="badge bg-secondary text-uppercase">{status}</span>;
    }
  };

  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h1 className="display-6 fw-bold font-serif text-dark mb-1">My Reservations</h1>
            <p className="text-muted mb-0">Track stay itineraries, access digital invoices, and manage upcoming visits.</p>
          </div>
          <Link to="/rooms" className="btn btn-gold mt-3 mt-md-0 d-inline-flex align-items-center gap-2">
            <span>Book New Stay</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Notifications */}
        {actionSuccess && (
          <div className="alert alert-success alert-dismissible fade show rounded-3 mb-4" role="alert">
            <ShieldCheck size={18} className="me-2" />
            {actionSuccess}
            <button type="button" className="btn-close" onClick={() => setActionSuccess(null)}></button>
          </div>
        )}

        {actionError && (
          <div className="alert alert-danger alert-dismissible fade show rounded-3 mb-4" role="alert">
            <AlertCircle size={18} className="me-2" />
            {actionError}
            <button type="button" className="btn-close" onClick={() => setActionError(null)}></button>
          </div>
        )}

        {/* Filter Pills */}
        <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
          {['all', 'confirmed', 'checked-in', 'checked-out', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`btn btn-sm text-capitalize px-3 rounded-pill ${
                filterStatus === status ? 'btn-navy text-white fw-semibold' : 'btn-outline-secondary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card border-0 shadow-sm p-5 text-center rounded-4 bg-white">
            <CalendarCheck size={48} className="text-gold mx-auto mb-3" />
            <h4 className="fw-bold font-serif mb-2">No Bookings Found</h4>
            <p className="text-muted mb-4">You have no reservations currently matching the selected status.</p>
            <div>
              <Link to="/rooms" className="btn btn-gold px-4">
                Explore Available Suites
              </Link>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filteredBookings.map((b) => (
              <div key={b._id} className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div className="row g-3 align-items-center">
                  {/* Room Thumbnail */}
                  <div className="col-md-2">
                    <img
                      src={b.room?.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
                      alt={b.room?.title}
                      className="rounded-3 w-100 object-fit-cover shadow-sm"
                      style={{ height: '110px', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="col-md-4">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="small text-muted fw-semibold">Ref: {b.bookingNumber}</span>
                      {getStatusBadge(b.status)}
                    </div>
                    <h5 className="fw-bold font-serif text-dark mb-1">{b.room?.title || 'Suite Reservation'}</h5>
                    <div className="small text-muted">
                      Room #{b.room?.roomNumber} • {b.room?.type} • Floor {b.room?.floor}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="col-md-3">
                    <div className="small text-muted">Check-In / Out:</div>
                    <div className="fw-semibold text-dark small">
                      {new Date(b.checkInDate).toLocaleDateString()} &rarr; {new Date(b.checkOutDate).toLocaleDateString()}
                    </div>
                    <div className="small text-muted mt-1">
                      {b.totalNights} {b.totalNights === 1 ? 'Night' : 'Nights'} • Total: <strong className="text-dark">₹{b.totalAmount?.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-md-3 text-md-end d-flex flex-md-column gap-2 justify-content-end">
                    <button
                      onClick={() => setSelectedInvoiceBooking(b)}
                      className="btn btn-outline-dark btn-sm d-flex align-items-center justify-content-center gap-1"
                    >
                      <Receipt size={16} />
                      <span>View Invoice</span>
                    </button>

                    {(b.status === 'confirmed' || b.status === 'pending') && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center gap-1"
                      >
                        <XCircle size={16} />
                        <span>Cancel Stay</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          isOpen={!!selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}
    </div>
  );
};

export default MyBookings;
