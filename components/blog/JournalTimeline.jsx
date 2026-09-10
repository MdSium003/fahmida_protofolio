import React from 'react';
import { Play, BookOpen, ArrowRight, Calendar, ExternalLink } from 'lucide-react';

const JournalTimeline = ({ stories, onOpenStory }) => {
  if (!stories || stories.length === 0) {
    return (
      <div className="journal-empty-state">
        <p>No journal entries match your filter.</p>
      </div>
    );
  }

  return (
    <section className="journal-timeline-section" aria-label="Chronological Visual Journal">
      <div className="journal-timeline-track">
        {stories.map((story, index) => {
          const isVideo = story.isVlog || (story.media && story.media.includes('youtube'));
          const dateObj = story.published_date ? new Date(story.published_date) : null;
          const monthYear = dateObj 
            ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '2026';
          
          const isEven = index % 2 === 0;

          return (
            <article 
              key={story.id || index}
              className={`timeline-entry-row ${isEven ? 'layout-image-left' : 'layout-image-right'}`}
            >
              {/* Timeline Center Node Indicator */}
              <div className="timeline-node-marker" aria-hidden="true">
                <span className="node-dot" />
                <span className="node-stem" />
              </div>

              {/* Story Visual Media Frame */}
              <div className="timeline-media-column" onClick={() => onOpenStory(story)}>
                <div className="timeline-media-frame">
                  <img 
                    src={story.coverImage || story.thumbnail_url} 
                    alt={story.title}
                    className="timeline-image"
                    loading="lazy"
                  />
                  <div className="timeline-image-overlay" />

                  {/* Video Play Overlay if Vlog */}
                  {isVideo && (
                    <div className="timeline-play-badge">
                      <Play size={18} fill="currentColor" />
                    </div>
                  )}

                  <span className="timeline-format-tag">
                    {isVideo ? 'VLOG' : 'ARTICLE'}
                  </span>
                </div>
              </div>

              {/* Story Content Narrative Column */}
              <div className="timeline-narrative-column">
                <div className="timeline-meta-bar">
                  <span className="timeline-date">
                    <Calendar size={12} /> {monthYear}
                  </span>
                  <span className="meta-bullet">•</span>
                  <span className="timeline-type">
                    {isVideo ? (
                      <><Play size={11} fill="currentColor" /> Video Log</>
                    ) : (
                      <><BookOpen size={11} /> Written Article</>
                    )}
                  </span>
                </div>

                <h3 
                  className="timeline-story-title"
                  onClick={() => onOpenStory(story)}
                >
                  {story.title}
                </h3>

                <p className="timeline-story-summary">
                  {story.description}
                </p>

                <div className="timeline-actions-row">
                  <button 
                    className="timeline-action-btn"
                    onClick={() => onOpenStory(story)}
                  >
                    <span>{isVideo ? 'Watch Vlog' : 'Read Article'}</span>
                    <ArrowRight size={14} />
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

export default JournalTimeline;
