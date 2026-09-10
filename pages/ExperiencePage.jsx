import React, { useState, useEffect } from 'react';
import { loadCsv } from '../src/utils/csvLoader';
import ExperienceCard from '../components/experience/ExperienceCard';
import '../styles/ExperiencePage.css';

const ExperiencePage = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await loadCsv('experience');
      const sorted = (data || []).sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
      setExperiences(sorted);
    } catch (err) {
      console.error('Error fetching experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="experience-page">
      <header className="experience-header page-header">
        <h1>Work Experience</h1>
        <p>A track record of professional growth and technical contributions</p>
        <div className="header-decoration"></div>
      </header>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading experience history...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="no-data">
          <p>No experience history records found.</p>
        </div>
      ) : (
        <div className="experience-list">
          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.id} experience={exp} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperiencePage;
