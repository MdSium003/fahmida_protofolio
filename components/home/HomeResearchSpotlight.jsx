import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, ArrowUpRight, Activity } from 'lucide-react';
import ResearchFigureFallback from '../research/ResearchFigureFallback';
import ScrollReveal from '../shared/ScrollReveal';
import StaggerReveal from '../shared/StaggerReveal';

const HomeResearchSpotlight = ({ papers = [] }) => {
  if (!papers || papers.length === 0) return null;

  // Curate 1 Lead Research Paper + 2 Supporting Papers from data-driven featured flags
  const featured = papers.filter(p => p.isFeatured || p.is_featured === true || String(p.is_featured).toLowerCase() === 'true');
  const leadPaper = featured[0] || papers[0];
  const supportingPapers = (featured.length > 1 ? featured.slice(1, 3) : papers.filter(p => String(p.id) !== String(leadPaper?.id)).slice(0, 2));

  if (!leadPaper) return null;

  const getMediaInfo = (paper) => {
    const rawImage = paper.displayImg || paper.thumbnail_url;
    const isPdf = rawImage && (rawImage.toLowerCase().endsWith('.pdf') || rawImage.toLowerCase().includes('/pdf'));
    const hasValidImage = (rawImage && 
                          !isPdf &&
                          !rawImage.includes('example.com') && 
                          !rawImage.includes('youtube') && 
                          !rawImage.includes('youtu.be') &&
                          (rawImage.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || rawImage.includes('storage/v1/object/public')));
    return { hasValidImage, displayImg: rawImage };
  };

  const leadMedia = getMediaInfo(leadPaper);

  return (
    <section className="home-section home-research-spotlight" aria-label="Research Spotlight">
      <div className="home-section-container">
        {/* Section Header */}
        <ScrollReveal>
          <div className="home-section-header">
            <h2 className="home-section-title">Scientific Publications & Models</h2>
            <p className="home-section-subtitle">
              Advancing clinical AI, multimodal multi-agent reasoning, and medical image segmentation.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <article className="home-research-lead-card">
          <div className="home-research-figure-frame">
            {leadMedia.hasValidImage ? (
              <div className="home-research-img-wrapper">
                <img 
                  src={leadMedia.displayImg} 
                  alt={leadPaper.title}
                  className="home-research-img"
                  loading="lazy"
decoding="async"/>
                <div className="home-research-gradient-overlay" />
              </div>
            ) : (
              <ResearchFigureFallback paper={leadPaper} className="home-research-blueprint" />
            )}

            <div className="home-research-kicker-badge">
              <Activity size={12} />
              <span>{leadPaper.kicker || (leadPaper.topics ? leadPaper.topics.split(',')[0] : 'CLINICAL AI')}</span>
            </div>
          </div>

          <div className="home-research-content">
            <div className="home-research-meta-row">
              {leadPaper.status && (
                <span className={`home-status-badge status-${leadPaper.status.toLowerCase()}`}>
                  {leadPaper.status}
                </span>
              )}
              {leadPaper.year && <span className="home-year-pill">{leadPaper.year}</span>}
            </div>

            <h3 className="home-research-lead-title">{leadPaper.title}</h3>

            <p className="home-research-abstract">
              {leadPaper.abstract 
                ? `${leadPaper.abstract.slice(0, 240)}...`
                : leadPaper.description 
                  ? `${leadPaper.description.replace(/^[-•]\s*/gm, '').slice(0, 220)}...`
                  : 'Scientific publication on multi-agent consistency and multimodal clinical reasoning.'}
            </p>

            <div className="home-research-footer">
              <Link to={`/research?id=${leadPaper.id}`} className="home-boxed-btn primary-action">
                <span>Explore Paper</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </article>
      </ScrollReveal>

        {/* 2. Supporting Papers 2-Column Grid */}
        {supportingPapers.length > 0 && (
          <StaggerReveal className="home-supporting-papers-grid" staggerDelay={0.1}>
            {supportingPapers.map((paper) => {
              const media = getMediaInfo(paper);
              const kicker = paper.kicker || (paper.topics ? paper.topics.split(',')[0] : 'MEDICAL AI');

              return (
                <article key={paper.id} className="home-supporting-paper-card">
                  <div className="home-supporting-paper-media">
                    {media.hasValidImage ? (
                      <div className="home-research-img-wrapper">
                        <img 
                          src={media.displayImg} 
                          alt={paper.title}
                          className="home-research-img"
                          loading="lazy"
decoding="async"/>
                        <div className="home-research-gradient-overlay" />
                      </div>
                    ) : (
                      <ResearchFigureFallback paper={paper} className="home-research-blueprint compact" />
                    )}

                    <span className="home-paper-category-tag">{kicker}</span>
                  </div>

                  <div className="home-supporting-paper-content">
                    <div className="home-research-meta-row compact">
                      {paper.status && (
                        <span className={`home-status-badge status-${paper.status.toLowerCase()}`}>
                          {paper.status}
                        </span>
                      )}
                      {paper.year && <span className="home-year-text">{paper.year}</span>}
                    </div>

                    <h4 className="home-supporting-paper-title">{paper.title}</h4>

                    <div className="home-supporting-paper-footer">
                      <Link to={`/research?id=${paper.id}`} className="home-boxed-btn">
                        <span>Explore Paper</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </StaggerReveal>
        )}

        {/* Section Action: View All Research */}
        <ScrollReveal>
          <div className="home-section-bottom-action">
            <Link to="/research" className="home-view-all-link">
              <span>View All Research & Publications</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default React.memo(HomeResearchSpotlight);
