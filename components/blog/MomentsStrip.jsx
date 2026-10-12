import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Camera, Tv, Newspaper, Share2, Youtube, Play, ExternalLink, X, ChevronLeft, ChevronRight, Calendar, Linkedin } from 'lucide-react';
import { loadMomentsData, loadMediaMentionsData } from '../../src/utils/csvLoader';
import { asset } from '../../src/utils/assetUrl';

/**
 * Extracts a clean YouTube embed URL from various formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube-nocookie.com/embed/VIDEO_ID
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

const MomentsStrip = () => {
  const [moments, setMoments] = useState([]);
  const [mediaMentions, setMediaMentions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [momentsData, mediaData] = await Promise.all([
          loadMomentsData().catch(() => []),
          loadMediaMentionsData().catch(() => [])
        ]);

        if (!isMounted) return;

        const normalizedMoments = (momentsData || []).map((m, idx) => ({
          id: `moment_${m.id || idx}`,
          title: m.caption || 'Journey Milestone',
          caption: m.caption || '',
          outlet: '',
          media_type: 'moment',
          image_url: m.image_url || m.image,
          media_url: '',
          external_link: '',
          date: '',
          category: 'moment',
          display_order: Number(m.display_order) || (idx + 100)
        }));

        const normalizedMedia = (mediaData || []).map((item, idx) => {
          const type = (item.media_type || item.mediaType || 'newspaper').toLowerCase();
          return {
            id: `media_${item.id || idx}`,
            title: item.title || 'Media Feature',
            caption: item.caption || item.summary || '',
            outlet: item.outlet || '',
            media_type: type,
            image_url: item.image_url || item.image || '',
            media_url: item.media_url || '',
            external_link: item.external_link || item.link || '',
            date: item.date || '',
            category: 'media',
            display_order: Number(item.display_order) || (idx + 1)
          };
        });

        setMoments(normalizedMoments);
        setMediaMentions(normalizedMedia);
      } catch (err) {
        console.error('Error loading moments & media mentions:', err);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Keep lightbox navigation in the same order as the page sections.
  const allItems = useMemo(() => {
    return [...mediaMentions, ...moments];
  }, [mediaMentions, moments]);

  const activeItem = selectedIndex !== null && allItems[selectedIndex] ? allItems[selectedIndex] : null;

  const openItem = (index) => setSelectedIndex(index);
  const closeItem = useCallback(() => setSelectedIndex(null), []);

  // Body scroll lock belongs to the lightbox's lifecycle, not to the handlers:
  // setting it inside openItem/closeItem left `overflow: hidden` stuck on
  // <body> if the component unmounted (e.g. route change) while open.
  useEffect(() => {
    if (selectedIndex === null) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [selectedIndex]);

  const nextItem = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!allItems.length) return;
    setSelectedIndex((prev) => (prev + 1) % allItems.length);
  }, [allItems.length]);

  const prevItem = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!allItems.length) return;
    setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
  }, [allItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeItem();
      if (e.key === 'ArrowRight') nextItem();
      if (e.key === 'ArrowLeft') prevItem();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeItem, nextItem, prevItem]);

  if (!allItems.length) return null;

  const renderTypeIcon = (type, size = 12) => {
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
        return <Camera size={size} />;
    }
  };

  const renderTypeLabel = (item) => {
    if (item.outlet) return item.outlet;
    switch (item.media_type) {
      case 'tv': return 'TV Broadcast';
      case 'newspaper': return 'Newspaper Feature';
      case 'facebook': return 'Community Spotlight';
      case 'youtube': return 'Video Feature';
      default: return 'Journey Moment';
    }
  };

  const renderGallery = (items) => (
    <div className="moments-gallery-strip">
      {items.map((item) => {
        const globalIndex = allItems.indexOf(item);
        const isVideo = item.media_type === 'tv' || item.media_type === 'youtube' || Boolean(item.media_url);
        const hasOutlet = Boolean(item.outlet);

        return (
          <div
            className={`moment-thumb-wrapper type-${item.media_type} ${isVideo ? 'has-video' : ''}`}
            key={item.id || globalIndex}
            onClick={() => openItem(globalIndex)}
            role="button"
            tabIndex={0}
            aria-label={`View ${item.title || item.caption}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openItem(globalIndex);
              }
            }}
          >
            <img
              src={item.image_url}
              alt={item.title || item.caption}
              className="moment-thumb-img"
              loading="lazy"
              onError={(e) => { e.currentTarget.src = asset('/images/fahmida_with_ddn.jpeg'); }}
              decoding="async"
            />

            <div className={`moment-card-badge type-${item.media_type}`}>
              {renderTypeIcon(item.media_type, 11)}
              <span>{hasOutlet ? item.outlet : renderTypeLabel(item)}</span>
            </div>

            {isVideo && (
              <div className="moment-video-play-hint" aria-hidden="true">
                <Play size={18} fill="currentColor" />
              </div>
            )}

            <div className="moment-hover-overlay">
              <div className="moment-hover-top">
                <span className="moment-hover-type">
                  {renderTypeIcon(item.media_type, 12)}
                  <span>{renderTypeLabel(item)}</span>
                </span>
                {item.date && <span className="moment-hover-date">{item.date}</span>}
              </div>
              <p className="moment-caption-preview">{item.title || item.caption}</p>
              <span className="moment-hover-action">
                {isVideo ? 'Watch Feature' : 'View Details'} &rarr;
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderMediaFeatures = () => (
    <div className="media-feature-list">
      {mediaMentions.map((item) => {
        const itemLink = item.external_link || item.media_url;
        const Card = itemLink ? 'a' : 'article';

        return (
          <Card
            className={`media-feature-card${itemLink ? ' media-feature-card-link' : ''}`}
            key={item.id}
            {...(itemLink ? { href: itemLink, target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <div className="media-feature-card-body">
              {item.image_url ? (
                <div className="media-feature-image-wrap">
                  <img className="media-feature-image" src={item.image_url} alt={item.title} loading="lazy" decoding="async" />
                  {item.media_type === 'youtube' && <span className="media-feature-play"><Play size={22} fill="currentColor" /></span>}
                </div>
              ) : (
                <div className="media-feature-image-placeholder">
                  <Linkedin size={34} />
                  <span>{item.outlet || 'LinkedIn Featured'}</span>
                </div>
              )}

              <div className="media-feature-card-content">
                <h3>{item.title}</h3>
                {itemLink ? (
                  <span className="media-feature-link" aria-label="Source link">
                    <span className="media-feature-link-text">{itemLink}</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </span>
                ) : (
                  <span className="media-feature-link-missing">Link not included in copied text</span>
                )}
                {item.outlet && <p className="media-feature-outlet">{item.outlet}</p>}
                {item.caption && <p className="media-feature-description">{item.caption}</p>}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <section className="moments-strip-section" aria-label="Key Mentions & Media Moments">
      {mediaMentions.length > 0 && (
        <div className="moments-gallery-section" aria-labelledby="media-mentions-title">
          <div className="moments-gallery-heading">
            <div className="moments-gallery-heading-main">
              <h2 className="section-title" id="media-mentions-title">Media Mentions</h2>
              <p className="moments-gallery-subtitle">
                Featured interviews, national & international daily coverage, television broadcasts, and tech community highlights.
              </p>
            </div>
            <span className="moments-gallery-count">{mediaMentions.length} features</span>
          </div>
          {renderMediaFeatures()}
        </div>
      )}

      {moments.length > 0 && (
        <div className="moments-gallery-section" aria-labelledby="key-moments-title">
          <div className="moments-gallery-heading">
            <div className="moments-gallery-heading-main">
              <h2 className="section-title" id="key-moments-title">Key Moments</h2>
              <p className="moments-gallery-subtitle">
                Travel, achievements, and memorable milestones from across the journey.
              </p>
            </div>
            <span className="moments-gallery-count">{moments.length} moments</span>
          </div>
          {renderGallery(moments)}
        </div>
      )}

      {/* Lightbox / Video Modal */}
      {typeof document !== 'undefined' && activeItem && createPortal(
        <div className="moment-lightbox-overlay" onClick={closeItem} role="dialog" aria-modal="true">
          <div className="moment-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={closeItem} aria-label="Close modal">
              <X size={22} />
            </button>

            {allItems.length > 1 && (
              <>
                <button className="lightbox-nav-btn prev-btn" onClick={prevItem} aria-label="Previous item">
                  <ChevronLeft size={24} />
                </button>
                <button className="lightbox-nav-btn next-btn" onClick={nextItem} aria-label="Next item">
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="lightbox-card-container">
              {/* Media Display: Video Embed OR Image */}
              <div className="lightbox-media-viewport">
                {activeItem.media_url && getYouTubeEmbedUrl(activeItem.media_url) ? (
                  <div className="lightbox-video-frame">
                    <iframe
                      src={getYouTubeEmbedUrl(activeItem.media_url)}
                      title={activeItem.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="lightbox-iframe"
                    />
                  </div>
                ) : (
                  <img
                    src={activeItem.image_url}
                    alt={activeItem.title || activeItem.caption}
                    className="lightbox-main-img"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>

              {/* Meta & Info Panel */}
              <div className="lightbox-info-panel">
                <div className="lightbox-meta-row">
                  <span className={`lightbox-type-pill type-${activeItem.media_type}`}>
                    {renderTypeIcon(activeItem.media_type, 13)}
                    <span>{renderTypeLabel(activeItem)}</span>
                  </span>

                  {activeItem.date && (
                    <span className="lightbox-date-pill">
                      <Calendar size={12} />
                      <span>{activeItem.date}</span>
                    </span>
                  )}
                </div>

                <h3 className="lightbox-item-title">
                  {activeItem.title || activeItem.caption}
                </h3>

                {activeItem.caption && activeItem.title && activeItem.caption !== activeItem.title && (
                  <p className="lightbox-description">
                    {activeItem.caption}
                  </p>
                )}

                {/* External Action Links (YouTube, Newspaper Portal, Facebook Page) */}
                <div className="lightbox-actions-row">
                  {activeItem.media_url && (
                    <a
                      href={activeItem.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lightbox-action-btn primary"
                    >
                      <Youtube size={15} />
                      <span>Watch on YouTube</span>
                      <ExternalLink size={13} />
                    </a>
                  )}

                  {activeItem.external_link && (
                    <a
                      href={activeItem.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lightbox-action-btn secondary"
                    >
                      {activeItem.media_type === 'facebook' ? (
                        <Share2 size={14} />
                      ) : activeItem.media_type === 'newspaper' ? (
                        <Newspaper size={14} />
                      ) : (
                        <ExternalLink size={14} />
                      )}
                      <span>
                        {activeItem.outlet
                          ? `Visit ${activeItem.outlet}`
                          : activeItem.media_type === 'facebook'
                          ? 'View on Facebook'
                          : 'Read Source Article'}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default MomentsStrip;
