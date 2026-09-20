import React from 'react';
import { ArrowRight, Play, ExternalLink } from 'lucide-react';
import ProjectGraphicFallback from './ProjectGraphicFallback';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length >= 11
    ? `https://img.youtube.com/vi/${match[2].substring(0, 11)}/maxresdefault.jpg`
    : '';
};

const ProjectCard = ({ project, onOpenProject }) => {
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
    <article 
      className="curated-project-card"
      onClick={() => onOpenProject(project)}
    >
      {/* 1. Image / Designed Blueprint Frame */}
      <div className="card-media-frame">
        {hasValidImage ? (
          <div className="card-media-inner">
            <img 
              src={displayImage} 
              alt={project.title}
              className="card-media-img"
              loading="lazy"
              decoding="async"
            />
            <div className="card-media-overlay" />
          </div>
        ) : (
          <ProjectGraphicFallback project={project} className="card-fallback-tile" />
        )}

        {isVideo && (
          <div className="card-video-indicator" title="Video Demo Available">
            <Play size={13} fill="currentColor" />
            <span>DEMO</span>
          </div>
        )}

        <span className="card-category-badge">
          {project.category || 'PROJECT'}
        </span>
      </div>

      {/* 2. Structured Content Frame */}
      <div className="card-content-frame">
        <div className="card-tech-chips">
          {(project.technologies || []).slice(0, 3).map((tech, idx) => (
            <span key={idx} className="card-tech-pill">{tech}</span>
          ))}
        </div>

        <h3 className="card-project-title">{project.title}</h3>

        <p className="card-project-summary">
          {project.description}
        </p>

        <div className="card-footer-action">
          {project.year && (
            <span className="card-year-stamp">{project.year}</span>
          )}
          <button 
            className="card-action-btn"
            onClick={(e) => { e.stopPropagation(); onOpenProject(project); }}
            aria-label={`Explore ${project.title}`}
          >
            <span>Explore</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
