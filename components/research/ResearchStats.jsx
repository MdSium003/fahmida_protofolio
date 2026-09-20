import React, { useMemo } from 'react';
import { BookOpen, CheckCircle2, Layers } from 'lucide-react';

const ResearchStats = ({ papers = [] }) => {
  const stats = useMemo(() => {
    if (!papers.length) return null;

    const totalPapers = papers.length;

    // Count peer-reviewed published / accepted
    const publishedCount = papers.filter(p => {
      const s = (p.status || '').toLowerCase();
      return s === 'published' || s === 'accepted';
    }).length;

    // Count clinical / medical / multimodal AI papers
    const clinicalCount = papers.filter(p => {
      const t = `${p.title || ''} ${p.topics || ''} ${p.abstract || ''} ${p.description || ''}`.toLowerCase();
      return t.includes('clinical') || t.includes('medical') || t.includes('x-ray') || t.includes('retinal') || t.includes('mri') || t.includes('radiology') || t.includes('tumor') || t.includes('multimodal');
    }).length;

    return {
      totalPapers,
      publishedCount,
      clinicalCount
    };
  }, [papers]);

  if (!stats) return null;

  return (
    <section className="research-stats-section" aria-label="Research Statistics">
      <div className="stats-container">
        <div className="stat-block">
          <div className="stat-header">
            <BookOpen size={13} className="stat-icon" />
            <span className="stat-label">Total Publications</span>
          </div>
          <div className="stat-value">{String(stats.totalPapers).padStart(2, '0')}</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-block">
          <div className="stat-header">
            <CheckCircle2 size={13} className="stat-icon" />
            <span className="stat-label">Peer-Reviewed / Accepted</span>
          </div>
          <div className="stat-value">{String(stats.publishedCount).padStart(2, '0')}</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-block">
          <div className="stat-header">
            <Layers size={13} className="stat-icon" />
            <span className="stat-label">Clinical & Multimodal AI</span>
          </div>
          <div className="stat-value">{String(stats.clinicalCount).padStart(2, '0')}</div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ResearchStats);
