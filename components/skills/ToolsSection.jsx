import React from 'react';
import { Wrench, Box, Cpu, Cloud } from 'lucide-react';

const toolGroups = [
  {
    groupTitle: '3D Simulation & AR',
    icon: <Box size={15} />,
    toolNames: ['Unity', 'Blender', 'Vuforia']
  },
  {
    groupTitle: 'Embedded & Hardware',
    icon: <Cpu size={15} />,
    toolNames: ['Arduino']
  },
  {
    groupTitle: 'Development & Cloud',
    icon: <Cloud size={15} />,
    toolNames: ['Android Studio', 'Firebase', 'Google Chrome Engine']
  }
];

const ToolsSection = ({ tools = [] }) => {
  return (
    <section className="skills-section tools-section" aria-label="Tools and Technologies">
      <div className="section-header-compact">
        <h2 className="section-title">Tools & Technologies</h2>
      </div>

      <div className="tool-rows-container">
        {toolGroups.map((group, gIdx) => {
          const matchedTools = tools.filter(t =>
            group.toolNames.some(name => name.toLowerCase() === (t.name || '').toLowerCase())
          );

          const displayItems = matchedTools.length > 0
            ? matchedTools
            : tools.filter(t => group.toolNames.includes(t.name));

          return (
            <div key={gIdx} className="tech-cluster-row">
              <div className="cluster-header">
                <div className="cluster-icon">{group.icon}</div>
                <h3 className="cluster-title">{group.groupTitle}</h3>
              </div>

              <div className="cluster-chips-wrap">
                {displayItems.map((item) => (
                  <div key={item.id || item.name} className="tech-chip-box tool-chip">
                    <span className="chip-name">{item.name}</span>
                    {(item.tool_type || item.proficiency) && (
                      <span className="chip-role">
                        {item.tool_type || item.proficiency}
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

export default ToolsSection;
