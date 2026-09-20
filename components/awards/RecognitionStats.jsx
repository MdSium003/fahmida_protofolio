import React, { useMemo } from 'react';
import { Trophy, Medal, Globe2 } from 'lucide-react';

const RecognitionStats = ({ awards = [] }) => {
  const stats = useMemo(() => {
    if (!awards.length) return null;

    const totalAwards = awards.length;

    // Calculate major finishes (Champion, 1st, Winner, Top 1-2)
    const majorFinishes = awards.filter(a => {
      const text = `${a.title || ''} ${a.description || ''}`.toLowerCase();
      return (
        text.includes('champion') ||
        text.includes('1st place') ||
        text.includes('1st runner up') ||
        text.includes('1st prize') ||
        text.includes('winner') ||
        text.includes('talent pool')
      );
    }).length;

    // Calculate international/global recognitions
    const internationalCount = awards.filter(a => {
      const text = `${a.title || ''} ${a.organization_name || ''} ${a.description || ''}`.toLowerCase();
      return (
        text.includes('international') ||
        text.includes('global') ||
        text.includes('johns hopkins') ||
        text.includes('sighpc') ||
        text.includes('escap') ||
        text.includes('commonwealth') ||
        text.includes('iscea') ||
        text.includes('united nations')
      );
    }).length;

    return {
      totalAwards,
      majorFinishes,
      internationalCount
    };
  }, [awards]);

  if (!stats) return null;

  return (
    <section className="recognition-stats-section" aria-label="Recognition Statistics">
      <div className="stats-container">
        <div className="stat-block">
          <div className="stat-header">
            <Trophy size={13} className="stat-icon" />
            <span className="stat-label">Total Distinctions</span>
          </div>
          <div className="stat-value">{String(stats.totalAwards).padStart(2, '0')}</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-block">
          <div className="stat-header">
            <Medal size={13} className="stat-icon" />
            <span className="stat-label">Major & Top Finishes</span>
          </div>
          <div className="stat-value">{String(stats.majorFinishes).padStart(2, '0')}</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-block">
          <div className="stat-header">
            <Globe2 size={13} className="stat-icon" />
            <span className="stat-label">International Scope</span>
          </div>
          <div className="stat-value">{String(stats.internationalCount).padStart(2, '0')}</div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(RecognitionStats);
