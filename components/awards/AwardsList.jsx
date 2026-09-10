import React, { useState, useEffect } from 'react';
import { loadCsv } from '../../src/utils/csvLoader';
import { Trophy } from 'lucide-react';
import AwardCard from './AwardCard';

const AwardsList = ({ selectedTopic, selectedYear }) => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAwards();
  }, [selectedTopic, selectedYear]);

  const fetchAwards = async () => {
    try {
      setLoading(true);
      const awardsData = await loadCsv('awards');

      let list = (awardsData || []).map(award => ({
        ...award,
        topic_slug: (award.topic || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }));

      // Filter by year
      if (selectedYear) {
        list = list.filter(a => Number(a.year) === Number(selectedYear));
      }

      // Filter by topic if selected
      if (selectedTopic) {
        list = list.filter(award => award.topic_slug === selectedTopic || award.topic === selectedTopic);
      }

      // Sort by year descending
      list.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));

      setAwards(list);
    } catch (error) {
      console.error('Error fetching awards:', error);
      setAwards([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="awards-list">
        <div className="awards-loading">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="award-skeleton">
              <div className="skeleton-thumbnail"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-links"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (awards.length === 0) {
    return (
      <div className="awards-list">
        <div className="no-awards">
          <Trophy size={36} className="no-awards-icon" />
          <h3>No awards found</h3>
          <p>Try selecting a different category or year filter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="awards-list">
      <div className="awards-grid">
        {awards.map((award, index) => (
          <AwardCard 
            key={award.id} 
            award={award} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default AwardsList;
