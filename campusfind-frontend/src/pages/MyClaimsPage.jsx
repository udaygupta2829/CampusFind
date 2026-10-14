import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { claimService } from '../services/claimService';
import StatusBadge from '../components/StatusBadge';
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Lock,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await claimService.getMyClaims();
      if (res.success && res.data) {
        setClaims(res.data);
      }
    } catch (err) {
      console.error('Failed to load claims', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <div className="container" style={{ marginTop: '2.5rem', marginBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>My Ownership Claims</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Track the status of your claims submitted for found campus items
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        </div>
      ) : claims.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShieldCheck size={32} />
          </div>
          <h3>No Claims Submitted Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', marginBottom: '1.25rem' }}>
            If you spot an item that belongs to you in the found registry, you can submit an ownership claim with secret proof.
          </p>
          <Link to="/search?type=FOUND" className="btn btn-gold btn-sm">
            Browse Found Items
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {claims.map((c) => (
            <div key={c.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <StatusBadge status={c.status} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Claim ID: #{c.id}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)' }}>
                    {c.foundItemName}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={14} /> Location Found: {c.foundItemLocation}
                    </span>
                    {c.foundItemHeldAt && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Building2 size={14} /> Held at: {c.foundItemHeldAt}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} /> Submitted: {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Link to={`/items/${c.foundItemId}`} className="btn btn-outline btn-sm">
                  View Item <ArrowRight size={14} />
                </Link>
              </div>

              {/* Claim Description & Proof */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <div style={{ marginBottom: '0.4rem' }}>
                  <strong>Your Description:</strong> {c.claimDescription}
                </div>
                <div style={{ color: '#64748B', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <Lock size={14} style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span><strong>Encrypted Proof Submitted:</strong> {c.privateOwnershipProof}</span>
                </div>
              </div>

              {/* Admin Feedback Notes */}
              {c.adminNotes && (
                <div
                  style={{
                    backgroundColor: c.status === 'APPROVED' ? '#F0FDF4' : '#FEF2F2',
                    border: `1px solid ${c.status === 'APPROVED' ? '#BBF7D0' : '#FECACA'}`,
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    color: c.status === 'APPROVED' ? '#166534' : '#991B1B',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>
                    Staff Verification Review ({c.verifiedByName ? `By ${c.verifiedByName}` : 'Admin'}):
                  </div>
                  <div>{c.adminNotes}</div>
                </div>
              )}

              {/* Return Record / Handover Details */}
              {c.returnRecord && (
                <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1rem', borderRadius: '8px', color: '#065F46', fontSize: '0.88rem' }}>
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                    <CheckCircle2 size={16} /> Official Return Confirmed & Completed
                  </div>
                  <div>Handover Location: <strong>{c.returnRecord.handoverLocation}</strong></div>
                  <div>Verification Method: <strong>{c.returnRecord.verificationMethod}</strong></div>
                  {c.returnRecord.remarks && <div>Remarks: {c.returnRecord.remarks}</div>}
                  <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '0.3rem' }}>
                    Returned Date: {new Date(c.returnRecord.returnDate).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaimsPage;
