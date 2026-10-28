import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { roomAPI } from '../../services/api';
import {
  Sparkles,
  Wrench,
  CheckCircle,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const Housekeeping = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [maintenanceNotes, setMaintenanceNotes] = useState({});
  const [message, setMessage] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await roomAPI.getAll();
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error('Failed to load rooms for housekeeping:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleUpdateStatus = async (roomId, status, assignedStaff, maintenanceNote) => {
    try {
      const payload = { status };
      if (assignedStaff !== undefined) payload.assignedStaff = assignedStaff;
      if (maintenanceNote !== undefined) payload.maintenanceNote = maintenanceNote;

      const res = await roomAPI.updateStatus(roomId, payload);
      if (res.data.success) {
        setMessage(`Room status updated to '${status}'. Inventory updated.`);
        fetchRooms();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update housekeeping status');
    }
  };

  const cleaningRooms = rooms.filter((r) => r.status === 'cleaning');
  const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance');
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied');
  const availableRooms = rooms.filter((r) => r.status === 'available');

  const staffMembers = [
    'Elena Ramos (Lead Housekeeper)',
    'Marco Diaz (Senior Attendant)',
    'Sarah Jenkins (Inspector)',
    'David Miller (Maintenance Tech)',
    'Carlos Santana (HVAC Specialist)',
  ];

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
              <span className="text-gold text-uppercase fw-bold small tracking-wider">Property Care & Quality</span>
              <h2 className="fw-bold font-serif text-dark mb-0">Housekeeping & Maintenance Tracker</h2>
            </div>
            <button onClick={fetchRooms} className="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-1 mt-3 mt-md-0">
              <RefreshCw size={14} /> Refresh Board
            </button>
          </div>

          {message && (
            <div className="alert alert-success alert-dismissible fade show rounded-3 mb-4" role="alert">
              <CheckCircle size={18} className="me-2" />
              {message}
              <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <span className="small text-muted fw-semibold">Needs Cleaning</span>
                <h3 className="fw-bold font-serif text-warning mt-1 mb-0">{cleaningRooms.length} Rooms</h3>
                <span className="small text-muted">Post check-out queue</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <span className="small text-muted fw-semibold">Under Maintenance</span>
                <h3 className="fw-bold font-serif text-danger mt-1 mb-0">{maintenanceRooms.length} Rooms</h3>
                <span className="small text-muted">Requires repairs/checks</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <span className="small text-muted fw-semibold">Occupied by Guests</span>
                <h3 className="fw-bold font-serif text-primary mt-1 mb-0">{occupiedRooms.length} Rooms</h3>
                <span className="small text-muted">Daily turndown service</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <span className="small text-muted fw-semibold">Ready for Check-In</span>
                <h3 className="fw-bold font-serif text-success mt-1 mb-0">{availableRooms.length} Rooms</h3>
                <span className="small text-muted">Inspected & sanitized</span>
              </div>
            </div>
          </div>

          {/* Housekeeping Tasks Kanban Grid */}
          <div className="row g-4 mb-4">
            {/* Column 1: Cleaning in Progress / Pending */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <div className="d-flex align-items-center gap-2">
                    <Sparkles className="text-warning" size={20} />
                    <h5 className="fw-bold font-serif mb-0 text-dark">Cleaning Queue</h5>
                  </div>
                  <span className="badge badge-cleaning">{cleaningRooms.length} Pending</span>
                </div>

                {cleaningRooms.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    <CheckCircle size={32} className="text-success mb-2" />
                    <div>All rooms have been cleaned and inspected!</div>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {cleaningRooms.map((room) => (
                      <div key={room._id} className="p-3 rounded-3 border bg-light">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong className="fs-6 text-dark font-serif">Room #{room.roomNumber}</strong>
                            <span className="text-muted small ms-2">({room.type} Suite - Floor {room.floor})</span>
                          </div>
                          <span className="badge badge-cleaning">Cleaning Needed</span>
                        </div>

                        <div className="row g-2 mb-3">
                          <div className="col-sm-7">
                            <label className="form-label small text-muted mb-1" style={{ fontSize: '0.75rem' }}>Assigned Housekeeper:</label>
                            <select
                              className="form-select form-select-sm"
                              value={selectedStaff[room._id] || room.assignedStaff || staffMembers[0]}
                              onChange={(e) => setSelectedStaff({ ...selectedStaff, [room._id]: e.target.value })}
                            >
                              {staffMembers.map((s, idx) => (
                                <option key={idx} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-sm-5 d-flex align-items-end">
                            <button
                              onClick={() => handleUpdateStatus(room._id, 'available', selectedStaff[room._id] || room.assignedStaff || staffMembers[0])}
                              className="btn btn-success btn-sm w-100 fw-semibold d-flex align-items-center justify-content-center gap-1"
                            >
                              <CheckCircle size={14} />
                              <span>Mark Inspected</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Maintenance Tracker */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <div className="d-flex align-items-center gap-2">
                    <Wrench className="text-danger" size={20} />
                    <h5 className="fw-bold font-serif mb-0 text-dark">Engineering & Repairs</h5>
                  </div>
                  <span className="badge badge-maintenance">{maintenanceRooms.length} In Progress</span>
                </div>

                {maintenanceRooms.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    <CheckCircle size={32} className="text-success mb-2" />
                    <div>No rooms currently require maintenance or technical service.</div>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {maintenanceRooms.map((room) => (
                      <div key={room._id} className="p-3 rounded-3 border bg-light">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong className="fs-6 text-dark font-serif">Room #{room.roomNumber}</strong>
                            <span className="text-muted small ms-2">({room.type} Suite - Floor {room.floor})</span>
                          </div>
                          <span className="badge badge-maintenance">Maintenance</span>
                        </div>

                        <div className="p-2 bg-white rounded border small text-muted mb-3">
                          <strong>Service Issue: </strong>
                          {room.maintenanceNote || 'General repair, filter servicing, or electrical inspection.'}
                        </div>

                        <div className="d-flex justify-content-end">
                          <button
                            onClick={() => handleUpdateStatus(room._id, 'available', '', '')}
                            className="btn btn-navy text-white btn-sm d-flex align-items-center gap-1"
                          >
                            <CheckCircle size={14} />
                            <span>Mark Fixed & Ready</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Status Setter for All Rooms */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold font-serif mb-3">Fast Room Status Overrides</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-uppercase text-muted">
                    <th>Room</th>
                    <th>Current Status</th>
                    <th>Floor</th>
                    <th>Staff Note</th>
                    <th className="text-end">Quick Update</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((r) => (
                    <tr key={r._id}>
                      <td>
                        <strong className="text-dark font-serif">Room #{r.roomNumber}</strong>
                        <span className="text-muted small ms-2">{r.title}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            r.status === 'available'
                              ? 'badge-available'
                              : r.status === 'occupied'
                              ? 'badge-occupied'
                              : r.status === 'cleaning'
                              ? 'badge-cleaning'
                              : 'badge-maintenance'
                          } text-capitalize`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="small text-muted">Floor {r.floor}</td>
                      <td className="small text-muted">{r.maintenanceNote || r.assignedStaff || '—'}</td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            onClick={() => handleUpdateStatus(r._id, 'available')}
                            className={`btn ${r.status === 'available' ? 'btn-success text-white' : 'btn-outline-success'}`}
                            title="Set Available"
                          >
                            Available
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(r._id, 'cleaning')}
                            className={`btn ${r.status === 'cleaning' ? 'btn-warning text-dark' : 'btn-outline-warning'}`}
                            title="Set Cleaning"
                          >
                            Clean
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(r._id, 'maintenance', '', 'Routine inspection scheduled')}
                            className={`btn ${r.status === 'maintenance' ? 'btn-danger text-white' : 'btn-outline-danger'}`}
                            title="Set Maintenance"
                          >
                            Maintenance
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Housekeeping;
