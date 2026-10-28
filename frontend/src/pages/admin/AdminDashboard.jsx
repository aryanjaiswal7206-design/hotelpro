import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { dashboardAPI, bookingAPI } from '../../services/api';
import InvoiceModal from '../../components/InvoiceModal';
import {
  TrendingUp,
  DollarSign,
  BedDouble,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  Receipt,
  ArrowUpRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await dashboardAPI.getStats();
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickStatus = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, { status: newStatus });
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar Navigation */}
      <div style={{ width: '260px' }} className="d-none d-lg-block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 p-4 overflow-auto">
        <div className="container-fluid">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <div>
              <span className="text-gold text-uppercase fw-bold small tracking-wider">Executive Overview</span>
              <h2 className="fw-bold font-serif text-dark mb-0">Hotel Operations Dashboard</h2>
            </div>
            <div className="d-flex gap-2 mt-3 mt-md-0">
              <Link to="/admin/bookings" className="btn btn-navy text-white btn-sm px-3">
                Manage Bookings
              </Link>
              <Link to="/admin/rooms" className="btn btn-gold btn-sm px-3">
                + Add Room
              </Link>
            </div>
          </div>

          {loading || !stats ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : (
            <>
              {/* KPI Cards Row */}
              <div className="row g-3 mb-4">
                <div className="col-xl-3 col-sm-6">
                  <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span className="text-muted small fw-semibold">Occupancy Rate</span>
                        <h3 className="fw-bold text-dark font-serif mt-1 mb-0">{stats.occupancyRate}%</h3>
                        <span className="small text-muted">{stats.occupiedRooms} of {stats.totalRooms} rooms filled</span>
                      </div>
                      <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
                        <TrendingUp size={22} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6">
                  <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span className="text-muted small fw-semibold">Total Revenue</span>
                        <h3 className="fw-bold text-dark font-serif mt-1 mb-0">₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
                        <span className="small text-success fw-semibold">From completed invoices</span>
                      </div>
                      <div className="p-3 bg-success bg-opacity-10 text-success rounded-3">
                        <DollarSign size={22} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6">
                  <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span className="text-muted small fw-semibold">Available Rooms</span>
                        <h3 className="fw-bold text-dark font-serif mt-1 mb-0">{stats.availableRooms}</h3>
                        <span className="small text-muted">{stats.cleaningRooms} pending cleaning</span>
                      </div>
                      <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3">
                        <BedDouble size={22} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6">
                  <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span className="text-muted small fw-semibold">Total Guests & VIPs</span>
                        <h3 className="fw-bold text-dark font-serif mt-1 mb-0">{stats.totalGuests}</h3>
                        <span className="small text-gold fw-semibold">{stats.vipGuests} VIP Profiles</span>
                      </div>
                      <div className="p-3 bg-info bg-opacity-10 text-info rounded-3">
                        <Users size={22} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Distribution & Revenue Trends */}
              <div className="row g-4 mb-4">
                {/* Room Inventory Distribution */}
                <div className="col-lg-6">
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                    <h5 className="fw-bold font-serif mb-3">Room Inventory Status</h5>
                    <div className="progress mb-3" style={{ height: '14px', borderRadius: '8px' }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${(stats.availableRooms / stats.totalRooms) * 100}%` }}
                        title="Available"
                      ></div>
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: `${(stats.occupiedRooms / stats.totalRooms) * 100}%` }}
                        title="Occupied"
                      ></div>
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: `${(stats.cleaningRooms / stats.totalRooms) * 100}%` }}
                        title="Cleaning"
                      ></div>
                      <div
                        className="progress-bar bg-danger"
                        style={{ width: `${(stats.maintenanceRooms / stats.totalRooms) * 100}%` }}
                        title="Maintenance"
                      ></div>
                    </div>

                    <div className="row g-2 text-center pt-2">
                      <div className="col-3">
                        <span className="badge badge-available d-block py-2">
                          {stats.availableRooms} Available
                        </span>
                      </div>
                      <div className="col-3">
                        <span className="badge badge-occupied d-block py-2">
                          {stats.occupiedRooms} Occupied
                        </span>
                      </div>
                      <div className="col-3">
                        <span className="badge badge-cleaning d-block py-2">
                          {stats.cleaningRooms} Cleaning
                        </span>
                      </div>
                      <div className="col-3">
                        <span className="badge badge-maintenance d-block py-2">
                          {stats.maintenanceRooms} Maintenance
                        </span>
                      </div>
                    </div>

                    <hr className="my-3" />
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small text-muted">Need housekeeping updates?</span>
                      <Link to="/admin/housekeeping" className="small fw-semibold text-gold text-decoration-none">
                        Open Housekeeping Board &rarr;
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Revenue Highlights */}
                <div className="col-lg-6">
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                    <h5 className="fw-bold font-serif mb-3">Recent Monthly Revenue</h5>
                    <div className="d-flex flex-column gap-3">
                      {stats.monthlyRevenue?.map((m, idx) => (
                        <div key={idx} className="d-flex align-items-center justify-content-between">
                          <span className="small fw-semibold text-muted" style={{ width: '80px' }}>{m.name}</span>
                          <div className="flex-grow-1 mx-3">
                            <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                              <div
                                className="progress-bar bg-warning"
                                style={{ width: `${Math.min(100, (m.revenue / (stats.totalRevenue || 1)) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="small fw-bold text-dark font-monospace">₹{m.revenue.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    <hr className="my-3" />
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small text-muted">View all itemized payments & invoices</span>
                      <Link to="/admin/payments" className="small fw-semibold text-gold text-decoration-none">
                        Billing Ledger &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold font-serif mb-0">Recent Reservations</h5>
                  <Link to="/admin/bookings" className="btn btn-outline-dark btn-sm">
                    View All Bookings
                  </Link>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr className="small text-uppercase text-muted">
                        <th>Reference</th>
                        <th>Guest</th>
                        <th>Room</th>
                        <th>Dates</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentBookings?.map((b) => (
                        <tr key={b._id}>
                          <td>
                            <strong className="small text-dark font-monospace">{b.bookingNumber}</strong>
                          </td>
                          <td>
                            <div className="fw-semibold small text-dark">{b.guestInfo?.fullName || b.user?.name}</div>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{b.guestInfo?.email || b.user?.email}</span>
                          </td>
                          <td>
                            <div className="small fw-semibold text-dark">Room #{b.room?.roomNumber}</div>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{b.room?.type}</span>
                          </td>
                          <td className="small text-muted">
                            {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}
                          </td>
                          <td>
                            <span className="fw-bold small text-dark">₹{b.totalAmount?.toLocaleString('en-IN')}</span>
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
                                  onClick={() => handleQuickStatus(b._id, 'checked-in')}
                                  className="btn btn-outline-primary"
                                  title="Check-In Guest"
                                >
                                  Check In
                                </button>
                              )}
                              {b.status === 'checked-in' && (
                                <button
                                  onClick={() => handleQuickStatus(b._id, 'checked-out')}
                                  className="btn btn-outline-success"
                                  title="Check-Out Guest"
                                >
                                  Check Out
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedInvoice(b)}
                                className="btn btn-outline-secondary"
                                title="View Folio"
                              >
                                Folio
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
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

export default AdminDashboard;
