import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public & Guest Pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Admin / Staff Management Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageRooms from './pages/admin/ManageRooms';
import ManageBookings from './pages/admin/ManageBookings';
import ManageGuests from './pages/admin/ManageGuests';
import ManagePayments from './pages/admin/ManagePayments';
import Housekeeping from './pages/admin/Housekeeping';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Guest Protected Routes */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin & Staff Management Hub */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <ManageRooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <ManageBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/guests"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <ManageGuests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <ManagePayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/housekeeping"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <Housekeeping />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {/* Hide public footer inside dense admin dashboard views for maximum screen efficiency */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
