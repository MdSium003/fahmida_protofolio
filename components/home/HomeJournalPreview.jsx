import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, ArrowUpRight, Play, Calendar } from 'lucide-react';
import { parseMedia } from '../../src/utils/csvLoader';
import ScrollReveal from '../shared/ScrollReveal';
import StaggerReveal from '../shared/StaggerReveal';

const HomeJournalPreview = ({ blogs = [] }) => {
  if (!blogs || blogs.length === 0) return null;

  // Curate 3 recent entries from the journal
  const entries = blogs.slice(0, 3);

  const getMediaInfo = (post) => {
    const media = parseMedia(post.media);
    const hasVideo = (post.thumbnail_url && (post.thumbnail_url.includes('youtube') || post.thumbnail_url.includes('youtu.be'))) ||
                     media.some(m => m.media_type === 'youtube');
    const imageMedia = media.find(m => m.media_type === 'image' && !m.media_url.includes('example.com'));
    const displayImg = (post.thumbnail_url && !post.thumbnail_url.includes('youtube') && !post.thumbnail_url.includes('example.com'))
      ? post.thumbnail_url
      : (imageMedia ? imageMedia.media_url : '/wall/fahmida_blog_2.jpeg');

    return { hasVideo, displayImg };
  };

  return (
    <section className="home-section home-journal-section" aria-label="Journal and Publications">
      <div className="home-section-container">
        {/* Section Header */}
        <ScrollReveal>
          <div className="home-section-header">
            <h2 className="home-section-title">Field Notes, Vlogs & Reflections</h2>
            <p className="home-section-subtitle">
              Insights on engineering workflows, UI/UX systems, and technical explorations.
            </p>
          </div>
        </ScrollReveal>

        {/* 3-Column Editorial Journal Grid */}
        <StaggerReveal className="home-journal-grid" staggerDelay={0.1}>
          {entries.map((post) => {
            const { hasVideo, displayImg } = getMediaInfo(post);

            return (
              <article key={post.id} className="home-journal-card">
                <div className="home-journal-media-wrapper">
                  <img 
                    src={displayImg} 
                    alt={post.title}
                    className="home-journal-img"
                    loading="lazy"
                  />
                  <div className="home-journal-gradient-overlay" />

                  <div className="home-journal-type-pill">
                    {hasVideo ? (
                      <>
                        <Play size={10} fill="currentColor" />
                        <span>VLOG</span>
                      </>
                    ) : (
                      <span>ARTICLE</span>
                    )}
                  </div>
                </div>

                <div className="home-journal-body">
                  {post.published_date && (
                    <div className="home-journal-date-row">
                      <Calendar size={12} />
                      <span>{post.published_date}</span>
                    </div>
                  )}

                  <h3 className="home-journal-title">{post.title}</h3>
                  
                  <p className="home-journal-desc">
                    {post.description 
                      ? `${post.description.slice(0, 130)}...`
                      : 'Reflections and technical walkthroughs from my development and research journey.'}
                  </p>

                  <div className="home-journal-footer">
                    <Link to={`/blog?id=${post.id}`} className="home-boxed-btn">
                      <span>Read Story</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </StaggerReveal>

        {/* Section Action: Read The Journal */}
        <ScrollReveal>
          <div className="home-section-bottom-action">
            <Link to="/blog" className="home-view-all-link">
              <span>Explore The Full Journal</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default React.memo(HomeJournalPreview);
