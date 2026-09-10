import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './DriftWall.css';

const DEFAULT_WALL_IMAGES = [
  '/wall/fahmida_with_lal_background.jpeg',
  '/wall/fahmida_with_purdue.jpeg',
  '/wall/fahmida_with_robot.jpeg',
  '/wall/fahmida_with_show_pice.jpeg',
  '/wall/fahmida_with_car.jpeg',
  '/wall/fahmida_with_ddn.jpeg',
  '/wall/fahmida_blog.jpeg',
  '/wall/fahmida_blog_2.jpeg',
  '/wall/fahmida_blog_3.jpeg',
  '/wall/fahmida_blog_4.jpeg',
  '/wall/up_1.jpeg',
  '/wall/up_2.jpeg',
  '/wall/up_3.jpeg',
  '/wall/up_4.jpeg',
  '/wall/research_1.jpg',
  '/wall/research_4.jpg',
  '/wall/college.jpeg',
  '/wall/undergrad.jpeg'
];

const DEFAULT_ITEMS = DEFAULT_WALL_IMAGES.map((img, i) => ({
  image: img,
  title: `Wall Image ${i + 1}`,
  href: undefined
}));

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const DriftWall = ({
  items = DEFAULT_ITEMS,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = 'up',
  variance = 0.45,
  parallax = 0, // Disabled cursor reactivity by default
  pauseOnHover = false,
  lift = 0, // 0 for background mode so tiles don't pop on hover
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = '#111111',
  interactive = false, // Pure background mode
  className = '',
  style
}) => {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const rafRef = useRef(null);

  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState(null);
  const activeIdRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = e => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const safeItems = useMemo(() => {
    return items && items.length > 0 ? items : DEFAULT_ITEMS;
  }, [items]);

  const columnItems = useMemo(() => {
    const cols = Array.from({ length: columns }, () => []);
    safeItems.forEach((item, i) => cols[i % columns].push(item));
    return cols.map(col => (col.length ? col : safeItems.slice(0, 1)));
  }, [safeItems, columns]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map(col => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(3, Math.ceil((containerHeight * 2.2) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px, py) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.48) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    const animate = ts => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      if (interactive && parallax > 0) {
        const maxTilt = parallax * 8;
        const targetX = pointerRef.current.x * maxTilt;
        const targetY = -pointerRef.current.y * maxTilt;
        const damp = 1 - Math.exp(-dt / 0.12);
        pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
        pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
        applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);
      } else {
        applyPlaneTransform(0, 0);
      }

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = interactive && wallHoveredRef.current && pauseOnHover;
          const factor = paused || (interactive && hoveredColRef.current === c) ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform, interactive]);

  const activate = useCallback((id, index) => {
    if (!interactive) return;
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, [interactive]);

  const release = useCallback(() => {
    if (!interactive) return;
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, [interactive]);

  const handlePointerMove = useCallback(
    e => {
      if (!interactive) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest ? hit.closest('[data-tile-id]') : null;
      if (!tile) return;
      const id = tile.dataset.tileId;
      if (id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    },
    [parallax, reduced, interactive]
  );

  const handlePointerLeaveWall = useCallback(() => {
    if (!interactive) return;
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release, interactive]);

  const cssVars = useMemo(
    () => ({
      '--dw-tile-w': `${tileWidth}px`,
      '--dw-tile-h': `${tileHeight}px`,
      '--dw-gap': `${gap}px`,
      '--dw-radius': `${radius}px`,
      '--dw-perspective': `${perspective}px`,
      '--dw-lift': `${lift}px`,
      '--dw-dim': dim,
      '--dw-gray': grayscale ? 1 : 0,
      '--dw-overlay': overlayColor,
      '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
      ...style
    }),
    [tileWidth, tileHeight, gap, radius, perspective, lift, dim, grayscale, overlayColor, fade, style]
  );

  const renderTile = (item, id, colIndex) => {
    const inner = (
      <span className="drift-wall__inner">
        <img
          src={item.image}
          alt={item.title ?? ''}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={(e) => {
            // Fallback placeholder gradient if a local image doesn't exist yet
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="drift-wall__overlay" aria-hidden="true" />
      </span>
    );

    const commonProps = {
      className: `drift-wall__tile${activeId === id ? ' is-active' : ''}`,
      'data-tile-id': id,
      'data-col': colIndex,
      ...(interactive ? {
        onFocus: () => activate(id, colIndex),
        onBlur: release
      } : {})
    };

    if (interactive && item.href) {
      return (
        <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
          {inner}
        </a>
      );
    }
    return (
      <div key={id} tabIndex={interactive ? 0 : -1} aria-hidden={!interactive} {...commonProps}>
        {inner}
      </div>
    );
  };

  const rootClass = [
    'drift-wall',
    reduced ? 'drift-wall--reduced' : '',
    !interactive ? 'drift-wall--passive' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      {...(interactive ? {
        onPointerMove: handlePointerMove,
        onPointerEnter: () => { wallHoveredRef.current = true; },
        onPointerLeave: handlePointerLeaveWall
      } : {})}
      role={interactive ? 'group' : 'presentation'}
      aria-label={interactive ? 'Drifting wall of tiles' : undefined}
      aria-hidden={!interactive}
    >
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div className="drift-wall__col" key={`col-${c}`}>
              <div className="drift-wall__track" ref={el => (trackRefs.current[c] = el)}>
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;
