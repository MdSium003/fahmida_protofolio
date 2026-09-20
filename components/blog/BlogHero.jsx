import React from 'react';
import { motion } from 'motion/react';

const BlogHero = () => {
  return (
    <section className="blog-hero-section" aria-label="Journal & Travel Stories Introduction">
      {/* Centered Editorial Title */}
      <motion.h1 
        className="blog-hero-title"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        Travel & <span className="title-accent">Visual Journal</span>
      </motion.h1>

      <motion.p 
        className="blog-hero-description"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        Personal reflections, global competitions, research fellowships, and spontaneous travels across Thailand, USA, Singapore, and Malaysia.
      </motion.p>
    </section>
  );
};

export default BlogHero;
