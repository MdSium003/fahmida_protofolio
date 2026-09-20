import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ArrowUpRight, X, ChevronRight, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollReveal from '../shared/ScrollReveal';

function formatNewsDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const HomeNews = ({ news = [] }) => {
  const [selectedNews, setSelectedNews] = useState(null);

  // Lock background scroll when modal is open and handle Escape key
  useEffect(() => {
    if (selectedNews) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setSelectedNews(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedNews]);

  if (!news || news.length === 0) return null;

  const featuredNews = news[0];
  const sideNews = news.slice(1, 3);
  const remainingNews = news.slice(3);

  return (
    <section className="home-section home-news-section" id="news" aria-label="Latest Updates & News">
      <div className="home-section-container">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="home-section-header">
              {/* <div className="home-section-pill">
                <Newspaper size={13} className="pill-icon" />
                <span>Latest Milestones</span>
              </div> */}
            <h2 className="home-section-title">
              News & <span className="text-highlight">Monthly Updates</span>
            </h2>
            <p className="home-section-subtitle">
              Recent academic appointments, research breakthroughs, major competitions, and community updates.
            </p>
          </div>
        </ScrollReveal>

        {/* Asymmetric Bento News Grid: Left Block Big + Side Two Small Boxes */}
        <div className="home-news-bento-layout">
          
          {/* LEFT: Big Featured News Card */}
          {featuredNews && (
            <ScrollReveal delay={0.05} className="news-featured-wrap">
              <article 
                className="news-featured-big-card"
                onClick={() => setSelectedNews(featuredNews)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedNews(featuredNews); }}
              >
                {/* Large Media Header */}
                <div className="news-big-media">
                  {featuredNews.image_url ? (
                    <img 
                      src={featuredNews.image_url} 
                      alt={featuredNews.title} 
                      className="news-big-img"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="news-media-fallback">
                      <Newspaper size={44} className="news-fallback-icon" />
                    </div>
                  )}
                  <div className="news-media-overlay" />
                  {featuredNews.category && (
                    <span className="news-floating-category">{featuredNews.category}</span>
                  )}
                </div>

                {/* Big Card Content */}
                <div className="news-big-body">
                  <div className="news-card-meta">
                    <span className="news-date-tag">
                      <Calendar size={13} />
                      <span>{formatNewsDate(featuredNews.date)}</span>
                    </span>
                  </div>

                  <h3 className="news-big-title">{featuredNews.title}</h3>
                  <p className="news-big-summary">{featuredNews.summary}</p>

                  <div className="news-card-footer">
                    <span className="news-read-more">
                      <span>Read Full Update</span>
                      <ChevronRight size={14} className="read-more-arrow" />
                    </span>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          )}

          {/* RIGHT: Side Two Small Boxes */}
          <div className="news-side-column">
            {sideNews.map((item, index) => (
              <ScrollReveal key={item.id || index} delay={0.1 + index * 0.08} className="news-side-wrap">
                <article 
                  className="news-side-small-card"
                  onClick={() => setSelectedNews(item)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedNews(item); }}
                >
                  {/* Horizontal Banner Image on Top */}
                  <div className="news-side-media">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="news-side-img"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="news-media-fallback">
                        <Newspaper size={28} className="news-fallback-icon" />
                      </div>
                    )}
                    <div className="news-media-overlay" />
                    {item.category && (
                      <span className="news-floating-category-sm">{item.category}</span>
                    )}
                  </div>

                  <div className="news-side-body">
                    <div className="news-card-meta">
                      <span className="news-date-tag">
                        <Calendar size={12} />
                        <span>{formatNewsDate(item.date)}</span>
                      </span>
                    </div>

                    <h3 className="news-side-title">{item.title}</h3>
                    <p className="news-side-summary">{item.summary}</p>

                    <div className="news-side-footer">
                      <span className="news-read-more">
                        <span>View Details</span>
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

        </div>

        {/* Any Additional News Items Grid (If more than 3) */}
        {remainingNews.length > 0 && (
          <div className="home-news-additional-grid">
            {remainingNews.map((item, index) => (
              <ScrollReveal key={item.id || index} delay={0.15 + index * 0.05}>
                <article 
                  className="news-side-small-card"
                  onClick={() => setSelectedNews(item)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedNews(item); }}
                >
                  <div className="news-side-media">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="news-side-img"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="news-media-overlay" />
                  </div>

                  <div className="news-side-body">
                    <div className="news-card-meta">
                      {item.category && (
                        <span className="news-side-category">{item.category}</span>
                      )}
                      <span className="news-date-tag">
                        <Calendar size={12} />
                        <span>{formatNewsDate(item.date)}</span>
                      </span>
                    </div>

                    <h3 className="news-side-title">{item.title}</h3>
                    <p className="news-side-summary">{item.summary}</p>

                    <div className="news-side-footer">
                      <span className="news-read-more">
                        <span>View Details</span>
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}

      </div>

      {/* Full Details Popup Dialog / Modal Rendered via React Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedNews && (
            <div 
              className="news-modal-overlay"
              onClick={() => setSelectedNews(null)}
              role="dialog"
              aria-modal="true"
            >
              <motion.div 
                className="news-modal-container"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button 
                  className="news-modal-close"
                  onClick={() => setSelectedNews(null)}
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>

                {/* Modal Image Header */}
                {selectedNews.image_url && (
                  <div className="news-modal-media">
                    <div className="news-modal-img-frame">
                      <img 
                        src={selectedNews.image_url} 
                        alt={selectedNews.title} 
                        className="news-modal-img"
                        onError={(e) => { 
                          const mediaEl = e.currentTarget.closest('.news-modal-media');
                          if (mediaEl) mediaEl.style.display = 'none';
                        }}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                )}

                {/* Modal Content Body with Scrollable Area */}
                <div className="news-modal-body">
                  <div className="news-modal-meta-row">
                    {selectedNews.category && (
                      <span className="news-modal-category">{selectedNews.category}</span>
                    )}
                    {selectedNews.date && (
                      <span className="news-modal-date">
                        <Calendar size={13} />
                        <span>{formatNewsDate(selectedNews.date)}</span>
                      </span>
                    )}
                  </div>

                  <h2 className="news-modal-title">{selectedNews.title}</h2>

                  <div className="news-modal-text">
                    {selectedNews.summary && selectedNews.details && selectedNews.summary.trim() !== selectedNews.details.trim() ? (
                      <>
                        <p className="news-modal-lead">{selectedNews.summary}</p>
                        <p className="news-modal-body-p">{selectedNews.details}</p>
                      </>
                    ) : (
                      <p className="news-modal-body-p">{selectedNews.details || selectedNews.summary}</p>
                    )}
                  </div>

                  {/* External Official Link */}
                  {selectedNews.external_link && (
                    <div className="news-modal-actions">
                      <a 
                        href={selectedNews.external_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="news-modal-link-btn"
                      >
                        <span>Visit Official Portal / Details</span>
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default React.memo(HomeNews);
