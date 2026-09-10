import React from 'react';
import { FolderGit2, Cpu, Eye } from 'lucide-react';
import { motion } from 'motion/react';

const ProjectsHero = ({ totalProjects = 15, domainCount = 4, featuredCount = 7 }) => {
  return (
    <section className="projects-hero-section" aria-label="Projects and Engineering Showcase Introduction">
      {/* Main Strong Title */}
      <motion.h1
        className="projects-hero-title"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        PROJECTS
      </motion.h1>

      <motion.p
        className="projects-hero-description"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        Experiments, applications, and systems I've built across AI, computer vision, robotics, and interactive technologies.
      </motion.p>

      <motion.div
        className="projects-metrics-strip"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="metric-chip">
          <FolderGit2 size={13} className="metric-icon" />
          <span><strong>{String(totalProjects).padStart(2, '0')}</strong> PROJECTS</span>
        </div>
        <span className="metric-separator">•</span>
        <div className="metric-chip">
          <Eye size={13} className="metric-icon" />
          <span><strong>{String(domainCount).padStart(2, '0')}</strong> DOMAINS</span>
        </div>
        <span className="metric-separator">•</span>
        <div className="metric-chip">
          <Cpu size={13} className="metric-icon" />
          <span><strong>{String(featuredCount).padStart(2, '0')}</strong> FEATURED SYSTEMS</span>
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectsHero;

