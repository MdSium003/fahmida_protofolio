import React from 'react';

const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  const statuses = [
    { key: 'all', label: 'All' },
    { key: 'ongoing', label: 'Ongoing' },
    { key: 'published', label: 'Published' },
    { key: 'preprint', label: 'Preprint' },
    { key: 'past', label: 'Past Works' }
  ];

  return (
    <div className="status-filter">
      <div className="status-tabs">
        {statuses.map((status, index) => (
          <button
            key={status.key}
            className={`status-tab ${selectedStatus === status.key ? 'active' : ''}`}
            onClick={() => onStatusChange(status.key)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {status.label}
          </button>
        ))}
      </div>
      <p className="status-hint">
        <span className="hint-icon">✨</span>
        (click on the <span className="hint-highlight">✨</span> icons to view details on each work)
      </p>
    </div>
  );
};

export default StatusFilter;
