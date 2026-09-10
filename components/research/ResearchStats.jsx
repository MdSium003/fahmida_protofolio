import React, { useMemo } from 'react';
import { BookOpen, Sparkles, Layers, Calendar } from 'lucide-react';

const ResearchStats = ({ papers = [] }) => {
  const stats = useMemo(() => {
    if (!papers.length) return null;

    const totalPapers = papers.length;

    // Count published / preprint
    const publishedCount = papers.filter(p => {
      const s = (p.status || '').toLowerCase();
      return s === 'published' || s === 'preprint';
    }).length;

    // Count clinical / medical / multimodal AI papers
    const clinicalCount = papers.filter(p => {
      const t = `${p.title || ''} ${p.topics || ''} ${p.abstract || ''} ${p.description || ''}`.toLowerCase();
      return t.includes('clinical') || t.includes('medical') || t.includes('x-ray') || t.includes('retinal') || t.includes('mri') || t.includes('radiology') || t.includes('tumor') || t.includes('multimodal');
    }).length;

    // Year span
    const years = papers
      .map(p => parseInt(p.year, 10))
      .filter(y => !isNaN(y) && y > 1990);
    const minYear = years.length ? Math.min(...years) : null;
    const maxYear = years.length ? Math.max(...years) : null;
    const yearSpan = minYear && maxYear ? `${minYear}–${String(maxYear).slice(-2)}` : '';

    return {
      totalPapers,
      publishedCount,
      clinicalCount,
      yearSpan
    };
  }, [papers]);

  if (!stats) return null;

  return (
    <section className="research-stats-section" aria-label="Research Statistics">
      <div className="stats-container">
        <div className="stat-block">
          <div className="stat-header">
            <BookOpen size={14} className="stat-icon" />
            <span className="stat-label">Total Publications</span>
          </div>
          <div className="stat-value">{String(stats.totalPapers).padStart(2, '0')}</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-block">
          <div className="stat-header">
            <Sparkles size={14} className="stat-icon" />
            <span className="stat-label">Published / Preprints</span>
          </div>
          <div className="stat-value">{String(stats.publishedCount).padStart(2, '0')}</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-block">
          <div className="stat-header">
            <Layers size={14} className="stat-icon" />
            <span className="stat-label">Clinical & Multimodal AI</span>
          </div>
          <div className="stat-value">{String(stats.clinicalCount).padStart(2, '0')}</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-block">
          <div className="stat-header">
            <Calendar size={14} className="stat-icon" />
            <span className="stat-label">Active Years</span>
          </div>
          <div className="stat-value year-value">{stats.yearSpan || '2021–26'}</div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ResearchStats);
