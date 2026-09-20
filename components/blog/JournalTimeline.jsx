import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useReducedMotion,
  useMotionValueEvent,
  useMotionValue,
} from 'motion/react';
import { Play, BookOpen, ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import { asset } from '../../src/utils/assetUrl';

/**
 * Deterministic pseudo-random number generator for consistent organic jitter
 */
function createSeededRNG(seed = 98765) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const JournalTimeline = ({ stories, onOpenStory }) => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const cardRefs = useRef([]);

  // Dynamic layout & path data state
  const [pathData, setPathData] = useState({
    mainPathD: '',
    branchPathsD: [],
    anchorPoints: [],
    width: 1200,
    height: 800,
    isMobile: false
  });

  // Track unlocked cards by scroll progress (each card unlocks as the line draws past it)
  const [unlockedIndices, setUnlockedIndices] = useState(new Set([0]));

  // The travelling marker is driven by motion values rather than React state.
  // Its position changes every animation frame; routing that through setState
  // re-rendered this component — and all of its story cards — 60 times a
  // second. Motion writes these straight to the DOM, off the render path.
  const markerX = useMotionValue(0);
  const markerY = useMotionValue(0);
  const markerAngle = useMotionValue(0);
  const markerOpacity = useMotionValue(0);

  // getTotalLength() costs ~0.6ms and the path does not change while scrolling,
  // so it is measured once per path rather than once per frame.
  const pathLengthRef = useRef(0);

  // 1. Scroll-linked progress for the timeline section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 85%']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.25,
    restDelta: 0.001
  });

  // Calculate & generate the dynamic hand-drawn SVG path
  const recalculatePath = useCallback(() => {
    if (!containerRef.current || !stories || stories.length === 0) return;

    const container = containerRef.current;
    const cRect = container.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;
    const width = Math.max(cRect.width, 320);
    const height = Math.max(container.scrollHeight, cRect.height, 400);

    const anchors = [];
    const cardElements = cardRefs.current;

    stories.forEach((story, idx) => {
      const el = cardElements[idx];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relativeTop = rect.top - cRect.top;
      const cardCenterY = relativeTop + rect.height / 2;

      let anchorX;
      if (isMobile) {
        // Mobile single column: left-hand track with anchor near the dot
        anchorX = 24;
      } else {
        // Desktop 2-column alternating: center line weaves toward active card
        const isEven = idx % 2 === 0;
        const centerX = width / 2;
        // Subtle offset towards the media column side to "thread" through
        const swayOffset = isEven ? -42 : 42;
        anchorX = centerX + swayOffset;
      }

      anchors.push({
        index: idx,
        x: anchorX,
        y: cardCenterY,
        cardTop: relativeTop,
        cardHeight: rect.height,
        isEven: idx % 2 === 0
      });
    });

    if (anchors.length === 0) return;

    const rng = createSeededRNG(4242);
    const jitter = (amount = 4) => (rng() - 0.5) * 2 * amount;

    let mainPathD = '';
    const branchPaths = [];

    if (isMobile) {
      // Mobile / Stacked geometry: straight hand-drawn line with subtle waviness down left rail
      const startX = 24;
      const startY = Math.max(10, anchors[0].y - 50);
      const endY = anchors[anchors.length - 1].y + 50;

      let d = `M ${startX + jitter(1.5)} ${startY}`;
      
      anchors.forEach((anc, i) => {
        const midY = (i === 0 ? startY : anchors[i - 1].y + (anc.y - anchors[i - 1].y) * 0.5);
        d += ` Q ${startX + jitter(2)} ${midY}, ${startX + jitter(1.5)} ${anc.y}`;

        // Horizontal branch tick pointing from rail to the card
        branchPaths.push(`M ${startX} ${anc.y} L ${startX + 28} ${anc.y}`);
      });

      d += ` L ${startX + jitter(1.5)} ${endY}`;
      mainPathD = d;
    } else {
      // Desktop 2-column alternating geometry: organic, continuous S-curves threading each entry
      const centerX = width / 2;
      const startY = Math.max(10, anchors[0].y - 70);
      const firstAnchor = anchors[0];

      // Initial entry curve from top center down to the first card
      let d = `M ${centerX + jitter(2)} ${startY}`;
      d += ` C ${centerX + jitter(3)} ${startY + (firstAnchor.y - startY) * 0.4}, ${firstAnchor.x} ${firstAnchor.y - (firstAnchor.y - startY) * 0.4}, ${firstAnchor.x} ${firstAnchor.y}`;

      for (let i = 0; i < anchors.length - 1; i++) {
        const curr = anchors[i];
        const next = anchors[i + 1];
        const deltaY = next.y - curr.y;

        // Dynamic S-curve control points with organic hand-drawn sway
        const cp1x = curr.x + (curr.isEven ? -18 : 18) + jitter(4);
        const cp1y = curr.y + deltaY * 0.45;

        const cp2x = next.x + (next.isEven ? -18 : 18) + jitter(4);
        const cp2y = next.y - deltaY * 0.45;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
      }

      // Smooth exit tail ending before Moments section
      const lastAnchor = anchors[anchors.length - 1];
      const endY = lastAnchor.y + 65;
      const endX = centerX + jitter(3);
      d += ` C ${lastAnchor.x} ${lastAnchor.y + 35}, ${endX} ${endY - 20}, ${endX} ${endY}`;

      mainPathD = d;
    }

    setPathData({
      mainPathD,
      branchPathsD: branchPaths,
      anchorPoints: anchors,
      width,
      height,
      isMobile
    });
  }, [stories]);

  // Measure the drawn path once per geometry change. Doing this in the scroll
  // handler cost ~0.6ms every frame for a value that never changes mid-scroll.
  useEffect(() => {
    if (!pathRef.current) return;
    try {
      pathLengthRef.current = pathRef.current.getTotalLength();
    } catch {
      pathLengthRef.current = 0;
    }
  }, [pathData.mainPathD]);

  // Recalculate on mount, story count changes, and debounced window resize
  useEffect(() => {
    recalculatePath();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(recalculatePath, 150);
    };

    window.addEventListener('resize', handleResize);
    
    // Also observe container size with ResizeObserver
    let ro;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => {
        handleResize();
      });
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      if (ro) ro.disconnect();
    };
  }, [recalculatePath]);

  // Sync scroll progress to unlock cards and update traveling marker position
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    if (prefersReducedMotion) return;

    // 1. Unlock cards the drawn line has reached.
    //    setState only when membership actually changes — this fires on every
    //    spring frame, and a fresh Set each time is always a new reference, so
    //    an unconditional call re-rendered the whole timeline ~60x/second.
    if (pathData.anchorPoints.length > 0) {
      const next = new Set([0]);
      pathData.anchorPoints.forEach((anc, i) => {
        const threshold = Math.max(0, Math.min(1, (anc.y - 50) / (pathData.height || 1)));
        if (latest >= threshold - 0.08 || latest > 0.92) next.add(i);
      });

      setUnlockedIndices((prev) => {
        if (prev.size === next.size) {
          let same = true;
          for (const i of next) {
            if (!prev.has(i)) { same = false; break; }
          }
          if (same) return prev; // identical — React bails out, no re-render
        }
        return next;
      });
    }

    // 2. Move the travelling marker. Written to motion values, so this costs
    //    two style writes rather than a React render pass.
    const totalLength = pathLengthRef.current;
    if (totalLength > 0 && pathRef.current) {
      try {
        const currentLength = Math.max(0, Math.min(totalLength, latest * totalLength));
        const pt = pathRef.current.getPointAtLength(currentLength);
        const nextPt = pathRef.current.getPointAtLength(
          Math.min(totalLength, currentLength + 2)
        );

        markerX.set(pt.x);
        markerY.set(pt.y);
        markerAngle.set(Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI));
        markerOpacity.set(latest > 0.01 && latest < 0.99 ? 1 : 0);
      } catch {
        // SVG not laid out yet
      }
    }
  });

  if (!stories || stories.length === 0) {
    return (
      <div className="journal-empty-state">
        <p>No journal entries match your filter.</p>
      </div>
    );
  }

  return (
    <section 
      className="journal-timeline-section journey-path-container" 
      ref={containerRef}
      aria-label="Chronological Visual Journal with Animated Journey Path"
    >
      {/* =====================================================================
          Dynamic Hand-Drawn SVG Journey Path Layer
          ===================================================================== */}
      <svg 
        className="journey-path-svg"
        viewBox={`0 0 ${pathData.width} ${pathData.height}`}
        aria-hidden="true"
      >
        <defs>
          {/* Hand-drawn organic ink texture filter */}
          <filter id="hand-drawn-ink" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Glowing gradient along the journey path */}
          <linearGradient id="journey-path-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--journey-path-color, #B1CC74)" stopOpacity="0.25" />
            <stop offset="15%" stopColor="var(--journey-path-color, #B1CC74)" stopOpacity="0.95" />
            <stop offset="85%" stopColor="var(--journey-path-color, #B1CC74)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--journey-path-color, #B1CC74)" stopOpacity="0.35" />
          </linearGradient>

          {/* Traveling marker glow */}
          <radialGradient id="marker-glow-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--journey-path-color, #B1CC74)" stopOpacity="1" />
            <stop offset="45%" stopColor="var(--journey-path-color, #B1CC74)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--journey-path-color, #B1CC74)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint Guide Trail / Under-Path (Shows route subtly before drawn) */}
        {pathData.mainPathD && (
          <path
            d={pathData.mainPathD}
            className="journey-path-guide"
            filter="url(#hand-drawn-ink)"
          />
        )}

        {/* Mobile Perpendicular Tick Connectors */}
        {pathData.isMobile && pathData.branchPathsD.map((d, i) => (
          <path 
            key={`tick-${i}`}
            d={d}
            className={`journey-branch-tick ${
              prefersReducedMotion || unlockedIndices.has(i) ? 'active' : ''
            }`}
            filter="url(#hand-drawn-ink)"
          />
        ))}

        {/* Main Animated Hand-Drawn Journey Path Stroke */}
        {pathData.mainPathD && (
          <motion.path
            ref={pathRef}
            d={pathData.mainPathD}
            className="journey-path-active-stroke"
            filter="url(#hand-drawn-ink)"
            style={{
              pathLength: prefersReducedMotion ? 1 : smoothProgress
            }}
          />
        )}

        {/* Traveling Marker (Pen Nib / Compass Dot riding on current drawn tip).
            Always mounted and driven by motion values — mounting/unmounting it
            on a state flag forced a React render on every scroll frame. */}
        {!prefersReducedMotion && (
          <motion.g
            className="journey-traveling-marker"
            style={{
              x: markerX,
              y: markerY,
              rotate: markerAngle,
              opacity: markerOpacity,
            }}
          >
            {/* Outer Pulsing Glow */}
            <circle cx="0" cy="0" r="16" fill="url(#marker-glow-radial)" />
            {/* Inner Core */}
            <circle cx="0" cy="0" r="5" className="marker-core-dot" />
            {/* Directional Needle/Tip */}
            <path d="M 4 0 L -4 -3 L -2 0 L -4 3 Z" className="marker-needle-tip" />
          </motion.g>
        )}
      </svg>

      {/* =====================================================================
          Alternating Post Cards Track (Scroll-Synchronized Reveal)
          ===================================================================== */}
      <div className="journal-timeline-track">
        {stories.map((story, index) => {
          const isVideo = story.isVlog || (story.media && story.media.includes('youtube'));
          const dateObj = story.published_date ? new Date(story.published_date) : null;
          const monthYear = dateObj 
            ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : (story.published_date || '2026');
          
          const isEven = index % 2 === 0;
          const displayImage = story.coverImage || story.thumbnail_url || asset('/images/fahmida_blog.jpeg');
          const isUnlocked = prefersReducedMotion || unlockedIndices.has(index);

          return (
            <article 
              key={story.id || index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`timeline-entry-row ${isEven ? 'layout-image-left' : 'layout-image-right'} ${isUnlocked ? 'card-unlocked' : 'card-locked'}`}
              style={{
                transition: prefersReducedMotion ? 'none' : 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), filter 0.65s ease'
              }}
            >
              {/* Story Visual Media Frame */}
              <div 
                className="timeline-media-column" 
                onClick={() => onOpenStory(story)}
                role="button"
                tabIndex={0}
                aria-label={`Open story media: ${story.title}`}
              >
                <div className="timeline-media-frame">
                  <img 
                    src={displayImage} 
                    alt={story.title}
                    className="timeline-image"
                    loading="lazy"
decoding="async"/>
                  <div className="timeline-image-overlay" />

                  {/* Video Play Overlay if Vlog */}
                  {isVideo && (
                    <div className="timeline-play-badge">
                      <Play size={18} fill="currentColor" />
                    </div>
                  )}

                  <span className="timeline-format-tag">
                    {isVideo ? 'VLOG' : 'ARTICLE'}
                  </span>
                </div>
              </div>

              {/* Story Content Narrative Column */}
              <div className="timeline-narrative-column">
                <div className="timeline-meta-bar">
                  {story.location && (
                    <>
                      <span className="timeline-location">
                        <MapPin size={12} /> {story.location}
                      </span>
                      <span className="meta-bullet">•</span>
                    </>
                  )}
                  <span className="timeline-date">
                    <Calendar size={12} /> {monthYear}
                  </span>
                  <span className="meta-bullet">•</span>
                  <span className="timeline-type">
                    {isVideo ? (
                      <><Play size={11} fill="currentColor" /> Video Log</>
                    ) : (
                      <><BookOpen size={11} /> {story.read_time || 'Written Article'}</>
                    )}
                  </span>
                </div>

                <h3 
                  className="timeline-story-title"
                  onClick={() => onOpenStory(story)}
                >
                  {story.title}
                </h3>

                <p className="timeline-story-summary">
                  {story.description}
                </p>

                <div className="timeline-actions-row">
                  <button 
                    className="timeline-action-btn"
                    onClick={() => onOpenStory(story)}
                    aria-label={`Read full story for ${story.title}`}
                  >
                    <span>{isVideo ? 'Watch Vlog' : 'Read Full Story'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default React.memo(JournalTimeline);
