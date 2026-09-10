import React from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Award, ArrowRight } from 'lucide-react';

const ResearchThreads = () => {
  return (
    <section className="research-threads-banner-section" aria-label="Research Connections and Applied Systems">
      <div className="threads-banner-container">
        <h3 className="threads-title">
          From scientific discovery to deployed systems
        </h3>

        <p className="threads-description">
          Explore how these theoretical architectures, computer vision pipelines, and multimodal reasoning algorithms power real-world applied software and hardware robotics.
        </p>

        {/* Action buttons */}
        <div className="threads-actions-row">
          <Link to="/projects" className="threads-action-btn primary">
            <FolderGit2 size={15} />
            <span>Explore Applied Projects</span>
            <ArrowRight size={14} />
          </Link>
          <Link to="/awards" className="threads-action-btn secondary">
            <Award size={15} />
            <span>View Honors & Recognition</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResearchThreads;
