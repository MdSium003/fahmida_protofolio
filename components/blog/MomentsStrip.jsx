import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Camera, Tv, Newspaper, Share2, Youtube, Play, ExternalLink, X, ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { loadMomentsData, loadMediaMentionsData } from '../../src/utils/csvLoader';

/**
 * Extracts a clean YouTube embed URL from various formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
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
  const [activeFilter, setActiveFilter] = useState('all');
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
            image_url: item.image_url || item.image || '/wall/fahmida_with_ddn.jpeg',
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

  // Combine items and sort
  const allItems = useMemo(() => {
    // Interleave / prioritize media mentions and moments cleanly
    const combined = [...mediaMentions, ...moments];
    return combined;
  }, [mediaMentions, moments]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (activeFilter === 'media') {
      return mediaMentions;
    }
    if (activeFilter === 'moments') {
      return moments;
    }
    return allItems;
  }, [activeFilter, allItems, mediaMentions, moments]);

  const activeItem = selectedIndex !== null && filteredItems[selectedIndex] ? filteredItems[selectedIndex] : null;

  const openItem = (index) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeItem = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = '';
  }, []);

  const nextItem = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!filteredItems.length) return;
    setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  const prevItem = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!filteredItems.length) return;
    setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [filteredItems.length]);

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

  return (
    <section className="moments-strip-section" aria-label="Key Moments & Media Mentions">
      <div className="section-header-compact moments-section-header">
        <div className="moments-title-wrap">
          <div className="moments-badge-pill">
            <Sparkles size={13} />
            <span>Press, TV & Photo Journal</span>
          </div>
          <h2 className="section-title">Key Moments & Media Mentions</h2>
          <p className="moments-header-desc">
            Media features in national newspapers, television broadcasts, community spotlights, and memorable journey milestones.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="moments-filter-tabs" role="tablist">
          <button
            type="button"
            className={`moments-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('all'); setSelectedIndex(null); }}
            role="tab"
            aria-selected={activeFilter === 'all'}
          >
            All Highlights ({allItems.length})
          </button>
          {mediaMentions.length > 0 && (
            <button
              type="button"
              className={`moments-tab-btn ${activeFilter === 'media' ? 'active' : ''}`}
              onClick={() => { setActiveFilter('media'); setSelectedIndex(null); }}
              role="tab"
              aria-selected={activeFilter === 'media'}
            >
              Media & TV ({mediaMentions.length})
            </button>
          )}
          {moments.length > 0 && (
            <button
              type="button"
              className={`moments-tab-btn ${activeFilter === 'moments' ? 'active' : ''}`}
              onClick={() => { setActiveFilter('moments'); setSelectedIndex(null); }}
              role="tab"
              aria-selected={activeFilter === 'moments'}
            >
              Moments ({moments.length})
            </button>
          )}
        </div>
      </div>

      {/* Grid Display */}
      <div className="moments-gallery-strip">
        {filteredItems.map((item, idx) => {
          const isVideo = item.media_type === 'tv' || item.media_type === 'youtube' || Boolean(item.media_url);
          const hasOutlet = Boolean(item.outlet);

          return (
            <div
              className={`moment-thumb-wrapper type-${item.media_type} ${isVideo ? 'has-video' : ''}`}
              key={item.id || idx}
              onClick={() => openItem(idx)}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.title || item.caption}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openItem(idx);
                }
              }}
            >
              <img
                src={item.image_url}
                alt={item.title || item.caption}
                className="moment-thumb-img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/wall/fahmida_with_ddn.jpeg';
                }}
              />

              {/* Top Tag Badge */}
              <div className={`moment-card-badge type-${item.media_type}`}>
                {renderTypeIcon(item.media_type, 11)}
                <span>{hasOutlet ? item.outlet : renderTypeLabel(item)}</span>
              </div>

              {/* Center Play Icon for Video / TV */}
              {isVideo && (
                <div className="moment-video-play-hint" aria-hidden="true">
                  <Play size={18} fill="currentColor" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="moment-hover-overlay">
                <div className="moment-hover-top">
                  <span className="moment-hover-type">
                    {renderTypeIcon(item.media_type, 12)}
                    <span>{renderTypeLabel(item)}</span>
                  </span>
                  {item.date && (
                    <span className="moment-hover-date">{item.date}</span>
                  )}
                </div>

                <p className="moment-caption-preview">
                  {item.title || item.caption}
                </p>

                <span className="moment-hover-action">
                  {isVideo ? 'Watch Feature' : 'View Details'} &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Video Modal */}
      {typeof document !== 'undefined' && activeItem && createPortal(
        <div className="moment-lightbox-overlay" onClick={closeItem} role="dialog" aria-modal="true">
          <div className="moment-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={closeItem} aria-label="Close modal">
              <X size={22} />
            </button>

            {filteredItems.length > 1 && (
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
