import React from 'react';
import { Activity, BookOpen, FolderGit2, Award, Calendar } from 'lucide-react';

const HomeImpactMetrics = ({ 
  papersCount = 13, 
  projectsCount = 10, 
  awardsCount = 55 
}) => {
  return (
    <section className="home-section home-impact-section" aria-label="Portfolio Impact & Metrics">
      <div className="home-section-container">
        <div className="home-impact-banner">
          <div className="home-impact-header">
            <h2 className="home-impact-title">Quantified Impact & Reach</h2>
          </div>

          <div className="home-metrics-grid">
            <div className="home-metric-item">
              <div className="home-metric-icon-wrap">
                <BookOpen size={18} />
              </div>
              <span className="home-metric-value">{papersCount || 12}+</span>
              <span className="home-metric-label">Research Publications</span>
            </div>

            <div className="home-metric-divider" aria-hidden="true" />

            <div className="home-metric-item">
              <div className="home-metric-icon-wrap">
                <FolderGit2 size={18} />
              </div>
              <span className="home-metric-value">{projectsCount || 15}+</span>
              <span className="home-metric-label">Engineering Systems</span>
            </div>

            <div className="home-metric-divider" aria-hidden="true" />

            <div className="home-metric-item">
              <div className="home-metric-icon-wrap">
                <Award size={18} />
              </div>
              <span className="home-metric-value">{awardsCount || 18}+</span>
              <span className="home-metric-label">Honors & Distinctions</span>
            </div>

            <div className="home-metric-divider" aria-hidden="true" />

            <div className="home-metric-item">
              <div className="home-metric-icon-wrap">
                <Calendar size={18} />
              </div>
              <span className="home-metric-value year-span">2021–2026</span>
              <span className="home-metric-label">Active Research & Practice</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HomeImpactMetrics);
