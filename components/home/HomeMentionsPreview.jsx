import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Tv, Newspaper, Share2, Youtube, Play, Calendar, ArrowUpRight, ExternalLink, Sparkles, X, ChevronRight } from 'lucide-react';
import ScrollReveal from '../shared/ScrollReveal';
import StaggerReveal from '../shared/StaggerReveal';
import { asset } from '../../src/utils/assetUrl';

/**
 * Extracts YouTube embed URL from standard watch/short URLs
 */
function getYouTubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const clean = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = clean.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0`;
  }
  return clean.includes('/embed/') ? clean : '';
}

const HomeMentionsPreview = ({ mediaMentions = [] }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Lock background scrolling and handle Escape key when modal is open
  useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setSelectedMedia(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedMedia]);

  if (!mediaMentions || mediaMentions.length === 0) return null;

  // Curate top 3 featured media mentions
  const featuredEntries = mediaMentions
    .filter(item => item.isFeatured !== false)
    .slice(0, 3);

  const displayEntries = featuredEntries.length > 0 ? featuredEntries : mediaMentions.slice(0, 3);

  const renderTypeIcon = (type, size = 11) => {
    switch (type) {
      case 'tv':
        return <Tv size={size} />;
      case 'newspaper':
      case 'article':
        return <Newspaper size={size} />;
      case 'facebook':
        return <Share2 size={size} />;
      case 'youtube':
        return <Youtube size={size} />;
      default:
        return <Newspaper size={size} />;
    }
  };

  const renderTypeLabel = (item) => {
    if (item.outlet) return item.outlet;
    switch (item.media_type) {
      case 'tv': return 'TV Broadcast';
      case 'newspaper': return 'Newspaper Feature';
      case 'facebook': return 'Community Spotlight';
      case 'youtube': return 'Video Feature';
      default: return 'Press Mention';
    }
  };

  return (
    <section className="home-section home-mentions-section" id="media-mentions" aria-label="Key Media Mentions">
      <div className="home-section-container">
        {/* Section Header */}
        <ScrollReveal>
          <div className="home-section-header">
            <h2 className="home-section-title">
              Key Mentions & <span className="text-highlight">Media Moments</span>
            </h2>
            <p className="home-section-subtitle">
              Featured interviews, national daily coverage, television broadcasts, and tech community highlights.
            </p>
          </div>
        </ScrollReveal>

        {/* 3-Column Editorial Media Grid */}
        <StaggerReveal className="home-mentions-grid" staggerDelay={0.1}>
          {displayEntries.map((item) => {
            const isVideo = item.media_type === 'tv' || item.media_type === 'youtube' || Boolean(item.media_url);
            const imgUrl = item.image_url || asset('/images/fahmida_with_ddn.jpeg');

            return (
              <article key={item.id} className={`home-mentions-card type-${item.media_type}`}>
                <div 
                  className="home-mentions-media-wrapper"
                  onClick={() => setSelectedMedia(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${item.title}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMedia(item); }}
                >
                  <img 
                    src={imgUrl} 
                    alt={item.title}
                    className="home-mentions-img"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = asset('/images/fahmida_with_ddn.jpeg'); }}                    decoding="async"
                  />
                  <div className="home-mentions-gradient-overlay" />

                  {/* Media Type Badge */}
                  <div className={`home-mentions-type-pill type-${item.media_type}`}>
                    {renderTypeIcon(item.media_type, 11)}
                    <span>{renderTypeLabel(item)}</span>
                  </div>

                  {/* Video Play Icon Overlay */}
                  {isVideo && (
                    <div className="home-mentions-play-btn" aria-hidden="true">
                      <Play size={16} fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="home-mentions-body">
                  {item.date && (
                    <div className="home-mentions-date-row">
                      <Calendar size={12} />
                      <span>{item.date}</span>
                    </div>
                  )}

                  <h3 
                    className="home-mentions-title"
                    onClick={() => setSelectedMedia(item)}
                    role="button"
                    tabIndex={0}
                  >
                    {item.title}
                  </h3>
                  
                  <p className="home-mentions-desc">
                    {item.caption || 'Featured story and technical spotlight across national media outlets.'}
                  </p>

                  <div className="home-mentions-footer">
                    <button 
                      type="button" 
                      onClick={() => setSelectedMedia(item)} 
                      className="home-boxed-btn"
                    >
                      <span>{isVideo ? 'Watch Feature' : 'Read Highlight'}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </StaggerReveal>

        {/* Section Action: View All Moments on Blog Page */}
        <ScrollReveal>
          <div className="home-section-bottom-action">
            <Link to="/blog" className="home-view-all-link">
              <span>Explore All Moments & Press Features</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Full Details Modal rendered directly via React Portal to prevent any scroll or stacking trapping */}
      {typeof document !== 'undefined' && selectedMedia && createPortal(
        <div 
          className="home-mentions-modal-overlay" 
          onClick={() => setSelectedMedia(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="home-mentions-modal-container" onClick={(e) => e.stopPropagation()}>
            <button 
              className="home-mentions-modal-close" 
              onClick={() => setSelectedMedia(null)}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            {/* Media Viewport */}
            <div className="home-mentions-modal-viewport">
              {selectedMedia.media_url && getYouTubeEmbedUrl(selectedMedia.media_url) ? (
                <div className="home-mentions-video-frame">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedMedia.media_url)}
                    title={selectedMedia.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="home-mentions-iframe"
                  />
                </div>
              ) : (
                <img 
                  src={selectedMedia.image_url || asset('/images/fahmida_with_ddn.jpeg')} 
                  alt={selectedMedia.title}
                  className="home-mentions-modal-img"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>

            {/* Info Body */}
            <div className="home-mentions-modal-body">
              <div className="home-mentions-modal-meta">
                <span className={`home-mentions-type-pill type-${selectedMedia.media_type}`}>
                  {renderTypeIcon(selectedMedia.media_type, 12)}
                  <span>{renderTypeLabel(selectedMedia)}</span>
                </span>
                {selectedMedia.date && (
                  <span className="home-mentions-modal-date">
                    <Calendar size={12} />
                    <span>{selectedMedia.date}</span>
                  </span>
                )}
              </div>

              <h2 className="home-mentions-modal-title">{selectedMedia.title}</h2>

              <p className="home-mentions-modal-caption">
                {selectedMedia.caption}
              </p>

              <div className="home-mentions-modal-actions">
                {selectedMedia.media_url && (
                  <a 
                    href={selectedMedia.media_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="home-mentions-btn primary"
                  >
                    <Youtube size={15} />
                    <span>Watch on YouTube</span>
                    <ExternalLink size={13} />
                  </a>
                )}
                {selectedMedia.external_link && (
                  <a 
                    href={selectedMedia.external_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="home-mentions-btn secondary"
                  >
                    {selectedMedia.media_type === 'facebook' ? (
                      <Share2 size={14} />
                    ) : (
                      <Newspaper size={14} />
                    )}
                    <span>
                      {selectedMedia.outlet
                        ? `Visit ${selectedMedia.outlet}`
                        : selectedMedia.media_type === 'facebook'
                        ? 'View on Facebook'
                        : 'Read Source Article'}
                    </span>
                    <ExternalLink size={13} />
                  </a>
                )}
                <Link to="/blog" className="home-mentions-btn tertiary">
                  <span>View in Blog Journey</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default React.memo(HomeMentionsPreview);
