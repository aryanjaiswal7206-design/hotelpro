import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Bed, Maximize2, Star, Check } from 'lucide-react';

const RoomCard = ({ room, onBookNow }) => {
  const statusColors = {
    available: 'badge-available',
    occupied: 'badge-occupied',
    cleaning: 'badge-cleaning',
    maintenance: 'badge-maintenance',
  };

  return (
    <div className="card hotel-card h-100 border-0 shadow-sm d-flex flex-column">
      {/* Room Image with Badges */}
      <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
          alt={room.title}
          className="w-100 h-100 object-fit-cover transition-transform"
          style={{ objectFit: 'cover' }}
        />
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className="badge bg-dark bg-opacity-75 text-white px-2 py-1 small rounded-pill">
            Room #{room.roomNumber}
          </span>
          <span className="badge bg-warning text-dark px-2 py-1 small rounded-pill fw-semibold">
            {room.type}
          </span>
        </div>

        <div className="position-absolute top-0 end-0 m-3">
          <span className={`badge ${statusColors[room.status] || 'bg-secondary text-white'} text-capitalize`}>
            {room.status}
          </span>
        </div>

        {room.rating && (
          <div className="position-absolute bottom-0 end-0 m-3 bg-white px-2 py-1 rounded shadow-sm d-flex align-items-center gap-1 small fw-bold">
            <Star size={14} className="text-warning fill-warning" fill="#f59e0b" />
            <span>{room.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body p-4 d-flex flex-column flex-grow-1">
        <h5 className="card-title fw-bold text-dark mb-2 font-serif text-truncate" title={room.title}>
          {room.title}
        </h5>

        <p className="card-text text-muted small mb-3 text-truncate-2" style={{ minHeight: '38px', lineHeight: '1.4' }}>
          {room.description}
        </p>

        {/* Room Specifications Row */}
        <div className="d-flex align-items-center justify-content-between py-2 border-top border-bottom border-light-subtle my-2 text-secondary small">
          <div className="d-flex align-items-center gap-1" title="Max Adults">
            <Users size={16} className="text-gold" />
            <span>{room.capacity?.adults || 2} Adults</span>
          </div>
          <div className="d-flex align-items-center gap-1" title="Bed Type">
            <Bed size={16} className="text-gold" />
            <span>{room.bedType || 'King Bed'}</span>
          </div>
          <div className="d-flex align-items-center gap-1" title="Room Size">
            <Maximize2 size={16} className="text-gold" />
            <span>{room.sizeSqFt || 350} sq ft</span>
          </div>
        </div>

        {/* Amenity Badges */}
        <div className="d-flex flex-wrap gap-1 mb-3 pt-2">
          {room.amenities?.slice(0, 3).map((amenity, index) => (
            <span key={index} className="badge bg-light text-secondary border small fw-normal py-1 px-2 d-flex align-items-center gap-1">
              <Check size={12} className="text-success" />
              {amenity}
            </span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="badge bg-light text-muted border small fw-normal py-1 px-2">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Pricing & Call to Actions */}
        <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
          <div>
            <div className="small text-muted">Per night from</div>
            <div className="d-flex align-items-baseline">
              <span className="fs-4 fw-bold text-dark font-serif">₹{room.pricePerNight?.toLocaleString('en-IN')}</span>
              <span className="small text-muted ms-1">/ night</span>
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link to={`/rooms/${room._id}`} className="btn btn-outline-secondary btn-sm px-2 py-1">
              Details
            </Link>
            <button
              onClick={() => onBookNow(room)}
              disabled={room.status === 'maintenance'}
              className="btn btn-gold btn-sm px-3 py-1"
            >
              {room.status === 'maintenance' ? 'Unavailable' : 'Reserve'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
