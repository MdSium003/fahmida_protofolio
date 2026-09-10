import React from 'react';
import { Code2, Flame } from 'lucide-react';

const languageMetadata = {
  Python: {
    domains: 'AI · Machine Learning · Computer Vision · Research',
    isCore: true
  },
  'C#': {
    domains: 'Unity 3D · Interactive Applications · .NET',
    isCore: true
  },
  'C++': {
    domains: 'Robotics · SLAM Algorithms · Systems',
    isCore: true
  },
  MATLAB: {
    domains: 'Scientific Computing · Numerical Analysis',
    isCore: false
  },
  C: {
    domains: 'Embedded Systems · Microcontrollers',
    isCore: false
  },
  Java: {
    domains: 'Software Development · Android',
    isCore: false
  },
  Shell: {
    domains: 'Automation · Linux Toolchains · Scripting',
    isCore: false
  }
};

const ProgrammingLanguages = ({ languages = [] }) => {
  const sortedLanguages = [...languages].sort((a, b) => {
    const metaA = languageMetadata[a.name] || {};
    const metaB = languageMetadata[b.name] || {};
    if (metaA.isCore && !metaB.isCore) return -1;
    if (!metaA.isCore && metaB.isCore) return 1;
    return (Number(a.display_order) || 0) - (Number(b.display_order) || 0);
  });

  return (
    <section className="skills-section languages-section" aria-label="Programming Languages">
      <div className="section-header-compact">
        <h2 className="section-title">Programming Languages</h2>
      </div>

      <div className="languages-boxes-grid">
        {sortedLanguages.map((lang) => {
          const meta = languageMetadata[lang.name] || {
            domains: 'Software Engineering',
            isCore: false
          };

          return (
            <div 
              key={lang.id || lang.name} 
              className={`language-box ${meta.isCore ? 'core-lang' : ''}`}
            >
              <div className="lang-box-top">
                <span className="lang-name">{lang.name}</span>
                {meta.isCore && (
                  <span className="core-lang-badge">
                    <Flame size={10} />
                    <span>Primary</span>
                  </span>
                )}
              </div>
              <span className="lang-domains-text">{meta.domains}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProgrammingLanguages;
