import React from 'react';
import { FolderGit2, Eye, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

const ProjectsHero = ({ totalProjects = 10, domainCount = 4, featuredCount = 6 }) => {
  return (
    <section className="projects-hero-section" aria-label="Projects and Engineering Showcase Introduction">
      {/* Main Strong Title */}
      <motion.h1
        className="projects-hero-title"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        PROJECTS
      </motion.h1>

      <motion.p
        className="projects-hero-description"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        Experiments, applications, and systems I&apos;ve built across AI, computer vision, robotics, and interactive technologies.
      </motion.p>

      {/* Unified Stats Card Matching Research & Awards */}
      <motion.div
        className="projects-stats-section"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="stats-container">
          <div className="stat-block">
            <div className="stat-header">
              <FolderGit2 size={13} className="stat-icon" />
              <span className="stat-label">Total Projects</span>
            </div>
            <div className="stat-value">{String(totalProjects).padStart(2, '0')}</div>
          </div>

          <div className="stat-divider" />

          <div className="stat-block">
            <div className="stat-header">
              <Eye size={13} className="stat-icon" />
              <span className="stat-label">Specialization Domains</span>
            </div>
            <div className="stat-value">{String(domainCount).padStart(2, '0')}</div>
          </div>

          <div className="stat-divider" />

          <div className="stat-block">
            <div className="stat-header">
              <Cpu size={13} className="stat-icon" />
              <span className="stat-label">Featured Systems</span>
            </div>
            <div className="stat-value">{String(featuredCount).padStart(2, '0')}</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectsHero;
