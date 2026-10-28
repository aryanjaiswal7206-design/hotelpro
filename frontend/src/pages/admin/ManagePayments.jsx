import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { paymentAPI } from '../../services/api';
import InvoiceModal from '../../components/InvoiceModal';
import {
  Receipt,
  Search,
  DollarSign,
  Printer,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  CreditCard,
} from 'lucide-react';

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (methodFilter !== 'all') params.paymentMethod = methodFilter;

      const res = await paymentAPI.getAll(params);
      if (res.data.success) {
        setPayments(res.data.payments);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, methodFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm('Process a full refund for this transaction?')) return;
    try {
      const res = await paymentAPI.refund(paymentId);
      if (res.data.success) {
        setMessage('Payment successfully marked as refunded.');
        fetchPayments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Refund failed');
    }
  };

  const openInvoiceForPayment = (payment) => {
    if (payment.booking) {
      // attach payment object to booking
      setSelectedInvoiceBooking({
        ...payment.booking,
        payment,
      });
    }
  };

  const totalCollected = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

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
              <span className="text-gold text-uppercase fw-bold small tracking-wider">Financial Operations</span>
              <h2 className="fw-bold font-serif text-dark mb-0">Billing Ledger & Invoices</h2>
            </div>
            <div className="card border-0 shadow-sm rounded-3 px-3 py-2 bg-white mt-3 mt-md-0 d-flex flex-row align-items-center gap-2">
              <span className="small text-muted">Settled Volume:</span>
              <strong className="fs-5 text-dark font-serif">₹{totalCollected.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {message && (
            <div className="alert alert-success alert-dismissible fade show rounded-3 mb-4" role="alert">
              <CheckCircle size={18} className="me-2" />
              {message}
              <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
            </div>
          )}

          {/* Search & Filters */}
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
                      placeholder="Search Invoice # or Transaction ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn btn-navy text-white" type="submit">
                      Search
                    </button>
                  </div>
                </div>

                <div className="col-md-3">
                  <select
                    className="form-select form-select-sm"
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                  >
                    <option value="all">All Payment Methods</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash / Front Desk</option>
                    <option value="Online">Online Gateway</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <select
                    className="form-select form-select-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div className="col-md-2 text-md-end small text-muted d-flex align-items-center justify-content-end">
                  <span>Transactions: <strong>{payments.length}</strong></span>
                </div>
              </div>
            </form>
          </div>

          {/* Ledger Table */}
          <div className="card border-0 shadow-sm rounded-4 p-0 bg-white overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-uppercase text-muted">
                    <th>Invoice #</th>
                    <th>Guest / Account</th>
                    <th>Booking Ref</th>
                    <th>Transaction ID</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="spinner-border text-warning spinner-border-sm me-2"></div>
                        <span>Loading payment ledger...</span>
                      </td>
                    </tr>
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        No transactions found matching filters.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <strong className="text-dark font-monospace small">{p.invoiceNumber}</strong>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {new Date(p.paidAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="fw-semibold small text-dark">{p.user?.name || 'Guest'}</div>
                          <span className="small text-muted">{p.user?.email}</span>
                        </td>
                        <td>
                          <span className="small text-muted font-monospace">{p.booking?.bookingNumber || 'N/A'}</span>
                        </td>
                        <td>
                          <span className="small text-muted font-monospace" style={{ fontSize: '0.75rem' }}>{p.transactionId}</span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border small">{p.paymentMethod}</span>
                        </td>
                        <td>
                          <strong className="text-dark font-serif fs-6">₹{p.amount?.toLocaleString('en-IN')}</strong>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              p.status === 'completed'
                                ? 'bg-success'
                                : p.status === 'refunded'
                                ? 'bg-warning text-dark'
                                : 'bg-danger'
                            } text-uppercase small`}
                            style={{ fontSize: '0.7rem' }}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              onClick={() => openInvoiceForPayment(p)}
                              className="btn btn-outline-secondary"
                              title="View & Print Official Folio"
                            >
                              <Printer size={14} />
                            </button>
                            {p.status === 'completed' && (
                              <button
                                onClick={() => handleRefund(p._id)}
                                className="btn btn-outline-danger"
                                title="Issue Refund"
                              >
                                Refund
                              </button>
                            )}
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

export default ManagePayments;
