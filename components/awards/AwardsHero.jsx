import React from 'react';
import { motion } from 'motion/react';

const AwardsHero = () => {
  return (
    <section className="awards-hero-section">
      <motion.h1 
        className="awards-hero-title"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        Awards & <span className="title-accent">Recognition</span>
      </motion.h1>

      <motion.p 
        className="awards-hero-description"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        Competitions, honors, and research distinctions earned across high-impact challenges, 
        global fellowships, healthcare innovation, and academic excellence.
      </motion.p>
    </section>
  );
};

export default AwardsHero;
