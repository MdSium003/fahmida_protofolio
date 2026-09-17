import React from 'react';
import { ExternalLink, Calendar, MapPin, Briefcase, Clock } from 'lucide-react';

const ExperienceCard = ({ experience, index }) => {
  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Exact duration calculation: X years Y months Z days
  const calculateExactDuration = (start, end) => {
    if (!start) return '';
    const startDate = new Date(start);
    const endDate = (!end || end.toLowerCase() === 'present') ? new Date() : new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) return '';

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
    if (days > 0 || parts.length === 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);

    return parts.join(' ');
  };

  // Robust bullet points and summary extraction
  const processDescription = (desc) => {
    if (!desc) return { summary: '', bulletPoints: [] };
    const lines = desc.split('\n').map(l => l.trim()).filter(Boolean);
    const bulletPoints = [];
    const nonBullets = [];

    lines.forEach(line => {
      if (/^[-*•>→]/.test(line)) {
        bulletPoints.push(line.replace(/^[-*•>→]+\s*/, '').trim());
      } else {
        nonBullets.push(line);
      }
    });

    return { 
      summary: nonBullets.join('\n'), 
      bulletPoints 
    };
  };

  const { summary, bulletPoints } = processDescription(experience.description || '');
  const duration = calculateExactDuration(experience.start_date, experience.end_date);
  const dateRange = `${formatDate(experience.start_date)} – ${formatDate(experience.end_date)}`;

  return (
    <div className="experience-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="experience-logo-container">
        <img 
          src={experience.logo_url || 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/Phd.jpeg'} 
          alt={`${experience.company} logo`} 
          className="experience-logo" 
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <div className="experience-info">
        <h3 className="experience-job-title">{experience.job_title}</h3>
        <div className="experience-company-name">{experience.company}</div>
        
        <div className="experience-meta">
          <div className="experience-meta-item">
            <Calendar size={14} />
            <span>{dateRange}</span>
          </div>
          {duration && (
            <div className="experience-meta-item" style={{ color: 'var(--color-accent)' }}>
              <Clock size={14} />
              <span>{duration}</span>
            </div>
          )}
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
          {summary && <p className="experience-summary" style={{ whiteSpace: 'pre-line' }}>{summary}</p>}
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
            Visit Official Link <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

export default ExperienceCard;
