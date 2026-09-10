import React from 'react';

const ResearchHero = () => {
  return (
    <section className="research-hero-section" aria-label="Research and Publications Introduction">
      {/* Large Centered Editorial Title */}
      <h1 className="research-hero-title">
        RESEARCH & <span className="title-accent">PUBLICATIONS</span>
      </h1>

      {/* Short Research Identity Statement */}
      <p className="research-hero-description">
        Scientific publications, clinical multimodal AI architectures, computer vision, and trustworthy machine learning.
      </p>
    </section>
  );
};

export default ResearchHero;
