import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import StatusBadge from '../components/StatusBadge';
import ReturnModal from '../components/ReturnModal';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  ArrowRight,
  Filter,
  Eye,
  Building2
} from 'lucide-react';

const AdminClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedClaimForReturn, setSelectedClaimForReturn] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllClaims(false);
      if (res.success && res.data) {
        setClaims(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleApprove = async (claimId) => {
    const notes = prompt('Enter approval notes or pickup instructions for the student:', 'Claim verified. Please visit Central Security Desk with your student ID card to collect item.');
    if (notes === null) return;
    try {
      await adminService.approveClaim(claimId, notes);
      fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve claim.');
    }
  };

  const handleReject = async (claimId) => {
    const notes = prompt('Enter reason for rejecting this claim:', 'Ownership details or proof did not match the recovered item specifications.');
    if (notes === null) return;
    try {
      await adminService.rejectClaim(claimId, notes);
      fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject claim.');
    }
  };

  const filteredClaims = claims.filter((c) => {
    if (activeFilter === 'ALL') return true;
    return c.status === activeFilter;
  });

  return (
    <div className="container" style={{ marginTop: '2.5rem', marginBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Ownership Claims Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Review private ownership proofs, approve genuine owners, and confirm handovers
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#E2E8F0', padding: '4px', borderRadius: 'var(--radius-md)', gap: '4px' }}>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'RETURNED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setActiveFilter(st)}
              className={`btn btn-sm ${activeFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '6px' }}
            >
              {st} ({claims.filter((c) => (st === 'ALL' ? true : c.status === st)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Claims List Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="empty-state">
          <ShieldCheck size={32} />
          <h3>No Claims Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            No claims matching filter "{activeFilter}".
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredClaims.map((claim) => (
            <div key={claim.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <StatusBadge status={claim.status} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Claim #{claim.id}</span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)' }}>
                    Item: {claim.foundItemName}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Found at: <strong>{claim.foundItemLocation}</strong> • Held at: {claim.foundItemHeldAt || 'Security Desk'}
                  </div>
                </div>

                {/* Claimant Details */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', minWidth: '220px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Claimant Information
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-navy)', fontSize: '0.95rem', marginTop: '2px' }}>
                    {claim.claimantFullName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                    UID: {claim.claimantCollegeId || 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                    {claim.claimantEmail} {claim.claimantPhone && `• ${claim.claimantPhone}`}
                  </div>
                </div>
              </div>

              {/* Descriptions & Private Proof */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
                  <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    Claim Description:
                  </div>
                  {claim.claimDescription}
                </div>

                <div style={{ backgroundColor: '#FEF8E6', padding: '0.85rem', borderRadius: '8px', border: '1px solid #FDE68A', fontSize: '0.88rem', color: '#92400E' }}>
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <Lock size={14} /> Confidential Ownership Proof:
                  </div>
                  {claim.privateOwnershipProof}
                </div>
              </div>

              {/* Admin Note if already reviewed */}
              {claim.adminNotes && (
                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#166534', marginBottom: '1rem' }}>
                  <strong>Admin Note:</strong> {claim.adminNotes} (Verified by: {claim.verifiedByName || 'Staff'})
                </div>
              )}

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <Link to={`/items/${claim.foundItemId}`} className="btn btn-outline btn-sm">
                  <Eye size={14} /> View Found Item Report
                </Link>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {claim.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(claim.id)}
                        className="btn btn-success btn-sm"
                      >
                        <CheckCircle2 size={15} /> Approve Claim
                      </button>
                      <button
                        onClick={() => handleReject(claim.id)}
                        className="btn btn-danger btn-sm"
                      >
                        <XCircle size={15} /> Reject Claim
                      </button>
                    </>
                  )}

                  {claim.status === 'APPROVED' && !claim.returnRecord && (
                    <button
                      onClick={() => {
                        setSelectedClaimForReturn(claim);
                        setShowReturnModal(true);
                      }}
                      className="btn btn-gold btn-sm"
                    >
                      <CheckCircle2 size={15} /> Record Handover Return
                    </button>
                  )}

                  {claim.returnRecord && (
                    <span className="badge badge-returned" style={{ fontSize: '0.8rem' }}>
                      Handed Over at {claim.returnRecord.handoverLocation}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return Modal */}
      <ReturnModal
        claim={selectedClaimForReturn}
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onSuccess={() => {
          fetchClaims();
          alert('Return record created successfully! Student has been notified.');
        }}
      />
    </div>
  );
};

export default AdminClaimsPage;
