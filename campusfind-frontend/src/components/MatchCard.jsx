import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

const MatchCard = ({ match, onClaimClick }) => {
  return (
    <div className="match-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="#D97706" />
          <span style={{ fontWeight: 700, color: '#92400E', fontSize: '0.95rem' }}>
            Algorithm Match Detected
          </span>
        </div>
        <div className="match-score-badge">
          {Math.round(match.matchScore)}% Match
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Lost Item Details */}
        <div style={{ backgroundColor: '#FEF2F2', padding: '0.85rem', borderRadius: '8px', border: '1px solid #FECACA' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Lost Report
          </div>
          <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>
            {match.lostItemName}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
            <Tag size={12} />
            {match.lostItemCategory}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
            <MapPin size={12} />
            {match.lostItemLocation}
          </div>
        </div>

        {/* Found Item Details */}
        <div style={{ backgroundColor: '#ECFDF5', padding: '0.85rem', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Found Report
          </div>
          <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>
            {match.foundItemName}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
            <Tag size={12} />
            {match.foundItemCategory}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
            <MapPin size={12} />
            {match.foundItemLocation}
          </div>
          {match.foundItemHeldAt && (
            <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600, marginTop: '0.3rem' }}>
              Held at: {match.foundItemHeldAt}
            </div>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#FFFBEB', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.82rem', color: '#92400E', marginBottom: '1rem', border: '1px solid #FDE68A' }}>
        <strong>Why it matched:</strong> {match.matchReason}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <Link to={`/items/${match.foundItemId}`} className="btn btn-outline btn-sm">
          Inspect Found Item
          <ArrowRight size={14} />
        </Link>
        {onClaimClick && (
          <button
            onClick={() => onClaimClick({ id: match.foundItemId, itemName: match.foundItemName })}
            className="btn btn-gold btn-sm"
          >
            <ShieldCheck size={14} />
            Submit Claim
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
