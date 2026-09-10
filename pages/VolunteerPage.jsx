import React, { useState, useEffect } from 'react';
import { loadCsv } from '../src/utils/csvLoader';
import VolunteerCard from '../components/volunteer/VolunteerCard';
import '../styles/VolunteerPage.css';

const VolunteerPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const data = await loadCsv('volunteer');
      const sorted = [...data].sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
      setVolunteers(sorted);
    } catch (err) {
      console.error('Error fetching volunteer history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="volunteer-page">
      <header className="volunteer-header page-header">
        <h1>Volunteer Experience</h1>
        <p>Giving back to the community and contributing to meaningful causes</p>
        <div className="header-decoration"></div>
      </header>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading volunteer history...</p>
        </div>
      ) : volunteers.length === 0 ? (
        <div className="no-data">
          <p>No volunteer history records found.</p>
        </div>
      ) : (
        <div className="volunteer-list">
          {volunteers.map((vol, index) => (
            <VolunteerCard key={vol.id} volunteer={vol} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerPage;
