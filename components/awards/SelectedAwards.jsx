import React from 'react';
import { Building2, ArrowRight, Tag } from 'lucide-react';
import { cleanAwardTitle, getPlacementBadge } from './FeaturedAwards';

const SelectedAwards = ({ awards = [], onSelectAward, onOpenMedia }) => {
  // Exclude items featured in the top Premier Accomplishments section (Johns Hopkins)
  const selectedList = awards
    .filter(a => !(a.isFeatured || a.is_featured === true || String(a.is_featured).toLowerCase() === 'true'))
    .filter(a => {
      const text = `${a.title || ''} ${a.description || ''} ${a.topic || ''}`.toLowerCase();
      return (
        text.includes('sighpc') ||
        text.includes('changemaker') ||
        text.includes('global') ||
        text.includes('isets') ||
        text.includes('wie') ||
        text.includes('iscea') ||
        text.includes('commonwealth') ||
        text.includes('startup') ||
        text.includes('fellowship') ||
        text.includes('orange corner') ||
        text.includes('womentor') ||
        text.includes('hult')
      );
    });

  if (selectedList.length === 0) return null;

  return (
    <section className="selected-awards-section" aria-label="Selected Recognition">
      <div className="section-header-compact">
        <h2 className="section-title">Notable Distinctions</h2>
      </div>

      <div className="selected-grid">
        {selectedList.map((award) => {
          const placement = getPlacementBadge(award.title);
          const cleanDesc = (award.description || '')
            .replace(/^[-•>]\s*/gm, '')
            .replace(/\n+/g, ' ')
            .trim();

          return (
            <article 
              key={award.id} 
              className="selected-card"
              onClick={() => onSelectAward(award)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectAward(award); }}
            >
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

                {cleanDesc && (
                  <p className="selected-desc">
                    {cleanDesc.length > 150 ? `${cleanDesc.slice(0, 150)}...` : cleanDesc}
                  </p>
                )}

                <div className="selected-card-footer">
                  {award.topic ? (
                    <span className="selected-category-tag">
                      <Tag size={12} />
                      <span>{award.topic}</span>
                    </span>
                  ) : <span />}

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

export default React.memo(SelectedAwards);

