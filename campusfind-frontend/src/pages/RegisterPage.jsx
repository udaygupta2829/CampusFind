import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User as UserIcon, Phone, CreditCard, AlertCircle, Shield } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    collegeId: '',
    role: 'ROLE_STUDENT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const authUser = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        collegeId: formData.collegeId,
        role: formData.role
      });

      if (authUser.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '560px', marginTop: '3rem', marginBottom: '3.5rem' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-logo-icon" style={{ width: '48px', height: '48px', margin: '0 auto 0.75rem auto', fontSize: '1.4rem' }}>
            CF
          </div>
          <h2 style={{ fontSize: '1.75rem' }}>Create CampusFind Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Register with your university credentials to report and recover lost items
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                name="fullName"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="e.g. Aarav Patel"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              College Email <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                name="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="student.id@campus.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                College ID / UID
              </label>
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
              <label className="form-label">
                Phone Number
              </label>
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

          <div className="form-group">
            <label className="form-label">
              Account Role <span className="required">*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: formData.role === 'ROLE_STUDENT' ? '#FEF8E6' : '#ffffff', borderColor: formData.role === 'ROLE_STUDENT' ? 'var(--gold-accent)' : 'var(--border-color)' }}>
                <input
                  type="radio"
                  name="role"
                  value="ROLE_STUDENT"
                  checked={formData.role === 'ROLE_STUDENT'}
                  onChange={handleChange}
                />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Student</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: formData.role === 'ROLE_ADMIN' ? '#EFF6FF' : '#ffffff', borderColor: formData.role === 'ROLE_ADMIN' ? 'var(--secondary-blue)' : 'var(--border-color)' }}>
                <input
                  type="radio"
                  name="role"
                  value="ROLE_ADMIN"
                  checked={formData.role === 'ROLE_ADMIN'}
                  onChange={handleChange}
                />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin / Security</span>
              </label>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Password <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Confirm Password <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '0.75rem' }} disabled={loading}>
            {loading ? (
              <>
                <div className="spinner spinner-gold" style={{ width: '18px', height: '18px' }}></div>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Complete Registration
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
