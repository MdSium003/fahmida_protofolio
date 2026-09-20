import React from 'react';
import { ExternalLink, ArrowRight, Play, BookOpen, FileText } from 'lucide-react';
import ResearchFigureFallback from './ResearchFigureFallback';
import { asset } from '../../src/utils/assetUrl';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length >= 11
    ? `https://img.youtube.com/vi/${match[2].substring(0, 11)}/maxresdefault.jpg`
    : '';
};

/**
 * Format authors concisely for the collapsed card (e.g., "**F. Sultana**, M. Shawon, et al.")
 */
const formatShortAuthors = (authorsList) => {
  if (!authorsList || authorsList.length === 0) {
    return (
      <span className="author-name me-highlight">Mst. Fahmida Sultana Naznin</span>
    );
  }

  // Format first name initial + last name for clean academic citation
  const formatName = (fullName) => {
    if (!fullName) return '';
    const clean = fullName.replace(/^Dr\.\s+/i, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length <= 1) return clean;
    const lastName = parts[parts.length - 1];
    const initials = parts.slice(0, -1).map(p => p[0] + '.').join(' ');
    return `${initials} ${lastName}`;
  };

  const formattedItems = authorsList.slice(0, 3).map((author, index) => {
    const isMe = author.isMe || 
      author.name.toLowerCase().includes('fahmida') || 
      author.name.toLowerCase().includes('sultana') || 
      author.name.toLowerCase().includes('naznin');

    const display = formatName(author.name);

    return (
      <span key={index} className={`author-item ${isMe ? 'me-highlight font-semibold text-[#a8c66c]' : 'text-neutral-400'}`}>
        {display}
      </span>
    );
  });

  return (
    <div className="pub-authors-line text-xs leading-relaxed truncate">
      {formattedItems.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="author-separator text-neutral-500">, </span>}
          {item}
        </React.Fragment>
      ))}
      {authorsList.length > 3 && <span className="author-etal text-neutral-500"> et al.</span>}
    </div>
  );
};

const PublicationCard = ({ publication, onSelect }) => {
  const {
    title,
    venue,
    year,
    status = 'published',
    category = [],
    topicsList = [],
    coverImage,
    thumbnail_url,
    externalUrl,
    hasDemo,
    authorsList = []
  } = publication;

  const primaryCategory = category[0] || topicsList[0] || 'Clinical AI';
  const isVideo = coverImage && (coverImage.includes('youtube') || coverImage.includes('youtu.be'));
  const videoThumb = isVideo ? getYouTubeEmbedUrl(coverImage) : '';
  const finalImage = videoThumb || coverImage || thumbnail_url;

  const hasValidImage = finalImage && 
    !finalImage.includes('example.com') && 
    !finalImage.endsWith('.pdf') &&
    (finalImage.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || finalImage.startsWith(asset('/wall/')) || finalImage.startsWith('http'));

  const statusLower = String(status).toLowerCase();
  const statusLabel = statusLower === 'published' ? 'Published' : (statusLower === 'preprint' ? 'Preprint' : 'Ongoing');

  // Handle direct paper link click without opening modal
  const handleDirectLink = (e) => {
    e.stopPropagation();
    if (externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
    } else if (onSelect) {
      onSelect(publication);
    }
  };

  return (
    <article 
      className="pub-card group"
      onClick={() => onSelect && onSelect(publication)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(publication);
        }
      }}
    >
      {/* 1. Cover Image (16:9 Aspect Ratio) with Overlaid Badges */}
      <div className="pub-card-cover-container">
        {hasValidImage ? (
          <img 
            src={finalImage} 
            alt={title}
            className="pub-card-cover-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.classList.add('fallback-active');
              }
            }}            decoding="async"
          />
        ) : (
          <ResearchFigureFallback paper={publication} className="pub-card-fallback" />
        )}

        {/* Gradient Scrim for Legibility */}
        <div className="pub-cover-scrim" />

        {/* Overlaid Badges Header (Flex containment prevents any badge collision) */}
        <div className="pub-card-badge-header">
          <div className="pub-badge-left">
            <span className="pub-category-chip" title={primaryCategory}>
              {primaryCategory}
            </span>
          </div>

          <div className="pub-badge-right">
            {hasDemo && (
              <span className="pub-demo-chip" title="Interactive Demo / Video Available">
                <Play size={10} fill="currentColor" />
                <span>Demo</span>
              </span>
            )}
            <span className={`pub-status-chip status-${statusLower}`}>
              {statusLabel}
            </span>
            {year && (
              <span className="pub-year-chip">
                {year}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="pub-card-body">
        {/* Title: Bold Serif with 2-line clamp */}
        <h3 className="pub-card-title font-serif" title={title}>
          {title}
        </h3>

        {/* Venue Line: Directly under title, styled distinctly */}
        <div className="pub-venue-line">
          <BookOpen size={13} className="pub-venue-icon" />
          <span className="pub-venue-text">
            {venue ? `${venue} · ${year}` : `${statusLabel} · ${year}`}
          </span>
        </div>

        {/* Short Author Line with Fahmida Emphasized */}
        <div className="pub-authors-wrapper">
          {formatShortAuthors(authorsList)}
        </div>

        {/* 3. Footer Action Row */}
        <div className="pub-card-footer">
          {/* Action A: Direct External Link (PDF / DOI) - Only if genuine link exists */}
          {externalUrl ? (
            <button 
              type="button"
              onClick={handleDirectLink}
              className="pub-direct-link-btn"
              title="Open Paper / PDF in new tab"
              aria-label={`Read full PDF for ${title} in new tab`}
            >
              <FileText size={13} />
              <span>Read PDF</span>
              <ExternalLink size={12} className="pub-ext-icon" />
            </button>
          ) : null}

          {/* Action B: View Details Modal Trigger */}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect(publication);
            }}
            className="pub-details-trigger-btn"
            aria-label={`View details modal for ${title}`}
          >
            <span>View Details</span>
            <ArrowRight size={13} className="pub-arrow-icon" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default React.memo(PublicationCard);
