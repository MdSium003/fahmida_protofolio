import React from 'react';
import { Link } from 'react-router-dom';
import { Tv, Newspaper, Share2, Youtube, Play, Calendar, ArrowUpRight, ChevronRight } from 'lucide-react';
import ScrollReveal from '../shared/ScrollReveal';
import StaggerReveal from '../shared/StaggerReveal';
import { asset } from '../../src/utils/assetUrl';

const HomeMentionsPreview = ({ mediaMentions = [] }) => {
  if (!mediaMentions.length) return null;

  // The loader uses the same display_order as the full Media Mentions page.
  const displayEntries = mediaMentions.slice(0, 6);

  const renderTypeIcon = (type, size = 11) => {
    switch (type) {
      case 'tv': return <Tv size={size} />;
      case 'newspaper':
      case 'article': return <Newspaper size={size} />;
      case 'facebook': return <Share2 size={size} />;
      case 'youtube': return <Youtube size={size} />;
      default: return <Newspaper size={size} />;
    }
  };

  const renderTypeLabel = (item) => {
    if (item.outlet) return item.outlet;
    switch (item.media_type) {
      case 'tv': return 'TV Broadcast';
      case 'newspaper': return 'Newspaper Feature';
      case 'facebook': return 'Community Spotlight';
      case 'youtube': return 'Video Feature';
      default: return 'Press Mention';
    }
  };

  return (
    <section className="home-section home-mentions-section" id="media-mentions" aria-label="Key Media Mentions">
      <div className="home-section-container">
        <ScrollReveal>
          <div className="home-section-header">
            <h2 className="home-section-title">
              Key Mentions & <span className="text-highlight">Media Moments</span>
            </h2>
            <p className="home-section-subtitle">
              Featured interviews, national & international daily coverage, television broadcasts, and tech community highlights.
            </p>
          </div>
        </ScrollReveal>

        <StaggerReveal className="home-mentions-grid" staggerDelay={0.1}>
          {displayEntries.map((item) => {
            const isVideo = item.media_type === 'tv' || item.media_type === 'youtube' || Boolean(item.media_url);
            const imgUrl = item.image_url || asset('/images/fahmida_with_ddn.jpeg');
            const itemLink = item.external_link || item.media_url;
            const Card = itemLink ? 'a' : 'article';

            return (
              <Card
                key={item.id}
                className={`home-mentions-card type-${item.media_type}${itemLink ? ' home-mentions-card-link' : ''}`}
                {...(itemLink ? { href: itemLink, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `Open ${item.title}` } : {})}
              >
                <div className="home-mentions-media-wrapper">
                  <img
                    src={imgUrl}
                    alt={item.title}
                    className="home-mentions-img"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => { event.currentTarget.src = asset('/images/fahmida_with_ddn.jpeg'); }}
                  />
                  <div className="home-mentions-gradient-overlay" />
                  <div className={`home-mentions-type-pill type-${item.media_type}`}>
                    {renderTypeIcon(item.media_type, 11)}
                    <span>{renderTypeLabel(item)}</span>
                  </div>
                  {isVideo && (
                    <div className="home-mentions-play-btn" aria-hidden="true">
                      <Play size={16} fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="home-mentions-body">
                  {item.date && (
                    <div className="home-mentions-date-row">
                      <Calendar size={12} />
                      <span>{item.date}</span>
                    </div>
                  )}
                  <h3 className="home-mentions-title">{item.title}</h3>
                  <p className="home-mentions-desc">
                    {item.caption || 'Featured story and technical spotlight across national media outlets.'}
                  </p>
                  {itemLink && (
                    <div className="home-mentions-footer">
                      <span className="home-boxed-btn">
                        <span>{isVideo ? 'Watch Feature' : 'Read Highlight'}</span>
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </StaggerReveal>

        <ScrollReveal>
          <div className="home-section-bottom-action">
            <Link to="/blog#media-mentions" className="home-view-all-link">
              <span>Explore All Moments & Press Features</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default React.memo(HomeMentionsPreview);
