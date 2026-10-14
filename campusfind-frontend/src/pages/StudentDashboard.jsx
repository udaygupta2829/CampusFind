import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemService } from '../services/itemService';
import { matchService } from '../services/matchService';
import { claimService } from '../services/claimService';
import StatCard from '../components/StatCard';
import MatchCard from '../components/MatchCard';
import ItemCard from '../components/ItemCard';
import StatusBadge from '../components/StatusBadge';
import ClaimModal from '../components/ClaimModal';
import {
  FileText,
  Package,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  LogOut
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaimItem, setSelectedClaimItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reportsRes, matchesRes, claimsRes] = await Promise.all([
        itemService.getMyReports(),
        matchService.getMatches(),
        claimService.getMyClaims(),
      ]);

      if (reportsRes.success) setReports(reportsRes.data || []);
      if (matchesRes.success) setMatches(matchesRes.data || []);
      if (claimsRes.success) setClaims(claimsRes.data || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const lostCount = reports.filter((r) => r.type === 'LOST').length;
  const foundCount = reports.filter((r) => r.type === 'FOUND').length;

  return (
    <div className="container" style={{ marginTop: '2.5rem' }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #002B5C 0%, #003B7A 100%)',
          color: '#ffffff',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <span style={{ backgroundColor: 'rgba(249, 195, 0, 0.2)', color: 'var(--gold-accent)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Student Workspace
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '1.85rem', marginTop: '0.4rem' }}>
            Welcome back, {user?.fullName}!
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            College UID: <strong>{user?.collegeId || 'Not set'}</strong> • {user?.email}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/report-lost" className="btn btn-gold">
            <PlusCircle size={16} />
            Report Lost
          </Link>
          <Link to="/report-found" className="btn btn-outline-gold">
            <Package size={16} />
            Report Found
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <StatCard icon={FileText} label="My Lost Reports" value={lostCount} colorScheme="blue" />
        <StatCard icon={Package} label="My Found Reports" value={foundCount} colorScheme="green" />
        <StatCard icon={Sparkles} label="Suggested Matches" value={matches.length} colorScheme="gold" />
        <StatCard icon={ShieldCheck} label="Active Claims" value={claims.length} colorScheme="purple" />
      </div>

      {/* Suggested Matches Section */}
      {matches.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={22} color="#D97706" />
              <h2 style={{ fontSize: '1.4rem' }}>Possible Item Matches ({matches.length})</h2>
            </div>
          </div>

          <div className="grid-2">
            {matches.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                onClaimClick={(item) => setSelectedClaimItem(item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Split Grid: My Recent Reports & My Active Claims */}
      <div className="grid-2" style={{ alignItems: 'flex-start', gap: '2rem' }}>
        {/* Recent Reports */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem' }}>My Recent Reports</h2>
            <Link to="/my-reports" className="btn btn-outline btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
              <div className="spinner"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="empty-state">
              <Package size={28} />
              <h4>No items reported yet</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Lost an item or found someone's belonging on campus?
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                <Link to="/report-lost" className="btn btn-gold btn-sm">Report Lost</Link>
                <Link to="/report-found" className="btn btn-secondary btn-sm">Report Found</Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {reports.slice(0, 4).map((r) => (
                <div key={r.id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <StatusBadge type={r.type} />
                      <StatusBadge status={r.status} />
                    </div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--primary-navy)' }}>{r.itemName}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {r.location} • {r.eventDate}
                    </span>
                  </div>
                  <Link to={`/items/${r.id}`} className="btn btn-outline btn-sm">
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Claims */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem' }}>My Ownership Claims</h2>
            <Link to="/my-claims" className="btn btn-outline btn-sm">
              Track All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
              <div className="spinner"></div>
            </div>
          ) : claims.length === 0 ? (
            <div className="empty-state">
              <ShieldCheck size={28} />
              <h4>No claims submitted</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Browse found items to claim anything that belongs to you.
              </p>
              <Link to="/search?type=FOUND" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
                Browse Found Items
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {claims.slice(0, 4).map((c) => (
                <div key={c.id} className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--primary-navy)' }}>{c.foundItemName}</h4>
                    <StatusBadge status={c.status} />
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.claimDescription}
                  </p>
                  {c.adminNotes && (
                    <div style={{ backgroundColor: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--primary-navy)', borderLeft: '3px solid var(--secondary-blue)', marginBottom: '0.5rem' }}>
                      <strong>Staff Note:</strong> {c.adminNotes}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                    <span>Submitted: {new Date(c.createdAt).toLocaleDateString()}</span>
                    <Link to={`/items/${c.foundItemId}`} style={{ fontWeight: 600 }}>
                      Inspect Item &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        item={selectedClaimItem}
        isOpen={!!selectedClaimItem}
        onClose={() => setSelectedClaimItem(null)}
        onSuccess={() => {
          fetchData();
          alert('Claim submitted successfully!');
        }}
      />
    </div>
  );
};

export default StudentDashboard;
