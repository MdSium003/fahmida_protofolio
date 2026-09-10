import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { loadMomentsData } from '../../src/utils/csvLoader';

const MomentsStrip = () => {
  const [moments, setMoments] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  useEffect(() => {
    const fetchMoments = async () => {
      try {
        const data = await loadMomentsData();
        setMoments(data || []);
      } catch (err) {
        console.error('Error loading moments data:', err);
      }
    };
    fetchMoments();
  }, []);

  const openPhoto = (index) => {
    setSelectedPhotoIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closePhoto = () => {
    setSelectedPhotoIndex(null);
    document.body.style.overflow = '';
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    if (!moments.length) return;
    setSelectedPhotoIndex((prev) => (prev + 1) % moments.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    if (!moments.length) return;
    setSelectedPhotoIndex((prev) => (prev - 1 + moments.length) % moments.length);
  };

  if (!moments.length) return null;

  return (
    <section className="moments-strip-section" aria-label="Moments From The Journey">
      <div className="section-header-compact">
        <h2 className="section-title">Moments From The Journey</h2>
      </div>

      <div className="moments-gallery-strip">
        {moments.map((item, idx) => (
          <div 
            className="moment-thumb-wrapper" 
            key={item.id || idx}
            onClick={() => openPhoto(idx)}
            role="button"
            tabIndex={0}
            aria-label={`View photo: ${item.caption}`}
          >
            <img 
              src={item.image_url || item.image} 
              alt={item.caption}
              className="moment-thumb-img"
              loading="lazy"
            />
            <div className="moment-hover-overlay">
              <Sparkles size={16} className="moment-sparkle-icon" />
              <p className="moment-caption-preview">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && moments[selectedPhotoIndex] && (
        <div className="moment-lightbox-overlay" onClick={closePhoto} role="dialog" aria-modal="true">
          <div className="moment-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={closePhoto} aria-label="Close photo">
              <X size={22} />
            </button>

            <button className="lightbox-nav-btn prev-btn" onClick={prevPhoto} aria-label="Previous photo">
              <ChevronLeft size={24} />
            </button>

            <div className="lightbox-image-container">
              <img 
                src={moments[selectedPhotoIndex].image_url || moments[selectedPhotoIndex].image} 
                alt={moments[selectedPhotoIndex].caption}
                className="lightbox-main-img"
              />
              <p className="lightbox-caption">
                {moments[selectedPhotoIndex].caption}
              </p>
            </div>

            <button className="lightbox-nav-btn next-btn" onClick={nextPhoto} aria-label="Next photo">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MomentsStrip;
