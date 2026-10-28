import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else if (data.user?.role === 'admin' || data.user?.role === 'staff') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/my-bookings', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError(null);
    setLoading(true);
    try {
      const data = await switchDemoUser(role);
      if (role === 'admin' || role === 'staff') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/my-bookings', { replace: true });
      }
    } catch (err) {
      setError('Demo login failed. Make sure database is seeded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="d-inline-flex p-3 bg-warning text-dark rounded-3 mb-2 shadow-sm">
                  <Building2 size={28} />
                </div>
                <h3 className="fw-bold font-serif text-dark mb-1">Sign In to HotelPro</h3>
                <p className="text-muted small">Manage reservations, suites, and operations.</p>
              </div>

              {/* Demo Account Pills for quick grading / evaluation */}
              <div className="bg-light p-3 rounded-3 mb-4 border">
                <div className="d-flex align-items-center gap-1 text-gold small fw-bold mb-2">
                  <Sparkles size={14} /> <span>1-Click Demo Accounts</span>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="btn btn-outline-dark btn-sm flex-fill"
                    style={{ fontSize: '0.75rem' }}
                  >
                    👑 Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('staff')}
                    className="btn btn-outline-dark btn-sm flex-fill"
                    style={{ fontSize: '0.75rem' }}
                  >
                    🛎️ Front Desk
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('guest')}
                    className="btn btn-outline-dark btn-sm flex-fill"
                    style={{ fontSize: '0.75rem' }}
                  >
                    🧳 Sophia (Guest)
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 rounded-3 small">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      placeholder="admin@hotelpro.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <label className="form-label small fw-semibold text-muted">Password</label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold w-100 py-2 fw-bold text-uppercase mb-3 shadow-sm"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                <div className="text-center small text-muted">
                  Don't have an account yet?{' '}
                  <Link to="/register" className="text-gold fw-bold text-decoration-none">
                    Register here
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

export default Login;
