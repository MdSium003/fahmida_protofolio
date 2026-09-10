import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PiFunnelSimpleBold } from 'react-icons/pi';
import { BsCheckLg } from 'react-icons/bs';
import { 
  X, RotateCcw, BookOpen, 
  SlidersHorizontal, Tag
} from 'lucide-react';
import '../../styles/ResearchFilterDisclosure.css';

const TOPIC_OPTIONS = [
  { id: 'deep-learning', label: 'Deep Learning', keyword: 'Deep Learning' },
  { id: 'image-video-understanding', label: 'Image & Video', keyword: 'Image & Video Understanding' },
  { id: 'llm', label: 'LLM', keyword: 'LLM' },
  { id: 'computer-vision', label: 'Computer Vision', keyword: 'Computer Vision' },
  { id: 'nlp', label: 'NLP', keyword: 'Natural Language Processing' },
  { id: 'hci', label: 'HCI', keyword: 'HCI' },
  { id: 'computer-graphics', label: 'Graphics', keyword: 'Computer Graphics' },
  { id: 'ar-vr', label: 'AR/VR', keyword: 'AR/VR' },
];

const STATUS_OPTIONS = [
  { id: 'published', label: 'Published', value: 'published' },
  { id: 'preprint', label: 'Preprint', value: 'preprint' },
  { id: 'ongoing', label: 'Ongoing', value: 'ongoing' },
];

const ResearchFilterDisclosure = ({ 
  selectedTopics = [], 
  onTopicsChange, 
  selectedStatuses = [], 
  onStatusesChange 
}) => {
  const [open, setOpen] = useState(false);

  // Close on ESC key and lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Toggle topic
  const toggleTopic = (keyword) => {
    if (selectedTopics.includes(keyword)) {
      onTopicsChange(selectedTopics.filter(t => t !== keyword));
    } else {
      onTopicsChange([...selectedTopics, keyword]);
    }
  };

  // Toggle status
  const toggleStatus = (statusVal) => {
    if (selectedStatuses.includes(statusVal)) {
      onStatusesChange(selectedStatuses.filter(s => s !== statusVal));
    } else {
      onStatusesChange([...selectedStatuses, statusVal]);
    }
  };

  const handleClearAll = () => {
    onTopicsChange([]);
    onStatusesChange([]);
  };

  const totalActiveCount = selectedTopics.length + selectedStatuses.length;

  return (
    <div className="filter-disclosure-wrapper">
      {/* =================================================================
          CENTERED TRIGGER BUTTON
          ================================================================= */}
      <div className="filter-trigger-container">
        <button
          onClick={() => setOpen(true)}
          className={`filter-funnel-trigger-btn ${totalActiveCount > 0 ? 'has-active' : ''}`}
          aria-label="Open filter options"
        >
          <div className="trigger-icon-wrap">
            <PiFunnelSimpleBold size={18} className="funnel-icon" />
          </div>
          <span className="trigger-label-text">
            {totalActiveCount > 0 ? `Filters (${totalActiveCount})` : 'Filter Publications'}
          </span>
          {totalActiveCount > 0 && (
            <span className="trigger-pulse-dot" />
          )}
        </button>

        {/* Quick Clear Button if active */}
        {totalActiveCount > 0 && (
          <button
            onClick={handleClearAll}
            className="quick-reset-btn"
            title="Clear all filters"
          >
            <X size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* =================================================================
          CENTERED POPUP DIALOG WITH BACKDROP
          ================================================================= */}
      <AnimatePresence>
        {open && (
          <div 
            className="filter-modal-backdrop" 
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="filter-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel Top Header */}
              <div className="panel-header">
                <div className="panel-title-group">
                  <SlidersHorizontal size={17} className="panel-icon" />
                  <span className="panel-title">Filter Publications</span>
                  {totalActiveCount > 0 && (
                    <span className="active-badge">{totalActiveCount} active</span>
                  )}
                </div>

                <div className="panel-actions">
                  {totalActiveCount > 0 && (
                    <button 
                      className="btn-clear-filters" 
                      onClick={handleClearAll}
                      title="Reset all filters"
                    >
                      <RotateCcw size={12} />
                      <span>Reset</span>
                    </button>
                  )}
                  <button 
                    className="btn-close-panel" 
                    onClick={() => setOpen(false)}
                    aria-label="Close filter panel"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Category 1: Research Topics (Compact Chips Layout) */}
              <div className="filter-category-section">
                <div className="category-heading">
                  <Tag size={13} className="cat-icon" />
                  <span>Research Topics & Domains</span>
                </div>

                <div className="filter-chips-wrap">
                  {TOPIC_OPTIONS.map((item) => {
                    const isSelected = selectedTopics.includes(item.keyword);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleTopic(item.keyword)}
                        className={`filter-chip-btn ${isSelected ? 'is-selected' : ''}`}
                      >
                        <span className="chip-label">{item.label}</span>
                        {isSelected && <BsCheckLg size={11} className="chip-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 2: Publication Status */}
              <div className="filter-category-section">
                <div className="category-heading">
                  <BookOpen size={13} className="cat-icon" />
                  <span>Publication Status</span>
                </div>

                <div className="status-items-row">
                  {STATUS_OPTIONS.map((item) => {
                    const isSelected = selectedStatuses.includes(item.value);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleStatus(item.value)}
                        className={`status-item-pill ${isSelected ? 'is-selected' : ''} status-${item.value}`}
                      >
                        <div className={`checkbox-dot ${isSelected ? 'checked' : ''}`} />
                        <span className="status-label">{item.label}</span>
                        {isSelected && <BsCheckLg size={11} className="check-icon-mini" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Footer Actions */}
              <div className="panel-footer">
                <span className="footer-summary">
                  {totalActiveCount === 0 
                    ? 'Showing all papers' 
                    : `${totalActiveCount} selected`}
                </span>
                <button 
                  type="button" 
                  className="btn-done-filter" 
                  onClick={() => setOpen(false)}
                >
                  <span>Apply & Close</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResearchFilterDisclosure;
