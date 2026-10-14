import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { MapPin, Calendar, Tag, Image as ImageIcon, ShieldAlert, ArrowRight } from 'lucide-react';

const ItemCard = ({ item, onClaimClick }) => {
  const isFound = item.type === 'FOUND';
  const primaryImage = item.images && item.images.length > 0 ? item.images[0].imageUrl : null;

  return (
    <div className="item-card">
      <div className="item-card-image-wrapper">
        {primaryImage ? (
          <img 
            src={primaryImage} 
            alt={item.itemName} 
            className="item-card-img" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop&q=60';
            }}
          />
        ) : (
          <div className="item-card-placeholder">
            <ImageIcon size={38} />
            <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>No Image Attached</span>
          </div>
        )}
        <div className="item-card-type-tag">
          <StatusBadge type={item.type} />
        </div>
        <div className="item-card-status-tag">
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="item-card-body">
        <h3 className="item-card-title" title={item.itemName}>
          {item.itemName}
        </h3>

        <div className="item-card-meta">
          <div className="item-card-meta-row">
            <Tag size={14} color="#6B7280" />
            <span>{item.category} • {item.colour}</span>
          </div>
          <div className="item-card-meta-row">
            <MapPin size={14} color="#6B7280" />
            <span title={item.location} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.location}
            </span>
          </div>
          <div className="item-card-meta-row">
            <Calendar size={14} color="#6B7280" />
            <span>{item.eventDate ? new Date(item.eventDate).toLocaleDateString() : 'Recent'}</span>
          </div>
        </div>

        <p className="item-card-desc">
          {item.description}
        </p>

        <div className="item-card-footer">
          <Link to={`/items/${item.id}`} className="btn btn-outline btn-sm">
            View Details
            <ArrowRight size={14} />
          </Link>

          {isFound && item.status !== 'RETURNED' && !item.isOwner && onClaimClick && (
            <button
              onClick={() => onClaimClick(item)}
              className="btn btn-gold btn-sm"
              title="Claim this found item"
            >
              <ShieldAlert size={14} />
              Claim
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
