import React, { useState, useEffect } from 'react';
import { loadCsv } from '../../src/utils/csvLoader';

const AwardYearFilter = ({ selectedYear, onYearChange }) => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch unique years from CSV
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const data = await loadCsv('awards');
        const uniqueYears = [...new Set((data || []).map(item => item.year))]
          .filter(Boolean)
          .sort((a, b) => Number(b) - Number(a));
        setYears(uniqueYears);
      } catch (error) {
        console.error('Error fetching years:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  if (loading) {
    return (
      <div className="year-filter">
        <div className="year-tabs">
          <div className="year-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="year-filter">
      <div className="year-tabs">
        <button
          className={`year-tab ${selectedYear === null ? 'active' : ''}`}
          onClick={() => onYearChange(null)}
        >
          All Years
        </button>
        {years.map((year, index) => (
          <button
            key={year}
            className={`year-tab ${selectedYear === year ? 'active' : ''}`}
            onClick={() => onYearChange(year)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AwardYearFilter;
