import React, { useState, useEffect } from 'react';

const AutoImageLoop = ({ mediaList, fallbackImg, title, interval = 4000 }) => {
  const images = React.useMemo(() => {
    const list = (mediaList || [])
      .filter(m => m.media_type === 'image' || !m.media_type || m.media_url?.endsWith('.jpg') || m.media_url?.endsWith('.jpeg') || m.media_url?.endsWith('.png'))
      .map(m => m.media_url || m);

    if (list.length === 0 && fallbackImg && !fallbackImg.includes('example.com')) {
      return [fallbackImg];
    }
    return list.length > 0 ? list : ['/wall/research_1.jpg'];
  }, [mediaList, fallbackImg]);

  // If only 1 image, render ultra-lightweight static image with 0 timer overhead
  if (images.length <= 1) {
    return (
      <div className="auto-image-loop-container">
        <img 
          src={images[0]} 
          alt={title}
          className="loop-slide-img"
          loading="lazy" 
        />
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, isHovered, interval]);

  return (
    <div 
      className="auto-image-loop-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((imgSrc, idx) => (
        <div
          key={idx}
          className={`image-loop-slide ${idx === currentIndex ? 'active' : ''}`}
        >
          <img 
            src={imgSrc} 
            alt={`${title} - view ${idx + 1}`}
            className="loop-slide-img"
            loading="lazy" 
          />
        </div>
      ))}

      {/* Pagination Dot Indicators */}
      <div className="loop-dots-indicator">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`loop-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(AutoImageLoop);
