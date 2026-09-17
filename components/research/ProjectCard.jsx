import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink, BookOpen, Play, Code, File, X, ChevronLeft, ChevronRight, Github, Globe } from 'lucide-react';
import { parseAuthors, parseLinks, parseMedia } from '../../src/utils/csvLoader';

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const authors = React.useMemo(() => parseAuthors(project.authors), [project.authors]);
  const links = React.useMemo(() => parseLinks(project.links), [project.links]);
  const media = React.useMemo(() => parseMedia(project.media), [project.media]);

  const getLinkIcon = (type) => {
    switch (type) {
      case 'paper': return <FileText size={14} />;
      case 'preprint': return <File size={14} />;
      case 'abstract': return <BookOpen size={14} />;
      case 'video': return <Play size={14} />;
      case 'code': return <Code size={14} />;
      default: return <ExternalLink size={14} />;
    }
  };

  const getLinkLabel = (type) => {
    switch (type) {
      case 'paper': return 'PDF';
      case 'preprint': return 'Preprint';
      case 'abstract': return 'Abstract';
      case 'video': return 'Video';
      case 'code': return 'Code';
      case 'blog': return 'Blog';
      default: return 'Link';
    }
  };

  const openLightbox = (index) => {
    setCurrentMediaIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 
      ? `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`
      : null;
  };

  // Check if URL is a YouTube URL
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    const regExp = /^.*(youtu.be\/|youtube.com\/)/;
    return regExp.test(url);
  };

  // Get proper thumbnail URL (handles YouTube or regular images)
  const getThumbnailSrc = (url) => {
    if (!url) return null;
    if (isYouTubeUrl(url)) {
      return getYouTubeThumbnail(url);
    }
    return url;
  };

  return (
    <>
      <article 
        className={`project-card ${isHovered ? 'hovered' : ''}`}
        style={{ animationDelay: `${index * 0.15}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail - supports both static images and embedded YouTube */}
        <div className="project-thumbnail">
          {project.thumbnail_url ? (
            isYouTubeUrl(project.thumbnail_url) ? (
              // Embedded YouTube Player
              <div className="youtube-embed-wrapper">
                <iframe
                  src={`${getYouTubeEmbedUrl(project.thumbnail_url)}?rel=0&modestbranding=1`}
                  title={project.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : (
              // Static Image
              <img 
                src={project.thumbnail_url} 
                alt={project.title}
                loading="lazy"
              />
            )
          ) : (
            <div className="thumbnail-placeholder">
              <FileText size={48} />
            </div>
          )}
          {project.award && (
            <div className="award-badge">
               {project.award}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="project-content">
          {/* 1. Title */}
          <h3 className="project-title">{project.title}</h3>

          {/* 2. Authors - ordered with clickable links */}
          {authors.length > 0 && (
            <div className="project-authors">
              {authors.map((author, idx) => (
                <span key={author.id || idx} className="author-item">
                  {author.website || author.github_url ? (
                    <a 
                      href={author.website || author.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="author-link"
                      title={author.website ? 'Visit Website' : 'Visit GitHub'}
                    >
                      {author.name}
                      {author.github_url && !author.website && (
                        <Github size={12} className="author-icon" />
                      )}
                      {author.website && (
                        <Globe size={12} className="author-icon" />
                      )}
                    </a>
                  ) : (
                    <span className="author-name">{author.name}</span>
                  )}
                  {idx < authors.length - 1 && <span className="author-separator">, </span>}
                </span>
              ))}
            </div>
          )}

          {/* 3. Description / Publication Info */}
          {project.description && (
            <p className="project-venue">
              <span className="venue-text">{project.description}</span>
              {project.year && <span className="project-year">, {project.year}</span>}
            </p>
          )}

          {/* 4. Links (PDF, Abstract, Video, etc.) */}
          {links.length > 0 && (
            <div className="project-links">
              {links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`project-link link-${link.type}`}
                >
                  {getLinkIcon(link.type)}
                  <span>{getLinkLabel(link.type)}</span>
                </a>
              ))}
            </div>
          )}

          {/* 5. Media Gallery - at the bottom */}
          {media.length > 0 && (
            <div className="media-gallery">
              <div className="media-thumbnails">
                {media.slice(0, 4).map((item, idx) => (
                  <div 
                    key={item.id} 
                    className={`media-thumb ${idx === 3 && media.length > 4 ? 'has-more' : ''}`}
                    onClick={() => openLightbox(idx)}
                  >
                    {item.media_type === 'youtube' ? (
                      <img 
                        src={getYouTubeThumbnail(item.media_url)} 
                        alt={`Media ${idx + 1}`}
                      />
                    ) : (
                      <img 
                        src={item.media_url} 
                        alt={`Media ${idx + 1}`}
                      />
                    )}
                    {item.media_type === 'youtube' && (
                      <div className="play-overlay">
                        <Play size={16} fill="white" />
                      </div>
                    )}
                    {idx === 3 && media.length > 4 && (
                      <div className="more-overlay">
                        +{media.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Lightbox Modal */}
      {lightboxOpen && media.length > 0 && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <X size={24} />
            </button>
            
            {media.length > 1 && (
              <button className="lightbox-nav lightbox-prev" onClick={prevMedia}>
                <ChevronLeft size={32} />
              </button>
            )}

            <div className="lightbox-media">
              {media[currentMediaIndex].media_type === 'youtube' ? (
                <iframe
                  src={getYouTubeEmbedUrl(media[currentMediaIndex].media_url)}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img 
                  src={media[currentMediaIndex].media_url} 
                  alt={`Media ${currentMediaIndex + 1}`}
                />
              )}
            </div>

            {media.length > 1 && (
              <button className="lightbox-nav lightbox-next" onClick={nextMedia}>
                <ChevronRight size={32} />
              </button>
            )}

            {/* Thumbnail strip */}
            <div className="lightbox-thumbs">
              {media.map((item, idx) => (
                <div 
                  key={item.id}
                  className={`lightbox-thumb ${idx === currentMediaIndex ? 'active' : ''}`}
                  onClick={() => setCurrentMediaIndex(idx)}
                >
                  {item.media_type === 'youtube' ? (
                    <img src={getYouTubeThumbnail(item.media_url)} alt="" />
                  ) : (
                    <img src={item.media_url} alt="" />
                  )}
                </div>
              ))}
            </div>

            <div className="lightbox-counter">
              {currentMediaIndex + 1} / {media.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;
