import React from 'react';
import { Eye, Stethoscope, Sparkles, Brain, Network, Activity } from 'lucide-react';

const AREAS = [
  { id: 'medical', label: 'Medical & Clinical AI', keyword: 'Deep Learning', icon: <Stethoscope size={13} /> },
  { id: 'vision', label: 'Computer Vision', keyword: 'Computer Vision', icon: <Eye size={13} /> },
  { id: 'multimodal', label: 'Multimodal Systems', keyword: 'Image & Video Understanding', icon: <Network size={13} /> },
  { id: 'nlp', label: 'Clinical NLP & LLMs', keyword: 'Natural Language Processing', icon: <Brain size={13} /> },
  { id: 'hci', label: 'HCI & Telemedicine', keyword: 'HCI', icon: <Activity size={13} /> },
  { id: 'ai', label: 'Trustworthy AI', keyword: 'LLM', icon: <Sparkles size={13} /> }
];

const ResearchAreas = ({ selectedTopics = [], onToggleTopic }) => {
  return (
    <div className="research-areas-strip-wrapper" aria-label="Research landscape areas">
      <div className="research-areas-container">
        {AREAS.map((area, idx) => {
          const isActive = selectedTopics.includes(area.keyword);
          return (
            <React.Fragment key={area.id}>
              <button
                type="button"
                className={`research-area-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => onToggleTopic && onToggleTopic(area.keyword)}
                title={`Filter by ${area.label}`}
              >
                {area.icon}
                <span>{area.label}</span>
              </button>
              {idx < AREAS.length - 1 && (
                <span className="area-separator" aria-hidden="true">·</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ResearchAreas;
