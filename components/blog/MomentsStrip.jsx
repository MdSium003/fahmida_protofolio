import React, { useEffect, useState } from 'react';
import { Linkedin, Play, ExternalLink } from 'lucide-react';
import { loadMediaMentionsData } from '../../src/utils/csvLoader';

const MomentsStrip = () => {
  const [mediaMentions, setMediaMentions] = useState([]);

  useEffect(() => {
    let isMounted = true;
    loadMediaMentionsData()
      .then((data) => {
        if (isMounted) setMediaMentions(data || []);
      })
      .catch((error) => {
        console.error('Error loading media mentions:', error);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <section id="media-mentions" className="moments-strip-section" aria-label="Media Mentions">
      {mediaMentions.length > 0 && (
        <div className="moments-gallery-section" aria-labelledby="media-mentions-title">
          <div className="moments-gallery-heading">
            <div className="moments-gallery-heading-main">
              <h2 className="section-title" id="media-mentions-title">Media Mentions</h2>
              <p className="moments-gallery-subtitle">
                Featured interviews, national & international daily coverage, television broadcasts, and tech community highlights.
              </p>
            </div>
            <span className="moments-gallery-count">{mediaMentions.length} features</span>
          </div>

          <div className="media-feature-list">
            {mediaMentions.map((item) => {
              const itemLink = item.external_link || item.media_url;
              const Card = itemLink ? 'a' : 'article';

              return (
                <Card
                  className={`media-feature-card${itemLink ? ' media-feature-card-link' : ''}`}
                  key={item.id}
                  {...(itemLink ? { href: itemLink, target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <div className="media-feature-card-body">
                    {item.image_url ? (
                      <div className="media-feature-image-wrap">
                        <img className="media-feature-image" src={item.image_url} alt={item.title} loading="lazy" decoding="async" />
                        {item.media_type === 'youtube' && <span className="media-feature-play"><Play size={22} fill="currentColor" /></span>}
                      </div>
                    ) : (
                      <div className="media-feature-image-placeholder">
                        <Linkedin size={34} />
                        <span>{item.outlet || 'LinkedIn Featured'}</span>
                      </div>
                    )}

                    <div className="media-feature-card-content">
                      <h3>{item.title}</h3>
                      {itemLink ? (
                        <span className="media-feature-link" aria-label="Source link">
                          <span className="media-feature-link-text">{itemLink}</span>
                          <ExternalLink size={14} aria-hidden="true" />
                        </span>
                      ) : (
                        <span className="media-feature-link-missing">Link not included in copied text</span>
                      )}
                      {item.outlet && <p className="media-feature-outlet">{item.outlet}</p>}
                      {item.caption && <p className="media-feature-description">{item.caption}</p>}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default MomentsStrip;
