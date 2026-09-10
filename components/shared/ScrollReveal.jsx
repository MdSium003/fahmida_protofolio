import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

/**
 * ScrollReveal — Wraps children in a motion.div that fades/slides in
 * smoothly as soon as the top of the element enters the viewport.
 *
 * @param {number}  delay      — Delay before animation starts (seconds)
 * @param {string}  direction  — 'up' | 'down' | 'left' | 'right' | 'none'
 * @param {number}  distance   — Distance in px for the translate (default: 16px)
 * @param {number}  duration   — Animation duration in seconds (default: 0.5s)
 * @param {boolean} once       — If true, animates only once (default: true)
 * @param {number|string} threshold — IntersectionObserver amount (default: 0)
 * @param {string}  margin     — Root margin for intersection (default: '0px 0px -30px 0px')
 * @param {string}  className  — Optional className for the wrapper
 * @param {object}  style      — Optional inline styles
 */
const ScrollReveal = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 16,
  duration = 0.5,
  once = true,
  threshold = 0,
  margin = '0px 0px -30px 0px',
  className = '',
  style = {},
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold, margin });
  const prefersReducedMotion = useReducedMotion();

  // Build the initial transform offset based on direction
  const getOffset = () => {
    switch (direction) {
      case 'up':    return { y: distance };
      case 'down':  return { y: -distance };
      case 'left':  return { x: distance };
      case 'right': return { x: -distance };
      case 'none':  return {};
      default:      return { y: distance };
    }
  };

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, ...getOffset() }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getOffset() }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // easeOutCubic / sleek smooth deceleration
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
