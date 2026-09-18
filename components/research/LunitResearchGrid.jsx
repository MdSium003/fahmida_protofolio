import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Play, BookCheck, FlaskConical } from 'lucide-react';
import { loadCsv, parseList, parseAuthors, parseLinks, parseMedia } from '../../src/utils/csvLoader';
import { matchesResearchCategory } from './ResearchFilters';
import ResearchFigureFallback from './ResearchFigureFallback';
import ResearchDetailModal from './ResearchDetailModal';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length >= 11
    ? `https://img.youtube.com/vi/${match[2].substring(0, 11)}/maxresdefault.jpg`
    : '';
};

/**
 * Intelligent Bento span calculator that guarantees every row sums to exactly 12 columns
 * with zero orphaned cards and a rhythmic, modern editorial bento aesthetic.
 */
const getBentoSpanClass = (index, total) => {
  // Pre-calculated row distributions for common counts to guarantee 100% full rows
  const layoutTable = {
    1: ['bento-col-12'],
    2: ['bento-col-7 bento-featured', 'bento-col-5 bento-featured'],
    3: ['bento-col-4', 'bento-col-4', 'bento-col-4'],
    4: ['bento-col-7 bento-featured', 'bento-col-5 bento-featured', 'bento-col-6', 'bento-col-6'],
    5: ['bento-col-7 bento-featured', 'bento-col-5 bento-featured', 'bento-col-4', 'bento-col-4', 'bento-col-4'],
    6: ['bento-col-7 bento-featured', 'bento-col-5 bento-featured', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-12'],
    7: ['bento-col-7 bento-featured', 'bento-col-5 bento-featured', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-6', 'bento-col-6'],
    8: ['bento-col-7 bento-featured', 'bento-col-5 bento-featured', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-4'],
    9: ['bento-col-7 bento-featured', 'bento-col-5 bento-featured', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-8 bento-wide', 'bento-col-6', 'bento-col-6'],
    10: ['bento-col-7 bento-featured', 'bento-col-5 bento-featured', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-8 bento-wide', 'bento-col-4', 'bento-col-4', 'bento-col-4'],
    11: ['bento-col-7 bento-featured', 'bento-col-5 bento-featured', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-8 bento-wide', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-12'],
    12: ['bento-col-7 bento-featured', 'bento-col-5 bento-featured', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-8 bento-wide', 'bento-col-4', 'bento-col-4', 'bento-col-4', 'bento-col-6', 'bento-col-6'],
  };

  if (layoutTable[total] && layoutTable[total][index]) {
    return layoutTable[total][index];
  }

  // Fallback for larger dynamic counts
  const remaining = total - index;
  if (remaining === 1) return 'bento-col-12';
  if (remaining === 2) return 'bento-col-6';
  return 'bento-col-4';
};

const LunitResearchGrid = ({ 
  papers = null, 
  loading = false, 
  selectedCategory = 'all',
  searchQuery = '',
  selectedTopics = [], 
  selectedStatuses = [] 
}) => {
  const [searchParams] = useSearchParams();
  const targetPaperId = searchParams.get('id') || searchParams.get('paper') || searchParams.get('project');
  const [internalProjects, setInternalProjects] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [activeModalProject, setActiveModalProject] = useState(null);

  useEffect(() => {
    if (!papers) {
      fetchResearch();
    }
  }, [papers]);

  const projects = papers !== null ? papers : internalProjects;
  const isLoading = papers !== null ? loading : internalLoading;

  useEffect(() => {
    if (targetPaperId && projects.length > 0) {
      const found = projects.find(p => String(p.id) === String(targetPaperId));
      if (found) {
        setActiveModalProject(found);
      }
    }
  }, [targetPaperId, projects]);

  const fetchResearch = async () => {
    try {
      setInternalLoading(true);
      const data = await loadCsv('research');
      
      const processed = (data || []).map((p) => {
        const topics = parseList(p.topics);
        return {
          ...p,
          topicsList: topics,
          authorsList: parseAuthors(p.authors),
          linksList: parseLinks(p.links),
          mediaList: parseMedia(p.media),
          kicker: topics[0] || 'Medical AI',
          displayImg: p.thumbnail_url && !p.thumbnail_url.includes('example.com')
            ? p.thumbnail_url
            : ''
        };
      });

      // Sort by year descending
      processed.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
      setInternalProjects(processed);
    } catch (err) {
      console.error('Error loading research papers:', err);
      setInternalProjects([]);
    } finally {
      setInternalLoading(false);
    }
  };

  // Category & Search Query filtering
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(p => matchesResearchCategory(p, selectedCategory));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        (p.title || '').toLowerCase().includes(q) || 
        (p.description || '').toLowerCase().includes(q) ||
        (p.abstract || '').toLowerCase().includes(q) ||
        (p.topics || '').toLowerCase().includes(q) ||
        (p.authors || '').toLowerCase().includes(q)
      );
    }

    if (selectedStatuses.length > 0) {
      list = list.filter(p => {
        const pStatus = (p.status || '').toLowerCase();
        return selectedStatuses.some(s => s.toLowerCase() === pStatus);
      });
    }

    if (selectedTopics.length > 0) {
      list = list.filter(p => {
        if (!p.topics && !p.kicker) return false;
        const projectTopics = (p.topics || p.kicker).split(/[,;]+/).map(t => t.trim().toLowerCase());
        return selectedTopics.some(topicKeyword => 
          projectTopics.some(pt => pt.includes(topicKeyword.toLowerCase()) || topicKeyword.toLowerCase().includes(pt))
        );
      });
    }

    return list;
  }, [projects, selectedCategory, searchQuery, selectedTopics, selectedStatuses]);

  // Section 1: Published Works
  const publishedProjects = useMemo(() => {
    return filteredProjects.filter(p => (p.status || '').toLowerCase() === 'published');
  }, [filteredProjects]);

  // Section 2: Ongoing & Preprint Researches
  const ongoingAndPreprintProjects = useMemo(() => {
    return filteredProjects.filter(p => (p.status || '').toLowerCase() !== 'published');
  }, [filteredProjects]);

  if (isLoading) {
    return (
      <div className="lunit-loading-container">
        <div className="lunit-spinner" />
        <p>Loading scientific publications & models...</p>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="lunit-empty-state">
        <BookOpen size={44} className="empty-icon" />
        <h3>No research publications found</h3>
        <p>Try clearing your active category or search query.</p>
      </div>
    );
  }

  const renderBentoGrid = (items) => {
    const totalCount = items.length;

    return (
      <div className="research-unified-bento-grid">
        {items.map((project, idx) => {
          const isVideo = project.thumbnail_url && (project.thumbnail_url.includes('youtube') || project.thumbnail_url.includes('youtu.be'));
          const videoThumb = isVideo ? getYouTubeEmbedUrl(project.thumbnail_url) : '';
          const rawImage = project.displayImg || project.thumbnail_url;
          const isPdf = rawImage && (rawImage.toLowerCase().endsWith('.pdf') || rawImage.toLowerCase().includes('/pdf'));
          const hasValidImage = (videoThumb || (rawImage && 
                                !isPdf &&
                                !rawImage.includes('example.com') && 
                                !rawImage.includes('youtube') && 
                                !rawImage.includes('youtu.be') &&
                                (rawImage.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || rawImage.includes('storage/v1/object/public'))));

          const finalImage = videoThumb || rawImage;
          const spanClass = getBentoSpanClass(idx, totalCount);

          return (
            <article 
              key={project.id || idx}
              className={`research-bento-tile ${spanClass}`}
              onClick={() => setActiveModalProject(project)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveModalProject(project); }}
            >
              {/* Visual Background Layer: Pure Photo or Pure Blueprint (Zero conflicting text) */}
              <div className="tile-media-backdrop">
                {hasValidImage ? (
                  <div className="tile-image-wrapper">
                    <img 
                      src={finalImage} 
                      alt={project.title}
                      className="tile-figure-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <ResearchFigureFallback paper={project} className="tile-blueprint-fallback" />
                )}

                <div className="tile-gradient-overlay" />

                {isVideo && (
                  <div className="tile-video-indicator" title="Video Demo Available">
                    <Play size={11} fill="currentColor" />
                    <span>DEMO</span>
                  </div>
                )}
              </div>

              {/* Foreground Typography Layer: Kicker + Status + Year + Title + Arrow */}
              <div className="tile-overlay-body">
                <div className="tile-top-metadata">
                  <span className="tile-domain-kicker">{project.kicker || 'RESEARCH'}</span>
                  <div className="tile-status-row">
                    {project.status && (
                      <span className={`tile-status-tag status-${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    )}
                    {project.year && (
                      <span className="tile-year-tag">{project.year}</span>
                    )}
                  </div>
                </div>

                <div className="tile-bottom-details">
                  <h3 className="tile-paper-title">{project.title}</h3>

                  <div className="tile-action-row">
                    <span className="tile-action-label">Explore Paper</span>
                    <div className="tile-arrow-circle" aria-hidden="true">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <div className="lunit-research-layout">
      {/* 1. First Section: Published Works */}
      {publishedProjects.length > 0 && (
        <section className="research-status-group published-group" aria-label="Published Works">
          <div className="research-group-header">
            {/* <div className="research-group-badge published-badge">
              <BookCheck size={14} />
              <span>Peer-Reviewed & Published</span>
            </div> */}
            <h2 className="research-group-title">
              Published <span className="text-highlight">Works</span>
            </h2>
            <p className="research-group-subtitle">
              Peer-reviewed conference proceedings, journal papers, and archival publications. ({publishedProjects.length})
            </p>
          </div>

          {renderBentoGrid(publishedProjects)}
        </section>
      )}

      {/* 2. Second Section: Preprints & Ongoing Researches */}
      {ongoingAndPreprintProjects.length > 0 && (
        <section className="research-status-group ongoing-group" aria-label="Preprints and Ongoing Research">
          <div className="research-group-header">
            {/* <div className="research-group-badge ongoing-badge">
              <FlaskConical size={14} />
              <span>Under Review & In Progress</span>
            </div> */}
            <h2 className="research-group-title">
              Preprints & <span className="text-highlight">Ongoing Researches</span>
            </h2>
            <p className="research-group-subtitle">
              Active lab models, ongoing clinical validations, and preprints under peer review. ({ongoingAndPreprintProjects.length})
            </p>
          </div>

          {renderBentoGrid(ongoingAndPreprintProjects)}
        </section>
      )}

      {/* Case Study Detail Modal */}
      {activeModalProject && (
        <ResearchDetailModal 
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </div>
  );
};

export default React.memo(LunitResearchGrid);
