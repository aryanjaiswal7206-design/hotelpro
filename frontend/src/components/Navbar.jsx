import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, User, LogOut, ShieldCheck, CalendarCheck, Sparkles, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isStaff, isAdmin, logout, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDemoSwitch = async (role) => {
    await switchDemoUser(role);
    if (role === 'admin' || role === 'staff') {
      navigate('/admin');
    } else {
      navigate('/my-bookings');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-navy sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <div className="bg-warning text-dark p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm">
            <Building2 size={22} className="text-navy" />
          </div>
          <div>
            <span className="fs-4 text-white">Hotel<span className="text-gold">Pro</span></span>
            <span className="d-block small text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', marginTop: '-4px' }}>
              LUXURY SUITES & RESIDENCES
            </span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#hotelNavbar"
          aria-controls="hotelNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="hotelNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/') ? 'text-gold fw-semibold' : 'text-light'}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/rooms') ? 'text-gold fw-semibold' : 'text-light'}`} to="/rooms">
                Rooms & Suites
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className={`nav-link px-3 ${isActive('/my-bookings') ? 'text-gold fw-semibold' : 'text-light'}`} to="/my-bookings">
                  My Bookings
                </Link>
              </li>
            )}
            {isStaff && (
              <li className="nav-item">
                <Link
                  className={`nav-link px-3 d-flex align-items-center gap-1 ${
                    location.pathname.startsWith('/admin') ? 'text-gold fw-semibold' : 'text-warning'
                  }`}
                  to="/admin"
                >
                  <ShieldCheck size={16} />
                  <span>Admin Hub</span>
                </Link>
              </li>
            )}
          </ul>

          {/* Right Action Buttons & User Menu */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Quick Demo Switcher Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-sm btn-outline-secondary text-light border-secondary dropdown-toggle d-flex align-items-center gap-1 py-1"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Sparkles size={14} className="text-warning" />
                <span className="small">Demo Logins</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-2">
                <li><h6 className="dropdown-header text-uppercase small fw-bold">1-Click Switch</h6></li>
                <li>
                  <button className="dropdown-item rounded py-2 small" onClick={() => handleDemoSwitch('admin')}>
                    👑 <strong>Admin</strong> (Manager)
                  </button>
                </li>
                <li>
                  <button className="dropdown-item rounded py-2 small" onClick={() => handleDemoSwitch('staff')}>
                    🛎️ <strong>Front Desk</strong> (Staff)
                  </button>
                </li>
                <li>
                  <button className="dropdown-item rounded py-2 small" onClick={() => handleDemoSwitch('guest')}>
                    🧳 <strong>Sophia</strong> (Guest)
                  </button>
                </li>
              </ul>
            </div>

            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light border-0 d-flex align-items-center gap-2 py-1 px-2 dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="rounded-circle border border-warning"
                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                  />
                  <div className="text-start d-none d-md-block">
                    <span className="d-block small text-white fw-semibold lh-1">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <span className="badge bg-warning text-dark text-uppercase" style={{ fontSize: '0.6rem' }}>
                      {user?.role}
                    </span>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2">
                  <li className="px-3 py-2 border-bottom mb-2">
                    <div className="fw-bold text-dark">{user?.name}</div>
                    <div className="small text-muted">{user?.email}</div>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded d-flex align-items-center gap-2 py-2" to="/profile">
                      <User size={16} /> My Profile
                    </Link>
                  </li>
                  {isStaff && (
                    <li>
                      <Link className="dropdown-item rounded d-flex align-items-center gap-2 py-2 text-primary" to="/admin">
                        <ShieldCheck size={16} /> Staff Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item rounded d-flex align-items-center gap-2 py-2" to="/my-bookings">
                      <CalendarCheck size={16} /> My Reservations
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger rounded d-flex align-items-center gap-2 py-2" onClick={handleLogout}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3 py-2">
                  Sign In
                </Link>
                <Link to="/rooms" className="btn btn-gold btn-sm px-3 py-2">
                  Book A Room
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
