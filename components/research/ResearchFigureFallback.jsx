import React from 'react';
import { Eye, Brain, Network, FileText, Stethoscope, Dna, Activity, Binary } from 'lucide-react';

/**
 * Pure aesthetic scientific blueprint & schematic background visual.
 * Renders ONLY background textures, geometric lattices, and subtle glowing watermark icons.
 * Classifies by general scientific domain and topic rather than hardcoded paper titles.
 */
const ResearchFigureFallback = ({ paper, className = '' }) => {
  const topic = ((paper?.topics || '') + ' ' + (paper?.kicker || '') + ' ' + (paper?.title || '')).toLowerCase();

  const getSchematicConfig = () => {
    if (topic.includes('dna') || topic.includes('bio') || topic.includes('genom')) {
      return {
        pattern: 'dna-channel',
        icon: <Dna size={56} />
      };
    }
    if (topic.includes('brain') || topic.includes('tumor') || topic.includes('neuro') || topic.includes('anatom')) {
      return {
        pattern: 'brain-mesh',
        icon: <Brain size={56} />
      };
    }
    if (topic.includes('clinical') || topic.includes('medical') || topic.includes('health') || topic.includes('agent')) {
      return {
        pattern: 'agent-graph',
        icon: <Stethoscope size={56} />
      };
    }
    if (topic.includes('vision') || topic.includes('segment') || topic.includes('retin') || topic.includes('image') || topic.includes('optical')) {
      return {
        pattern: 'diffusion-fourier',
        icon: <Eye size={56} />
      };
    }
    if (topic.includes('nlp') || topic.includes('text') || topic.includes('report') || topic.includes('summar') || topic.includes('language')) {
      return {
        pattern: 'cross-attention',
        icon: <FileText size={56} />
      };
    }
    if (topic.includes('graph') || topic.includes('network') || topic.includes('flow') || topic.includes('video')) {
      return {
        pattern: 'pyramid-flow',
        icon: <Network size={56} />
      };
    }
    if (topic.includes('speech') || topic.includes('dialogue') || topic.includes('audio') || topic.includes('signal')) {
      return {
        pattern: 'dialogue-tree',
        icon: <Activity size={56} />
      };
    }
    return {
      pattern: 'generic-neural',
      icon: <Binary size={56} />
    };
  };

  const config = getSchematicConfig();

  return (
    <div className={`research-blueprint-canvas ${className}`} aria-hidden="true">
      {/* Background Geometric Grid / Lattice */}
      <div className={`blueprint-pattern ${config.pattern}`} />
      
      {/* Central Ambient Glow */}
      <div className="blueprint-ambient-glow" />

      {/* Subtle Blueprint Watermark Icon */}
      <div className="blueprint-watermark-icon">
        {config.icon}
      </div>
    </div>
  );
};

export default React.memo(ResearchFigureFallback);
