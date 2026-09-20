import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, BookOpen, Calendar, ExternalLink, Github, Linkedin, 
  Globe, ChevronLeft, ChevronRight, MapPin, Clock, Tag 
} from 'lucide-react';
import { parseLinks, parseMedia } from '../../src/utils/csvLoader';
import BlogContentRenderer from './BlogContentRenderer';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length >= 11
    ? `https://www.youtube-nocookie.com/embed/${match[2].substring(0, 11)}`
    : url;
};

const BlogDetailModal = ({ story, onClose }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  // The reading bar is written straight to the DOM through a ref. Holding
  // it in state re-rendered this entire modal on every scroll event of a
  // long article, for a value only one 3px element consumes.
  const progressBarRef = useRef(null);

  const links = React.useMemo(() => parseLinks(story?.links), [story?.links]);
  const parsedMedia = React.useMemo(() => parseMedia(story?.media), [story?.media]);

  // Combine media items
  const mediaList = React.useMemo(() => {
    if (!story) return [];
    const items = [];
    const seenUrls = new Set();

    // Primary thumbnail if image
    if (story.thumbnail_url && !seenUrls.has(story.thumbnail_url)) {
      items.push({
        id: 'primary-thumb',
        media_type: story.thumbnail_url.includes('youtube') || story.thumbnail_url.includes('youtu.be') ? 'youtube' : 'image',
        media_url: story.thumbnail_url,
        title: story.title
      });
      seenUrls.add(story.thumbnail_url);
    }

    // Parsed media list
    parsedMedia.forEach((m, idx) => {
      if (m && m.media_url && !seenUrls.has(m.media_url)) {
        seenUrls.add(m.media_url);
        items.push({
          id: m.id || `media-${idx}`,
          media_type: m.media_type || (m.media_url.includes('youtube') ? 'youtube' : 'image'),
          media_url: m.media_url,
          title: m.title || `Media ${idx + 1}`
        });
      }
    });

    return items;
  }, [story, parsedMedia]);

  // Lock scroll and handle escape
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && mediaList.length > 1) {
        setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
      }
      if (e.key === 'ArrowLeft' && mediaList.length > 1) {
        setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, mediaList.length]);

  if (!story) return null;

  const currentMedia = mediaList[activeMediaIndex] || mediaList[0] || null;
  const isCurrentVideo = currentMedia?.media_type === 'youtube' || currentMedia?.media_url.includes('youtube') || currentMedia?.media_url.includes('youtu.be');

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const maxScroll = scrollHeight - clientHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${ratio})`;
    }
  };

  const getLinkIcon = (type) => {
    switch (type) {
      case 'github': return <Github size={14} />;
      case 'linkedin': return <Linkedin size={14} />;
      default: return <ExternalLink size={14} />;
    }
  };

  return (
    <div className="blog-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="blog-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Reading Progress Bar */}
        <div className="modal-reading-progress-track" aria-hidden="true">
          <div 
            className="modal-reading-progress-bar"
            ref={progressBarRef}
          />
        </div>

        {/* Pinned Close Button */}
        <button className="blog-modal-close-btn" onClick={onClose} aria-label="Close story">
          <X size={20} />
        </button>

        <div className="blog-modal-scrollable" onScroll={handleScroll}>
          
          {/* Modal Header */}
          <div className="blog-modal-header">
            <div className="blog-modal-badges">
              {story.category && (
                <span className="blog-modal-badge category-badge">
                  <Tag size={12} /> {story.category}
                </span>
              )}
              {story.location && (
                <span className="blog-modal-badge location-badge">
                  <MapPin size={12} /> {story.location}
                </span>
              )}
              {story.published_date && (
                <span className="blog-modal-badge date-badge">
                  <Calendar size={12} /> {story.published_date}
                </span>
              )}
              {story.read_time && (
                <span className="blog-modal-badge time-badge">
                  <Clock size={12} /> {story.read_time}
                </span>
              )}
            </div>

            <h2 className="blog-modal-title">{story.title}</h2>
          </div>

          {/* Media Showcase Frame */}
          {mediaList.length > 0 && (
            <div className="blog-modal-media-showcase">
              <div className="blog-modal-media-frame">
                {isCurrentVideo ? (
                  <div className="blog-modal-video-box">
                    <iframe
                      src={`${getYouTubeEmbedUrl(currentMedia.media_url)}?rel=0&modestbranding=1`}
                      title={story.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="blog-modal-img-box">
                    <img 
                      src={currentMedia.media_url} 
                      alt={story.title}
                      className="blog-modal-main-img"
loading="lazy"
decoding="async"/>
                  </div>
                )}

                {/* Slideshow Controls */}
                {mediaList.length > 1 && (
                  <>
                    <button 
                      className="blog-media-nav prev"
                      onClick={() => setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length)}
                      aria-label="Previous item"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      className="blog-media-nav next"
                      onClick={() => setActiveMediaIndex((prev) => (prev + 1) % mediaList.length)}
                      aria-label="Next item"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Media Thumbnails Strip */}
              {mediaList.length > 1 && (
                <div className="blog-modal-thumb-strip">
                  {mediaList.map((item, idx) => {
                    const isItemVideo = item.media_type === 'youtube' || item.media_url.includes('youtube');
                    return (
                      <button 
                        key={idx}
                        className={`blog-thumb-btn ${idx === activeMediaIndex ? 'active' : ''}`}
                        onClick={() => setActiveMediaIndex(idx)}
                      >
                        {isItemVideo ? (
                          <div className="thumb-video-indicator">
                            <Play size={12} fill="currentColor" />
                          </div>
                        ) : (
                          <img src={item.media_url} alt="" className="thumb-mini-img" loading="lazy" decoding="async"/>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Full Narrative Content with Rich Headings, Inline Figures & Blockquotes */}
          <div className="blog-modal-body-section">
            <BlogContentRenderer content={story.content || story.description} />
          </div>

          {/* External Links & References */}
          {links.length > 0 && (
            <div className="blog-modal-links-section">
              <h4 className="blog-links-title">References & External Links</h4>
              <div className="blog-links-wrap">
                {links.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="blog-source-link"
                  >
                    {getLinkIcon(link.type)}
                    <span>{link.label || 'View Source'}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailModal;
