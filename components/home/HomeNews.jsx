import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Calendar, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function formatNewsDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function NewsCard({ item, onSelect, duplicate = false }) {
  return (
    <button
      className="news-marquee-card"
      type="button"
      onClick={() => onSelect(item)}
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate ? 'true' : undefined}
      aria-label={`Read update: ${item.title}`}
    >
      <span className="news-marquee-card-topline">
        <span className="news-marquee-category">{item.category || 'Update'}</span>
        <ChevronRight size={17} aria-hidden="true" />
      </span>
      <span className="news-marquee-title">{item.title}</span>
      <span className="news-marquee-summary">{item.summary || item.details}</span>
      <span className="news-marquee-card-footer">
        <span className="news-marquee-date">
          <Calendar size={13} aria-hidden="true" />
          {formatNewsDate(item.date)}
        </span>
        <span className="news-marquee-read">Read update</span>
      </span>
    </button>
  );
}

const HomeNews = ({ news = [] }) => {
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    if (!selectedNews) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedNews(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNews]);

  if (!news || news.length === 0) return null;

  return (
    <section className="home-section home-news-section" id="news" aria-label="Latest Updates & News">
      <div className="home-section-container">
        <div className="home-section-header">
          <h2 className="home-section-title">
            News & <span className="text-highlight">Monthly Updates</span>
          </h2>
          <p className="home-section-subtitle">
            Recent academic appointments, research breakthroughs, major competitions, and community updates.
          </p>
        </div>

        <div className="news-marquee" aria-label="Select an update to read more">
          <div className="news-marquee-track">
            {[0, 1].map((copy) => (
              <div className="news-marquee-group" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
                {news.map((item, index) => (
                  <NewsCard
                    key={`${copy}-${item.id || index}`}
                    item={item}
                    onSelect={setSelectedNews}
                    duplicate={copy === 1}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedNews && (
            <div
              className="news-modal-overlay"
              onClick={() => setSelectedNews(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="news-modal-title"
            >
              <motion.div
                className="news-modal-container"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  className="news-modal-close"
                  onClick={() => setSelectedNews(null)}
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>

                {selectedNews.image_url && (
                  <div className="news-modal-media">
                    <div className="news-modal-img-frame">
                      <img
                        src={selectedNews.image_url}
                        alt={selectedNews.title}
                        className="news-modal-img"
                        onError={(event) => {
                          const media = event.currentTarget.closest('.news-modal-media');
                          if (media) media.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="news-modal-body">
                  <div className="news-modal-meta-row">
                    {selectedNews.category && <span className="news-modal-category">{selectedNews.category}</span>}
                    {selectedNews.date && (
                      <span className="news-modal-date">
                        <Calendar size={13} />
                        <span>{formatNewsDate(selectedNews.date)}</span>
                      </span>
                    )}
                  </div>
                  <h2 className="news-modal-title" id="news-modal-title">{selectedNews.title}</h2>
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
