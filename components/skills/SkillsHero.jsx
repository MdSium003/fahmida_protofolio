import React from 'react';
import { motion } from 'motion/react';

const SkillsHero = () => {
  return (
    <section className="skills-hero-section" aria-label="Skills and Technical Identity">
      <motion.h1 
        className="skills-hero-title"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        Skills & <span className="title-accent">Expertise</span>
      </motion.h1>

      <motion.p 
        className="skills-hero-description"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        Specialized in Biomedical AI, Natural Language Processing, Computer Vision, Bioinformatics, 
        and full-stack software architectures.
      </motion.p>

      <motion.div 
        className="skills-hero-divider"
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </section>
  );
};

export default SkillsHero;
