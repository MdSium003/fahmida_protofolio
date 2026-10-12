import React from 'react';
import { CalendarDays, GraduationCap } from 'lucide-react';

const ProfessionalTraining = ({ training = [] }) => (
  <section className="skills-section professional-training-section" aria-label="Professional Training">
    <div className="section-header-compact">
      <h2 className="section-title">Professional Training</h2>
    </div>

    <div className="professional-training-list">
      {training.map(item => (
        <article className="professional-training-card" key={item.id}>
          <div className="professional-training-icon" aria-hidden="true">
            <GraduationCap size={22} />
          </div>
          <div className="professional-training-content">
            <h3>{item.title}</h3>
            <p className="professional-training-institution">{item.institution}</p>
            <p className="professional-training-date">
              <CalendarDays size={15} aria-hidden="true" />
              <span>{item.date_range}</span>
            </p>
            {item.description && <p className="professional-training-description">{item.description}</p>}
            {item.responsibilitiesList?.length > 0 && (
              <ul className="professional-training-focus">
                {item.responsibilitiesList.map((focus, index) => <li key={`${item.id}-${index}`}>{focus}</li>)}
              </ul>
            )}
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default ProfessionalTraining;
