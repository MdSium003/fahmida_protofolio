import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, ArrowUpRight, Building2, Medal, Award, Globe2, GraduationCap } from 'lucide-react';
import { cleanAwardTitle, getAllAwardImages, getPlacementBadge } from '../awards/FeaturedAwards';

const HomeRecognitionPreview = ({ awards = [] }) => {
  if (!awards || awards.length === 0) return null;

  // Curate standout distinctions from data-driven featured flags
  const featured = awards.filter(a => a.isFeatured || a.is_featured === true || String(a.is_featured).toLowerCase() === 'true');
  let curatedAwards = featured.length > 0 ? featured.slice(0, 3) : awards.filter(a => getAllAwardImages(a).length > 0).slice(0, 3);

  if (curatedAwards.length === 0) return null;

  return (
    <section className="home-section home-recognition-section" aria-label="Recognition & Distinctions">
      <div className="home-section-container">
        {/* Section Header */}
        <div className="home-section-header">
          <h2 className="home-section-title">Honors & Academic Distinctions</h2>
          <p className="home-section-subtitle">
            International travel grants, national champions, and selective academic scholarships.
          </p>
        </div>

        {/* 3-Column Visual Distinctions Grid */}
        <div className="home-awards-preview-grid">
          {curatedAwards.map((award) => {
            const placement = getPlacementBadge(award.title);
            const images = getAllAwardImages(award);
            const image = images.length > 0 ? images[0] : null;

            return (
              <article key={award.id} className="home-award-card">
                {image ? (
                  <div className="home-award-media-frame">
                    <img 
                      src={image} 
                      alt={cleanAwardTitle(award.title)}
                      className="home-award-img"
                      loading="lazy"
                    />
                    <div className="home-award-gradient-overlay" />
                  </div>
                ) : (
                  <div className="home-award-media-fallback">
                    <Trophy size={28} />
                  </div>
                )}

                <div className="home-award-body">
                  <div className="home-award-top-meta">
                    <span className={`home-award-rank-pill ${placement.rankClass}`}>
                      {placement.icon}
                      <span>{placement.text}</span>
                    </span>
                    {award.year && <span className="home-year-text">{award.year}</span>}
                  </div>

                  <h3 className="home-award-card-title">{cleanAwardTitle(award.title)}</h3>

                  {award.organization_name && (
                    <div className="home-award-org">
                      <Building2 size={13} />
                      <span>{award.organization_name}</span>
                    </div>
                  )}

                  <div className="home-award-footer">
                    <Link to={`/awards?id=${award.id}`} className="home-boxed-btn">
                      <span>Explore Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Section Action: View All Awards */}
        <div className="home-section-bottom-action">
          <Link to="/awards" className="home-view-all-link">
            <span>View All Awards & Honors</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HomeRecognitionPreview);
