import React, { useMemo } from 'react';
import { Trophy, Globe2, Sparkles, Calendar } from 'lucide-react';

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

    // Calculate year range
    const validYears = awards
      .map(a => parseInt(a.year, 10))
      .filter(y => !isNaN(y) && y > 1990);
    
    const minYear = validYears.length ? Math.min(...validYears) : null;
    const maxYear = validYears.length ? Math.max(...validYears) : null;
    const yearSpan = minYear && maxYear ? `${minYear}–${maxYear}` : '';

    return {
      totalAwards,
      majorFinishes,
      internationalCount,
      yearSpan
    };
  }, [awards]);

  if (!stats) return null;

  return (
    <section className="recognition-stats-section" aria-label="Recognition Statistics">
      <div className="stats-container">
        <div className="stat-block">
          <div className="stat-header">
            <Trophy size={15} className="stat-icon" />
            <span className="stat-label">Total Distinctions</span>
          </div>
          <div className="stat-value">{stats.totalAwards}</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-block">
          <div className="stat-header">
            <Sparkles size={15} className="stat-icon" />
            <span className="stat-label">Major & Top Finishes</span>
          </div>
          <div className="stat-value">{stats.majorFinishes}</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-block">
          <div className="stat-header">
            <Globe2 size={15} className="stat-icon" />
            <span className="stat-label">International Scope</span>
          </div>
          <div className="stat-value">{stats.internationalCount}</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-block">
          <div className="stat-header">
            <Calendar size={15} className="stat-icon" />
            <span className="stat-label">Active Years</span>
          </div>
          <div className="stat-value year-value">{stats.yearSpan}</div>
        </div>
      </div>
    </section>
  );
};

export default RecognitionStats;
