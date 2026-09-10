import React, { useState, useMemo } from 'react';
import { Layers, ArrowRight, Building2, Tag, Image as ImageIcon } from 'lucide-react';
import { parseMedia } from '../../src/utils/csvLoader';
import { cleanAwardTitle, getPlacementBadge } from './FeaturedAwards';

const AwardArchive = ({ awards = [], onSelectAward, onOpenMedia }) => {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  // Extract unique topics from data
  const topics = useMemo(() => {
    const set = new Set();
    awards.forEach(a => {
      const t = String(a.topic || '').trim();
      if (t) set.add(t);
    });
    return Array.from(set);
  }, [awards]);

  // Extract unique years from data
  const years = useMemo(() => {
    const set = new Set();
    awards.forEach(a => {
      const y = String(a.year || '').trim();
      if (y) set.add(y);
    });
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [awards]);

  // Filter awards based on selected topic and year
  const filteredAwards = useMemo(() => {
    return awards.filter(award => {
      const matchTopic = selectedTopic === 'all' || award.topic === selectedTopic;
      const matchYear = selectedYear === 'all' || String(award.year) === String(selectedYear);
      return matchTopic && matchYear;
    });
  }, [awards, selectedTopic, selectedYear]);

  // Group awards chronologically by Year
  const groupedByYear = useMemo(() => {
    const groups = {};
    filteredAwards.forEach(award => {
      const year = award.year || 'Other';
      if (!groups[year]) groups[year] = [];
      groups[year].push(award);
    });

    return Object.keys(groups)
      .sort((a, b) => Number(b) - Number(a))
      .map(year => ({
        year,
        items: groups[year]
      }));
  }, [filteredAwards]);

  return (
    <section className="award-archive-section" aria-label="Complete Award Archive">
      <div className="section-header-compact">
        <h2 className="section-title">Chronological Recognition Record</h2>
      </div>

      {/* Filter Controls */}
      <div className="archive-filters-wrapper">
        <div className="archive-category-filters" role="tablist" aria-label="Filter awards by category">
          <button
            className={`archive-filter-btn ${selectedTopic === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTopic('all')}
            type="button"
          >
            All Categories ({awards.length})
          </button>
          {topics.map(topic => {
            const count = awards.filter(a => a.topic === topic).length;
            return (
              <button
                key={topic}
                className={`archive-filter-btn ${selectedTopic === topic ? 'active' : ''}`}
                onClick={() => setSelectedTopic(topic)}
                type="button"
              >
                {topic} ({count})
              </button>
            );
          })}
        </div>

        {/* Year Filter Pills */}
        <div className="archive-year-filters" aria-label="Filter awards by year">
          <button
            className={`archive-year-btn ${selectedYear === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedYear('all')}
            type="button"
          >
            All Years
          </button>
          {years.map(year => (
            <button
              key={year}
              className={`archive-year-btn ${selectedYear === year ? 'active' : ''}`}
              onClick={() => setSelectedYear(year)}
              type="button"
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Archive List Grouped by Year */}
      <div className="archive-timeline-container">
        {groupedByYear.length === 0 ? (
          <div className="archive-empty-state">
            <p>No awards match the selected filters.</p>
            <button 
              className="btn-reset-filters" 
              onClick={() => { setSelectedTopic('all'); setSelectedYear('all'); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          groupedByYear.map(({ year, items }) => (
            <div key={year} className="archive-year-group">
              <div className="archive-year-header">
                <span className="year-number">{year}</span>
                <span className="year-count">({items.length} {items.length === 1 ? 'honor' : 'honors'})</span>
                <div className="year-line" />
              </div>

              <div className="archive-rows-list">
                {items.map((award) => {
                  const placement = getPlacementBadge(award.title);
                  const media = parseMedia(award.media);

                  return (
                    <article 
                      key={award.id} 
                      className="archive-row-item"
                      onClick={() => onSelectAward(award)}
                    >
                      <div className="archive-row-placement">
                        <span className={`archive-placement-badge ${placement.rankClass}`}>
                          {placement.icon}
                          <span className="placement-text">{placement.text}</span>
                        </span>
                      </div>

                      <div className="archive-row-main">
                        <h4 className="archive-row-title">{cleanAwardTitle(award.title)}</h4>
                        <div className="archive-row-meta">
                          {award.organization_name && (
                            <span className="archive-meta-org">
                              <Building2 size={13} />
                              <span>{award.organization_name}</span>
                            </span>
                          )}
                          {award.topic && (
                            <span className="archive-meta-topic">
                              <Tag size={12} />
                              <span>{award.topic}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="archive-row-actions" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="archive-row-btn"
                          onClick={() => onSelectAward(award)}
                          type="button"
                          aria-label={`View details for ${cleanAwardTitle(award.title)}`}
                        >
                          <span>Details</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default AwardArchive;
