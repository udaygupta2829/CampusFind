import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { itemService } from '../services/itemService';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  FileText,
  Package,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Tag,
  Filter,
  Sparkles
} from 'lucide-react';

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [activeType, setActiveType] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllReports(activeType || null);
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
  }, [activeType]);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await itemService.updateStatus(reportId, newStatus);
      fetchReports();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setActionLoading(true);
    try {
      await itemService.deleteReport(deleteTargetId);
      setReports(reports.filter((r) => r.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '2.5rem', marginBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>All Campus Reports (Admin View)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Comprehensive directory of all lost and found item reports logged across campus
          </p>
        </div>

        {/* Type Filter */}
        <div style={{ display: 'flex', backgroundColor: '#E2E8F0', padding: '4px', borderRadius: 'var(--radius-md)', gap: '4px' }}>
          <button
            onClick={() => setActiveType('')}
            className={`btn btn-sm ${activeType === '' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '6px' }}
          >
            All Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveType('LOST')}
            className={`btn btn-sm ${activeType === 'LOST' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '6px' }}
          >
            🔍 Lost
          </button>
          <button
            onClick={() => setActiveType('FOUND')}
            className={`btn btn-sm ${activeType === 'FOUND' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '6px' }}
          >
            📦 Found
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="empty-state">
          <FileText size={32} />
          <h3>No Reports Found</h3>
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: '#F8FAFC', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Item Info</th>
                <th style={{ padding: '0.85rem 1rem' }}>Reporter</th>
                <th style={{ padding: '0.85rem 1rem' }}>Location & Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StatusBadge type={r.type} />
                      <Link to={`/items/${r.id}`} style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>
                        {r.itemName}
                      </Link>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {r.category} • {r.colour}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 600 }}>{r.userFullName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.userEmail || 'Student'}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div>{r.location}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.eventDate}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <select
                      className="form-control"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      value={r.status}
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="POSSIBLE_MATCH">POSSIBLE_MATCH</option>
                      <option value="CLAIM_REQUESTED">CLAIM_REQUESTED</option>
                      <option value="CLAIMED">CLAIMED</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="RETURNED">RETURNED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <Link to={`/items/${r.id}`} className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}>
                        <Eye size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteTargetId(r.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                        title="Delete Report"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Report (Admin)"
        message="Are you sure you want to permanently delete this report? This will remove all associated matches and claims."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminReportsPage;
