import React from 'react';
import { Play, BookOpen, ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import { asset } from '../../src/utils/assetUrl';

const CoverStory = ({ story, onOpenStory }) => {
  if (!story) return null;

  const isVideo = story.isVlog || (story.media && story.media.includes('youtube'));
  const dateFormatted = story.published_date || story.date || 'Recent';
  const displayImage = story.coverImage || story.thumbnail_url || story.image || asset('/images/fahmida_blog.jpeg');

  return (
    <section className="cover-story-section" aria-label="Featured Cover Story">
      <div 
        className="cover-story-card" 
        onClick={() => onOpenStory(story)}
        role="button"
        tabIndex={0}
        aria-label={`Open cover story: ${story.title}`}
      >
        {/* Dominant Media Layer */}
        <div className="cover-media-layer">
          <img 
            src={displayImage} 
            alt={story.title} 
            className="cover-story-img"
            loading="eager"
decoding="async"/>
          <div className="cover-gradient-vignette" />
          
          {/* Subtle Video Play Badge if Vlog */}
          {isVideo && (
            <div className="cover-play-badge">
              <Play size={22} fill="currentColor" />
            </div>
          )}
        </div>

        {/* Editorial Content Overlay */}
        <div className="cover-content-layer">
          <div className="cover-meta-row">
            {story.category && (
              <span className="cover-badge">{story.category}</span>
            )}
            {story.location && (
              <>
                <span className="cover-divider-dot">•</span>
                <span className="cover-location-badge">
                  <MapPin size={12} /> {story.location}
                </span>
              </>
            )}
            <span className="cover-divider-dot">•</span>
            <span className="cover-date">
              <Calendar size={12} /> {dateFormatted}
            </span>
            <span className="cover-divider-dot">•</span>
            <span className="cover-type-badge">
              {isVideo ? <><Play size={11} fill="currentColor" /> VLOG</> : <><BookOpen size={11} /> {story.read_time || '6 min read'}</>}
            </span>
          </div>

          <h2 className="cover-story-title">{story.title}</h2>
          
          <p className="cover-story-summary">{story.description}</p>

          <button className="cover-action-btn" onClick={(e) => { e.stopPropagation(); onOpenStory(story); }}>
            <span>{isVideo ? 'Watch Story' : 'Read Full Story'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoverStory;
