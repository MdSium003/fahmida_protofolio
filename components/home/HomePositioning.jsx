import React from 'react';
import ScrollReveal from '../shared/ScrollReveal';

const HomePositioning = () => {
  return (
    <section className="home-positioning-section" id="about-the-work" aria-label="About the Work">
      <ScrollReveal>
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
      </ScrollReveal>
    </section>
  );
};

export default React.memo(HomePositioning);
