import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderGit2, BookOpen } from 'lucide-react';

const SkillsCTA = () => {
  return (
    <section className="skills-cta-section" aria-label="Explore Projects and Research">
      <div className="skills-cta-card">
        <h2 className="cta-heading">Explore What I&apos;ve Built</h2>
        <p className="cta-subheading">
          Dive into the complete collection of software engineering projects, research papers, and technical recognitions.
        </p>
        <div className="cta-buttons-row">
          <Link to="/projects" className="cta-btn primary-cta">
            <FolderGit2 size={15} />
            <span>Explore Projects</span>
            <ArrowRight size={14} />
          </Link>
          <Link to="/research" className="cta-btn secondary-cta">
            <BookOpen size={15} />
            <span>View Research</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SkillsCTA;
