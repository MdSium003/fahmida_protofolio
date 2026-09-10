import React, { useEffect } from 'react';
import { 
  X, Github, ExternalLink, FileText, Download, Play, 
  Presentation, Tag, Calendar, Sparkles, Layers, ArrowRight 
} from 'lucide-react';
import { parseSources } from '../../src/utils/csvLoader';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length >= 11
    ? `https://www.youtube.com/embed/${match[2].substring(0, 11)}`
    : url;
};

const ProjectDetailModal = ({ project, onClose }) => {
  const sources = React.useMemo(() => parseSources(project?.sources), [project?.sources]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  const isVideo = project.thumbnail_url && (project.thumbnail_url.includes('youtube') || project.thumbnail_url.includes('youtu.be'));
  const displayImage = project.image || project.thumbnail_url;
  const hasValidImage = displayImage && 
                        !displayImage.includes('mir_mehedi.jpg') && 
                        !displayImage.includes('youtube') && 
                        !displayImage.includes('youtu.be');

  const [readingProgress, setReadingProgress] = React.useState(0);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      setReadingProgress(progress);
    } else {
      setReadingProgress(0);
    }
  };

  const getSourceIcon = (type) => {
    switch (type) {
      case 'github': return <Github size={15} />;
      case 'live_demo': return <ExternalLink size={15} />;
      case 'documentation': case 'paper': return <FileText size={15} />;
      case 'video': return <Play size={15} />;
      case 'download': return <Download size={15} />;
      default: return <ExternalLink size={15} />;
    }
  };

  return (
    <div className="project-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="project-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Reading Progress Bar */}
        <div className="modal-reading-progress-track" aria-hidden="true">
          <div 
            className="modal-reading-progress-bar" 
            style={{ width: `${readingProgress}%` }} 
          />
        </div>

        {/* Pinned Close Button */}
        <button className="project-modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="project-modal-scrollable" onScroll={handleScroll}>
          
          {/* Header & Badges */}
          <div className="project-modal-header">
            <div className="project-modal-badges">
              <span className="project-modal-badge category-badge">
                <Layers size={12} /> {project.category || 'Engineering Project'}
              </span>
              {project.year && (
                <span className="project-modal-badge year-badge">
                  <Calendar size={12} /> {project.year}
                </span>
              )}
            </div>

            <h2 className="project-modal-title">{project.title}</h2>

            <div className="project-modal-tech-list">
              {(project.technologies || []).map((tech, idx) => (
                <span key={idx} className="modal-tech-pill">{tech}</span>
              ))}
            </div>
          </div>

          {/* Top Media Showcase Frame */}
          <div className="project-modal-showcase">
            <div className="project-modal-media-frame">
              {isVideo ? (
                <div className="project-modal-video-container">
                  <iframe
                    src={`${getYouTubeEmbedUrl(project.thumbnail_url)}?rel=0&modestbranding=1`}
                    title={project.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : hasValidImage ? (
                <div className="project-modal-slide-wrapper">
                  <div 
                    className="project-modal-slide-bg" 
                    style={{ backgroundImage: `url(${displayImage})` }} 
                    aria-hidden="true"
                  />
                  <img 
                    src={displayImage} 
                    alt={project.title}
                    className="project-modal-slide-img"
                  />
                </div>
              ) : (
                <div className="project-modal-graphic-hero">
                  <div className="graphic-grid-overlay" />
                  <Sparkles size={36} className="graphic-hero-icon" />
                  <span className="graphic-hero-text">{project.title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Case Study Overview */}
          <div className="project-modal-section">
            <h3 className="section-subheading">Project Overview & Approach</h3>
            <p className="project-overview-text">{project.description}</p>
          </div>

          {/* Presentation / Research Context */}
          {project.presented_in && (
            <div className="project-modal-section context-section">
              <h3 className="section-subheading">Presentation & Research Context</h3>
              <div className="context-card">
                <Presentation size={18} className="context-icon" />
                <div className="context-details">
                  <span className="context-label">Presented in:</span>
                  {project.presented_in_url ? (
                    <a 
                      href={project.presented_in_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="context-link"
                    >
                      {project.presented_in} <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="context-name">{project.presented_in}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sources & Action Links */}
          {sources.length > 0 && (
            <div className="project-modal-section sources-section">
              <h3 className="section-subheading">Project Artifacts & Links</h3>
              <div className="project-sources-grid">
                {sources.map((source, idx) => (
                  <a 
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`modal-source-btn source-type-${source.type}`}
                  >
                    {getSourceIcon(source.type)}
                    <span>{source.label || 'View Resource'}</span>
                    <ArrowRight size={13} className="btn-arrow" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
