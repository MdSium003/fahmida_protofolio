import React from 'react';
import { ArrowUpRight, Send } from 'lucide-react';
import ScrollReveal from '../shared/ScrollReveal';

const HomeContactCTA = () => {
  return (
    <section className="home-section home-contact-section" id="contact" aria-label="Contact & Connect">
      <ScrollReveal>
        <div className="home-section-container">
          <div className="home-contact-card">
            <div className="home-contact-ambient-glow" />
            
            <div className="home-contact-inner">
              <h2 className="home-contact-heading">
                LET'S BUILD SOMETHING <br />
                <span className="text-highlight">WORTH REMEMBERING.</span>
              </h2>

              <p className="home-contact-description">
                Have a research collaboration, engineering project, or strategic inquiry worth discussing? 
                I am always open to exploring new frontiers at the intersection of AI, vision, and technology.
              </p>

              <div className="home-contact-actions-row">
                <a 
                  href="mailto:fahmidasultana4444@gmail.com" 
                  className="home-contact-primary-btn"
                >
                  <Send size={16} />
                  <span>Get In Touch</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default React.memo(HomeContactCTA);
