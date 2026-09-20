import React from 'react';
import { 
  Terminal, Cpu, Code2, Layers, Globe, Box, Database 
} from 'lucide-react';

const getCategoryIcon = (category) => {
  const cat = String(category).toUpperCase();
  if (cat.includes('LANGUAGE')) return <Code2 size={16} />;
  if (cat.includes('AI') || cat.includes('MACHINE')) return <Cpu size={16} />;
  if (cat.includes('VISION') || cat.includes('GRAPHICS')) return <Layers size={16} />;
  if (cat.includes('SPATIAL') || cat.includes('3D') || cat.includes('ENGINE')) return <Box size={16} />;
  if (cat.includes('WEB') || cat.includes('CLOUD') || cat.includes('EMBEDDED')) return <Globe size={16} />;
  return <Layers size={16} />;
};

const TechnologyStack = ({ skills = [] }) => {
  // Filter out Domain rows
  const techSkills = skills.filter(s => s.category !== 'Domains');

  // Group by subcategory preserving display order
  const grouped = {};
  techSkills.forEach(skill => {
    const subcat = skill.subcategory || 'OTHER TOOLS';
    if (!grouped[subcat]) {
      grouped[subcat] = [];
    }
    grouped[subcat].push(skill);
  });

  const clusters = Object.entries(grouped).map(([category, items]) => ({
    category,
    icon: getCategoryIcon(category),
    items
  }));

  return (
    <section className="skills-section tech-stack-section" aria-label="Unified Technology Stack">
      <div className="section-header-compact">
        <h2 className="section-title">Languages, Frameworks & Tooling</h2>
      </div>

      <div className="tech-stack-container">
        {clusters.map((cluster, idx) => (
          <div className="tech-cluster-group" key={idx}>
            <div className="cluster-header">
              <span className="cluster-icon">{cluster.icon}</span>
              <h3 className="cluster-category-title">{cluster.category}</h3>
            </div>

            <div className="cluster-tags-flow">
              {cluster.items.map((item, itemIdx) => (
                <span 
                  key={item.id || itemIdx} 
                  className={`tech-pill ${item.isPrimary ? 'tech-pill-primary' : 'tech-pill-secondary'}`}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechnologyStack;
