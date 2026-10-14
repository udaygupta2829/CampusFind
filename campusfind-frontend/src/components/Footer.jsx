import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Mail, Phone, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid-4" style={{ gap: '2rem' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div className="brand-logo-icon" style={{ width: '34px', height: '34px', fontSize: '1rem', background: 'linear-gradient(135deg, #E63946 0%, #0066CC 100%)' }}>
                CF
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '1.3rem' }}>CampusFind</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
              The official centralized Lost & Found portal for university students and security staff. Safely report, discover matches, and claim misplaced belongings across campus.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/search">Browse All Items</Link></li>
              <li><Link to="/report-lost">Report Lost Item</Link></li>
              <li><Link to="/report-found">Report Found Item</Link></li>
              <li><Link to="/dashboard">Student Dashboard</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4>Popular Categories</h4>
            <ul className="footer-links">
              <li><Link to="/search?category=Electronics">Electronics & Laptops</Link></li>
              <li><Link to="/search?category=ID Cards / Documents">ID Cards & Wallets</Link></li>
              <li><Link to="/search?category=Bags & Backpacks">Bags & Backpacks</Link></li>
              <li><Link to="/search?category=Keys">Keys & Accessories</Link></li>
            </ul>
          </div>

          {/* Security Desk Info */}
          <div>
            <h4>Campus Security Desk</h4>
            <ul className="footer-links" style={{ color: '#CBD5E1' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#E63946" />
                <span>Central Security Office, Gate 1</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#E63946" />
                <span>+91 1800-200-3578</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#E63946" />
                <span>security@campusfind.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} CampusFind Portal. Developed for Academic Campus Safety.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built with Spring Boot & React <Heart size={14} color="#E63946" fill="#E63946" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
