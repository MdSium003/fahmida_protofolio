import React from 'react';
import { ExternalLink, Calendar, MapPin, Briefcase } from 'lucide-react';

const ExperienceCard = ({ experience, index }) => {
  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Duration calculation helper
  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let durationStr = '';
    if (years > 0) durationStr += `${years} yr${years > 1 ? 's' : ''} `;
    if (remainingMonths > 0) durationStr += `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
    
    return durationStr.trim() || '1 mo';
  };

  // Description processing helper
  const processDescription = (desc) => {
    const lines = desc.split('\n');
    const summary = lines[0].startsWith('*') ? '' : lines[0];
    const bulletPoints = lines
      .filter(line => line.trim().startsWith('*'))
      .map(line => line.trim().substring(1).trim());
    
    return { summary, bulletPoints };
  };

  const { summary, bulletPoints } = processDescription(experience.description || '');
  const duration = calculateDuration(experience.start_date, experience.end_date);
  const dateRange = `${formatDate(experience.start_date)} - ${formatDate(experience.end_date)}`;

  return (
    <div className="experience-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="experience-logo-container">
        <img 
          src={experience.logo_url || 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/Phd.jpeg'} 
          alt={`${experience.company} logo`} 
          className="experience-logo" 
        />
      </div>

      <div className="experience-info">
        <h3 className="experience-job-title">{experience.job_title}</h3>
        <div className="experience-company-name">{experience.company}</div>
        
        <div className="experience-meta">
          <div className="experience-meta-item">
            <Calendar size={14} />
            <span>{dateRange} · {duration}</span>
          </div>
          {experience.location && (
            <div className="experience-meta-item">
              <MapPin size={14} />
              <span>{experience.location}</span>
            </div>
          )}
          {experience.employment_type && (
            <div className="experience-meta-item">
              <Briefcase size={14} />
              <span>{experience.employment_type}</span>
            </div>
          )}
        </div>

        <div className="experience-description">
          {summary && <p className="experience-summary">{summary}</p>}
          {bulletPoints.length > 0 && (
            <ul className="experience-bullets">
              {bulletPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          )}
        </div>

        {experience.skills_used && (
          <div className="experience-skills">
            <div className="experience-skills-label">Skills:</div>
            <div className="experience-skills-list">
              {experience.skills_used.split(',').map((skill, i) => (
                <span key={i} className="experience-skill-tag">{skill.trim()}</span>
              ))}
            </div>
          </div>
        )}

        {experience.external_link && (
          <a 
            href={experience.external_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="experience-link"
          >
            Visit Website <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

export default ExperienceCard;
