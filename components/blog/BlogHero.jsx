import React from 'react';
import { Search, ArrowUpDown, Video, BookOpen, Layers } from 'lucide-react';

const BlogHero = ({ 
  selectedCategory, 
  onSelectCategory, 
  searchQuery, 
  onSearchChange,
  sortOrder,
  onToggleSort,
  counts = { all: 0, vlogs: 0, articles: 0 }
}) => {
  return (
    <section className="blog-hero-section" aria-label="Blog and Vlogs Journal Introduction">
      {/* Centered Editorial Title */}
      <h1 className="blog-hero-title">
        Blog & <span className="title-accent">Vlogs</span>
      </h1>

      <p className="blog-hero-description">
        Notes from the journey — things I build, research, learn, and experience through video logs and technical articles.
      </p>

      {/* Editorial Category Filter Pills */}
      <div className="blog-category-nav">
        <button 
          className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <Layers size={13} />
          <span>All Stories ({counts.all})</span>
        </button>

        <button 
          className={`category-pill ${selectedCategory === 'vlog' ? 'active' : ''}`}
          onClick={() => onSelectCategory('vlog')}
        >
          <Video size={13} />
          <span>Vlogs ({counts.vlogs})</span>
        </button>

        <button 
          className={`category-pill ${selectedCategory === 'article' ? 'active' : ''}`}
          onClick={() => onSelectCategory('article')}
        >
          <BookOpen size={13} />
          <span>Articles ({counts.articles})</span>
        </button>
      </div>

      {/* Sleek Minimal Toolbar */}
      <div className="blog-toolbar">
        <div className="blog-search-box">
          <Search size={15} className="blog-search-icon" />
          <input 
            type="text"
            placeholder="Search stories by topic, title or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="blog-search-input"
            id="blog-search"
          />
          {searchQuery && (
            <button 
              className="blog-search-clear" 
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <button 
          className="blog-sort-trigger"
          onClick={onToggleSort}
          aria-label={`Sort order: ${sortOrder === 'latest' ? 'Latest first' : 'Oldest first'}`}
        >
          <ArrowUpDown size={14} />
          <span>{sortOrder === 'latest' ? 'Latest' : 'Oldest'}</span>
        </button>
      </div>
    </section>
  );
};

export default BlogHero;
