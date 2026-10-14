import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import StatCard from '../components/StatCard';
import {
  User as UserIcon,
  Mail,
  Phone,
  CreditCard,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  Package,
  ShieldCheck,
  LogOut
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    collegeId: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await authService.getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
          setFormData({
            fullName: res.data.fullName || '',
            phoneNumber: res.data.phoneNumber || '',
            collegeId: res.data.collegeId || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrorMsg('Full name cannot be blank.');
      return;
    }

    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await authService.updateProfile(formData);
      if (res.success && res.data) {
        setProfile(res.data);
        updateUserProfile({
          fullName: res.data.fullName,
          phoneNumber: res.data.phoneNumber,
          collegeId: res.data.collegeId
        });
        setSuccessMsg('Profile information updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
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
    <div className="container" style={{ maxWidth: '800px', marginTop: '2.5rem', marginBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>My Account Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          View and update your personal and campus registration details
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--gold-accent)',
              color: 'var(--primary-navy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
            }}
          >
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)' }}>{profile?.fullName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
              <Mail size={14} /> {profile?.email}
            </div>
            <div style={{ marginTop: '0.35rem' }}>
              <span className={`badge ${profile?.role === 'ROLE_ADMIN' ? 'badge-approved' : 'badge-open'}`}>
                {profile?.role === 'ROLE_ADMIN' ? '🛡️ Admin / Security Staff' : '🎓 University Student'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid-3" style={{ gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-navy)' }}>{profile?.totalLostReports || 0}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lost Reports</div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-navy)' }}>{profile?.totalFoundReports || 0}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Found Reports</div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-navy)' }}>{profile?.totalClaims || 0}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Submitted Claims</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Edit Personal Details</h3>

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                name="fullName"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">College Email (Read-Only)</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem', backgroundColor: '#F1F5F9', cursor: 'not-allowed' }}
                value={profile?.email || ''}
                disabled
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">College ID / UID</label>
              <div style={{ position: 'relative' }}>
                <CreditCard size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  name="collegeId"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. 21BCS10045"
                  value={formData.collegeId}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  name="phoneNumber"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="+91 9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="btn"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#DC2626',
                border: '1px solid #FECACA',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: '6px'
              }}
            >
              <LogOut size={16} />
              Log Out of Account
            </button>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#ffffff' }}></div>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
