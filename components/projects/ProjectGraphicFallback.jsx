import React from 'react';
import { Eye, Box, Bot, Cpu, Layers, Sparkles, Code2, Globe, Activity, Terminal } from 'lucide-react';

/**
 * High-precision bespoke technical schematic fallback for projects.
 * Replaces generic/repetitive stock photos with designed, authentic blueprints.
 */
const ProjectGraphicFallback = ({ project, className = '' }) => {
  const title = project?.title || 'System Project';
  const category = (project?.category || '').toLowerCase();
  const tech = project?.technologies?.[0] || 'ENGINEERING';
  const year = project?.year || '';

  const getDomainConfig = () => {
    if (category.includes('vision') || category.includes('3d')) {
      return {
        type: 'vision',
        icon: <Eye size={32} className="fallback-primary-icon" />,
        badge: '3D MESH & VISION PIPELINE',
        pattern: 'vision-mesh'
      };
    }
    if (category.includes('robot') || category.includes('iot') || category.includes('sensor')) {
      return {
        type: 'robotics',
        icon: <Bot size={32} className="fallback-primary-icon" />,
        badge: 'EMBEDDED HARDWARE & SLAM',
        pattern: 'robotics-circuit'
      };
    }
    if (category.includes('health') || title.toLowerCase().includes('health')) {
      return {
        type: 'health',
        icon: <Activity size={32} className="fallback-primary-icon" />,
        badge: 'TELEMETRY & VITALS DASHBOARD',
        pattern: 'health-wave'
      };
    }
    if (category.includes('ai') || category.includes('neural') || category.includes('learning')) {
      return {
        type: 'ai',
        icon: <Sparkles size={32} className="fallback-primary-icon" />,
        badge: 'NEURAL WEIGHTS & INFERENCE',
        pattern: 'ai-matrix'
      };
    }
    return {
      type: 'systems',
      icon: <Terminal size={32} className="fallback-primary-icon" />,
      badge: 'SYSTEM ARCHITECTURE & ENGINE',
      pattern: 'code-ast'
    };
  };

  const config = getDomainConfig();

  return (
    <div className={`project-graphic-fallback-root type-${config.type} ${className}`} aria-hidden="true">
      {/* Background Subtle Tech Blueprint Grid */}
      <div className={`fallback-tech-pattern ${config.pattern}`} />
      <div className="fallback-ambient-glow" />

      {/* Blueprint Header Wire */}
      <div className="fallback-blueprint-meta">
        <span className="fallback-badge-pill">{config.badge}</span>
        {year && <span className="fallback-year-stamp">{year}</span>}
      </div>

      {/* Central Interactive Icon & Tech Node */}
      <div className="fallback-center-node">
        <div className="fallback-icon-ring">
          {config.icon}
        </div>
        <div className="fallback-node-waves" />
      </div>

      {/* Blueprint Footer Tech Specs */}
      <div className="fallback-blueprint-footer">
        <span className="fallback-tech-watermark">{tech}</span>
        <div className="fallback-circuit-lines">
          <span className="circuit-dot" />
          <span className="circuit-trace" />
          <span className="circuit-dot" />
        </div>
      </div>
    </div>
  );
};

export default ProjectGraphicFallback;
