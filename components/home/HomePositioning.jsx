import React from 'react';
import { Quote } from 'lucide-react';
import ScrollReveal from '../shared/ScrollReveal';

const HomePositioning = () => {
  return (
    <section className="home-positioning-section" id="philosophy" aria-label="Personal Philosophy">
      <div className="positioning-ambient-glow" aria-hidden="true" />
      
      <ScrollReveal>
        <div className="home-section-container positioning-inner-wrap">

          {/* Core Personal Speech */}
          <div className="positioning-quote-container">
            <Quote size={32} className="quote-mark-icon" aria-hidden="true" />
            <blockquote className="positioning-quote-text">
              “I believe the greatest AI is not the one that knows the most, but the one that can <span className="text-highlight">turn knowledge into hope</span>, <span className="text-highlight">ease someone’s pain</span>, <span className="text-highlight">change a life</span>, and <span className="text-highlight">make a dream feel possible</span>.”
            </blockquote>
          </div>

          {/* Author Signature & Role Attribution */}
          <div className="positioning-author-row">
            <div className="author-line" aria-hidden="true" />
            <div className="author-details">
              <span className="author-name">Mst. Fahmida Sultana Naznin</span>
              <span className="author-dot">•</span>
              <span className="author-title">Founder & CEO, PinkLifeLine</span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default React.memo(HomePositioning);
