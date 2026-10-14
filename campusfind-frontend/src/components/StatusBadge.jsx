import React from 'react';

const StatusBadge = ({ status, type }) => {
  if (type) {
    const isLost = type.toUpperCase() === 'LOST';
    return (
      <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
        {isLost ? '🔍 Lost' : '📦 Found'}
      </span>
    );
  }

  const getStatusClass = (s) => {
    switch (s?.toUpperCase()) {
      case 'OPEN':
        return 'badge-open';
      case 'POSSIBLE_MATCH':
        return 'badge-match';
      case 'CLAIM_REQUESTED':
        return 'badge-claim-requested';
      case 'CLAIMED':
        return 'badge-claimed';
      case 'APPROVED':
        return 'badge-approved';
      case 'REJECTED':
        return 'badge-rejected';
      case 'RETURNED':
        return 'badge-returned';
      case 'CLOSED':
      default:
        return 'badge-closed';
    }
  };

  const formatStatus = (s) => {
    switch (s?.toUpperCase()) {
      case 'POSSIBLE_MATCH':
        return 'Possible Match';
      case 'CLAIM_REQUESTED':
        return 'Claim Requested';
      case 'OPEN':
        return 'Open';
      case 'CLAIMED':
        return 'Claimed';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'RETURNED':
        return 'Returned';
      default:
        return s || 'Unknown';
    }
  };

  return (
    <span className={`badge ${getStatusClass(status)}`}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;
