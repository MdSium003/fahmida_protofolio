import React from 'react';
import { Search, Layers, Eye, Cpu, Bot, Globe } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Projects', icon: <Layers size={13} /> },
  { id: 'vision', label: 'Computer Vision & 3D', icon: <Eye size={13} /> },
  { id: 'ai', label: 'AI & Machine Learning', icon: <Cpu size={13} /> },
  { id: 'robotics', label: 'Robotics & IoT', icon: <Bot size={13} /> },
  { id: 'web', label: 'Web & Systems', icon: <Globe size={13} /> }
];

const ProjectFilters = ({ 
  selectedCategory, 
  onSelectCategory, 
  searchQuery, 
  onSearchChange,
  categoryCounts = {}
}) => {
  return (
    <div className="project-filters-wrapper">
      {/* Category Pills */}
      <div className="project-category-pills">
        {categories.map((cat) => {
          const count = categoryCounts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              className={`project-filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              {cat.icon}
              <span>{cat.label}</span>
              {count > 0 && <span className="pill-count">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="project-search-box">
        <Search size={15} className="project-search-icon" />
        <input 
          type="text"
          placeholder="Filter by keyword, tech or title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="project-search-input"
          id="project-search"
        />
        {searchQuery && (
          <button 
            className="project-search-clear" 
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectFilters;
