import React from 'react';

const HomePositioning = () => {
  return (
    <section className="home-positioning-section" id="about-the-work" aria-label="About the Work">
      <div className="home-section-container">
        <h2 className="positioning-statement">
          Building at the intersection of <span className="text-highlight">computational vision</span>, 
          applied research, and <span className="text-highlight">strategic analysis</span>.
        </h2>

        <p className="positioning-subtext">
          Dedicated to transforming complex technical challenges and data streams into rigorous, 
          trustworthy intelligence — spanning multimodal clinical AI systems, 3D spatial models, 
          and scalable software architectures.
        </p>
      </div>
    </section>
  );
};

export default React.memo(HomePositioning);
