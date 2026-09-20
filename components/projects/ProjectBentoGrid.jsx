import React from 'react';
import { ArrowRight, Play, Box, Bot, Activity, Cpu, Eye } from 'lucide-react';
import ProjectGraphicFallback from './ProjectGraphicFallback';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length >= 11
    ? `https://img.youtube.com/vi/${match[2].substring(0, 11)}/maxresdefault.jpg`
    : '';
};

const ProjectBentoGrid = ({ projects = [], onOpenProject }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="bento-showcase-section" aria-label="Curated Bento Showcase">
      <div className="section-header-compact">
        <h2 className="section-title">Spotlight Systems & Prototypes</h2>
      </div>

      <div className="bento-grid-container">
        {projects.map((project, idx) => {
          const isVideo = project.thumbnail_url && (project.thumbnail_url.includes('youtube') || project.thumbnail_url.includes('youtu.be'));
          const videoThumb = isVideo ? getYouTubeEmbedUrl(project.thumbnail_url) : '';
          const rawImage = project.image || project.thumbnail_url;
          const hasValidImage = (videoThumb || (rawImage && 
                                !rawImage.includes('mir_mehedi.jpg') && 
                                !rawImage.includes('youtube') && 
                                !rawImage.includes('youtu.be') &&
                                !rawImage.includes('example.com')));

          const displayImage = videoThumb || rawImage;

          // Asymmetric visual weighting (e.g. 1st wide, 2nd standard, 3rd standard, 4th wide)
          const isWide = idx === 0 || idx === 3;

          return (
            <article 
              key={project.id || idx}
              className={`bento-card ${isWide ? 'bento-card-wide' : 'bento-card-standard'}`}
              onClick={() => onOpenProject(project)}
            >
              {/* Media Section */}
              <div className="bento-media-container">
                {hasValidImage ? (
                  <div className="bento-image-wrapper">
                    <img 
                      src={displayImage} 
                      alt={project.title}
                      className="bento-image"
                      loading="lazy"
decoding="async"/>
                    <div className="bento-image-overlay" />
                  </div>
                ) : (
                  <ProjectGraphicFallback project={project} className="bento-fallback-wrapper" />
                )}

                {isVideo && (
                  <div className="bento-play-pill" title="Watch Video Demonstration">
                    <Play size={13} fill="currentColor" />
                    <span>DEMO</span>
                  </div>
                )}

                <span className="bento-category-tag">
                  {project.category || 'FEATURED'}
                </span>
              </div>

              {/* Content Section */}
              <div className="bento-content-container">
                <div className="bento-tech-pills">
                  {(project.technologies || []).slice(0, 3).map((tech, tIdx) => (
                    <span key={tIdx} className="bento-pill">{tech}</span>
                  ))}
                </div>

                <h3 className="bento-title">{project.title}</h3>
                
                <p className="bento-summary">{project.description}</p>

                <div className="bento-footer-row">
                  {project.year && (
                    <span className="bento-year">{project.year}</span>
                  )}
                  <button 
                    className="bento-action-btn"
                    onClick={(e) => { e.stopPropagation(); onOpenProject(project); }}
                  >
                    <span>Explore</span>
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

export default ProjectBentoGrid;
