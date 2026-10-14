import React, { useState } from 'react';
import { claimService } from '../services/claimService';
import { ShieldCheck, Lock, X, AlertCircle } from 'lucide-react';

const ClaimModal = ({ item, isOpen, onClose, onSuccess }) => {
  const [claimDescription, setClaimDescription] = useState('');
  const [privateOwnershipProof, setPrivateOwnershipProof] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!claimDescription.trim() || !privateOwnershipProof.trim()) {
      setError('Please provide both the claim description and ownership proof.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await claimService.submitClaim({
        foundItemId: item.id,
        claimDescription,
        privateOwnershipProof,
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="card-header" style={{ backgroundColor: 'var(--primary-navy)', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={22} color="var(--gold-accent)" />
            <h3 style={{ color: '#ffffff', fontSize: '1.2rem' }}>Claim Ownership: {item.itemName}</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ backgroundColor: '#FEF8E6', border: '1px solid #FDE68A', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', gap: '0.6rem', fontSize: '0.85rem', color: '#92400E' }}>
            <Lock size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Confidential Verification Protocol:</strong>
              <div style={{ marginTop: '3px' }}>
                Your ownership proof is encrypted and viewable ONLY by college administrative and security verifiers. Do NOT submit complete passwords, PINs, or full banking digits.
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Why is this item yours? (General Description) <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. I left my black Wildcraft backpack in Library 2nd floor during physics class"
              value={claimDescription}
              onChange={(e) => setClaimDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Private Ownership Proof / Identifying Details <span className="required">*</span>
            </label>
            <textarea
              className="form-control"
              placeholder="Provide exact details only the true owner would know: e.g. sticker on the back, lock screen wallpaper, specific keychain, internal zipper contents, or last 4 digits of ID card."
              value={privateOwnershipProof}
              onChange={(e) => setPrivateOwnershipProof(e.target.value)}
              rows={4}
              required
            />
            <div className="form-hint">
              Be as specific as possible so security staff can verify and approve your claim swiftly.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-gold" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner spinner-gold" style={{ width: '16px', height: '16px' }}></div>
                  Submitting Claim...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Submit Ownership Claim
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimModal;
