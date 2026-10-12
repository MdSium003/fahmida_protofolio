import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Calendar, GraduationCap, X } from 'lucide-react';
import ScrollReveal from '../shared/ScrollReveal';
import StaggerReveal from '../shared/StaggerReveal';

export const ONGOING_WORKS_DATA = [
  {
    id: 'ongoing-1',
    title: 'Political Bias Analysis',
    timeline: 'Nov 2025 – Present',
    advisor: 'Sharifa Sultana, Assistant Professor, Dept. of Computer Science, University of Illinois Urbana-Champaign',
    description: 'Bias Emergence in LLM-Generated Summaries and Text Transformations from Neutral Sources in Low-Resource Settings.'
  },
  {
    id: 'ongoing-2',
    title: 'Temporal Empathy Analysis under Uncertainty',
    timeline: 'May 2026 – Present',
    advisor: 'Md Rakibul Hasan, Associate Lecturer (Research & Teaching), Curtin University',
    description: 'Temporal-Level Multimodal Empathy Analysis under Uncertainty: Hidden Vulnerability Detection in Counseling Conversations.'
  },
  {
    id: 'ongoing-3',
    title: 'Expert Telemedicine Conversations',
    timeline: 'Jan 2026 – Present',
    advisor: 'Rifat Shahriyar, Professor, Dept. of Computer Science & Engineering, BUET',
    description: 'Built a large-scale Bengali telemedicine conversation dataset from public TV call-in shows, using LLMs to reconstruct and annotate structured doctor–patient dialogues from noisy ASR transcripts for benchmarking medical NLP and QA tasks in low-resource settings.'
  },
  {
    id: 'ongoing-4',
    title: 'Brain Computer Interface',
    timeline: 'May 2025 – Present',
    advisor: 'Md. Golam Rabiul Alam, Professor, Dept. of Computer Science & Engineering, BRAC University',
    description: 'Foundation Model for Robust Epilepsy Detection with Focus on Asian Demographic Data.'
  },
  {
    id: 'ongoing-5',
    title: 'Contrastive Self-Supervised Learning for EEG',
    timeline: 'Jan 2025 – Present',
    advisor: 'Dr. A.B.M. Alim Al Islam, Professor, Dept. of Computer Science & Engineering, BUET',
    description: 'Contrastive Self-Supervised Learning with Explainable AI for Epilepsy Detection from EEG Spectrograms.'
  },
  {
    id: 'ongoing-6',
    title: 'Longitudinal Mammogram Risk Prediction',
    timeline: 'May 2025 – Present',
    advisor: 'Dr. A.B.M. Alim Al Islam, Professor, Dept. of Computer Science & Engineering, BUET',
    description: 'The More, The Better? Impact of Longitudinal Spatiotemporal Context in Mammograms for Improved Breast Cancer Risk Prediction and Tumor Localization.'
  },
  {
    id: 'ongoing-7',
    title: 'AI-Based Self-Testing Device for Breast Cancer Patients',
    timeline: 'Oct 2024 – Present',
    advisor: 'Dr. M Sohel Rahman, Professor, Dept. of Computer Science & Engineering, BUET',
    description: 'Breast Cancer Lump Detection Using Deep Learning on LED Image Data.'
  }
];

const OngoingWorks = ({ searchQuery = '' }) => {
  const [activeWork, setActiveWork] = useState(null);
  const filteredWorks = useMemo(() => {
    return ONGOING_WORKS_DATA.filter(item => {
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = `${item.title} ${item.advisor} ${item.description}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery]);

  useEffect(() => {
    if (!activeWork) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActiveWork(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeWork]);

  if (filteredWorks.length === 0) {
    return null;
  }

  return (
    <section className="research-status-group ongoing-works-section" aria-labelledby="heading-ongoing-works">
      {/* Section Header */}
      <ScrollReveal>
        <div className="research-group-header">
          <h2 id="heading-ongoing-works" className="research-group-title">
            Ongoing <span className="text-highlight">Works</span>
          </h2>
          <p className="research-group-subtitle">
            Active research projects and advisor collaborations ({filteredWorks.length})
          </p>
        </div>
      </ScrollReveal>

      {/* Clean, authentic CV grid */}
      <StaggerReveal
        className="ongoing-works-grid"
        staggerDelay={0.04}
        threshold={0}
        margin="0px 0px -20px 0px"
      >
        {filteredWorks.map((work) => {
          return (
            <article
              key={work.id}
              className="ongoing-work-card"
              tabIndex={0}
              role="button"
              aria-label={`View details for ${work.title}`}
              onClick={() => setActiveWork(work)}
              onKeyDown={(event) => {
                if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  setActiveWork(work);
                }
              }}
            >
              <div className="ongoing-card-top">
                <h3 className="ongoing-card-title">{work.title}</h3>
                <div className="ongoing-timeline-badge">
                  <Calendar size={12} />
                  <span>{work.timeline}</span>
                </div>
              </div>

              <div className="ongoing-advisor-row">
                <GraduationCap size={15} className="ongoing-advisor-icon" />
                <div className="ongoing-advisor-text">
                  <span className="advisor-label">Advisor:</span>
                  <span className="advisor-name">{work.advisor}</span>
                </div>
              </div>

              <button
                type="button"
                className="ongoing-details-toggle"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveWork(work);
                }}
              >
                <span>View Details</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            </article>
          );
        })}
      </StaggerReveal>

      {activeWork && createPortal(
        <div
          className="ongoing-detail-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveWork(null);
          }}
        >
          <section className="ongoing-detail-modal" role="dialog" aria-modal="true" aria-labelledby="ongoing-detail-title">
            <header className="ongoing-detail-header">
              <div>
                <span className="ongoing-detail-kicker">Ongoing Work</span>
                <h2 id="ongoing-detail-title">{activeWork.title}</h2>
              </div>
              <button type="button" className="ongoing-detail-close" onClick={() => setActiveWork(null)} aria-label="Close details">
                <X size={19} />
              </button>
            </header>

            <div className="ongoing-detail-content">
              <div className="ongoing-detail-meta">
                <div className="ongoing-detail-meta-item">
                  <Calendar size={17} aria-hidden="true" />
                  <div><span>Timeline</span><strong>{activeWork.timeline}</strong></div>
                </div>
                <div className="ongoing-detail-meta-item">
                  <GraduationCap size={18} aria-hidden="true" />
                  <div><span>Advisor</span><strong>{activeWork.advisor}</strong></div>
                </div>
              </div>
              <div className="ongoing-detail-summary">
                <h3>Summary</h3>
                <p>{activeWork.description}</p>
              </div>
            </div>
          </section>
        </div>,
        document.body
      )}
    </section>
  );
};

export default React.memo(OngoingWorks);
