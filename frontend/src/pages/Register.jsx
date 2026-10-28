import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'guest',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      if (data.user?.role === 'admin' || data.user?.role === 'staff') {
        navigate('/admin');
      } else {
        navigate('/rooms');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-9">
            <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="d-inline-flex p-3 bg-warning text-dark rounded-3 mb-2 shadow-sm">
                  <Building2 size={28} />
                </div>
                <h3 className="fw-bold font-serif text-dark mb-1">Create Your Account</h3>
                <p className="text-muted small">Join HotelPro for seamless suite bookings and guest perks.</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 rounded-3 small">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      name="name"
                      className="form-control border-start-0"
                      placeholder="Eleanor Vance"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        name="email"
                        className="form-control border-start-0"
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <Phone size={16} />
                      </span>
                      <input
                        type="text"
                        name="phone"
                        className="form-control border-start-0"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <Lock size={16} />
                      </span>
                      <input
                        type="password"
                        name="password"
                        className="form-control border-start-0"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <Lock size={16} />
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control border-start-0"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-muted">Account Access Role</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="guest">Guest / Traveler</option>
                    <option value="staff">Hotel Staff / Receptionist</option>
                    <option value="admin">Hotel Administrator</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold w-100 py-2 fw-bold text-uppercase mb-3 shadow-sm"
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>

                <div className="text-center small text-muted">
                  Already registered?{' '}
                  <Link to="/login" className="text-gold fw-bold text-decoration-none">
                    Sign in here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
