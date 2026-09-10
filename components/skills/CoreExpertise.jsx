import React, { useState } from 'react';
import { Brain, Eye, Box, Cpu, Server, Code2, Layers, Globe, Database, Terminal, Sparkles } from 'lucide-react';

const getDomainIcon = (iconName) => {
  switch (String(iconName).toLowerCase()) {
    case 'brain': return <Brain size={26} strokeWidth={1.6} />;
    case 'eye': return <Eye size={26} strokeWidth={1.6} />;
    case 'box': return <Box size={26} strokeWidth={1.6} />;
    case 'cpu': return <Cpu size={26} strokeWidth={1.6} />;
    case 'server': return <Server size={26} strokeWidth={1.6} />;
    case 'code2': return <Code2 size={26} strokeWidth={1.6} />;
    case 'layers': return <Layers size={26} strokeWidth={1.6} />;
    case 'globe': return <Globe size={26} strokeWidth={1.6} />;
    case 'database': return <Database size={26} strokeWidth={1.6} />;
    case 'terminal': return <Terminal size={26} strokeWidth={1.6} />;
    default: return <Sparkles size={26} strokeWidth={1.6} />;
  }
};

const CoreExpertise = ({ skills = [] }) => {
  const [hoveredDomain, setHoveredDomain] = useState(null);

  const domainSkills = skills.filter(s => s.category === 'Domains');

  return (
    <section className="skills-section core-expertise-section" aria-label="Core Technical Expertise & Architecture">
      <div className="section-header-compact">
        <h2 className="section-title">Specialization Domains & Tech Stack</h2>
      </div>

      <div className="core-expertise-merged-grid">
        {domainSkills.map((domain, idx) => {
          const numBadge = String(domain.displayOrder || idx + 1).padStart(2, '0');
          const isHovered = hoveredDomain === domain.id;
          const techs = domain.tagsList && domain.tagsList.length > 0 ? domain.tagsList : [];

          return (
            <div 
              className={`core-domain-card ${isHovered ? 'card-active' : ''}`}
              key={domain.id || idx}
              onMouseEnter={() => setHoveredDomain(domain.id)}
              onMouseLeave={() => setHoveredDomain(null)}
            >
              {/* Card Top: Number & Icon */}
              <div className="domain-card-top">
                <span className="domain-num-badge">{numBadge}</span>
                <div className="domain-icon-wrapper">
                  {getDomainIcon(domain.icon)}
                </div>
              </div>

              {/* Card Middle: Title & Scope */}
              <div className="domain-card-identity">
                <h3 className="domain-card-title">{domain.name}</h3>
                <p className="domain-card-scope">{domain.proficiency}</p>
              </div>

              {/* Card Bottom: Branching Technology Tree */}
              <div className="domain-tech-branches">
                {techs.map((tech, techIdx) => (
                  <div className="tech-branch-item" key={techIdx}>
                    <span className="tech-branch-line" aria-hidden="true" />
                    <span className="tech-branch-label">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CoreExpertise;
