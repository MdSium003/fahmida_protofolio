import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadAwardsData, parseMedia } from '../src/utils/csvLoader';
import AwardsHero from '../components/awards/AwardsHero';
import RecognitionStats from '../components/awards/RecognitionStats';
import FeaturedAwards from '../components/awards/FeaturedAwards';
import SelectedAwards from '../components/awards/SelectedAwards';
import AwardArchive from '../components/awards/AwardArchive';
import AwardDetailModal from '../components/awards/AwardDetailModal';
import AwardMediaLightbox from '../components/awards/AwardMediaLightbox';
import '../styles/AwardsPage.css';

const AwardsPage = () => {
  const [searchParams] = useSearchParams();
  const targetAwardId = searchParams.get('id') || searchParams.get('award');
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [modalAward, setModalAward] = useState(null);
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    media: [],
    currentIndex: 0
  });

  useEffect(() => {
    if (targetAwardId && awards.length > 0) {
      const found = awards.find(a => String(a.id) === String(targetAwardId));
      if (found) {
        setModalAward(found);
      }
    }
  }, [targetAwardId, awards]);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const data = await loadAwardsData();
        setAwards(data || []);
      } catch (err) {
        console.error('Error fetching awards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  // Compute year range for hero metadata
  const yearSpan = useMemo(() => {
    if (!awards.length) return '';
    const validYears = awards
      .map(a => parseInt(a.year, 10))
      .filter(y => !isNaN(y) && y > 1990);
    if (!validYears.length) return '';
    return `${Math.min(...validYears)}–${Math.max(...validYears)}`;
  }, [awards]);

  const handleOpenAwardModal = (award) => {
    setModalAward(award);
  };

  const handleCloseAwardModal = () => {
    setModalAward(null);
  };

  const handleOpenMediaFromAward = (award, initialIndex = 0) => {
    const media = parseMedia(award.media);
    if (media.length > 0) {
      setLightboxState({
        isOpen: true,
        media,
        currentIndex: initialIndex
      });
    }
  };

  const handleOpenMediaDirect = (index) => {
    if (modalAward) {
      const media = parseMedia(modalAward.media);
      setLightboxState({
        isOpen: true,
        media,
        currentIndex: index
      });
    }
  };

  const handleCloseLightbox = () => {
    setLightboxState(prev => ({ ...prev, isOpen: false }));
  };

  const handleLightboxIndexChange = (newIndex) => {
    setLightboxState(prev => ({ ...prev, currentIndex: newIndex }));
  };

  return (
    <div className="awards-page-container">
      {/* 1. Hero & Introduction */}
      <AwardsHero />

      {loading ? (
        <div className="awards-loading-state">
          <div className="skeleton-block" />
          <div className="skeleton-block" />
          <div className="skeleton-block" />
        </div>
      ) : (
        <>
          {/* 2. Recognition Statistics Strip */}
          <RecognitionStats awards={awards} />

          {/* 3. Featured Recognition Centerpiece */}
          <FeaturedAwards 
            awards={awards}
            onSelectAward={handleOpenAwardModal}
            onOpenMedia={handleOpenMediaFromAward}
          />

          {/* 4. Selected Recognition (Curated 2-Column Grid) */}
          <SelectedAwards 
            awards={awards}
            onSelectAward={handleOpenAwardModal}
            onOpenMedia={handleOpenMediaFromAward}
          />

          {/* 5. Complete Chronological Award Archive */}
          <AwardArchive 
            awards={awards}
            onSelectAward={handleOpenAwardModal}
            onOpenMedia={handleOpenMediaFromAward}
          />
        </>
      )}

      {/* Interactive Detail Modal */}
      {modalAward && (
        <AwardDetailModal 
          award={modalAward}
          media={parseMedia(modalAward.media)}
          onClose={handleCloseAwardModal}
          onOpenMedia={handleOpenMediaDirect}
        />
      )}

      {/* Interactive Media Lightbox */}
      {lightboxState.isOpen && (
        <AwardMediaLightbox 
          media={lightboxState.media}
          currentIndex={lightboxState.currentIndex}
          onClose={handleCloseLightbox}
          onIndexChange={handleLightboxIndexChange}
        />
      )}
    </div>
  );
};

export default AwardsPage;
