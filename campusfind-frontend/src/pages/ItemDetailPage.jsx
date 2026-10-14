import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemService } from '../services/itemService';
import { matchService } from '../services/matchService';
import { claimService } from '../services/claimService';
import StatusBadge from '../components/StatusBadge';
import MatchCard from '../components/MatchCard';
import ClaimModal from '../components/ClaimModal';
import ReturnModal from '../components/ReturnModal';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  MapPin,
  Calendar,
  Tag,
  Palette,
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  Phone,
  Trash2,
  Edit,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const ItemDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeImage, setActiveImage] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedClaimForReturn, setSelectedClaimForReturn] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const res = await itemService.getReportById(id);
      if (res.success && res.data) {
        setItem(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setActiveImage(res.data.images[0].imageUrl);
        }

        // Fetch matches if owner or admin
        if (isAuthenticated && (res.data.isOwner || isAdmin)) {
          if (res.data.type === 'LOST') {
            const mRes = await matchService.getMatchesForLostItem(id);
            if (mRes.success) setMatches(mRes.data || []);
          } else {
            const mRes = await matchService.getMatchesForFoundItem(id);
            if (mRes.success) setMatches(mRes.data || []);
          }
        }

        // Fetch claims if owner of found item or admin
        if (isAuthenticated && res.data.type === 'FOUND' && (res.data.isOwner || isAdmin)) {
          const cRes = await claimService.getClaimsForItem(id);
          if (cRes.success) setClaims(cRes.data || []);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load item details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id, isAuthenticated]);

  const handleDeleteReport = async () => {
    setActionLoading(true);
    try {
      await itemService.deleteReport(id);
      navigate('/my-reports');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report.');
      setActionLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await itemService.updateStatus(id, newStatus);
      fetchItemDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container" style={{ maxWidth: '600px', marginTop: '4rem', textAlign: 'center' }}>
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error || 'Item not found.'}</span>
        </div>
        <Link to="/search" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          &larr; Back to Search
        </Link>
      </div>
    );
  }

  const isFound = item.type === 'FOUND';
  const isOwner = item.isOwner;

  return (
    <div className="container" style={{ marginTop: '2.5rem', marginBottom: '4rem' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Main Item Grid */}
      <div className="grid-2" style={{ gap: '2.5rem', alignItems: 'flex-start' }}>
        {/* Left Column: Image Gallery */}
        <div>
          <div
            className="card"
            style={{
              height: '380px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F1F5F9',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '1rem',
            }}
          >
            {activeImage ? (
              <img
                src={activeImage}
                alt={item.itemName}
                style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#00000008' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80';
                }}
              />
            ) : (
              <div className="item-card-placeholder">
                <ImageIcon size={56} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>No Image Uploaded</span>
              </div>
            )}
            <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
              <StatusBadge type={item.type} />
            </div>
            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <StatusBadge status={item.status} />
            </div>
          </div>

          {/* Thumbnail list if multiple */}
          {item.images && item.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {item.images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setActiveImage(img.imageUrl)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: activeImage === img.imageUrl ? '2px solid var(--secondary-blue)' : '1px solid var(--border-color)',
                  }}
                >
                  <img src={img.imageUrl} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Item Information & Actions */}
        <div>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
              <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-navy)' }}>{item.itemName}</h1>
              {isAdmin && (
                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                  value={item.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="OPEN">Set: OPEN</option>
                  <option value="POSSIBLE_MATCH">Set: POSSIBLE_MATCH</option>
                  <option value="CLAIM_REQUESTED">Set: CLAIM_REQUESTED</option>
                  <option value="CLAIMED">Set: CLAIMED</option>
                  <option value="APPROVED">Set: APPROVED</option>
                  <option value="RETURNED">Set: RETURNED</option>
                  <option value="CLOSED">Set: CLOSED</option>
                </select>
              )}
            </div>

            {/* Key Item Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem', color: '#475569', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={16} color="var(--primary-navy)" />
                <strong>Category:</strong> {item.category}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Palette size={16} color="var(--primary-navy)" />
                <strong>Colour:</strong> {item.colour}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} color="var(--primary-navy)" />
                <strong>Location:</strong> {item.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} color="var(--primary-navy)" />
                <strong>Date:</strong> {item.eventDate}
              </div>
            </div>

            {isFound && item.itemHeldAt && (
              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Building2 size={20} color="#059669" />
                <div>
                  <span style={{ fontSize: '0.82rem', color: '#065F46', fontWeight: 600, textTransform: 'uppercase' }}>Physical Custody</span>
                  <div style={{ fontWeight: 700, color: '#065F46' }}>Item held at: {item.itemHeldAt}</div>
                </div>
              </div>
            )}

            {/* Public Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Description</h3>
              <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {item.description}
              </p>
            </div>

            {/* Private Unique Marks (Visible ONLY to Owner or Admin) */}
            {item.uniqueMarks && (
              <div style={{ backgroundColor: '#FEF8E6', border: '1px solid #FDE68A', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#92400E', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  <Lock size={16} /> Private Identification Marks (Owner/Staff Only)
                </div>
                <p style={{ color: '#78350F', fontSize: '0.9rem' }}>
                  {item.uniqueMarks}
                </p>
              </div>
            )}

            {/* Reporter Info */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div>Reported by: <strong>{item.userFullName}</strong> on {new Date(item.createdAt).toLocaleDateString()}</div>
              {item.userEmail && <div>Contact Email: {item.userEmail}</div>}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {/* If Found & Not Owner: Claim Button */}
              {isFound && item.status !== 'RETURNED' && !isOwner && (
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="btn btn-gold btn-lg"
                  style={{ flex: 1 }}
                >
                  <ShieldCheck size={20} />
                  Submit Ownership Claim
                </button>
              )}

              {/* If Owner: Edit / Delete */}
              {(isOwner || isAdmin) && (
                <>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={16} /> Delete Report
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Matches Section for Item */}
      {matches.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Sparkles size={24} color="#D97706" />
            <h2 style={{ fontSize: '1.6rem' }}>Matching Candidates ({matches.length})</h2>
          </div>
          <div className="grid-2">
            {matches.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                onClaimClick={() => setShowClaimModal(true)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Claims on this Item (Visible to Owner & Admin) */}
      {(isOwner || isAdmin) && isFound && claims.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <ShieldCheck size={24} color="var(--primary-navy)" />
            <h2 style={{ fontSize: '1.6rem' }}>Submitted Ownership Claims ({claims.length})</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {claims.map((c) => (
              <div key={c.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)' }}>
                      Claim by {c.claimantFullName}
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      UID: {c.claimantCollegeId || 'N/A'} • {c.claimantEmail}
                    </span>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                <div style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: '#334155' }}>
                  <strong>Claim Description:</strong> {c.claimDescription}
                </div>

                {/* Private Ownership Proof (Only shown to Admin or Claimant) */}
                <div style={{ backgroundColor: '#FEF8E6', border: '1px solid #FDE68A', padding: '0.85rem', borderRadius: '8px', fontSize: '0.88rem', color: '#92400E', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <Lock size={14} /> Private Ownership Proof:
                  </div>
                  {c.privateOwnershipProof}
                </div>

                {isAdmin && c.status === 'APPROVED' && !c.returnRecord && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setSelectedClaimForReturn(c);
                        setShowReturnModal(true);
                      }}
                      className="btn btn-success btn-sm"
                    >
                      <CheckCircle2 size={16} />
                      Handover Item & Confirm Return
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Claim Modal */}
      <ClaimModal
        item={item}
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onSuccess={() => {
          fetchItemDetails();
          alert('Claim submitted successfully! Staff will review your private proof.');
        }}
      />

      {/* Return Modal */}
      <ReturnModal
        claim={selectedClaimForReturn}
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onSuccess={() => {
          fetchItemDetails();
          alert('Item return confirmed and recorded permanently!');
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Report"
        message="Are you sure you want to permanently delete this report? This action cannot be undone."
        onConfirm={handleDeleteReport}
        onCancel={() => setShowDeleteConfirm(false)}
        loading={actionLoading}
      />
    </div>
  );
};

export default ItemDetailPage;
