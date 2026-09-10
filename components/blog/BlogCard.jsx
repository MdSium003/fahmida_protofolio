import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  FileText, ExternalLink, Play, X, ChevronLeft, ChevronRight, 
  Github, Linkedin, Globe, Calendar, Image, Link2
} from 'lucide-react';
import { parseLinks, parseMedia } from '../../src/utils/csvLoader';

const BlogCard = ({ blog, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const links = React.useMemo(() => parseLinks(blog.links), [blog.links]);
  const media = React.useMemo(() => parseMedia(blog.media), [blog.media]);

  // YouTube helpers
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYouTubeEmbedUrl = (url) => {
    const id = getYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : url;
  };

  const getYouTubeThumbnail = (url) => {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
  };

  // Link icon mapper
  const getLinkIcon = (type) => {
    switch (type) {
      case 'github': return <Github size={14} />;
      case 'linkedin': return <Linkedin size={14} />;
      case 'medium': return <FileText size={14} />;
      case 'dev_to': return <Globe size={14} />;
      case 'hashnode': return <Globe size={14} />;
      default: return <ExternalLink size={14} />;
    }
  };

  const getLinkColor = (type) => {
    switch (type) {
      case 'github': return 'blog-link-github';
      case 'linkedin': return 'blog-link-linkedin';
      case 'medium': return 'blog-link-medium';
      case 'dev_to': return 'blog-link-devto';
      case 'hashnode': return 'blog-link-hashnode';
      default: return 'blog-link-external';
    }
  };

  // Lightbox handlers - using portal to render outside card
  const openLightbox = (idx) => {
    setCurrentMediaIndex(idx);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextMedia = (e) => {
    e.stopPropagation();
    setCurrentMediaIndex((p) => (p + 1) % media.length);
  };

  const prevMedia = (e) => {
    e.stopPropagation();
    setCurrentMediaIndex((p) => (p - 1 + media.length) % media.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setCurrentMediaIndex((p) => (p + 1) % media.length);
      if (e.key === 'ArrowLeft') setCurrentMediaIndex((p) => (p - 1 + media.length) % media.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, media.length]);

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Separate media types
  const youtubeMedia = media.filter(m => m.media_type === 'youtube');
  const imageMedia = media.filter(m => m.media_type === 'image');

  const descriptionLimit = 150;
  const isLongDescription = blog.description && blog.description.length > descriptionLimit;

  // Lightbox rendered via portal to avoid overflow:hidden clipping
  const renderLightbox = () => {
    if (!lightboxOpen || media.length === 0) return null;

    const currentItem = media[currentMediaIndex];

    return ReactDOM.createPortal(
      <div className="blog-lightbox-overlay" onClick={closeLightbox}>
        <div className="blog-lightbox-content" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button className="blog-lightbox-close" onClick={closeLightbox}>
            <X size={28} />
          </button>
          
          {/* Prev Button */}
          {media.length > 1 && (
            <button className="blog-lightbox-nav blog-lightbox-prev" onClick={prevMedia}>
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Main Media Area */}
          <div className="blog-lightbox-media">
            {currentItem.media_type === 'youtube' ? (
              <div className="blog-lightbox-video-container">
                <iframe
                  key={currentItem.id}
                  src={`${getYouTubeEmbedUrl(currentItem.media_url)}?autoplay=1&rel=0&modestbranding=1`}
                  title={currentItem.caption || 'YouTube video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    width: '80vw',
                    maxWidth: '960px',
                    height: '55vh',
                    minHeight: '300px',
                    borderRadius: '12px',
                    border: 'none',
                    display: 'block'
                  }}
                />
                <a 
                  href={currentItem.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-open-youtube-btn"
                >
                  <Play size={14} />
                  Open in YouTube
                </a>
              </div>
            ) : (
              <img 
                key={currentItem.id}
                src={currentItem.media_url} 
                alt={currentItem.caption || `Media ${currentMediaIndex + 1}`}
                style={{
                  maxWidth: '85vw',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  display: 'block'
                }}
              />
            )}
          </div>

          {/* Caption */}
          {currentItem.caption && (
            <div className="blog-lightbox-caption">
              {currentItem.caption}
            </div>
          )}

          {/* Next Button */}
          {media.length > 1 && (
            <button className="blog-lightbox-nav blog-lightbox-next" onClick={nextMedia}>
              <ChevronRight size={32} />
            </button>
          )}

          {/* Thumbnail strip */}
          {media.length > 1 && (
            <div className="blog-lightbox-thumbs">
              {media.map((item, idx) => (
                <div 
                  key={item.id}
                  className={`blog-lightbox-thumb ${idx === currentMediaIndex ? 'active' : ''}`}
                  onClick={() => setCurrentMediaIndex(idx)}
                >
                  {item.media_type === 'youtube' ? (
                    <>
                      <img src={getYouTubeThumbnail(item.media_url)} alt="" />
                      <div className="blog-thumb-play-icon"><Play size={10} fill="white" /></div>
                    </>
                  ) : (
                    <img src={item.media_url} alt="" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Counter */}
          <div className="blog-lightbox-counter">
            {currentMediaIndex + 1} / {media.length}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <article 
        className={`blog-card ${isHovered ? 'hovered' : ''}`}
        style={{ animationDelay: `${index * 0.12}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div className="blog-thumbnail">
          {blog.thumbnail_url ? (
            <img 
              src={blog.thumbnail_url} 
              alt={blog.title}
              loading="lazy"
            />
          ) : (
            <div className="blog-thumbnail-placeholder">
              <FileText size={48} />
            </div>
          )}
          <div className="blog-thumbnail-overlay">
            <div className="blog-date-badge">
              <Calendar size={12} />
              <span>{formatDate(blog.published_date)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="blog-content">
          {/* Title */}
          <h3 className="blog-title">{blog.title}</h3>

          {/* Description */}
          {blog.description && (
            <div className="blog-description">
              <p>
                {expanded || !isLongDescription
                  ? blog.description
                  : `${blog.description.substring(0, descriptionLimit)}...`}
              </p>
              {isLongDescription && (
                <button 
                  className="blog-read-more" 
                  onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                >
                  {expanded ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
          )}

          {/* Media Gallery Section */}
          {media.length > 0 && (
            <div className="blog-media-section">
              {/* YouTube Videos Preview */}
              {youtubeMedia.length > 0 && (
                <div className="blog-video-gallery">
                  <div className="blog-section-label">
                    <Play size={14} />
                    <span>Videos ({youtubeMedia.length})</span>
                  </div>
                  <div className="blog-video-grid">
                    {youtubeMedia.slice(0, 2).map((vid, idx) => (
                      <div 
                        key={vid.id} 
                        className="blog-video-thumb"
                        onClick={() => openLightbox(media.indexOf(vid))}
                      >
                        <img 
                          src={getYouTubeThumbnail(vid.media_url)} 
                          alt={vid.caption || `Video ${idx + 1}`}
                          loading="lazy"
                        />
                        <div className="blog-play-overlay">
                          <div className="blog-play-btn">
                            <Play size={20} fill="white" />
                          </div>
                        </div>
                        {vid.caption && (
                          <div className="blog-media-caption">{vid.caption}</div>
                        )}
                      </div>
                    ))}
                    {youtubeMedia.length > 2 && (
                      <div 
                        className="blog-video-thumb blog-more-videos"
                        onClick={() => openLightbox(media.indexOf(youtubeMedia[2]))}
                      >
                        <img 
                          src={getYouTubeThumbnail(youtubeMedia[2].media_url)} 
                          alt="More videos"
                          loading="lazy"
                        />
                        <div className="blog-more-overlay">
                          +{youtubeMedia.length - 2} more
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Image Gallery */}
              {imageMedia.length > 0 && (
                <div className="blog-image-gallery">
                  <div className="blog-section-label">
                    <Image size={14} />
                    <span>Photos ({imageMedia.length})</span>
                  </div>
                  <div className="blog-image-strip">
                    {imageMedia.slice(0, 4).map((img, idx) => (
                      <div 
                        key={img.id} 
                        className={`blog-img-thumb ${idx === 3 && imageMedia.length > 4 ? 'has-more' : ''}`}
                        onClick={() => openLightbox(media.indexOf(img))}
                      >
                        <img 
                          src={img.media_url} 
                          alt={img.caption || `Photo ${idx + 1}`}
                          loading="lazy"
                        />
                        {idx === 3 && imageMedia.length > 4 && (
                          <div className="blog-more-overlay">
                            +{imageMedia.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Links Section */}
          {links.length > 0 && (
            <div className="blog-links">
              <div className="blog-section-label">
                <Link2 size={14} />
                <span>Resources</span>
              </div>
              <div className="blog-links-grid">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`blog-link-btn ${getLinkColor(link.type)}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getLinkIcon(link.type)}
                    <span>{link.label || link.type}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Lightbox - rendered via portal */}
      {renderLightbox()}
    </>
  );
};

export default BlogCard;
