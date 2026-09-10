import React from 'react';
import { ExternalLink, Calendar, Tag, Heart } from 'lucide-react';

const VolunteerCard = ({ volunteer, index }) => {
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
    if (!desc) return { summary: '', bulletPoints: [] };
    const lines = desc.split('\n');
    const summary = lines[0].startsWith('*') ? '' : lines[0];
    const bulletPoints = lines
      .filter(line => line.trim().startsWith('*'))
      .map(line => line.trim().substring(1).trim());
    
    return { summary, bulletPoints };
  };

  const { summary, bulletPoints } = processDescription(volunteer.description || '');
  const duration = volunteer.duration || calculateDuration(volunteer.start_date, volunteer.end_date);
  const dateRange = `${formatDate(volunteer.start_date)} - ${formatDate(volunteer.end_date)}`;

  // Responsibilities processing
  const respPoints = volunteer.responsibilities ? volunteer.responsibilities.split('\n')
    .filter(line => line.trim().startsWith('*'))
    .map(line => line.trim().substring(1).trim()) : [];

  return (
    <div className="volunteer-card" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="volunteer-card-content">
            <div className="volunteer-logo-container">
                <img 
                src={volunteer.logo_url || 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/Phd.jpeg'} 
                alt={`${volunteer.organization} logo`} 
                className="volunteer-logo" 
                />
            </div>

            <div className="volunteer-info">
                <div className="volunteer-top-header">
                    <div className="volunteer-title-group">
                        <h3 className="volunteer-job-title">{volunteer.role}</h3>
                        <div className="volunteer-org-name">{volunteer.organization}</div>
                    </div>
                </div>
                
                <div className="volunteer-meta">
                    <div className="volunteer-meta-item">
                        <Calendar size={14} />
                        <span>{dateRange} · {duration}</span>
                    </div>
                    {volunteer.category && (
                        <div className="volunteer-meta-item">
                            <Tag size={14} />
                            <span>{volunteer.category}</span>
                        </div>
                    )}
                </div>

                <div className="volunteer-description">
                    {summary && <p className="volunteer-summary">{summary}</p>}
                    {(bulletPoints.length > 0 || respPoints.length > 0) && (
                        <ul className="volunteer-bullets">
                            {[...bulletPoints, ...respPoints].map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>
                    )}
                </div>

                {volunteer.skills_gained && (
                    <div className="volunteer-skills">
                        <div className="volunteer-skills-label">Skills & Impact:</div>
                        <div className="volunteer-skills-list">
                            {volunteer.skills_gained.split(',').map((skill, i) => (
                                <span key={i} className="volunteer-skill-tag">
                                    <Heart size={10} className="skill-icon" /> {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {volunteer.external_link && (
                    <a 
                        href={volunteer.external_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="volunteer-link"
                    >
                        Learn More <ExternalLink size={14} />
                    </a>
                )}
            </div>
        </div>
    </div>
  );
};

export default VolunteerCard;
