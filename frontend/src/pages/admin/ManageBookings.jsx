import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { bookingAPI } from '../../services/api';
import InvoiceModal from '../../components/InvoiceModal';
import {
  CalendarCheck,
  Search,
  CheckCircle,
  LogOut,
  XCircle,
  Receipt,
  AlertCircle,
  Filter,
} from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search) params.search = search;

      const res = await bookingAPI.getAll(params);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setFeedback(null);
      const res = await bookingAPI.updateStatus(bookingId, { status: newStatus });
      if (res.data.success) {
        setFeedback({ type: 'success', text: `Reservation updated to '${newStatus}'. Room status synchronized.` });
        fetchBookings();
      }
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || 'Update failed' });
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <div style={{ width: '260px' }} className="d-none d-lg-block flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-grow-1 p-4 overflow-auto">
        <div className="container-fluid">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <div>
              <span className="text-gold text-uppercase fw-bold small tracking-wider">Front Desk Operations</span>
              <h2 className="fw-bold font-serif text-dark mb-0">Manage Bookings & Check-Ins</h2>
            </div>
          </div>

          {feedback && (
            <div className={`alert alert-${feedback.type} alert-dismissible fade show rounded-3 mb-4`} role="alert">
              {feedback.text}
              <button type="button" className="btn-close" onClick={() => setFeedback(null)}></button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <form onSubmit={handleSearchSubmit}>
              <div className="row g-3">
                <div className="col-md-5">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white text-muted">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Guest Name, Email, or Ref #..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn btn-navy text-white" type="submit">
                      Search
                    </button>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="d-flex gap-1 overflow-auto">
                    {['all', 'confirmed', 'checked-in', 'checked-out', 'cancelled'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`btn btn-sm text-capitalize ${
                          statusFilter === st ? 'btn-gold' : 'btn-outline-secondary'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-md-3 text-md-end small text-muted d-flex align-items-center justify-content-end">
                  <span>Found: <strong>{bookings.length}</strong> bookings</span>
                </div>
              </div>
            </form>
          </div>

          {/* Bookings Table */}
          <div className="card border-0 shadow-sm rounded-4 p-0 bg-white overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-uppercase text-muted">
                    <th>Ref #</th>
                    <th>Guest Details</th>
                    <th>Room</th>
                    <th>Dates</th>
                    <th>Nights</th>
                    <th>Amount & Pay</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="spinner-border text-warning spinner-border-sm me-2"></div>
                        <span>Loading bookings...</span>
                      </td>
                    </tr>
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        No reservations found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b._id}>
                        <td>
                          <strong className="text-dark font-monospace small">{b.bookingNumber}</strong>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark small">{b.guestInfo?.fullName || b.user?.name}</div>
                          <span className="small text-muted d-block">{b.guestInfo?.email || b.user?.email}</span>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>{b.guestInfo?.phone}</span>
                        </td>
                        <td>
                          <div className="fw-semibold small text-dark">Room #{b.room?.roomNumber}</div>
                          <span className="badge bg-light text-muted border small">{b.room?.type}</span>
                        </td>
                        <td className="small text-muted">
                          <div>In: {new Date(b.checkInDate).toLocaleDateString()}</div>
                          <div>Out: {new Date(b.checkOutDate).toLocaleDateString()}</div>
                        </td>
                        <td className="small text-muted">{b.totalNights} nts</td>
                        <td>
                          <div className="fw-bold small text-dark font-serif">₹{b.totalAmount?.toLocaleString('en-IN')}</div>
                          <span className="badge bg-success bg-opacity-10 text-success border border-success small" style={{ fontSize: '0.65rem' }}>
                            {b.paymentStatus} ({b.paymentMethod})
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              b.status === 'confirmed'
                                ? 'bg-success'
                                : b.status === 'checked-in'
                                ? 'bg-primary'
                                : b.status === 'checked-out'
                                ? 'bg-secondary'
                                : 'bg-danger'
                            } text-uppercase`}
                            style={{ fontSize: '0.7rem' }}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            {b.status === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateStatus(b._id, 'checked-in')}
                                className="btn btn-outline-primary"
                                title="Check In Guest (Sets Room to Occupied)"
                              >
                                Check In
                              </button>
                            )}

                            {b.status === 'checked-in' && (
                              <button
                                onClick={() => handleUpdateStatus(b._id, 'checked-out')}
                                className="btn btn-outline-success"
                                title="Check Out Guest (Sets Room to Cleaning)"
                              >
                                Check Out
                              </button>
                            )}

                            {b.status !== 'cancelled' && b.status !== 'checked-out' && (
                              <button
                                onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                                className="btn btn-outline-danger"
                                title="Cancel Booking"
                              >
                                Cancel
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedInvoice(b)}
                              className="btn btn-outline-secondary"
                              title="View Invoice Folio"
                            >
                              <Receipt size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          booking={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default ManageBookings;
