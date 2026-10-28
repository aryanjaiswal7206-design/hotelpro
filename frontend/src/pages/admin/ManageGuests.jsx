import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { guestAPI } from '../../services/api';
import {
  Users,
  Search,
  Star,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  X,
  AlertCircle,
} from 'lucide-react';

const ManageGuests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [vipFilter, setVipFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idType: 'Passport',
    idNumber: '',
    street: '',
    city: '',
    country: '',
    isVIP: false,
    notes: '',
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (vipFilter !== '') params.isVIP = vipFilter;

      const res = await guestAPI.getAll(params);
      if (res.data.success) {
        setGuests(res.data.guests);
      }
    } catch (err) {
      console.error('Failed to load guests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [vipFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchGuests();
  };

  const openCreateModal = () => {
    setEditingGuest(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      idType: 'Passport',
      idNumber: '',
      street: '',
      city: '',
      country: '',
      isVIP: false,
      notes: '',
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (guest) => {
    setEditingGuest(guest);
    setFormData({
      fullName: guest.fullName,
      email: guest.email,
      phone: guest.phone,
      idType: guest.idType || 'Passport',
      idNumber: guest.idNumber || '',
      street: guest.address?.street || '',
      city: guest.address?.city || '',
      country: guest.address?.country || '',
      isVIP: guest.isVIP,
      notes: guest.notes || '',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this guest profile?')) return;
    try {
      await guestAPI.delete(id);
      setMessage('Guest record removed successfully');
      fetchGuests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      idType: formData.idType,
      idNumber: formData.idNumber,
      address: {
        street: formData.street,
        city: formData.city,
        country: formData.country,
      },
      isVIP: formData.isVIP,
      notes: formData.notes,
    };

    try {
      if (editingGuest) {
        await guestAPI.update(editingGuest._id, payload);
        setMessage('Guest profile updated successfully');
      } else {
        await guestAPI.create(payload);
        setMessage('New guest profile added successfully');
      }
      setModalOpen(false);
      fetchGuests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save guest profile.');
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
              <span className="text-gold text-uppercase fw-bold small tracking-wider">Customer Relationship Management</span>
              <h2 className="fw-bold font-serif text-dark mb-0">Guest Directory & VIP Ledger</h2>
            </div>
            <button onClick={openCreateModal} className="btn btn-gold btn-sm d-inline-flex align-items-center gap-1 mt-3 mt-md-0">
              <Plus size={16} /> Add Guest Profile
            </button>
          </div>

          {message && (
            <div className="alert alert-success alert-dismissible fade show rounded-3 mb-4" role="alert">
              <CheckCircle size={18} className="me-2" />
              {message}
              <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <form onSubmit={handleSearchSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white text-muted">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search guest by name, email, phone, or passport #..."
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
                    value={vipFilter}
                    onChange={(e) => setVipFilter(e.target.value)}
                  >
                    <option value="">All Guests</option>
                    <option value="true">⭐ VIP Guests Only</option>
                    <option value="false">Standard Guests</option>
                  </select>
                </div>

                <div className="col-md-3 text-md-end small text-muted d-flex align-items-center justify-content-end">
                  <span>Total Guests: <strong>{guests.length}</strong></span>
                </div>
              </div>
            </form>
          </div>

          {/* Guests Table */}
          <div className="card border-0 shadow-sm rounded-4 p-0 bg-white overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-uppercase text-muted">
                    <th>Guest Profile</th>
                    <th>Contact Info</th>
                    <th>Identification</th>
                    <th>Stays & Lifetime Spend</th>
                    <th>Staff Notes & Preferences</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="spinner-border text-warning spinner-border-sm me-2"></div>
                        <span>Loading guest registry...</span>
                      </td>
                    </tr>
                  ) : guests.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No guest profiles found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    guests.map((g) => (
                      <tr key={g._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div>
                              <div className="fw-bold text-dark font-serif d-flex align-items-center gap-1">
                                <span>{g.fullName}</span>
                                {g.isVIP && (
                                  <span className="badge bg-warning text-dark small" title="VIP Guest">
                                    ⭐ VIP
                                  </span>
                                )}
                              </div>
                              <span className="small text-muted">{g.address?.city || 'City N/A'}, {g.address?.country || 'Country N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small text-dark">{g.email}</div>
                          <span className="small text-muted">{g.phone}</span>
                        </td>
                        <td>
                          <div className="small fw-semibold text-dark">{g.idType}</div>
                          <span className="text-muted font-monospace" style={{ fontSize: '0.75rem' }}>{g.idNumber || 'None'}</span>
                        </td>
                        <td>
                          <div className="small fw-semibold text-dark">{g.totalBookings} Total Stays</div>
                          <strong className="text-success small font-serif">₹{g.totalSpent?.toLocaleString('en-IN') || 0}</strong>
                        </td>
                        <td style={{ maxWidth: '240px' }}>
                          <span className="small text-muted text-truncate d-inline-block" style={{ maxWidth: '240px' }} title={g.notes}>
                            {g.notes || 'No custom notes logged.'}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              onClick={() => openEditModal(g)}
                              className="btn btn-outline-secondary"
                              title="Edit Guest"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(g._id)}
                              className="btn btn-outline-danger"
                              title="Delete Profile"
                            >
                              <Trash2 size={14} />
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

      {/* Modal */}
      {modalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-navy text-white px-4 py-3">
                <h5 className="modal-title font-serif fw-bold">
                  {editingGuest ? 'Edit Guest Profile' : 'New Guest Record'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalOpen(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  {error && (
                    <div className="alert alert-danger small rounded-3 mb-3">{error}</div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Phone *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">ID Proof Type</label>
                      <select
                        className="form-select"
                        value={formData.idType}
                        onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                      >
                        <option value="Passport">Passport</option>
                        <option value="Driving License">Driving License</option>
                        <option value="National ID">National ID</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Document Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isVipCheck"
                      checked={formData.isVIP}
                      onChange={(e) => setFormData({ ...formData, isVIP: e.target.checked })}
                    />
                    <label className="form-check-label small fw-bold text-dark" htmlFor="isVipCheck">
                      Designate as VIP Guest (Priority Concierge)
                    </label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Staff Notes / Preferences</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="e.g. High floor preference, sparkling water on arrival..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gold px-4">
                    {editingGuest ? 'Update Guest' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGuests;
