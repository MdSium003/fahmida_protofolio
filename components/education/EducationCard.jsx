import React from 'react';
import { ExternalLink, GraduationCap, Calendar, Award } from 'lucide-react';

const EducationCard = ({ record, index }) => {
  const duration = record.end_year ? `${record.start_year} - ${record.end_year}` : `${record.start_year} - Present`;

  return (
    <div className="education-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="education-logo-container">
        {/* Using logo_url directly from database as requested */}
        <img 
          src={record.logo_url || 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Education/college.jpeg'} 
          alt={`${record.institution} logo`} 
          className="education-logo" 
        />
      </div>

      <div className="education-info">
        <h3 className="education-institution">{record.institution}</h3>
        
        {record.field_of_study && (
          <div className="education-field">{record.field_of_study}</div>
        )}
        
        <div className="education-degree-level">
          <GraduationCap size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          {record.degree_level}
        </div>

        <div className="education-duration">
          <Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          {duration}
        </div>

        {record.grade && (
          <div className="education-grade">
            <Award size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Grade: <strong>{record.grade}</strong>
          </div>
        )}

        <div className="education-details">
          {record.activities && (
            <div className="education-activities">
              <div className="education-section-title">Activities & Societies</div>
              <p>{record.activities}</p>
            </div>
          )}

          {record.skills && (
            <div className="education-skills">
              <div className="education-section-title">Skills</div>
              <p>{record.skills}</p>
            </div>
          )}
        </div>

        {record.external_link && (
          <a 
            href={record.external_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="education-link"
          >
            Visit Website <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

export default EducationCard;
