import React, { useState, useEffect, useMemo } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'vlog' | 'article'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' | 'oldest'
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

  // Filter & Sort
  const filteredStories = useMemo(() => {
    let list = [...blogs];

    // Category Filter
    if (selectedCategory === 'vlog') {
      list = list.filter(b => b.isVlog);
    } else if (selectedCategory === 'article') {
      list = list.filter(b => !b.isVlog);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(b => 
        (b.title || '').toLowerCase().includes(q) || 
        (b.description || '').toLowerCase().includes(q) ||
        (b.published_date || '').toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      const dateA = new Date(a.published_date || 0);
      const dateB = new Date(b.published_date || 0);
      if (dateB - dateA !== 0) {
        return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
      }
      return sortOrder === 'latest' ? (Number(b.id) || 0) - (Number(a.id) || 0) : (Number(a.id) || 0) - (Number(b.id) || 0);
    });

    return list;
  }, [blogs, selectedCategory, searchQuery, sortOrder]);

  // Counts
  const counts = useMemo(() => {
    const vlogs = blogs.filter(b => b.isVlog).length;
    const articles = blogs.filter(b => !b.isVlog).length;
    return { all: blogs.length, vlogs, articles };
  }, [blogs]);

  // Cover Story (first entry if not searching, or top result)
  const coverStory = filteredStories.length > 0 ? filteredStories[0] : null;
  const timelineStories = filteredStories.length > 1 ? filteredStories.slice(1) : filteredStories;

  return (
    <div className="blog-page-container">
      {/* 1. Hero Section & Filter Controls */}
      <BlogHero 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onToggleSort={() => setSortOrder(prev => prev === 'latest' ? 'oldest' : 'latest')}
        counts={counts}
      />

      {loading ? (
        <div className="blog-loading-container">
          <div className="blog-loader" />
          <p>Loading visual journal...</p>
        </div>
      ) : (
        <>
          {/* 2. Magazine Cover Story (Dominant Visual Feature) */}
          {!searchQuery && coverStory && (
            <ScrollReveal threshold={0} margin="0px 0px -20px 0px">
              <CoverStory 
                story={coverStory} 
                onOpenStory={(story) => setActiveStory(story)} 
              />
            </ScrollReveal>
          )}

          {/* 3. Chronological Visual Journal Timeline */}
          <JournalTimeline 
            stories={searchQuery ? filteredStories : timelineStories} 
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
