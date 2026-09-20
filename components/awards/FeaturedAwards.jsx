import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, GraduationCap, Globe2, ArrowRight, Building2 } from 'lucide-react';
import { parseMedia } from '../../src/utils/csvLoader';

// Helper to remove all emojis and format titles cleanly
export const cleanAwardTitle = (title = '') => {
  return String(title || '')
    .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '')
    .replace(/^[|•\-\s]+/, '')
    .replace(/[|•\-\s]+$/, '')
    .replace(/\s*\|\s*/g, ' | ')
    .trim();
};

// Helper to extract all valid image URLs for an award
export const getAllAwardImages = (award) => {
  if (!award) return [];
  const list = [];
  if (award.thumbnail_url && 
      !award.thumbnail_url.includes('youtube') && 
      !award.thumbnail_url.includes('youtu.be') && 
      !award.thumbnail_url.includes('example.com')) {
    list.push(award.thumbnail_url);
  }
  const media = parseMedia(award.media);
  media.forEach(m => {
    if (m.media_type === 'image' && !m.media_url.includes('example.com') && !list.includes(m.media_url)) {
      list.push(m.media_url);
    }
  });
  return list;
};

// Auto-looping image slideshow for cards with multiple images
const AwardAutoSlideshow = ({ images = [], alt = '', className = '', onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div 
      className={className} 
      onClick={onClick} 
      role="button" 
      tabIndex={0}
    >
      {images.map((imgUrl, idx) => (
        <img
          key={idx}
          src={imgUrl}
          alt={`${alt} image ${idx + 1}`}
          className={`slideshow-img ${idx === currentIndex ? 'active' : ''}`}
          loading={idx === 0 ? 'eager' : 'lazy'}
decoding="async"/>
      ))}
    </div>
  );
};

// Helper for clean icon-based placement badges (NO emojis)
export const getPlacementBadge = (title = '') => {
  const lower = String(title || '').toLowerCase();
  if (lower.includes('champion')) {
    return { text: 'Champion', icon: <Trophy size={13} />, rankClass: 'rank-champion' };
  }
  if (lower.includes('1st runner up')) {
    return { text: '1st Runner Up', icon: <Medal size={13} />, rankClass: 'rank-runnerup' };
  }
  if (lower.includes('2nd runner up')) {
    return { text: '2nd Runner Up', icon: <Medal size={13} />, rankClass: 'rank-runnerup' };
  }
  if (lower.includes('winner') || lower.includes('1st place') || lower.includes('1st prize')) {
    return { text: 'Winner', icon: <Award size={13} />, rankClass: 'rank-winner' };
  }
  if (lower.includes('scholarship')) {
    return { text: 'Scholarship', icon: <GraduationCap size={13} />, rankClass: 'rank-scholarship' };
  }
  if (lower.includes('fellowship') || lower.includes('grant') || lower.includes('immersion')) {
    return { text: 'Fellowship / Grant', icon: <Globe2 size={13} />, rankClass: 'rank-fellow' };
  }
  if (lower.includes('best impact')) {
    return { text: 'Best Impact', icon: <Award size={13} />, rankClass: 'rank-impact' };
  }
  if (lower.includes('finalist')) {
    return { text: 'Finalist', icon: <Award size={13} />, rankClass: 'rank-finalist' };
  }
  return { text: 'Honors', icon: <Award size={13} />, rankClass: 'rank-default' };
};

const FeaturedAwards = ({ awards = [], onSelectAward }) => {
  // Select featured awards based on isFeatured / featuredOrder from data
  const dataFeatured = awards.filter(a => a.isFeatured || a.is_featured === true || String(a.is_featured).toLowerCase() === 'true');
  
  let featuredList = dataFeatured.length > 0 
    ? dataFeatured.slice(0, 4) 
    : awards.filter(a => getAllAwardImages(a).length > 0).slice(0, 4);

  if (featuredList.length === 0) return null;

  const [heroAward, ...secondaryFeatured] = featuredList;

  const heroImages = getAllAwardImages(heroAward);
  const heroPlacement = getPlacementBadge(heroAward.title);

  return (
    <section className="featured-awards-section" aria-label="Featured Recognition">
      <div className="section-header-compact">
        <h2 className="section-title">Premier Accomplishments</h2>
      </div>

      {/* 1. Large Dominant Featured Award */}
      {heroAward && (
        <article 
          className="featured-hero-card"
          onClick={() => onSelectAward(heroAward)}
        >
          {heroImages.length > 0 ? (
            <AwardAutoSlideshow
              images={heroImages}
              alt={cleanAwardTitle(heroAward.title)}
              className="featured-hero-media"
              onClick={(e) => { e.stopPropagation(); onSelectAward(heroAward); }}
            />
          ) : (
            <div className="featured-hero-media-fallback">
              <Trophy size={36} />
            </div>
          )}

          <div className="featured-hero-content">
            <div className="featured-card-top-meta">
              <span className={`featured-badge ${heroPlacement.rankClass}`}>
                {heroPlacement.icon}
                <span>{heroPlacement.text}</span>
              </span>
              {heroAward.year && <span className="featured-year-badge">{heroAward.year}</span>}
            </div>

            <h3 className="featured-hero-title">{cleanAwardTitle(heroAward.title)}</h3>

            {heroAward.organization_name && (
              <div className="featured-org">
                <Building2 size={15} />
                <span>{heroAward.organization_name}</span>
              </div>
            )}

            {heroAward.description && (
              <p className="featured-hero-desc">
                {heroAward.description.replace(/^[-•>]\s*/gm, '').slice(0, 260)}...
              </p>
            )}

            <div className="featured-hero-footer">
              <button 
                className="btn-featured-action"
                onClick={(e) => { e.stopPropagation(); onSelectAward(heroAward); }}
                type="button"
              >
                <span>Explore Details</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </article>
      )}

      {/* 2. Supporting Featured Awards (3-Column Grid) */}
      {secondaryFeatured.length > 0 && (
        <div className="supporting-featured-grid">
          {secondaryFeatured.map((award) => {
            const images = getAllAwardImages(award);
            const placement = getPlacementBadge(award.title);

            return (
              <article 
                key={award.id} 
                className="supporting-visual-card"
                onClick={() => onSelectAward(award)}
              >
                {images.length > 0 ? (
                  <AwardAutoSlideshow
                    images={images}
                    alt={cleanAwardTitle(award.title)}
                    className="supporting-card-media"
                    onClick={(e) => { e.stopPropagation(); onSelectAward(award); }}
                  />
                ) : (
                  <div className="supporting-card-media-fallback">
                    <Trophy size={24} />
                  </div>
                )}

                <div className="supporting-card-body">
                  <div className="featured-card-top-meta">
                    <span className={`featured-badge ${placement.rankClass}`}>
                      {placement.icon}
                      <span>{placement.text}</span>
                    </span>
                    {award.year && <span className="featured-year-badge">{award.year}</span>}
                  </div>

                  <h4 className="supporting-card-title">{cleanAwardTitle(award.title)}</h4>

                  {award.organization_name && (
                    <div className="featured-org small">
                      <Building2 size={13} />
                      <span>{award.organization_name}</span>
                    </div>
                  )}

                  <div className="supporting-card-footer">
                    <button 
                      className="btn-supporting-action"
                      onClick={(e) => { e.stopPropagation(); onSelectAward(award); }}
                      type="button"
                    >
                      <span>Details</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FeaturedAwards;
