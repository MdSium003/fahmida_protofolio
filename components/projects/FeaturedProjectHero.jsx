import React from 'react';
import { ArrowRight, Play, Code2, ExternalLink, Eye, Layers } from 'lucide-react';
import ProjectGraphicFallback from './ProjectGraphicFallback';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length >= 11
    ? `https://img.youtube.com/vi/${match[2].substring(0, 11)}/maxresdefault.jpg`
    : '';
};

const FeaturedProjectHero = ({ project, onOpenProject }) => {
  if (!project) return null;

  const isVideo = project.thumbnail_url && (project.thumbnail_url.includes('youtube') || project.thumbnail_url.includes('youtu.be'));
  const videoThumb = isVideo ? getYouTubeEmbedUrl(project.thumbnail_url) : '';
  const rawImage = project.image || project.thumbnail_url;
  const hasValidImage = (videoThumb || (rawImage && 
                        !rawImage.includes('mir_mehedi.jpg') && 
                        !rawImage.includes('youtube') && 
                        !rawImage.includes('youtu.be') &&
                        !rawImage.includes('example.com')));

  const displayImage = videoThumb || rawImage;

  return (
    <section className="featured-flagship-section" aria-label="Primary Featured Project">
      <div className="section-header-compact">
        <h2 className="section-title">Flagship Engineering Work</h2>
      </div>

      <article 
        className="featured-flagship-card" 
        onClick={() => onOpenProject(project)}
      >
        {/* Dominant Media Container (occupying 60-65% visual weight) */}
        <div className="featured-flagship-media">
          {hasValidImage ? (
            <div className="featured-media-frame">
              <img 
                src={displayImage} 
                alt={project.title} 
                className="featured-media-img" 
                loading="eager"
              />
              <div className="featured-media-gradient-overlay" />
            </div>
          ) : (
            <ProjectGraphicFallback project={project} className="featured-fallback-frame" />
          )}

          {isVideo && (
            <div className="featured-play-badge" title="Watch Video Demonstration">
              <Play size={20} fill="currentColor" />
            </div>
          )}
        </div>

        {/* Narrative & Specifications Layer */}
        <div className="featured-flagship-details">
          <div className="featured-details-top">
            <div className="featured-category-row">
              <span className="featured-category-pill">
                <Eye size={12} /> {project.category || 'COMPUTER VISION & 3D'}
              </span>
              {project.year && (
                <span className="featured-year-pill">{project.year}</span>
              )}
            </div>

            <h3 className="featured-flagship-title">{project.title}</h3>

            {/* Compact Technology Tags */}
            <div className="featured-tech-list">
              {(project.technologies || []).map((tech, idx) => (
                <span key={idx} className="tech-chip">{tech}</span>
              ))}
            </div>

            <p className="featured-flagship-summary">
              {project.description}
            </p>
          </div>

          <div className="featured-details-bottom">
            {project.presented_in && (
              <div className="featured-context-row">
                <span className="context-label">Research / Venue:</span>
                <span className="context-value">{project.presented_in}</span>
              </div>
            )}

            <button 
              className="featured-cta-button"
              onClick={(e) => { e.stopPropagation(); onOpenProject(project); }}
            >
              <span>Explore Case Study</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </article>
    </section>
  );
};

export default FeaturedProjectHero;
