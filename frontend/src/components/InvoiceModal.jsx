import React from 'react';
import { Printer, X, Building2, CheckCircle2 } from 'lucide-react';

const InvoiceModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber =
    booking.payment?.invoiceNumber ||
    `INV-${new Date(booking.createdAt || Date.now()).getFullYear()}-${String(booking._id || '').slice(-5).toUpperCase() || 'REF'}`;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1060 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header Action Bar */}
          <div className="modal-header bg-light border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold text-dark text-uppercase small tracking-wider">
              Official Guest Folio & Invoice
            </h6>
            <div className="d-flex align-items-center gap-2">
              <button onClick={handlePrint} className="btn btn-sm btn-outline-dark d-flex align-items-center gap-1">
                <Printer size={16} /> Print Receipt
              </button>
              <button onClick={onClose} className="btn-close" aria-label="Close"></button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div className="modal-body p-4 p-md-5" id="printable-invoice">
            {/* Header info */}
            <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="bg-warning text-dark p-2 rounded-3">
                    <Building2 size={24} />
                  </div>
                  <span className="fs-4 fw-bold font-serif text-dark">Hotel<span className="text-warning">Pro</span></span>
                </div>
                <div className="text-muted small">
                  <div>742 Ocean Promenade, Suite 100</div>
                  <div>California, United States</div>
                  <div>Phone: +1 (800) 555-HOTELPRO</div>
                  <div>Email: accounts@hotelpro.com</div>
                </div>
              </div>

              <div className="text-end">
                <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-1 mb-2 text-uppercase fs-6">
                  {booking.paymentStatus === 'paid' ? 'Paid in Full' : booking.paymentStatus}
                </div>
                <h4 className="fw-bold font-serif text-dark mb-1">{invoiceNumber}</h4>
                <div className="small text-muted">
                  Date: {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
                </div>
                <div className="small text-muted">
                  Booking Ref: <strong>{booking.bookingNumber}</strong>
                </div>
              </div>
            </div>

            {/* Billed To / Reservation details */}
            <div className="row g-4 mb-4 pb-4 border-bottom">
              <div className="col-sm-6">
                <h6 className="text-uppercase small text-muted fw-bold mb-2">Guest Information</h6>
                <div className="fw-bold text-dark fs-6">{booking.guestInfo?.fullName || booking.user?.name}</div>
                <div className="text-muted small">{booking.guestInfo?.email || booking.user?.email}</div>
                <div className="text-muted small">Phone: {booking.guestInfo?.phone || booking.user?.phone || 'N/A'}</div>
                {booking.guestInfo?.idProofNumber && (
                  <div className="text-muted small">ID: {booking.guestInfo.idProofType} ({booking.guestInfo.idProofNumber})</div>
                )}
              </div>

              <div className="col-sm-6">
                <h6 className="text-uppercase small text-muted fw-bold mb-2">Stay Details</h6>
                <div className="small text-muted">
                  <span className="fw-semibold text-dark">Room: </span>
                  {booking.room?.title} (Room #{booking.room?.roomNumber} - {booking.room?.type})
                </div>
                <div className="small text-muted">
                  <span className="fw-semibold text-dark">Check-in: </span>
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </div>
                <div className="small text-muted">
                  <span className="fw-semibold text-dark">Check-out: </span>
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </div>
                <div className="small text-muted">
                  <span className="fw-semibold text-dark">Duration: </span>
                  {booking.totalNights} {booking.totalNights === 1 ? 'Night' : 'Nights'}
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr className="small text-uppercase">
                    <th>Description</th>
                    <th className="text-center">Rate</th>
                    <th className="text-center">Nights</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Accommodation Charges</strong>
                      <div className="small text-muted">{booking.room?.title}</div>
                    </td>
                    <td className="text-center">₹{booking.pricePerNight?.toLocaleString('en-IN')}</td>
                    <td className="text-center">{booking.totalNights}</td>
                    <td className="text-end fw-semibold">₹{booking.subtotal?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end text-muted small">
                      State & Occupancy Tax (12%)
                    </td>
                    <td className="text-end text-muted small">₹{booking.taxes?.toLocaleString('en-IN')}</td>
                  </tr>
                  {booking.discount > 0 && (
                    <tr>
                      <td colSpan="3" className="text-end text-success small">
                        Special Promo Discount
                      </td>
                      <td className="text-end text-success small">-₹{booking.discount?.toLocaleString('en-IN')}</td>
                    </tr>
                  )}
                  <tr className="table-light">
                    <td colSpan="3" className="text-end fw-bold fs-6">
                      Total Billed
                    </td>
                    <td className="text-end fw-bold fs-5 text-dark">
                      ₹{booking.totalAmount?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer notes & sign-off */}
            <div className="d-flex justify-content-between align-items-center pt-3 border-top text-muted small">
              <div className="d-flex align-items-center gap-2 text-success">
                <CheckCircle2 size={18} />
                <span>Payment recorded via {booking.paymentMethod || 'Credit Card'}. Thank you for choosing HotelPro!</span>
              </div>
              <div className="text-end">
                <span>Authorized Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
