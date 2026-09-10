import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SkillsInPractice = ({ projects = [], research = [] }) => {
  // Select top featured research paper for hero card
  const heroItem = research.find(r => r.isFeatured) || research[0];
  
  // Select top 3 featured projects for supporting grid
  const featuredProjects = projects.filter(p => p.isFeatured);
  const supportingItems = (featuredProjects.length >= 3 ? featuredProjects : projects).slice(0, 3);

  return (
    <section className="skills-section skills-practice-section" aria-label="Skills in Practice and Proof of Work">
      <div className="section-header-compact">
        <h2 className="section-title">Applied Engineering & Research Proof</h2>
      </div>

      <div className="practice-showcase-container">
        {/* Dominant Hero Item Card (Research Spotlight) */}
        {heroItem && (
          <article className="practice-hero-card">
            <div className="practice-hero-media-wrapper">
              <img 
                src={heroItem.thumbnail_url || heroItem.displayImg || '/wall/research_1.jpg'} 
                alt={heroItem.title} 
                className="practice-hero-image"
                loading="lazy"
              />
              <div className="practice-media-overlay" />
              <span className="practice-category-tag">{heroItem.kicker || 'RESEARCH SPOTLIGHT'}</span>
            </div>

            <div className="practice-hero-content">
              <div className="practice-tags-row">
                {(heroItem.topicsList || []).slice(0, 4).map((tech, idx) => (
                  <span key={idx} className="practice-pill">{tech}</span>
                ))}
              </div>

              <h3 className="practice-hero-title">{heroItem.title}</h3>
              <p className="practice-hero-summary">{heroItem.abstract || heroItem.description}</p>

              <Link to={`/research?id=${heroItem.id}`} className="practice-action-link">
                <span>Explore Research</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        )}

        {/* Supporting Image-First Project Cards */}
        <div className="practice-supporting-grid">
          {supportingItems.map((item, idx) => (
            <article className="practice-card" key={item.id || idx}>
              <div className="practice-card-media-wrapper">
                <img 
                  src={item.image || item.thumbnail_url || '/wall/fahmida_with_car.jpeg'} 
                  alt={item.title} 
                  className="practice-card-image"
                  loading="lazy"
                />
                <div className="practice-media-overlay" />
                <span className="practice-category-tag">{item.category}</span>
              </div>

              <div className="practice-card-content">
                <div className="practice-tags-row">
                  {(item.technologies || []).slice(0, 3).map((tech, tIdx) => (
                    <span key={tIdx} className="practice-pill">{tech}</span>
                  ))}
                </div>

                <h4 className="practice-card-title">{item.title}</h4>
                <p className="practice-card-summary">{item.description}</p>

                <Link to={`/projects?id=${item.id}`} className="practice-action-link">
                  <span>Explore Project</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsInPractice;
