import React, { useEffect, useState, useMemo } from 'react';
import { 
  X, User, Calendar, Tag, ChevronLeft, ChevronRight, 
  Play, BookOpen, FileText, Code2, ExternalLink, Award, Sparkles 
} from 'lucide-react';
import { parseMedia } from '../../src/utils/csvLoader';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length >= 11
    ? `https://www.youtube.com/embed/${match[2].substring(0, 11)}`
    : url;
};

const ResearchDetailModal = ({ project, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Combine primary thumbnail and all parsed media items
  const combinedMedia = useMemo(() => {
    if (!project) return [];
    const items = [];
    const seenUrls = new Set();

    // 1. Primary thumbnail if valid
    if (project.thumbnail_url && !project.thumbnail_url.includes('example.com')) {
      const isYt = project.thumbnail_url.includes('youtube') || project.thumbnail_url.includes('youtu.be');
      items.push({
        id: 'primary-thumb',
        media_type: isYt ? 'youtube' : 'image',
        media_url: project.thumbnail_url
      });
      seenUrls.add(project.thumbnail_url);
    }

    // 2. Parsed media list
    const parsed = Array.isArray(project.mediaList) && project.mediaList.length > 0 
      ? project.mediaList 
      : parseMedia(project.media);

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

    // 3. Graceful fallback if no valid media or thumbnail was provided
    if (items.length === 0) {
      const fallbackUrl = project.displayImg && !project.displayImg.includes('example.com')
        ? project.displayImg
        : '/wall/research_1.jpg';
      items.push({
        id: 'fallback-media',
        media_type: 'image',
        media_url: fallbackUrl
      });
    }

    return items;
  }, [project]);

  // Reset index when project changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [project]);

  // Lock body scroll & handle keyboard events
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
    }, 3500);
    return () => clearInterval(interval);
  }, [combinedMedia.length, isPaused, isCurrentVideo]);

  if (!project) return null;

  // Parse description lines for bullet parsing
  const descriptionLines = project.description
    ? String(project.description).split('\n').filter(line => line.trim().length > 0)
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
    <div className="research-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="research-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Reading Progress Bar */}
        <div className="modal-reading-progress-track" aria-hidden="true">
          <div 
            className="modal-reading-progress-bar" 
            style={{ width: `${readingProgress}%` }} 
          />
        </div>

        {/* Pinned Floating Close Button */}
        <button className="research-modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Unified Smooth Scrollable Body */}
        <div className="research-modal-scrollable" onScroll={handleScroll}>
          
          {/* Modal Header */}
          <div className="research-modal-header">
            <div className="research-modal-badges">
              {project.status && (
                <span className={`research-modal-badge status-badge status-${project.status.toLowerCase()}`}>
                  <Sparkles size={12} /> {project.status}
                </span>
              )}
              {project.year && (
                <span className="research-modal-badge year-badge">
                  <Calendar size={12} /> {project.year}
                </span>
              )}
              {project.kicker && (
                <span className="research-modal-badge topic-badge">
                  <Tag size={12} /> {project.kicker}
                </span>
              )}
            </div>

            <h2 className="research-modal-title">{project.title}</h2>

            {/* Authors & Awards Row */}
            <div className="research-modal-meta">
              {project.authorsList && project.authorsList.length > 0 && (
                <div className="research-meta-authors">
                  <User size={14} className="meta-icon" />
                  <span>{project.authorsList.map(a => a.name).join(' • ')}</span>
                </div>
              )}
              {project.award && (
                <div className="research-meta-award">
                  <Award size={14} className="meta-icon" />
                  <span>{project.award}</span>
                </div>
              )}
            </div>
          </div>

          {/* Top Unified Image & Video Showcase */}
          {combinedMedia.length > 0 && (
            <div 
              className="research-modal-showcase"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="research-modal-media-frame">
                {isCurrentVideo ? (
                  <div className="research-modal-video-container">
                    <iframe
                      src={`${getYouTubeEmbedUrl(currentItem.media_url)}?rel=0&modestbranding=1`}
                      title={project.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="research-modal-slideshow-container">
                    {combinedMedia.map((item, idx) => {
                      if (item.media_type === 'youtube') return null;
                      const isActive = idx === currentIndex;
                      return (
                        <div
                          key={item.id || idx}
                          className={`research-modal-slide-wrapper ${isActive ? 'active' : ''}`}
                        >
                          <div 
                            className="research-modal-slide-bg" 
                            style={{ backgroundImage: `url(${item.media_url})` }} 
                            aria-hidden="true"
                          />
                          <img
                            src={item.media_url}
                            alt={`${project.title} ${idx + 1}`}
                            className="research-modal-slide-img"
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
                      className="research-showcase-nav prev"
                      onClick={handlePrev}
                      aria-label="Previous media"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="research-showcase-nav next"
                      onClick={handleNext}
                      aria-label="Next media"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Floating Bottom Media Bar (Dots / Indicator) */}
                {combinedMedia.length > 1 && (
                  <div className="research-showcase-controls">
                    <div className="research-showcase-dots">
                      {combinedMedia.map((item, idx) => (
                        <button
                          key={item.id || idx}
                          className={`research-showcase-dot ${idx === currentIndex ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(idx);
                          }}
                          aria-label={`Go to media ${idx + 1}`}
                          title={item.media_type === 'youtube' ? 'Video' : 'Photo'}
                        >
                          {item.media_type === 'youtube' ? (
                            <Play size={9} fill="currentColor" />
                          ) : (
                            <span className="dot-circle" />
                          )}
                        </button>
                      ))}
                    </div>
                    <span className="research-showcase-counter">
                      {currentIndex + 1} / {combinedMedia.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Abstract Section */}
          {project.abstract && (
            <div className="research-modal-section">
              <h4 className="section-label">
                <BookOpen size={14} />
                <span>Abstract & Research Scope</span>
              </h4>
              <p className="section-abstract-text">{project.abstract}</p>
            </div>
          )}

          {/* Key Methodology / Bullet Points */}
          {descriptionLines.length > 0 && (
            <div className="research-modal-section">
              <h4 className="section-label">
                <FileText size={14} />
                <span>Methodology & Key Findings</span>
              </h4>
              <div className="section-bullets-list">
                {descriptionLines.map((line, idx) => {
                  const trimmed = line.trim();
                  const isBullet = trimmed.startsWith('->') || trimmed.startsWith('-') || trimmed.startsWith('•');
                  const cleanLine = trimmed.replace(/^(\->|\-|•)\s*/, '');

                  return isBullet ? (
                    <div key={idx} className="research-bullet-item">
                      <span className="bullet-dot" />
                      <span>{cleanLine}</span>
                    </div>
                  ) : (
                    <p key={idx} className="research-body-para">{line}</p>
                  );
                })}
              </div>
            </div>
          )}

          {/* Topics Tag Cloud */}
          {project.topicsList && project.topicsList.length > 0 && (
            <div className="research-modal-section">
              <div className="research-tags-cloud">
                {project.topicsList.map((topic, i) => (
                  <span key={i} className="research-tag-chip">#{topic}</span>
                ))}
              </div>
            </div>
          )}

          {/* Action Links (attached at the end of the scrollable document) */}
          {project.linksList && project.linksList.length > 0 && (
            <div className="research-modal-actions-section">
              <h4 className="section-label">
                <ExternalLink size={14} />
                <span>Resources & Links</span>
              </h4>
              <div className="research-actions-row">
                {project.linksList.map((link, i) => {
                  const isCode = link.type === 'code' || (link.label && link.label.toLowerCase().includes('code'));
                  const isVideo = link.type === 'video' || (link.label && link.label.toLowerCase().includes('video'));
                  const isPrimary = !isCode && !isVideo;

                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`research-modal-btn ${isPrimary ? 'primary-btn' : 'secondary-btn'}`}
                    >
                      {isCode ? (
                        <Code2 size={14} />
                      ) : isVideo ? (
                        <Play size={14} />
                      ) : (
                        <FileText size={14} />
                      )}
                      <span>{link.label || (isCode ? 'Source Code' : isVideo ? 'Video Demo' : 'Read Paper')}</span>
                      <ExternalLink size={12} className="ext-icon" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResearchDetailModal;
