import React, { useState, useEffect } from 'react';
import { loadCsv } from '../src/utils/csvLoader';
import EducationCard from '../components/education/EducationCard';
import '../styles/EducationPage.css';

const EducationPage = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sorting priority for degree levels
  const degreePriority = {
    'School': 1,
    'College': 2,
    'University': 3,
    'MS': 4,
    'PhD': 5,
    'Postdoc': 6
  };

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const data = await loadCsv('education');

        // Custom sort to ensure degree_level order if years are same
        const sortedData = (data || []).sort((a, b) => {
          const priorityA = degreePriority[a.degree_level] || 0;
          const priorityB = degreePriority[b.degree_level] || 0;
          
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          return (Number(a.start_year) || 0) - (Number(b.start_year) || 0);
        });

        setEducation(sortedData);
      } catch (err) {
        console.error('Error fetching education:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  return (
    <>
      <div className="education-header page-header">
        <h1>Education</h1>
        <p>A journey of continuous learning and academic excellence</p>
        <div className="header-decoration"></div>
      </div>

      {loading ? (
        <div className="loading-container">
          <span className="loader"></span>
          <p>Loading educational history...</p>
        </div>
      ) : (
        <div className="education-list">
          {education.map((item, index) => (
            <EducationCard key={item.id} record={item} index={index} />
          ))}
          {education.length === 0 && (
            <p className="no-data">No educational history found.</p>
          )}
        </div>
      )}
    </>
  );
};

export default EducationPage;
