import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Play, BookOpen, ArrowRight, Calendar } from 'lucide-react';

const JournalTimeline = ({ stories, onOpenStory }) => {
  const prefersReducedMotion = useReducedMotion();

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

          if (prefersReducedMotion) {
            return (
              <article 
                key={story.id || index}
                className={`timeline-entry-row ${isEven ? 'layout-image-left' : 'layout-image-right'}`}
              >
                <div className="timeline-node-marker" aria-hidden="true">
                  <span className="node-dot" />
                  <span className="node-stem" />
                </div>

                <div className="timeline-media-column" onClick={() => onOpenStory(story)}>
                  <div className="timeline-media-frame">
                    <img 
                      src={story.coverImage || story.thumbnail_url} 
                      alt={story.title}
                      className="timeline-image"
                      loading="lazy"
                    />
                    <div className="timeline-image-overlay" />
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

                  <h3 className="timeline-story-title" onClick={() => onOpenStory(story)}>
                    {story.title}
                  </h3>

                  <p className="timeline-story-summary">{story.description}</p>

                  <div className="timeline-actions-row">
                    <button className="timeline-action-btn" onClick={() => onOpenStory(story)}>
                      <span>{isVideo ? 'Watch Vlog' : 'Read Article'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          }

          return (
            <motion.article 
              key={story.id || index}
              className={`timeline-entry-row ${isEven ? 'layout-image-left' : 'layout-image-right'}`}
              initial={{ opacity: 0, y: 44, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.16, margin: "0px 0px -50px 0px" }}
              transition={{ 
                duration: 0.65, 
                ease: [0.22, 1, 0.36, 1] 
              }}
            >
              {/* Timeline Center Node Indicator with Spring Pop */}
              <motion.div 
                className="timeline-node-marker" 
                aria-hidden="true"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.16 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.12, 
                  ease: [0.34, 1.56, 0.64, 1] 
                }}
              >
                <span className="node-dot" />
                <span className="node-stem" />
              </motion.div>

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
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default JournalTimeline;
