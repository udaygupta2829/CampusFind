import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Search,
  PlusCircle,
  Bell,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-logo-icon">CF</div>
          <span>CampusFind</span>
          <span className="brand-badge">PORTAL</span>
        </Link>

        {/* Navigation Links */}
        <nav className={`navbar-links ${showMobileMenu ? 'mobile-open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`}>
            <Search size={16} />
            Browse Items
          </Link>

          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link to="/my-reports" className={`nav-link ${isActive('/my-reports') ? 'active' : ''}`}>
                <FileText size={16} />
                My Reports
              </Link>
              <Link to="/my-claims" className={`nav-link ${isActive('/my-claims') ? 'active' : ''}`}>
                <ShieldCheck size={16} />
                My Claims
              </Link>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                <LayoutDashboard size={16} />
                Admin Console
              </Link>
              <Link to="/admin/claims" className={`nav-link ${isActive('/admin/claims') ? 'active' : ''}`}>
                <ShieldCheck size={16} />
                Claims Review
              </Link>
              <Link to="/admin/reports" className={`nav-link ${isActive('/admin/reports') ? 'active' : ''}`}>
                <FileText size={16} />
                All Reports
              </Link>
            </>
          )}
        </nav>

        {/* Action / Auth Buttons */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {/* Quick Action: Report Lost / Found */}
              {!isAdmin && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to="/report-lost" className="btn btn-gold btn-sm">
                    <PlusCircle size={15} />
                    Report Lost
                  </Link>
                  <Link to="/report-found" className="btn btn-outline-gold btn-sm">
                    <PlusCircle size={15} />
                    Report Found
                  </Link>
                </div>
              )}

              {/* Notification Center */}
              <div className="notif-wrapper" ref={notifRef}>
                <button
                  className="notif-btn"
                  onClick={() => setShowNotifs(!showNotifs)}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="notif-badge-count">{unreadCount}</span>}
                </button>

                {showNotifs && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <strong style={{ fontSize: '0.9rem' }}>Notifications ({unreadCount} unread)</strong>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          style={{ background: 'none', border: 'none', color: '#1D4ED8', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="notif-list">
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 8).map((n) => (
                          <div
                            key={n.id}
                            className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.relatedItemId) navigate(`/items/${n.relatedItemId}`);
                              setShowNotifs(false);
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              {n.type === 'MATCH_FOUND' ? (
                                <AlertCircle size={16} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                              ) : (
                                <CheckCircle2 size={16} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                              )}
                              <div>
                                <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.82rem' }}>{n.title}</div>
                                <div style={{ color: '#475569', fontSize: '0.78rem', marginTop: '2px' }}>{n.message}</div>
                                <div style={{ color: '#94A3B8', fontSize: '0.7rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <Clock size={10} />
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Menu */}
              <div className="user-menu-wrapper" ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  className="user-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  title="Account Menu"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div className="avatar-circle">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                    {user?.fullName ? user.fullName.split(' ')[0] : 'Account'}
                  </span>
                </button>

                {showUserMenu && (
                  <div
                    className="user-dropdown"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      backgroundColor: '#ffffff',
                      borderRadius: '10px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.18)',
                      border: '1px solid #E2E8F0',
                      minWidth: '210px',
                      zIndex: 1000,
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>
                        {user?.fullName || 'User'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px', wordBreak: 'break-all' }}>
                        {user?.email}
                      </div>
                    </div>

                    <div style={{ padding: '0.35rem 0' }}>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 1rem',
                          color: '#334155',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}
                      >
                        <UserIcon size={16} color="#64748B" />
                        My Profile
                      </Link>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 1rem',
                          color: '#DC2626',
                          background: 'none',
                          border: 'none',
                          borderTop: '1px solid #F1F5F9',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <LogOut size={16} color="#DC2626" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-outline-gold btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-gold btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
