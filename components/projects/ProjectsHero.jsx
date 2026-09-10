import React from 'react';
import { FolderGit2, Cpu, Eye } from 'lucide-react';

const ProjectsHero = ({ totalProjects = 15, domainCount = 4, featuredCount = 7 }) => {
  return (
    <section className="projects-hero-section" aria-label="Projects and Engineering Showcase Introduction">
      {/* Main Strong Title */}
      <h1 className="projects-hero-title">
        PROJECTS
      </h1>

      {/* Technical Summary Statement */}
      <p className="projects-hero-description">
        Experiments, applications, and systems I've built across AI, computer vision, robotics, and interactive technologies.
      </p>

      {/* Accurately Calculated Statistics Strip */}
      <div className="projects-metrics-strip">
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
      </div>
    </section>
  );
};

export default ProjectsHero;

