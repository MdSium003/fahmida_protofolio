import React from 'react';
import { Search, Layers, Cpu, Eye, Bot, FileText, X } from 'lucide-react';

export const RESEARCH_CATEGORIES = [
  { id: 'all', label: 'All Research', icon: <Layers size={13} /> },
  { id: 'clinical-ai', label: 'Clinical AI & Deep Learning', icon: <Cpu size={13} /> },
  { id: 'vision', label: 'Computer Vision & Imaging', icon: <Eye size={13} /> },
  { id: 'llm', label: 'LLMs & Multi-Agent', icon: <Bot size={13} /> },
  { id: 'nlp', label: 'NLP & Datasets', icon: <FileText size={13} /> }
];

export function matchesResearchCategory(paper, categoryId) {
  if (!categoryId || categoryId === 'all') return true;
  const combined = `${paper.topics || ''} ${paper.title || ''} ${paper.description || ''} ${paper.abstract || ''}`.toLowerCase();
  
  switch (categoryId) {
    case 'clinical-ai':
      return combined.includes('deep learning') || 
             combined.includes('clinical') || 
             combined.includes('medical') || 
             combined.includes('tumor') || 
             combined.includes('radiology');
    case 'vision':
      return combined.includes('computer vision') || 
             combined.includes('image & video') || 
             combined.includes('image') || 
             combined.includes('video') || 
             combined.includes('segmentation') || 
             combined.includes('optical flow');
    case 'llm':
      return combined.includes('llm') || 
             combined.includes('multi-agent') || 
             combined.includes('agent') || 
             combined.includes('reasoning') || 
             combined.includes('llama');
    case 'nlp':
      return combined.includes('natural language') || 
             combined.includes('nlp') || 
             combined.includes('summarization') || 
             combined.includes('telemedicine') || 
             combined.includes('dataset') || 
             combined.includes('conversations') || 
             combined.includes('hci');
    default:
      return true;
  }
}

const ResearchFilters = ({ 
  selectedCategory, 
  onSelectCategory, 
  searchQuery, 
  onSearchChange,
  categoryCounts = {}
}) => {
  return (
    <div className="research-filters-wrapper">
      {/* Category Filter Pills (Same as ProjectFilters) */}
      <div className="research-category-pills">
        {RESEARCH_CATEGORIES.map((cat) => {
          const count = categoryCounts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              className={`research-filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              {cat.icon}
              <span>{cat.label}</span>
              {count > 0 && <span className="pill-count">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Search Input Box */}
      <div className="research-search-box">
        <Search size={15} className="research-search-icon" />
        <input 
          type="text"
          placeholder="Filter publications by keyword, model or title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="research-search-input"
          id="research-search"
        />
        {searchQuery && (
          <button 
            className="research-search-clear" 
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(ResearchFilters);
