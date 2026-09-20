import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const AwardMediaLightbox = ({ media, currentIndex, onClose, onIndexChange }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndexChange((currentIndex + 1) % media.length);
      if (e.key === 'ArrowLeft') onIndexChange((currentIndex - 1 + media.length) % media.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, media.length, onClose, onIndexChange]);

  if (!media || media.length === 0 || currentIndex < 0 || currentIndex >= media.length) {
    return null;
  }

  const currentItem = media[currentIndex];

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length >= 11 
      ? `https://www.youtube-nocookie.com/embed/${match[2].substring(0, 11)}`
      : url;
  };

  const getYouTubeThumbnail = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length >= 11 
      ? `https://img.youtube.com/vi/${match[2].substring(0, 11)}/mqdefault.jpg`
      : url;
  };

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close Lightbox">
          <X size={24} />
        </button>

        {media.length > 1 && (
          <button 
            className="lightbox-nav lightbox-prev" 
            onClick={() => onIndexChange((currentIndex - 1 + media.length) % media.length)}
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <div className="lightbox-media">
          {currentItem.media_type === 'youtube' ? (
            <iframe
              src={`${getYouTubeEmbedUrl(currentItem.media_url)}?autoplay=1&rel=0`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img 
              src={currentItem.media_url} 
              alt={`Media ${currentIndex + 1}`}
loading="lazy"
decoding="async"/>
          )}
        </div>

        {media.length > 1 && (
          <button 
            className="lightbox-nav lightbox-next" 
            onClick={() => onIndexChange((currentIndex + 1) % media.length)}
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Thumbnail strip */}
        {media.length > 1 && (
          <div className="lightbox-thumbs">
            {media.map((item, idx) => (
              <button 
                key={item.id || idx}
                className={`lightbox-thumb ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => onIndexChange(idx)}
                type="button"
              >
                <img 
                  src={item.media_type === 'youtube' ? getYouTubeThumbnail(item.media_url) : item.media_url} 
                  alt=""
loading="lazy"
decoding="async"/>
              </button>
            ))}
          </div>
        )}

        <div className="lightbox-counter">
          {currentIndex + 1} / {media.length}
        </div>
      </div>
    </div>
  );
};

export default AwardMediaLightbox;
