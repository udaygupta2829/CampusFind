import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';
import ItemCard from '../components/ItemCard';
import ClaimModal from '../components/ClaimModal';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Award,
  ArrowRight,
  Package,
  HelpCircle,
  MapPin,
  Laptop,
  CreditCard,
  Briefcase,
  Key,
  BookOpen,
  Watch,
  CheckCircle2,
  BellRing,
  RefreshCw
} from 'lucide-react';

const HomePage = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedClaimItem, setSelectedClaimItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await itemService.getAllItems();
        if (res.success && res.data) {
          setRecentItems(res.data.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const categories = [
    { name: 'Electronics', icon: Laptop, count: 'Laptops, Earbuds, Phones', bg: '#EFF6FF', color: '#1D4ED8' },
    { name: 'ID Cards / Documents', icon: CreditCard, count: 'Student IDs, Passes, Wallets', bg: '#FFF0F3', color: '#E63946' },
    { name: 'Bags & Backpacks', icon: Briefcase, count: 'Handbags, Wildcraft, Kits', bg: '#EFF6FF', color: '#1E40AF' },
    { name: 'Keys', icon: Key, count: 'Room Keys, Bike Keys', bg: '#FFF0F3', color: '#DC2626' },
    { name: 'Books & Stationery', icon: BookOpen, count: 'Textbooks, Calculators, Notes', bg: '#EFF6FF', color: '#2563EB' },
    { name: 'Clothing & Accessories', icon: Watch, count: 'Watches, Glasses, Jackets', bg: '#FFF0F3', color: '#BE123C' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              <Sparkles size={16} />
              <span>Official Campus Lost & Found Network</span>
            </div>
            
            <h1 className="hero-title">
              Lost Something on Campus? <span className="gradient-text-red-blue">We'll Help You Find It.</span>
            </h1>
            
            <p className="hero-subtitle">
              CampusFind is the secure, real-time repository connecting students, faculty, and campus security staff to safely report, match, and return misplaced belongings.
            </p>

            {/* Hero Search Bar */}
            <form onSubmit={handleHeroSearch} style={{ display: 'flex', gap: '0.6rem', maxWidth: '640px', marginBottom: '2.25rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={20} color="#94A3B8" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{
                    paddingLeft: '3rem',
                    height: '54px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  placeholder="Search by item name, colour, or location (e.g. AirPods, Library)..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-red"
                style={{ height: '54px', padding: '0 1.75rem', borderRadius: '12px', fontSize: '1rem' }}
              >
                Search
              </button>
            </form>

            {/* Quick Action Buttons */}
            <div className="hero-buttons">
              <Link to="/report-lost" className="btn btn-red btn-lg">
                <PlusCircle size={20} />
                Report Lost Item
              </Link>
              <Link to="/report-found" className="btn btn-outline-white btn-lg">
                <Package size={20} />
                Report Found Item
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Metrics Row */}
      <div className="container stats-banner">
        <div className="grid-4" style={{ gap: '1.25rem' }}>
          <div className="stat-box">
            <div className="stat-icon-wrapper stat-icon-blue">
              <Package size={26} />
            </div>
            <div>
              <div className="stat-value">100%</div>
              <div className="stat-label">Verified Reports</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon-wrapper stat-icon-red">
              <RefreshCw size={26} />
            </div>
            <div>
              <div className="stat-value">Auto</div>
              <div className="stat-label">Smart Match Engine</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon-wrapper stat-icon-blue">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="stat-value">Private</div>
              <div className="stat-label">Encrypted Proofs</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon-wrapper stat-icon-red">
              <CheckCircle2 size={26} />
            </div>
            <div>
              <div className="stat-value">Official</div>
              <div className="stat-label">Security Handover</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '3.5rem' }}>
        
        {/* Categories Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.85rem' }}>Explore by Category</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Quickly browse items reported missing or found in common campus departments
              </p>
            </div>
            <Link to="/search" className="btn btn-outline btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-3" style={{ gap: '1.25rem' }}>
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/search?category=${encodeURIComponent(cat.name)}`}
                  className="category-card"
                >
                  <div className="category-icon-box" style={{ backgroundColor: cat.bg, color: cat.color }}>
                    <IconComp size={24} color={cat.color} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-navy)' }}>{cat.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="card" style={{ padding: '3rem 2rem', marginBottom: '4rem', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.75rem auto' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Simple 4-Step Process
            </span>
            <h2 style={{ fontSize: '2.1rem', marginTop: '0.35rem' }}>How CampusFind Works</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              An automated, verified bridge between lost item owners and safe campus security desks.
            </p>
          </div>

          <div className="grid-4" style={{ gap: '1.75rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1D4ED8 0%, #0B2545 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                fontWeight: 800,
                fontSize: '1.3rem',
                boxShadow: '0 4px 10px rgba(29, 78, 216, 0.3)'
              }}>
                1
              </div>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>1. Report Details</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Post a lost or found report with item photos, date, and campus location.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                fontWeight: 800,
                fontSize: '1.3rem',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
              }}>
                2
              </div>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>2. Auto-Matching</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Our rule engine scans categories, dates, and keywords to alert you of potential matches.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7E22CE 0%, #BE123C 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                fontWeight: 800,
                fontSize: '1.3rem',
                boxShadow: '0 4px 10px rgba(190, 18, 60, 0.3)'
              }}>
                3
              </div>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>3. Private Claim</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Submit secret ownership proof (wallpaper, unique marks, digits) visible only to staff.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E63946 0%, #9B0017 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                fontWeight: 800,
                fontSize: '1.3rem',
                boxShadow: '0 4px 10px rgba(230, 57, 70, 0.35)'
              }}>
                4
              </div>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>4. Verified Handover</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Collect your item safely from the security desk after biometric/ID confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="cta-banner">
          <div style={{ maxWidth: '640px' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(230, 57, 70, 0.35)',
              color: '#FFA8BA',
              padding: '0.3rem 0.8rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '1rem',
              border: '1px solid rgba(230, 57, 70, 0.5)'
            }}>
              Join the Campus Trust Community
            </span>
            <h2 style={{ color: '#ffffff', fontSize: '2rem', marginBottom: '0.85rem' }}>
              Found an Item on Campus? Help a Classmate.
            </h2>
            <p style={{ color: '#E2E8F0', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Reporting a found item takes less than 60 seconds. Our matching engine will immediately notify the rightful owner.
            </p>
            <Link to="/report-found" className="btn btn-red btn-lg" style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
              <Package size={20} />
              Post Found Item Now
            </Link>
          </div>
        </div>

        {/* Recent Items Grid */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.85rem' }}>Recent Campus Reports</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Latest lost and found items reported across university campus blocks
              </p>
            </div>
            <Link to="/search" className="btn btn-outline btn-sm">
              Search All Items <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3.5rem 0' }}>
              <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
          ) : recentItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Package size={28} />
              </div>
              <h3>No Reports Logged Yet</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', marginBottom: '1.25rem' }}>
                Be the first to submit a lost or found item report.
              </p>
              <Link to="/report-lost" className="btn btn-red btn-sm">
                Report Lost Item
              </Link>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {recentItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClaimClick={(it) => setSelectedClaimItem(it)}
                />
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
          alert('Claim submitted successfully! Check "My Claims" to track status.');
        }}
      />
    </div>
  );
};

export default HomePage;
