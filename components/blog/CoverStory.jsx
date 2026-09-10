import React from 'react';
import { Play, BookOpen, ArrowRight, Calendar, Clock } from 'lucide-react';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length >= 11
    ? `https://img.youtube.com/vi/${match[2].substring(0, 11)}/maxresdefault.jpg`
    : '';
};

const CoverStory = ({ story, onOpenStory }) => {
  if (!story) return null;

  const isVideo = String(story.is_vlog).toLowerCase() === 'true' || Boolean(story.video_url);
  const dateFormatted = story.date || 'Recent';

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
            src={story.image || (isVideo ? getYouTubeEmbedUrl(story.video_url) : '/wall/research_1.jpg')} 
            alt={story.title} 
            className="cover-story-img"
            loading="eager"
          />
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
            <span className="cover-date">
              <Calendar size={12} /> {dateFormatted}
            </span>
            <span className="cover-divider-dot">•</span>
            <span className="cover-type-badge">
              {isVideo ? <><Play size={11} fill="currentColor" /> VLOG · WATCH</> : <><BookOpen size={11} /> ARTICLE · 06 MIN</>}
            </span>
          </div>

          <h2 className="cover-story-title">{story.title}</h2>
          
          <p className="cover-story-summary">{story.description}</p>

          <button className="cover-action-btn" onClick={(e) => { e.stopPropagation(); onOpenStory(story); }}>
            <span>{isVideo ? 'Watch Story' : 'Read Story'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoverStory;
