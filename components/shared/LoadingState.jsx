import React from 'react';
import '../../styles/LoadingState.css';

/**
 * Shared skeleton placeholder for CSV-driven page content.
 *
 * Replaces four separate spinner implementations plus one ad-hoc skeleton.
 * Skeletons are used rather than spinners because the real problem on Home
 * and Research was layout jump: a spinner occupies no meaningful space, so
 * content snapped in and shifted the page. These blocks reserve it.
 *
 * @param {string} variant — 'page' | 'grid' | 'list' | 'hero'
 * @param {number} count   — number of repeated blocks (grid/list only)
 * @param {string} label   — announced to assistive tech; not shown visually
 */
const LoadingState = ({ variant = 'page', count = 6, label = 'Loading content' }) => {
  const blocks = Array.from({ length: count });

  return (
    <div
      className={`loading-state loading-state--${variant}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="loading-state__sr">{label}…</span>

      {variant === 'hero' && (
        <div className="loading-state__hero" aria-hidden="true">
          <div className="skeleton loading-state__bar loading-state__bar--title" />
          <div className="skeleton loading-state__bar loading-state__bar--sub" />
        </div>
      )}

      {variant === 'list' && (
        <div className="loading-state__list" aria-hidden="true">
          {blocks.map((_, i) => (
            <div key={i} className="loading-state__row">
              <div className="skeleton loading-state__thumb" />
              <div className="loading-state__rowtext">
                <div className="skeleton loading-state__bar loading-state__bar--title" />
                <div className="skeleton loading-state__bar loading-state__bar--sub" />
              </div>
            </div>
          ))}
        </div>
      )}

      {(variant === 'grid' || variant === 'page') && (
        <div className="loading-state__grid" aria-hidden="true">
          {blocks.map((_, i) => (
            <div key={i} className="loading-state__card">
              <div className="skeleton loading-state__media" />
              <div className="skeleton loading-state__bar loading-state__bar--title" />
              <div className="skeleton loading-state__bar loading-state__bar--sub" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(LoadingState);
