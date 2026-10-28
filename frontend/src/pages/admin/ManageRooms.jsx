import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { roomAPI } from '../../services/api';
import {
  BedDouble,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  Filter,
} from 'lucide-react';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    title: '',
    type: 'Deluxe',
    pricePerNight: 4500,
    adults: 2,
    children: 1,
    floor: 1,
    bedType: 'King Bed',
    sizeSqFt: 350,
    amenities: 'High-speed Wi-Fi, Air Conditioning, Smart TV, Mini Bar',
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    description: '',
    status: 'available',
  });

  const [formError, setFormError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await roomAPI.getAll();
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openCreateModal = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      title: '',
      type: 'Deluxe',
      pricePerNight: 5500,
      adults: 2,
      children: 1,
      floor: 1,
      bedType: 'King Bed',
      sizeSqFt: 380,
      amenities: 'High-speed Wi-Fi, Air Conditioning, Smart TV, Mini Bar, Ocean View',
      images: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      description: 'Sophisticated suite offering panoramic vistas and custom bath amenities.',
      status: 'available',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      title: room.title,
      type: room.type,
      pricePerNight: room.pricePerNight,
      adults: room.capacity?.adults || 2,
      children: room.capacity?.children || 0,
      floor: room.floor || 1,
      bedType: room.bedType || 'King Bed',
      sizeSqFt: room.sizeSqFt || 350,
      amenities: room.amenities?.join(', ') || '',
      images: room.images?.join(', ') || '',
      description: room.description || '',
      status: room.status,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const res = await roomAPI.updateStatus(roomId, { status: newStatus });
      if (res.data.success) {
        setMessage(`Room status updated to ${newStatus}`);
        fetchRooms();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await roomAPI.delete(roomId);
      if (res.data.success) {
        setMessage('Room removed successfully');
        fetchRooms();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const payload = {
      roomNumber: formData.roomNumber,
      title: formData.title,
      type: formData.type,
      pricePerNight: Number(formData.pricePerNight),
      capacity: { adults: Number(formData.adults), children: Number(formData.children) },
      floor: Number(formData.floor),
      bedType: formData.bedType,
      sizeSqFt: Number(formData.sizeSqFt),
      amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
      description: formData.description,
      status: formData.status,
    };

    try {
      if (editingRoom) {
        await roomAPI.update(editingRoom._id, payload);
        setMessage('Room updated successfully');
      } else {
        await roomAPI.create(payload);
        setMessage('New room created successfully');
      }
      setModalOpen(false);
      fetchRooms();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save room.');
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || r.type === filterType;
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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
              <span className="text-gold text-uppercase fw-bold small tracking-wider">Inventory Control</span>
              <h2 className="fw-bold font-serif text-dark mb-0">Manage Rooms & Suites</h2>
            </div>
            <button onClick={openCreateModal} className="btn btn-gold btn-sm d-inline-flex align-items-center gap-1 mt-3 mt-md-0">
              <Plus size={16} /> Add New Room
            </button>
          </div>

          {message && (
            <div className="alert alert-success alert-dismissible fade show rounded-3 mb-4" role="alert">
              <CheckCircle size={18} className="me-2" />
              {message}
              <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
            </div>
          )}

          {/* Filters Bar */}
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white text-muted">
                    <Search size={14} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Room # or Title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <select
                  className="form-select form-select-sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Room Types</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Executive">Executive</option>
                  <option value="Family">Family</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>

              <div className="col-md-3">
                <select
                  className="form-select form-select-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="col-md-2 text-md-end small text-muted d-flex align-items-center justify-content-end">
                <span>Total: <strong>{filteredRooms.length}</strong></span>
              </div>
            </div>
          </div>

          {/* Rooms Table */}
          <div className="card border-0 shadow-sm rounded-4 p-0 bg-white overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-uppercase text-muted">
                    <th>Room</th>
                    <th>Category & Bed</th>
                    <th>Rate / Night</th>
                    <th>Capacity</th>
                    <th>Floor</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <div className="spinner-border text-warning spinner-border-sm me-2"></div>
                        <span>Loading rooms...</span>
                      </td>
                    </tr>
                  ) : filteredRooms.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No rooms found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRooms.map((room) => (
                      <tr key={room._id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=150&q=80'}
                              alt={room.title}
                              className="rounded-3"
                              style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-bold text-dark font-serif">Room #{room.roomNumber}</div>
                              <span className="small text-muted text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                {room.title}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border small me-1">{room.type}</span>
                          <span className="small text-muted">{room.bedType}</span>
                        </td>
                        <td>
                          <strong className="text-dark font-serif fs-6">₹{room.pricePerNight?.toLocaleString('en-IN')}</strong>
                        </td>
                        <td className="small text-muted">
                          {room.capacity?.adults} Adults, {room.capacity?.children} Ch.
                        </td>
                        <td className="small text-muted">Floor {room.floor}</td>
                        <td>
                          <select
                            className="form-select form-select-sm text-capitalize"
                            style={{ width: '130px', fontSize: '0.8rem' }}
                            value={room.status}
                            onChange={(e) => handleStatusChange(room._id, e.target.value)}
                          >
                            <option value="available">🟢 Available</option>
                            <option value="occupied">🔵 Occupied</option>
                            <option value="cleaning">🟡 Cleaning</option>
                            <option value="maintenance">🔴 Maintenance</option>
                          </select>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              onClick={() => openEditModal(room)}
                              className="btn btn-outline-secondary"
                              title="Edit Room"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(room._id)}
                              className="btn btn-outline-danger"
                              title="Delete Room"
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

      {/* Add / Edit Room Modal */}
      {modalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1055 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-navy text-white px-4 py-3">
                <h5 className="modal-title font-serif fw-bold">
                  {editingRoom ? `Edit Room #${editingRoom.roomNumber}` : 'Add New Room / Suite'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalOpen(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  {formError && (
                    <div className="alert alert-danger small rounded-3 mb-3 d-flex align-items-center gap-2">
                      <AlertCircle size={16} /> <span>{formError}</span>
                    </div>
                  )}

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-muted">Room Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 501"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold text-muted">Room Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Grand Diplomatic Terrace Suite"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-muted">Category *</label>
                      <select
                        className="form-select"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Executive">Executive</option>
                        <option value="Family">Family</option>
                        <option value="Presidential">Presidential</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-muted">Price / Night (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={formData.pricePerNight}
                        onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-muted">Floor</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-muted">Adults</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={formData.adults}
                        onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-muted">Children</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={formData.children}
                        onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-muted">Bed Type</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="King Bed"
                        value={formData.bedType}
                        onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Amenities (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="High-speed Wi-Fi, Air Conditioning, Smart TV..."
                      value={formData.amenities}
                      onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Image URLs (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Room Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gold px-4">
                    {editingRoom ? 'Update Room' : 'Create Room'}
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

export default ManageRooms;
