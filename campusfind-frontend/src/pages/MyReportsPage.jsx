import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../services/itemService';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  FileText,
  PlusCircle,
  Package,
  Calendar,
  MapPin,
  Trash2,
  Eye,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, LOST, FOUND
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await itemService.getMyReports();
      if (res.success && res.data) {
        setReports(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await itemService.deleteReport(deleteTargetId);
      setReports(reports.filter((r) => r.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (activeTab === 'LOST') return r.type === 'LOST';
    if (activeTab === 'FOUND') return r.type === 'FOUND';
    return true;
  });

  return (
    <div className="container" style={{ marginTop: '2.5rem', marginBottom: '4rem' }}>
      {/* Header & New Report Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>My Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Manage and track all lost & found items you have submitted
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/report-lost" className="btn btn-gold btn-sm">
            <PlusCircle size={15} /> Report Lost
          </Link>
          <Link to="/report-found" className="btn btn-outline btn-sm">
            <Package size={15} /> Report Found
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          All Reports ({reports.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'LOST' ? 'active' : ''}`}
          onClick={() => setActiveTab('LOST')}
        >
          Lost Items ({reports.filter((r) => r.type === 'LOST').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'FOUND' ? 'active' : ''}`}
          onClick={() => setActiveTab('FOUND')}
        >
          Found Items ({reports.filter((r) => r.type === 'FOUND').length})
        </button>
      </div>

      {/* Reports List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FileText size={32} />
          </div>
          <h3>No reports in this category</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', marginBottom: '1.25rem' }}>
            You haven't submitted any {activeTab === 'ALL' ? '' : activeTab.toLowerCase()} item reports yet.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/report-lost" className="btn btn-gold btn-sm">Report Lost Item</Link>
            <Link to="/report-found" className="btn btn-secondary btn-sm">Report Found Item</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredReports.map((report) => (
            <div key={report.id} className="card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '8px',
                      backgroundColor: '#F1F5F9',
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {report.images && report.images.length > 0 ? (
                      <img src={report.images[0].imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Tag size={24} color="#94A3B8" />
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <StatusBadge type={report.type} />
                      <StatusBadge status={report.status} />
                      {report.matchSuggestionCount > 0 && (
                        <span className="badge badge-match">
                          <Sparkles size={12} /> {report.matchSuggestionCount} Matches
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '0.35rem' }}>
                      {report.itemName}
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Tag size={13} /> {report.category} ({report.colour})
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} /> {report.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} /> {report.eventDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Link to={`/items/${report.id}`} className="btn btn-outline btn-sm">
                    <Eye size={15} /> Details
                  </Link>
                  <button
                    onClick={() => setDeleteTargetId(report.id)}
                    className="btn btn-danger btn-sm"
                    title="Delete Report"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Report"
        message="Are you sure you want to permanently delete this report? Any match suggestions will also be removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

export default MyReportsPage;
