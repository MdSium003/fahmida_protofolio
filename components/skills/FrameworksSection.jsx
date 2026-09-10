import React from 'react';
import { Layers, BrainCircuit, Eye, Globe } from 'lucide-react';

const frameworkGroups = [
  {
    groupTitle: 'AI & Machine Learning',
    icon: <BrainCircuit size={15} />,
    frameworkNames: ['PyTorch', 'TensorFlow', 'Keras', 'PyTorch3D', 'Geomstat']
  },
  {
    groupTitle: 'Computer Vision & Graphics',
    icon: <Eye size={15} />,
    frameworkNames: ['OpenCV', 'OpenGL', 'Three.js', 'AR.js']
  },
  {
    groupTitle: 'Web & Package Architecture',
    icon: <Globe size={15} />,
    frameworkNames: ['Django', 'NuGet']
  }
];

const FrameworksSection = ({ frameworks = [] }) => {
  return (
    <section className="skills-section frameworks-section" aria-label="Frameworks and Libraries">
      <div className="section-header-compact">
        <h2 className="section-title">Frameworks & Libraries</h2>
      </div>

      <div className="framework-rows-container">
        {frameworkGroups.map((group, gIdx) => {
          const matchedFrameworks = frameworks.filter(f => 
            group.frameworkNames.some(name => name.toLowerCase() === (f.name || '').toLowerCase())
          );

          const displayItems = matchedFrameworks.length > 0 
            ? matchedFrameworks 
            : frameworks.filter(f => group.frameworkNames.includes(f.name));

          return (
            <div key={gIdx} className="tech-cluster-row">
              <div className="cluster-header">
                <div className="cluster-icon">{group.icon}</div>
                <h3 className="cluster-title">{group.groupTitle}</h3>
              </div>

              <div className="cluster-chips-wrap">
                {displayItems.map((item) => (
                  <div key={item.id || item.name} className="tech-chip-box">
                    <span className="chip-name">{item.name}</span>
                    {(item.proficiency || item.category_label) && (
                      <span className="chip-role">
                        {item.proficiency || item.category_label}
                      </span>
                    )}
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

export default FrameworksSection;
