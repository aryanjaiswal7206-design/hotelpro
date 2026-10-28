import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  Receipt,
  Sparkles,
  ArrowLeft,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/rooms', label: 'Room Inventory', icon: BedDouble },
    { to: '/admin/bookings', label: 'Reservations & Check-In', icon: CalendarCheck },
    { to: '/admin/guests', label: 'Guest Directory (CRM)', icon: Users },
    { to: '/admin/payments', label: 'Invoices & Billing', icon: Receipt },
    { to: '/admin/housekeeping', label: 'Housekeeping Board', icon: Sparkles },
  ];

  return (
    <aside className="admin-sidebar p-3 d-flex flex-column justify-content-between h-100 shadow-sm">
      <div>
        {/* Portal Header */}
        <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom border-secondary border-opacity-25 px-2">
          <div className="p-2 bg-warning text-dark rounded-3">
            <Building size={20} />
          </div>
          <div>
            <h6 className="mb-0 text-white fw-bold">Operations Hub</h6>
            <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
              HOTELPRO MANAGEMENT
            </span>
          </div>
        </div>

        {/* User Badge */}
        <div className="bg-secondary bg-opacity-25 p-3 rounded-3 mb-4 d-flex align-items-center gap-3 border border-secondary border-opacity-25">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt={user?.name}
            className="rounded-circle"
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
          />
          <div className="overflow-hidden">
            <div className="text-white fw-semibold small text-truncate">{user?.name}</div>
            <span className="badge bg-warning text-dark text-uppercase" style={{ fontSize: '0.65rem' }}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="nav flex-column gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Return Link */}
      <div className="pt-3 border-top border-secondary border-opacity-25 mt-4">
        <Link to="/" className="btn btn-outline-secondary text-light w-100 btn-sm d-flex align-items-center justify-content-center gap-2">
          <ArrowLeft size={16} />
          <span>Exit to Guest View</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
