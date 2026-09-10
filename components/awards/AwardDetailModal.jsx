import React, { useEffect, useState, useMemo } from 'react';
import { X, Building2, ExternalLink, Calendar, Tag, ChevronLeft, ChevronRight, Play, Image as ImageIcon } from 'lucide-react';
import { cleanAwardTitle } from './FeaturedAwards';
import { parseMedia } from '../../src/utils/csvLoader';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length >= 11
    ? `https://www.youtube.com/embed/${match[2].substring(0, 11)}`
    : url;
};

const AwardDetailModal = ({ award, onClose, onOpenMedia, media = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Combine primary thumbnail and supporting media items
  const combinedMedia = useMemo(() => {
    if (!award) return [];
    const items = [];
    const seenUrls = new Set();

    // 1. Primary thumbnail
    if (award.thumbnail_url && !award.thumbnail_url.includes('example.com')) {
      const isYt = award.thumbnail_url.includes('youtube') || award.thumbnail_url.includes('youtu.be');
      items.push({
        id: 'primary-thumb',
        media_type: isYt ? 'youtube' : 'image',
        media_url: award.thumbnail_url
      });
      seenUrls.add(award.thumbnail_url);
    }

    // 2. Supporting media items
    const parsed = Array.isArray(media) && media.length > 0 ? media : parseMedia(award.media);
    parsed.forEach((item, idx) => {
      if (item && item.media_url && !item.media_url.includes('example.com') && !seenUrls.has(item.media_url)) {
        seenUrls.add(item.media_url);
        const isYt = item.media_type === 'youtube' || item.media_url.includes('youtube') || item.media_url.includes('youtu.be');
        items.push({
          id: item.id || `media-${idx}`,
          media_type: isYt ? 'youtube' : 'image',
          media_url: item.media_url
        });
      }
    });

    return items;
  }, [award, media]);

  // Reset index when award changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [award]);

  // Lock body scroll and handle keyboard events
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && combinedMedia.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % combinedMedia.length);
      }
      if (e.key === 'ArrowLeft' && combinedMedia.length > 1) {
        setCurrentIndex((prev) => (prev - 1 + combinedMedia.length) % combinedMedia.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, combinedMedia.length]);

  const currentItem = combinedMedia[currentIndex] || null;
  const isCurrentVideo = currentItem?.media_type === 'youtube';

  // Auto-cycle through images unless paused or current item is a video
  useEffect(() => {
    if (combinedMedia.length <= 1 || isPaused || isCurrentVideo) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % combinedMedia.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [combinedMedia.length, isPaused, isCurrentVideo]);

  if (!award) return null;

  const cleanTitle = cleanAwardTitle(award.title);

  // Parse description lines
  const descriptionLines = award.description
    ? String(award.description).split('\n').filter(line => line.trim().length > 0)
    : [];

  const [readingProgress, setReadingProgress] = useState(0);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      setReadingProgress(progress);
    } else {
      setReadingProgress(0);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + combinedMedia.length) % combinedMedia.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % combinedMedia.length);
  };

  return (
    <div className="award-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="award-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Reading Progress Bar */}
        <div className="modal-reading-progress-track" aria-hidden="true">
          <div 
            className="modal-reading-progress-bar" 
            style={{ width: `${readingProgress}%` }} 
          />
        </div>

        {/* Pinned Close Button */}
        <button className="award-modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Unified Scrollable Body */}
        <div className="award-modal-scrollable" onScroll={handleScroll}>
          
          {/* Header & Badges */}
          <div className="award-modal-header">
            <div className="award-modal-badges">
              {award.year && (
                <span className="award-modal-badge year-badge">
                  <Calendar size={13} /> {award.year}
                </span>
              )}
              {award.topic && (
                <span className="award-modal-badge category-badge">
                  <Tag size={13} /> {award.topic}
                </span>
              )}
            </div>

            <h2 className="award-modal-title">{cleanTitle || award.title}</h2>

            {award.organization_name && (
              <div className="award-modal-org">
                <Building2 size={16} className="org-icon" />
                {award.organization_url ? (
                  <a 
                    href={award.organization_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="org-link"
                  >
                    {award.organization_name}
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <span>{award.organization_name}</span>
                )}
              </div>
            )}
          </div>

          {/* Top Unified Image & Video Showcase */}
          {combinedMedia.length > 0 && (
            <div 
              className="award-modal-showcase"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="award-modal-media-frame">
                {isCurrentVideo ? (
                  <div className="award-modal-video-container">
                    <iframe
                      src={`${getYouTubeEmbedUrl(currentItem.media_url)}?rel=0&modestbranding=1`}
                      title={cleanTitle}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="award-modal-slideshow-container">
                    {combinedMedia.map((item, idx) => {
                      if (item.media_type === 'youtube') return null;
                      const isActive = idx === currentIndex;
                      return (
                        <div
                          key={item.id || idx}
                          className={`award-modal-slide-wrapper ${isActive ? 'active' : ''}`}
                        >
                          <div 
                            className="award-modal-slide-bg" 
                            style={{ backgroundImage: `url(${item.media_url})` }} 
                            aria-hidden="true"
                          />
                          <img
                            src={item.media_url}
                            alt={`${cleanTitle} ${idx + 1}`}
                            className="award-modal-slide-img"
                            loading={idx === 0 ? 'eager' : 'lazy'}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Left/Right Navigation Arrows if multiple media */}
                {combinedMedia.length > 1 && (
                  <>
                    <button
                      className="modal-showcase-nav prev"
                      onClick={handlePrev}
                      aria-label="Previous media"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="modal-showcase-nav next"
                      onClick={handleNext}
                      aria-label="Next media"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Floating Bottom Media Bar (Dots / Indicator) */}
                {combinedMedia.length > 1 && (
                  <div className="modal-showcase-controls">
                    <div className="modal-showcase-dots">
                      {combinedMedia.map((item, idx) => (
                        <button
                          key={item.id || idx}
                          className={`modal-showcase-dot ${idx === currentIndex ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(idx);
                          }}
                          aria-label={`Go to media ${idx + 1}`}
                          title={item.media_type === 'youtube' ? 'Video' : 'Photo'}
                        >
                          {item.media_type === 'youtube' ? (
                            <Play size={10} fill="currentColor" />
                          ) : (
                            <span className="dot-circle" />
                          )}
                        </button>
                      ))}
                    </div>
                    <span className="modal-showcase-counter">
                      {currentIndex + 1} / {combinedMedia.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {descriptionLines.length > 0 && (
            <div className="award-modal-description">
              <h4 className="section-label">Overview & Impact</h4>
              {descriptionLines.map((line, idx) => {
                const trimmed = line.trim();
                const isBullet = trimmed.startsWith('->') || trimmed.startsWith('-') || trimmed.startsWith('•');
                const cleanLine = trimmed.replace(/^(\->|\-|•)\s*/, '');
                
                return isBullet ? (
                  <div key={idx} className="description-bullet">
                    <span className="bullet-dot" />
                    <span>{cleanLine}</span>
                  </div>
                ) : (
                  <p key={idx} className="description-para">{line}</p>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AwardDetailModal;

