import React from 'react';
import { Building2, ArrowRight, Tag } from 'lucide-react';
import { getPlacementBadge } from './FeaturedAwards';

// Keep this section intentionally curated: the full awards list remains below,
// while Notable Distinctions shows only the entries requested for the homepage.
const notableDistinctions = [
  {
    id: '57',
    year: '2026',
    title: 'IEEE WIE Big Idea Pitch Competition (Global) – Best Transformative Business Idea Pitch',
    description: 'Awarded USD 1000.',
  },
  {
    id: '52',
    year: '2025',
    title: '2nd ISETS–ESCAP & 3rd ISETS Global Competition of Youth Voice on Energy Transition (Global) – 2nd prize',
    description: 'Fully funded trip to UN-ESCAP Headquarters in Bangkok out of 105 projects',
  },
  {
    id: '43',
    year: '2024',
    title: 'ISETS-ESCAP Youth Voice Competition (Global) – South Asia Divisional 2nd',
    description: 'Invited to Youth Dialogue at UN ESCAP, Bangkok; selected from 300 applicants across 77 teams',
  },
  {
    id: '58',
    year: '2024',
    title: 'IEEE WIE Big Idea Pitch Competition (Global) – Best Impact Prize',
    description: 'Awarded USD 500',
  },
  {
    id: '35',
    year: '2023',
    title: 'IEEE WIE Big Idea Pitch Competition (Global) – Best Impact Prize',
    description: 'Awarded USD 300.',
  },
  {
    id: '4',
    year: '2025',
    title: 'SIGHPC Immersion Program for SC25',
    description: '(16 Nov 2025 - 21 Nov 2025) - ACM SIGHPC Immersion Travel Grant to attend SC 2025, the International Conference on High Performance Computing, Networking, Storage, and Analysis in St. Louis, Missouri.',
  },
  {
    id: '1',
    year: '2024',
    title: 'Global Changemaker Fellowship Cohort-4',
    description: '(Sep 2024 - Jun 2025) - top 33 out of 7,000 from 115 countries',
  },
];

const SelectedAwards = ({ awards = [], onSelectAward }) => {
  const selectedList = notableDistinctions
    .map((notable) => {
      const award = awards.find((item) => String(item.id) === notable.id);
      return award ? { ...award, ...notable } : null;
    })
    .filter(Boolean);

  if (selectedList.length === 0) return null;

  return (
    <section className="selected-awards-section" aria-label="Selected Recognition">
      <div className="section-header-compact">
        <h2 className="section-title">Notable Distinctions</h2>
      </div>

      <div className="selected-grid">
        {selectedList.map((award) => {
          const placement = getPlacementBadge(award.title);
          const cleanDesc = award.description;

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

                <h3 className="selected-title">{award.title}</h3>

                {award.organization_name && (
                  <div className="selected-org">
                    <Building2 size={14} />
                    <span>{award.organization_name}</span>
                  </div>
                )}

                {cleanDesc && (
                  <p className="selected-desc">
                    {cleanDesc}
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

