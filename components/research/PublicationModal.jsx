import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Play, 
  BookOpen, 
  FileText, 
  Layers, 
  Calendar, 
  Quote, 
  Users,
  Code
} from 'lucide-react';
import ResearchFigureFallback from './ResearchFigureFallback';

const PublicationModal = ({ publication, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('abstract'); // 'abstract' | 'bibtex' | 'media'
  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    previousActiveElementRef.current = document.activeElement;
    
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button or modal container
    if (modalRef.current) {
      const focusable = modalRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      // Simple focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
    };
  }, [onClose]);

  if (!publication) return null;

  const {
    title,
    venue,
    year,
    status = 'published',
    category = [],
    topicsList = [],
    coverImage,
    thumbnail_url,
    abstract,
    description,
    externalUrl,
    hasDemo,
    demoUrl,
    authorsList = [],
    bibtex,
    mediaList = [],
    linksList = []
  } = publication;

  const statusLower = String(status).toLowerCase();
  const statusLabel = statusLower === 'published' ? 'Published' : (statusLower === 'preprint' ? 'Preprint' : 'Ongoing');
  const categories = category.length > 0 ? category : (topicsList.length > 0 ? topicsList : ['Clinical AI']);

  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(bibtex || `${title}. ${venue || ''} (${year}).`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy citation:', err);
    }
  };

  const rawVideoUrl = (demoUrl && (demoUrl.includes('youtu.be') || demoUrl.includes('youtube.com')) ? demoUrl : '') ||
    (coverImage && (coverImage.includes('youtu.be') || coverImage.includes('youtube.com')) ? coverImage : '') ||
    mediaList.find(m => m.media_type === 'youtube' || (m.media_url && (m.media_url.includes('youtube') || m.media_url.includes('youtu.be'))))?.media_url ||
    linksList.find(l => l.url && (l.url.includes('youtube') || l.url.includes('youtu.be')))?.url || '';

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
    const match = String(url).match(regExp);
    return match && match[2] && match[2].length >= 11
      ? `https://www.youtube.com/embed/${match[2].substring(0, 11)}`
      : '';
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(rawVideoUrl);

  const finalImage = coverImage || thumbnail_url;
  const hasValidImage = !youtubeEmbedUrl && finalImage && 
    !finalImage.includes('example.com') && 
    !finalImage.endsWith('.pdf') &&
    (finalImage.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || finalImage.startsWith('/wall/') || finalImage.startsWith('http'));

  const codeLink = linksList.find(l => l.type === 'code' || l.type === 'github');

  const modalContent = (
    <div 
      className="pub-modal-backdrop animate-fadeIn" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pub-modal-title"
    >
      <div 
        ref={modalRef}
        className="pub-modal-container animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="pub-modal-header-bar">
          <div className="pub-modal-meta-pills">
            <span className={`pub-modal-status status-${statusLower}`}>
              {statusLabel}
            </span>
            <span className="pub-modal-year">
              <Calendar size={12} className="inline mr-1" />
              {year}
            </span>
            <span className="pub-modal-venue-tag">
              <BookOpen size={12} className="inline mr-1" />
              {venue}
            </span>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            className="pub-modal-close-btn"
            aria-label="Close publication details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="pub-modal-scrollable-content">
          {/* Main Title */}
          <h2 id="pub-modal-title" className="pub-modal-title font-serif">
            {title}
          </h2>

          {/* Full Authors List */}
          <div className="pub-modal-authors-section">
            <div className="pub-modal-authors-label">
              <Users size={14} className="text-[#a8c66c]" />
              <span>Authors:</span>
            </div>
            <div className="pub-modal-authors-list">
              {authorsList.length > 0 ? (
                authorsList.map((author, idx) => {
                  const isMe = author.isMe || 
                    author.name.toLowerCase().includes('fahmida') || 
                    author.name.toLowerCase().includes('sultana') || 
                    author.name.toLowerCase().includes('naznin');

                  return (
                    <React.Fragment key={idx}>
                      <span 
                        className={`pub-modal-author-name ${isMe ? 'font-extrabold text-[#e8fcc2]' : 'text-neutral-300 font-normal'}`}
                      >
                        {author.name}
                      </span>
                      {idx < authorsList.length - 1 && <span className="text-neutral-500 mr-1.5">,</span>}
                    </React.Fragment>
                  );
                })
              ) : (
                <span className="pub-modal-author-name font-extrabold text-[#e8fcc2]">
                  Mst. Fahmida Sultana Naznin
                </span>
              )}
            </div>
          </div>

          {/* Category Tags */}
          <div className="pub-modal-categories-row">
            {categories.map((cat, idx) => (
              <span key={idx} className="pub-modal-cat-pill">
                <Layers size={11} className="mr-1 text-[#a8c66c]" />
                {cat}
              </span>
            ))}
          </div>

          {/* Tab Navigation: Abstract / BibTeX Citation */}
          <div className="pub-modal-tab-nav">
            <button
              type="button"
              className={`pub-tab-btn ${activeTab === 'abstract' ? 'active' : ''}`}
              onClick={() => setActiveTab('abstract')}
            >
              <FileText size={14} />
              <span>Overview & Media</span>
            </button>
            <button
              type="button"
              className={`pub-tab-btn ${activeTab === 'bibtex' ? 'active' : ''}`}
              onClick={() => setActiveTab('bibtex')}
            >
              <Quote size={14} />
              <span>BibTeX Citation</span>
            </button>
          </div>

          {/* Tab Content 1: Overview & Media */}
          {activeTab === 'abstract' && (
            <div className="pub-modal-tab-panel">
              {abstract ? (
                <div className="pub-abstract-block">
                  <h4 className="pub-section-heading">Abstract</h4>
                  <p className="pub-abstract-text">{abstract}</p>
                </div>
              ) : null}

              {/* Research Highlights / Key Contributions if present */}
              {description && description.includes('-') && (
                <div className="pub-contributions-block">
                  <h4 className="pub-section-heading">
                    Key Methodological Contributions
                  </h4>
                  <ul className="pub-contributions-list">
                    {description.split('\n').filter(l => l.trim().startsWith('-')).map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet.replace(/^-\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Media Display: Embedded Video below if available, otherwise Figure Image or Fallback */}
              <div className={`pub-figure-container ${youtubeEmbedUrl ? 'pub-video-container' : ''}`}>
                {youtubeEmbedUrl ? (
                  <iframe 
                    src={youtubeEmbedUrl} 
                    title={`Video Demonstration for ${title}`}
                    className="pub-modal-video-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : hasValidImage ? (
                  <img 
                    src={finalImage} 
                    alt={title}
                    className="pub-modal-figure-img"
                    loading="lazy"
                  />
                ) : (
                  <ResearchFigureFallback paper={publication} className="pub-modal-figure-fallback" />
                )}
              </div>
            </div>
          )}

          {/* Tab Content 2: BibTeX Citation */}
          {activeTab === 'bibtex' && (
            <div className="pub-modal-tab-panel">
              <div className="pub-bibtex-block">
                <div className="pub-bibtex-header">
                  <span className="text-xs font-mono text-neutral-400">BibTeX Format</span>
                  <button
                    type="button"
                    onClick={handleCopyCitation}
                    className="pub-copy-bibtex-btn"
                  >
                    {copied ? <Check size={13} className="text-[#a8c66c]" /> : <Copy size={13} />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy BibTeX'}</span>
                  </button>
                </div>
                <pre className="pub-bibtex-code">
                  <code>{bibtex}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="pub-modal-footer-bar">
          <div className="pub-modal-left-actions">
            {/* Secondary Action: Copy Citation */}
            <button 
              type="button"
              onClick={handleCopyCitation}
              className="pub-modal-btn secondary-btn"
              title="Copy BibTeX citation"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-[#a8c66c]" />
                  <span className="text-[#a8c66c]">Citation Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Citation</span>
                </>
              )}
            </button>

            {/* Code Repository Button */}
            {codeLink && (
              <a 
                href={codeLink.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="pub-modal-btn code-btn"
              >
                <Code size={13} />
                <span>Code Repo ↗</span>
              </a>
            )}

            {/* Optional Demo Button */}
            {hasDemo && demoUrl && (
              <a 
                href={demoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="pub-modal-btn demo-btn"
              >
                <Play size={13} fill="currentColor" />
                <span>View Demo ↗</span>
              </a>
            )}
          </div>

          <div className="pub-modal-right-actions">
            {/* Primary CTA: Read Full Paper (Only rendered if genuine external URL is available) */}
            {externalUrl ? (
              <a 
                href={externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="pub-modal-btn primary-cta-btn"
              >
                <FileText size={15} />
                <span>Read Full Paper ↗</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default React.memo(PublicationModal);
