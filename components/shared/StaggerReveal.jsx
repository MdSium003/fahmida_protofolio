import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

/**
 * StaggerReveal — Container that staggers the reveal of its children
 * as soon as the top of the container enters the viewport.
 *
 * @param {number}  staggerDelay — Delay between each child (seconds)
 * @param {number}  duration     — Duration per child animation (seconds)
 * @param {number}  distance     — translateY distance for each child (default: 16px)
 * @param {boolean} once         — If true, animates only once
 * @param {number|string} threshold — IntersectionObserver amount (default: 0)
 * @param {string}  margin       — Root margin for intersection (default: '0px 0px -30px 0px')
 * @param {string}  className    — Optional className for the wrapper
 * @param {object}  style        — Optional inline styles
 */

const containerVariants = (staggerDelay) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

const itemVariants = (distance, duration) => ({
  hidden: { 
    opacity: 0, 
    y: distance 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration,
      ease: [0.22, 1, 0.36, 1], // easeOutCubic
    },
  },
});

const StaggerReveal = ({
  children,
  staggerDelay = 0.05,
  duration = 0.45,
  distance = 16,
  once = true,
  threshold = 0,
  margin = '0px 0px 50px 0px',
  className = '',
  style = {},
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold, margin });
  const prefersReducedMotion = useReducedMotion();

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
      variants={containerVariants(staggerDelay)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div variants={itemVariants(distance, duration)}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StaggerReveal;
