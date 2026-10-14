import React, { useState } from 'react';
import { adminService } from '../services/adminService';
import { CheckCircle, X, AlertCircle, MapPin, Award } from 'lucide-react';

const ReturnModal = ({ claim, isOpen, onClose, onSuccess }) => {
  const [handoverLocation, setHandoverLocation] = useState('Central Security Office - Gate 1');
  const [verificationMethod, setVerificationMethod] = useState('Physical College ID & Biometric Verification');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !claim) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handoverLocation.trim() || !verificationMethod.trim()) {
      setError('Please fill in all mandatory handover fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await adminService.createReturnRecord({
        claimId: claim.id,
        handoverLocation,
        verificationMethod,
        remarks,
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete return record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="card-header" style={{ backgroundColor: 'var(--primary-navy)', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle size={22} color="var(--gold-accent)" />
            <h3 style={{ color: '#ffffff', fontSize: '1.2rem' }}>Confirm Item Return Handover</h3>
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

          <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 700, color: '#065F46', fontSize: '0.95rem' }}>
              Handing over: {claim.foundItemName}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#047857', marginTop: '3px' }}>
              Returning to student: <strong>{claim.claimantFullName}</strong> ({claim.claimantCollegeId || claim.claimantEmail})
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Handover Location <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={handoverLocation}
              onChange={(e) => setHandoverLocation(e.target.value)}
              placeholder="e.g. Central Security Office Desk / Admin Block Counter 4"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Identity Verification Method <span className="required">*</span>
            </label>
            <select
              className="form-control"
              value={verificationMethod}
              onChange={(e) => setVerificationMethod(e.target.value)}
              required
            >
              <option value="Physical College ID & Biometric Verification">Physical College ID & Biometric Verification</option>
              <option value="Aadhaar / Government Photo ID Check">Aadhaar / Government Photo ID Check</option>
              <option value="Device Unlocking with Passcode/Fingerprint">Device Unlocking with Passcode/Fingerprint</option>
              <option value="Serial Number & Purchase Invoice Matching">Serial Number & Purchase Invoice Matching</option>
              <option value="Keys / Lock Turn Verification">Keys / Lock Turn Verification</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Admin Return Remarks / Signature Register Entry</label>
            <textarea
              className="form-control"
              placeholder="Enter register entry number, witness name, or physical condition notes..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                  Confirming Return...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Confirm Handover & Close Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnModal;
