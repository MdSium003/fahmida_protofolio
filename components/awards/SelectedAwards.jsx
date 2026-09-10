import React from 'react';
import { Building2, ArrowRight, Tag } from 'lucide-react';
import { getAllAwardImages, cleanAwardTitle, getPlacementBadge } from './FeaturedAwards';

const SelectedAwards = ({ awards = [], onSelectAward, onOpenMedia }) => {
  // Exclude items featured in the top section
  const selectedList = awards
    .filter(a => !(a.isFeatured || a.is_featured === true || String(a.is_featured).toLowerCase() === 'true'))
    .filter(a => {
      const text = `${a.title || ''} ${a.description || ''}`.toLowerCase();
      return (
        text.includes('champion') ||
        text.includes('1st runner up') ||
        text.includes('2nd runner up') ||
        text.includes('scholarship') ||
        text.includes('finalist') ||
        text.includes('best impact') ||
        text.includes('johns hopkins') ||
        text.includes('orange corner')
      );
    })
    .slice(0, 6);

  if (selectedList.length === 0) return null;

  return (
    <section className="selected-awards-section" aria-label="Selected Recognition">
      <div className="section-header-compact">
        <h2 className="section-title">Notable Distinctions</h2>
      </div>

      <div className="selected-grid">
        {selectedList.map((award) => {
          const placement = getPlacementBadge(award.title);
          const images = getAllAwardImages(award);
          const img = images.length > 0 ? images[0] : null;

          return (
            <article 
              key={award.id} 
              className="selected-card"
              onClick={() => onSelectAward(award)}
            >
              {img && (
                <div 
                  className="selected-card-thumb-frame"
                  onClick={(e) => { e.stopPropagation(); onSelectAward(award); }}
                  role="button"
                  tabIndex={0}
                >
                  <img src={img} alt={cleanAwardTitle(award.title)} loading="lazy" />
                </div>
              )}

              <div className="selected-card-content">
                <div className="selected-card-top">
                  <span className={`selected-badge ${placement.rankClass}`}>
                    {placement.icon}
                    <span>{placement.text}</span>
                  </span>
                  {award.year && <span className="selected-year">{award.year}</span>}
                </div>

                <h3 className="selected-title">{cleanAwardTitle(award.title)}</h3>

                {award.organization_name && (
                  <div className="selected-org">
                    <Building2 size={14} />
                    <span>{award.organization_name}</span>
                  </div>
                )}

                <div className="selected-card-footer">
                  {award.topic && (
                    <span className="selected-category-tag">
                      <Tag size={12} />
                      <span>{award.topic}</span>
                    </span>
                  )}

                  <button 
                    className="selected-detail-btn"
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
    </section>
  );
};

export default SelectedAwards;
