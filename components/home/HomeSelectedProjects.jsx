import React from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, ArrowRight, ArrowUpRight, Play, Eye } from 'lucide-react';
import ProjectGraphicFallback from '../projects/ProjectGraphicFallback';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length >= 11
    ? `https://img.youtube.com/vi/${match[2].substring(0, 11)}/maxresdefault.jpg`
    : '';
};

const parseKeywords = (kw) => {
  if (!kw) return [];
  return kw.split(/[,;]+/).map(k => k.trim()).filter(Boolean);
};

const HomeSelectedProjects = ({ projects = [] }) => {
  if (!projects || projects.length === 0) return null;

  // Curate 1 Flagship + 2 Supporting projects from the data-driven featured flags
  const featured = projects.filter(p => p.isFeatured || p.is_featured === true || String(p.is_featured).toLowerCase() === 'true');
  const flagship = featured[0] || projects[0];
  const supporting = (featured.length > 1 ? featured.slice(1, 3) : projects.filter(p => String(p.id) !== String(flagship?.id)).slice(0, 2));

  if (!flagship) return null;

  const getMediaInfo = (project) => {
    const isVideo = project.thumbnail_url && (project.thumbnail_url.includes('youtube') || project.thumbnail_url.includes('youtu.be'));
    const videoThumb = isVideo ? getYouTubeEmbedUrl(project.thumbnail_url) : '';
    const rawImage = project.image || project.thumbnail_url;
    const hasValidImage = (videoThumb || (rawImage && 
                          !rawImage.includes('mir_mehedi.jpg') && 
                          !rawImage.includes('youtube') && 
                          !rawImage.includes('youtu.be') &&
                          !rawImage.includes('example.com')));
    return { isVideo, displayImg: videoThumb || rawImage, hasValidImage };
  };

  const flagshipMedia = getMediaInfo(flagship);

  return (
    <section className="home-section home-selected-projects" aria-label="Selected Projects">
      <div className="home-section-container">
        {/* Section Header */}
        <div className="home-section-header">
          <h2 className="home-section-title">Flagship Systems & Engineering</h2>
          <p className="home-section-subtitle">
            A curated selection of technical software, computer vision architectures, and interactive tools.
          </p>
        </div>

        {/* 1. Large Dominant Flagship Project */}
        <article className="home-flagship-card">
          <div className="home-flagship-media">
            {flagshipMedia.hasValidImage ? (
              <div className="home-flagship-img-wrap">
                <img 
                  src={flagshipMedia.displayImg} 
                  alt={flagship.title}
                  className="home-flagship-img"
                  loading="lazy"
                />
                <div className="home-media-gradient-overlay" />
              </div>
            ) : (
              <ProjectGraphicFallback project={flagship} className="home-fallback-frame" />
            )}

            <div className="home-flagship-category-badge">
              <Eye size={12} />
              <span>{flagship.category || 'COMPUTER VISION & 3D'}</span>
            </div>

            {flagshipMedia.isVideo && (
              <div className="home-play-badge" title="Video Demo Available">
                <Play size={16} fill="currentColor" />
              </div>
            )}
          </div>

          <div className="home-flagship-content">
            <div className="home-flagship-tech-row">
              {parseKeywords(flagship.keywords).slice(0, 4).map((tech, idx) => (
                <span key={idx} className="home-tech-pill">{tech}</span>
              ))}
              {flagship.year && <span className="home-year-pill">{flagship.year}</span>}
            </div>

            <h3 className="home-flagship-title">{flagship.title}</h3>
            
            <p className="home-flagship-desc">
              {flagship.description}
            </p>

            <div className="home-flagship-footer">
              <Link to={`/projects?id=${flagship.id}`} className="home-boxed-btn primary-action">
                <span>Explore Project</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </article>

        {/* 2. Supporting Projects 2-Column Grid */}
        {supporting.length > 0 && (
          <div className="home-supporting-projects-grid">
            {supporting.map((proj) => {
              const media = getMediaInfo(proj);
              const techList = parseKeywords(proj.keywords).slice(0, 3);

              return (
                <article key={proj.id} className="home-supporting-project-card">
                  <div className="home-supporting-media">
                    {media.hasValidImage ? (
                      <div className="home-supporting-img-wrap">
                        <img 
                          src={media.displayImg} 
                          alt={proj.title}
                          className="home-supporting-img"
                          loading="lazy"
                        />
                        <div className="home-media-gradient-overlay" />
                      </div>
                    ) : (
                      <ProjectGraphicFallback project={proj} className="home-fallback-frame compact" />
                    )}

                    <span className="home-supporting-category">
                      {proj.category || techList[0] || 'ENGINEERING'}
                    </span>
                  </div>

                  <div className="home-supporting-content">
                    <div className="home-flagship-tech-row compact">
                      {techList.map((t, idx) => (
                        <span key={idx} className="home-tech-pill">{t}</span>
                      ))}
                    </div>

                    <h4 className="home-supporting-title">{proj.title}</h4>
                    <p className="home-supporting-desc">{proj.description}</p>

                    <div className="home-supporting-footer">
                      {proj.year && <span className="home-year-text">{proj.year}</span>}
                      <Link to={`/projects?id=${proj.id}`} className="home-boxed-btn">
                        <span>Explore Project</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Section Action: View All Projects */}
        <div className="home-section-bottom-action">
          <Link to="/projects" className="home-view-all-link">
            <span>View All Projects</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HomeSelectedProjects);
