import React from 'react';
import { ArrowRight, CalendarDays } from 'lucide-react';

const formatDate = (value) => {
  const match = String(value || '').trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/);
  if (!match) return value;

  const [, day, month, year] = match;
  const fullYear = year.length === 2 ? `20${year}` : year;
  const date = new Date(Number(fullYear), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const TravelDateRange = ({ value, variant = 'cover' }) => {
  if (!value) return null;

  const dates = String(value).split(/\s*[-–—]\s*/);
  const start = formatDate(dates[0]);
  const end = dates[1] ? formatDate(dates[1]) : '';

  return (
    <span className={`travel-date-range ${variant === 'modal' ? 'modal-travel-date-range' : ''}`}>
      <CalendarDays size={15} aria-hidden="true" />
      <span className="travel-date-label">TRAVEL DATES</span>
      <time>{start}</time>
      {end && <>
        <ArrowRight size={14} className="travel-date-arrow" aria-hidden="true" />
        <time>{end}</time>
      </>}
    </span>
  );
};

export default TravelDateRange;
