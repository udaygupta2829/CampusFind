import React from 'react';

const StatCard = ({ icon: Icon, label, value, colorScheme = 'blue' }) => {
  return (
    <div className="stat-box">
      <div className={`stat-icon-wrapper stat-icon-${colorScheme}`}>
        <Icon size={26} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
