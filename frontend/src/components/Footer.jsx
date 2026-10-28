import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy text-light pt-5 pb-4 mt-auto border-top border-secondary border-opacity-25">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-warning text-dark p-2 rounded-3">
                <Building2 size={24} />
              </div>
              <span className="fs-4 fw-bold text-white">Hotel<span className="text-gold">Pro</span></span>
            </div>
            <p className="text-secondary small leading-relaxed pe-lg-4">
              HotelPro is an enterprise-grade hospitality management system. Streamlining room inventories,
              real-time reservation workflows, guest CRM, and automated invoicing with military-grade security.
            </p>
            <div className="d-flex gap-3 text-secondary">
              <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary px-2 py-1">
                Node.js & Express
              </span>
              <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary px-2 py-1">
                MongoDB
              </span>
              <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary px-2 py-1">
                React JSX
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold text-uppercase mb-3 small tracking-wider">Explore</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2 text-secondary">
              <li><Link to="/" className="text-decoration-none text-secondary hover-gold">Home</Link></li>
              <li><Link to="/rooms" className="text-decoration-none text-secondary hover-gold">Rooms & Suites</Link></li>
              <li><Link to="/my-bookings" className="text-decoration-none text-secondary hover-gold">Reservation Search</Link></li>
              <li><Link to="/admin" className="text-decoration-none text-secondary hover-gold">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Hotel Amenities */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold text-uppercase mb-3 small tracking-wider">Signature Features</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2 text-secondary">
              <li>✨ Real-Time Date Collision Checking</li>
              <li>🛎️ Automated Express Check-In / Out</li>
              <li>📑 Instant Digital Invoicing & PDF Print</li>
              <li>🧹 Housekeeping Task Management Board</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold text-uppercase mb-3 small tracking-wider">Contact & Concierge</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2 text-secondary">
              <li className="d-flex align-items-center gap-2">
                <MapPin size={16} className="text-warning flex-shrink-0" />
                <span>742 Ocean Promenade, Suite 100, California</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-warning flex-shrink-0" />
                <span>+1 (800) 555-HOTELPRO</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-warning flex-shrink-0" />
                <span>concierge@hotelpro.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary border-opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} HotelPro Hospitality Solutions. Built with precision for modern hotels.
          </p>
          <div className="d-flex align-items-center gap-3 mt-2 mt-md-0">
            <span>Secure 256-Bit SSL Encryption</span>
            <span>•</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
