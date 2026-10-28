import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { roomAPI } from '../services/api';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Users,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper date format YYYY-MM-DD
  const formatDate = (d) => d.toISOString().split('T')[0];
  const todayStr = formatDate(new Date());

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [capacity, setCapacity] = useState(searchParams.get('capacity') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '30000');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (type && type !== 'all') params.type = type;
      if (checkIn && checkOut) {
        params.checkIn = checkIn;
        params.checkOut = checkOut;
      }
      if (capacity) params.capacity = capacity;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;

      const res = await roomAPI.getAll(params);
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
  }, [type, capacity, maxPrice, sort]);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const handleReset = () => {
    setSearch('');
    setType('all');
    setCheckIn('');
    setCheckOut('');
    setCapacity('');
    setMaxPrice('30000');
    setSort('');
    setSearchParams({});
    // Re-fetch default
    roomAPI.getAll().then((res) => {
      if (res.data.success) setRooms(res.data.rooms);
    });
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="text-gold text-uppercase fw-bold small tracking-wider">Accommodations & Residences</span>
          <h1 className="display-5 fw-bold font-serif text-dark">Discover Your Sanctuary</h1>
          <p className="text-muted">
            Explore our curated inventory of coastal and skyline suites, equipped with five-star luxury amenities.
          </p>
        </div>

        {/* Filters Toolbar */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-white">
          <form onSubmit={handleApplyFilter}>
            <div className="row g-3 align-items-end">
              {/* Keyword Search */}
              <div className="col-lg-3 col-md-6">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Search size={14} className="text-gold" /> Search Room / Amenity
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ocean, King, Balcony..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary" type="submit">
                    Go
                  </button>
                </div>
              </div>

              {/* Room Category */}
              <div className="col-lg-2 col-md-6">
                <label className="form-label small fw-bold text-muted">Category</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
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

              {/* Check-In */}
              <div className="col-lg-2 col-md-4">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Calendar size={14} className="text-gold" /> Check-In
                </label>
                <input
                  type="date"
                  className="form-control"
                  min={todayStr}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>

              {/* Check-Out */}
              <div className="col-lg-2 col-md-4">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Calendar size={14} className="text-gold" /> Check-Out
                </label>
                <input
                  type="date"
                  className="form-control"
                  min={checkIn || todayStr}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>

              {/* Max Price Slider */}
              <div className="col-lg-2 col-md-4">
                <div className="d-flex justify-content-between small fw-bold text-muted mb-1">
                  <span>Max Price</span>
                  <span className="text-dark">₹{Number(maxPrice).toLocaleString('en-IN')}/night</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="1500"
                  max="30000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="col-lg-1 col-md-12 d-flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline-secondary w-100 p-2"
                  title="Reset Filters"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </form>

          {/* Active status indicator */}
          <div className="d-flex flex-wrap align-items-center justify-content-between pt-3 mt-3 border-top small text-muted">
            <div>
              Showing <strong className="text-dark">{rooms.length}</strong> available accommodations
              {checkIn && checkOut && (
                <span className="ms-2 badge bg-success bg-opacity-10 text-success border border-success">
                  Filtered for dates: {checkIn} to {checkOut}
                </span>
              )}
            </div>

            {/* Sort selector */}
            <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
              <span>Sort By:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Featured / Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Room Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading suites...</span>
            </div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="card border-0 shadow-sm p-5 text-center rounded-4">
            <h4 className="fw-bold font-serif mb-2">No Matching Accommodations Found</h4>
            <p className="text-muted mb-4">
              We couldn't find any rooms matching your current filters or date criteria. Try adjusting dates or reset filters.
            </p>
            <div>
              <button onClick={handleReset} className="btn btn-gold px-4">
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {rooms.map((room) => (
              <div key={room._id} className="col-lg-4 col-md-6">
                <RoomCard room={room} onBookNow={(r) => setSelectedRoom(r)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          isOpen={!!selectedRoom}
          initialDates={{ checkIn, checkOut }}
          onClose={() => setSelectedRoom(null)}
          onBookingSuccess={() => {
            fetchRooms(); // refresh availability
          }}
        />
      )}
    </div>
  );
};

export default Rooms;
