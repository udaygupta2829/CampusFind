import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ReturnModal from '../components/ReturnModal';
import {
  FileText,
  Package,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  MapPin,
  Tag,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  LogOut
} from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClaimForReturn, setSelectedClaimForReturn] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleApproveClaim = async (claimId) => {
    const notes = prompt('Enter approval notes or pickup instructions for student:', 'ID and details verified. Item is ready for pickup at Central Security Office Desk.');
    if (notes === null) return;
    try {
      await adminService.approveClaim(claimId, notes);
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve claim.');
    }
  };

  const handleRejectClaim = async (claimId) => {
    const notes = prompt('Enter rejection reason for student:', 'Ownership details or proof did not match the recovered item.');
    if (notes === null) return;
    try {
      await adminService.rejectClaim(claimId, notes);
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject claim.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2.5rem', marginBottom: '4rem' }}>
      {/* Admin Welcome Header */}
      <div
        className="card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #001E42 0%, #002B5C 100%)',
          color: '#ffffff',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span style={{ backgroundColor: 'rgba(249, 195, 0, 0.2)', color: 'var(--gold-accent)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Campus Security & Administration
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '1.9rem', marginTop: '0.4rem' }}>
            Security Staff Dashboard & Analytics
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Real-time monitoring of campus lost reports, recovered inventory, and claims
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/claims" className="btn btn-gold">
            <ShieldCheck size={16} />
            Review Claims ({stats?.pendingClaims || 0})
          </Link>
          <Link to="/admin/reports" className="btn btn-outline-gold">
            <FileText size={16} />
            Manage Reports
          </Link>
        </div>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid-3" style={{ gap: '1.25rem', marginBottom: '2.5rem' }}>
        <StatCard icon={FileText} label="Total Lost Reports" value={stats?.totalLostReports || 0} colorScheme="blue" />
        <StatCard icon={Package} label="Total Found Reports" value={stats?.totalFoundReports || 0} colorScheme="green" />
        <StatCard icon={Clock} label="Open Active Reports" value={stats?.openReports || 0} colorScheme="blue" />
        <StatCard icon={ShieldCheck} label="Pending Ownership Claims" value={stats?.pendingClaims || 0} colorScheme="gold" />
        <StatCard icon={CheckCircle2} label="Approved Claims" value={stats?.approvedClaims || 0} colorScheme="green" />
        <StatCard icon={Users} label="Returned to Students" value={stats?.returnedItems || 0} colorScheme="purple" />
      </div>

      {/* Analytics Insights: Popular Categories & Common Lost Locations */}
      <div className="grid-2" style={{ gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Popular Categories */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Tag size={20} color="var(--primary-navy)" />
            <h3 style={{ fontSize: '1.2rem' }}>Popular Item Categories</h3>
          </div>

          {stats?.popularCategories && stats.popularCategories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.popularCategories.map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1E293B' }}>{cat.category}</span>
                  <span className="badge badge-open" style={{ fontSize: '0.8rem' }}>{cat.count} items</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No category data yet</div>
          )}
        </div>

        {/* Common Lost Locations */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <MapPin size={20} color="var(--primary-navy)" />
            <h3 style={{ fontSize: '1.2rem' }}>Top Lost Item Locations (Hotspots)</h3>
          </div>

          {stats?.commonLostLocations && stats.commonLostLocations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.commonLostLocations.map((loc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1E293B' }}>{loc.location}</span>
                  <span className="badge badge-match" style={{ fontSize: '0.8rem' }}>{loc.count} reports</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No location data yet</div>
          )}
        </div>
      </div>

      {/* Pending Claims Action Queue */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} color="#D97706" />
            <h2 style={{ fontSize: '1.35rem' }}>Pending Claims Verification Queue</h2>
          </div>
          <Link to="/admin/claims" className="btn btn-outline btn-sm">
            View All Claims <ArrowRight size={14} />
          </Link>
        </div>

        {stats?.recentPendingClaims && stats.recentPendingClaims.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem' }}>Found Item</th>
                  <th style={{ padding: '0.75rem' }}>Claimant Student</th>
                  <th style={{ padding: '0.75rem' }}>Claim Description</th>
                  <th style={{ padding: '0.75rem' }}>Proof Details</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPendingClaims.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <Link to={`/items/${c.foundItemId}`} style={{ fontWeight: 600 }}>
                        {c.foundItemName}
                      </Link>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.foundItemLocation}</div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <strong>{c.claimantFullName}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>UID: {c.claimantCollegeId || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '0.75rem', maxWidth: '240px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.claimDescription}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', maxWidth: '240px' }}>
                      <div style={{ backgroundColor: '#FEF8E6', padding: '0.35rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: '#92400E' }}>
                        {c.privateOwnershipProof}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleApproveClaim(c.id)}
                          className="btn btn-success btn-sm"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectClaim(c.id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No pending claims in the queue right now. All caught up!
          </div>
        )}
      </div>

      {/* Return Modal */}
      <ReturnModal
        claim={selectedClaimForReturn}
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onSuccess={() => {
          fetchStats();
          alert('Return recorded successfully!');
        }}
      />
    </div>
  );
};

export default AdminDashboard;
