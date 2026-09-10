import React from 'react';
import { motion } from 'motion/react';

const ResearchHero = () => {
  return (
    <section className="research-hero-section" aria-label="Research and Publications Introduction">
      {/* Large Centered Editorial Title */}
      <motion.h1
        className="research-hero-title"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        RESEARCH & <span className="title-accent">PUBLICATIONS</span>
      </motion.h1>

      {/* Short Research Identity Statement */}
      <motion.p
        className="research-hero-description"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        Scientific publications, clinical multimodal AI architectures, computer vision, and trustworthy machine learning.
      </motion.p>
    </section>
  );
};

export default ResearchHero;
