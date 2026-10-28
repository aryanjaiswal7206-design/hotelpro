import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { User, Lock, Phone, Mail, ShieldCheck, AlertCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setLoading(true);

    try {
      const res = await authAPI.updateProfile({ name, phone, avatar });
      if (res.data.success) {
        updateUser(res.data.user);
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setProfileMsg({ type: 'danger', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: 'danger', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'danger', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.updatePassword({ currentPassword, newPassword });
      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      setPasswordMsg({ type: 'danger', text: err.response?.data?.message || 'Password update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        <div className="row g-4 justify-content-center">
          {/* User overview card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white">
              <img
                src={avatar || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name}
                className="rounded-circle mx-auto mb-3 border border-3 border-warning"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <h4 className="fw-bold font-serif text-dark mb-1">{user?.name}</h4>
              <p className="text-muted small mb-2">{user?.email}</p>
              <span className="badge bg-navy text-gold text-uppercase px-3 py-2 rounded-pill small">
                {user?.role} Access
              </span>

              <hr className="my-4" />

              <div className="text-start small text-muted">
                <div className="d-flex justify-content-between mb-2">
                  <span>Phone:</span>
                  <strong className="text-dark">{user?.phone || 'Not provided'}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Member Since:</span>
                  <strong className="text-dark">2026</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="col-lg-7">
            {/* Personal Details */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold font-serif mb-3 d-flex align-items-center gap-2">
                <User size={20} className="text-gold" /> Personal Details
              </h5>

              {profileMsg && (
                <div className={`alert alert-${profileMsg.type} small rounded-3 mb-3`}>
                  {profileMsg.text}
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Email (Read Only)</label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-muted">Avatar Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-navy text-white d-flex align-items-center gap-2 px-4"
                >
                  <Save size={16} /> Save Changes
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold font-serif mb-3 d-flex align-items-center gap-2">
                <Lock size={20} className="text-gold" /> Security & Password
              </h5>

              {passwordMsg && (
                <div className={`alert alert-${passwordMsg.type} small rounded-3 mb-3`}>
                  {passwordMsg.text}
                </div>
              )}

              <form onSubmit={handleUpdatePassword}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-outline-dark d-flex align-items-center gap-2 px-4"
                >
                  <Lock size={16} /> Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
