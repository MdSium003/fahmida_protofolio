import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadBlogsData } from '../src/utils/csvLoader';
import BlogHero from '../components/blog/BlogHero';
import CoverStory from '../components/blog/CoverStory';
import JournalTimeline from '../components/blog/JournalTimeline';
import MomentsStrip from '../components/blog/MomentsStrip';
import BlogDetailModal from '../components/blog/BlogDetailModal';
import ScrollReveal from '../components/shared/ScrollReveal';
import '../styles/BlogPage.css';

const BlogPage = () => {
  const [searchParams] = useSearchParams();
  const targetStoryId = searchParams.get('id') || searchParams.get('story') || searchParams.get('blog');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (targetStoryId && blogs.length > 0) {
      const found = blogs.find(b => String(b.id) === String(targetStoryId));
      if (found) {
        setActiveStory(found);
      }
    }
  }, [targetStoryId, blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await loadBlogsData();
      setBlogs(data || []);
    } catch (err) {
      console.error('Error loading blogs:', err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Cover Story (first entry) & Remaining Timeline entries
  const coverStory = blogs.length > 0 ? blogs[0] : null;
  const timelineStories = blogs.length > 1 ? blogs.slice(1) : blogs;

  return (
    <div className="blog-page-container">
      {/* 1. Hero Section */}
      <BlogHero />

      {loading ? (
        <div className="blog-loading-container">
          <div className="blog-loader" />
          <p>Loading visual journal...</p>
        </div>
      ) : (
        <>
          {/* 2. Magazine Cover Story (Dominant Visual Feature) */}
          {coverStory && (
            <ScrollReveal threshold={0} margin="0px 0px -20px 0px">
              <CoverStory 
                story={coverStory} 
                onOpenStory={(story) => setActiveStory(story)} 
              />
            </ScrollReveal>
          )}

          {/* 3. Chronological Visual Journal Timeline */}
          <JournalTimeline 
            stories={timelineStories} 
            onOpenStory={(story) => setActiveStory(story)} 
          />

          {/* 4. Moments From The Journey (Visual Media Strip) */}
          <ScrollReveal threshold={0} margin="0px 0px -20px 0px">
            <MomentsStrip />
          </ScrollReveal>
        </>
      )}

      {/* Interactive Story Detail Modal */}
      {activeStory && (
        <BlogDetailModal 
          story={activeStory} 
          onClose={() => setActiveStory(null)} 
        />
      )}
    </div>
  );
};

export default BlogPage;
