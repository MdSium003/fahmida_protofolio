import React from 'react';
import { ArrowUpRight, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../shared/ScrollReveal';
import StaggerReveal from '../shared/StaggerReveal';

const HomeLinkedInFeatured = ({ items = [] }) => {
  if (!items.length) return null;
  const latestItems = [...items]
    .sort((a, b) => (Number(b.displayOrder) || 0) - (Number(a.displayOrder) || 0))
    .slice(0, 6);

  return (
    <section className="home-section linkedin-featured-section" aria-label="Key Mentions & Media Moments">
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

        <StaggerReveal className="linkedin-featured-grid" staggerDelay={0.08}>
          {latestItems.map(item => (
            <a
              className="linkedin-featured-card"
              href={item.external_link}
              key={item.id}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.title} — open link`}
            >
              <div className="linkedin-featured-image-wrap">
                <img
                  className="linkedin-featured-image"
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                />
                <span className="linkedin-featured-link-icon" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <div className="linkedin-featured-content">
                <span className="linkedin-featured-source">
                  <Linkedin size={13} aria-hidden="true" />
                  {item.source_label || 'LinkedIn'}
                </span>
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
              </div>
            </a>
          ))}
        </StaggerReveal>

        <ScrollReveal>
          <div className="home-section-bottom-action">
            <Link to="/blog" className="home-view-all-link">
              <span>Explore All Moments & Press Features</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HomeLinkedInFeatured;
