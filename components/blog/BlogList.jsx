import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { loadCsv } from '../../src/utils/csvLoader';
import BlogCard from './BlogCard';
import { Search, ArrowUpDown } from 'lucide-react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Debounce search for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await loadCsv('blogs');
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Efficient filtered & sorted blogs with useMemo
  const filteredBlogs = useMemo(() => {
    let result = [...blogs];
    
    // Search filter - exact phrase match in title and description
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase().trim();
      
      result = result.filter(blog => {
        const titleLower = (blog.title || '').toLowerCase();
        const descLower = (blog.description || '').toLowerCase();
        
        // Exact phrase match - "Vlog 1" only matches blogs containing "vlog 1"
        return titleLower.includes(query) || descLower.includes(query);
      });
    }
    
    // Sort by date, then by ID as a fallback (stable sort)
    result.sort((a, b) => {
      const dateA = new Date(a.published_date || 0);
      const dateB = new Date(b.published_date || 0);
      
      if (dateB - dateA !== 0) {
        return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
      }
      // If dates are same, sort by ID to keep order stable
      return sortOrder === 'latest' ? b.id - a.id : a.id - b.id;
    });
    
    return result;
  }, [blogs, debouncedQuery, sortOrder]);

  // Handle search input
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="blog-list">
        <div className="blog-list-header">
          <h2 className="blog-list-title">
            <span className="blog-title-icon"></span> Blog & Vlogs
          </h2>
          <p className="blog-list-subtitle">Insights, tutorials, and creative content</p>
        </div>
        <div className="blog-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="blog-skeleton">
              <div className="blog-skeleton-thumb"></div>
              <div className="blog-skeleton-content">
                <div className="blog-skeleton-title"></div>
                <div className="blog-skeleton-text"></div>
                <div className="blog-skeleton-text short"></div>
                <div className="blog-skeleton-links"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="blog-list">
      {/* Header */}
      <div className="blog-list-header">
        <div className="blog-header-top">
          <div>
            <h2 className="blog-list-title">
              <span className="blog-title-icon"></span> Blog & Vlogs
            </h2>
            <p className="blog-list-subtitle">
              Insights, tutorials, and creative content · {blogs.length} posts
            </p>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="blog-toolbar">
          <div className="blog-search-wrapper">
            <Search size={16} className="blog-search-icon" />
            <input 
              type="text"
              placeholder="Search by title, description, or date..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="blog-search-input"
              id="blog-search"
            />
          </div>
          <div className="blog-sort-wrapper">
            <button 
              className="blog-sort-btn"
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              <ArrowUpDown size={14} />
              <span>{sortOrder === 'latest' ? 'Latest' : 'Oldest'}</span>
            </button>
            {showSortMenu && (
              <div className="blog-sort-menu">
                <button 
                  className={sortOrder === 'latest' ? 'active' : ''}
                  onClick={() => { setSortOrder('latest'); setShowSortMenu(false); }}
                >
                  Latest First
                </button>
                <button 
                  className={sortOrder === 'oldest' ? 'active' : ''}
                  onClick={() => { setSortOrder('oldest'); setShowSortMenu(false); }}
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search result info */}
      {debouncedQuery.trim() && (
        <div className="blog-search-info">
          <span>
            Found <strong>{filteredBlogs.length}</strong> result{filteredBlogs.length !== 1 ? 's' : ''} for "<strong>{debouncedQuery}</strong>"
          </span>
          <button className="blog-clear-search" onClick={clearSearch}>Clear</button>
        </div>
      )}

      {/* Blog Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="blog-grid">
          {filteredBlogs.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </div>
      ) : (
        <div className="blog-empty-state">
          <span className="blog-empty-icon"></span>
          <h3>No blogs found</h3>
          <p>
            {debouncedQuery 
              ? `No results for "${debouncedQuery}". Try a different search term.`
              : 'No blog posts available yet. Check back soon!'}
          </p>
          {debouncedQuery && (
            <button className="blog-clear-search" onClick={clearSearch} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogList;
