import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink, Play, X, ChevronLeft, ChevronRight, Award, Building2 } from 'lucide-react';
import { parseMedia } from '../../src/utils/csvLoader';

const AwardCard = ({ award, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const media = React.useMemo(() => parseMedia(award.media), [award.media]);

  // Check if URL is a YouTube URL
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    const regExp = /^.*(youtu.be\/|youtube.com\/)/;
    return regExp.test(url);
  };

  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length >= 11 
      ? `https://www.youtube.com/embed/${match[2].substring(0, 11)}`
      : url;
  };

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length >= 11 
      ? `https://img.youtube.com/vi/${match[2].substring(0, 11)}/mqdefault.jpg`
      : null;
  };

  const openLightbox = (index) => {
    setCurrentMediaIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <>
      <article 
        className={`award-card ${isHovered ? 'hovered' : ''}`}
        style={{ animationDelay: `${index * 0.15}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail - supports both static images and embedded YouTube */}
        <div className="award-thumbnail">
          {award.thumbnail_url ? (
            isYouTubeUrl(award.thumbnail_url) ? (
              // Embedded YouTube Player
              <div className="youtube-embed-wrapper">
                <iframe
                  src={`${getYouTubeEmbedUrl(award.thumbnail_url)}?rel=0&modestbranding=1`}
                  title={award.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : (
              // Static Image
              <img 
                src={award.thumbnail_url} 
                alt={award.title}
                loading="lazy"
              />
            )
          ) : (
            <div className="thumbnail-placeholder">
              <Award size={48} />
            </div>
          )}
          {award.year && (
            <div className="year-badge">
              {award.year}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="award-content">
          {/* Title */}
          <h3 className="award-title">{award.title}</h3>

          {/* Organization - clickable link */}
          {award.organization_name && (
            <div className="award-organization">
              <Building2 size={14} className="org-icon" />
              {award.organization_url ? (
                <a 
                  href={award.organization_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="org-link"
                >
                  {award.organization_name}
                </a>
              ) : (
                <span className="org-name">{award.organization_name}</span>
              )}
            </div>
          )}

          {/* Description Button - opens popup like Abstract */}
          {award.description && (
            <button 
              className="description-button"
              onClick={() => setDescriptionOpen(true)}
            >
              <ExternalLink size={14} />
              <span>Details</span>
            </button>
          )}

          {/* Media Gallery - LinkedIn style small thumbnails */}
          {media.length > 0 && (
            <div className="media-gallery">
              <div className="media-thumbnails">
                {media.slice(0, 4).map((item, idx) => (
                  <div 
                    key={item.id} 
                    className={`media-thumb ${idx === 3 && media.length > 4 ? 'has-more' : ''}`}
                    onClick={() => openLightbox(idx)}
                  >
                    {item.media_type === 'youtube' ? (
                      <img 
                        src={getYouTubeThumbnail(item.media_url)} 
                        alt={`Media ${idx + 1}`}
                      />
                    ) : (
                      <img 
                        src={item.media_url} 
                        alt={`Media ${idx + 1}`}
                      />
                    )}
                    {item.media_type === 'youtube' && (
                      <div className="play-overlay">
                        <Play size={16} fill="white" />
                      </div>
                    )}
                    {idx === 3 && media.length > 4 && (
                      <div className="more-overlay">
                        +{media.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Tag */}
          {award.award_topics && (
            <div className="award-category-tag">
              <span className="category-hash">#</span> {award.award_topics.name}
            </div>
          )}
        </div>
      </article>

      {/* Description Modal - like Abstract popup */}
      {descriptionOpen && (
        <div className="description-modal-overlay" onClick={() => setDescriptionOpen(false)}>
          <div className="description-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDescriptionOpen(false)}>
              <X size={24} />
            </button>
            
            <div className="modal-header">
              <h3>{award.title}</h3>
              {award.organization_name && (
                <p className="modal-org">
                  <Building2 size={16} />
                  {award.organization_url ? (
                    <a href={award.organization_url} target="_blank" rel="noopener noreferrer">
                      {award.organization_name}
                    </a>
                  ) : (
                    <span>{award.organization_name}</span>
                  )}
                  {award.year && <span className="modal-year">, {award.year}</span>}
                </p>
              )}
            </div>

            <div className="modal-content">
              <p className="modal-description">{award.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Media */}
      {lightboxOpen && media.length > 0 && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <X size={24} />
            </button>
            
            {media.length > 1 && (
              <button className="lightbox-nav lightbox-prev" onClick={prevMedia}>
                <ChevronLeft size={32} />
              </button>
            )}

            <div className="lightbox-media">
              {media[currentMediaIndex].media_type === 'youtube' ? (
                <iframe
                  src={getYouTubeEmbedUrl(media[currentMediaIndex].media_url)}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img 
                  src={media[currentMediaIndex].media_url} 
                  alt={`Media ${currentMediaIndex + 1}`}
                />
              )}
            </div>

            {media.length > 1 && (
              <button className="lightbox-nav lightbox-next" onClick={nextMedia}>
                <ChevronRight size={32} />
              </button>
            )}

            {/* Thumbnail strip */}
            <div className="lightbox-thumbs">
              {media.map((item, idx) => (
                <div 
                  key={item.id}
                  className={`lightbox-thumb ${idx === currentMediaIndex ? 'active' : ''}`}
                  onClick={() => setCurrentMediaIndex(idx)}
                >
                  {item.media_type === 'youtube' ? (
                    <img src={getYouTubeThumbnail(item.media_url)} alt="" />
                  ) : (
                    <img src={item.media_url} alt="" />
                  )}
                </div>
              ))}
            </div>

            <div className="lightbox-counter">
              {currentMediaIndex + 1} / {media.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AwardCard;
