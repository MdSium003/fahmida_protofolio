import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import '../styles/NotFoundPage.css';
import { usePageMeta } from '../src/hooks/usePageMeta';

/**
 * In-app 404. Reached when the router matches nothing — either from an
 * in-site link or from a deep link that public/404.html bounced back here.
 */
const NotFoundPage = () => {
  usePageMeta({
    title: 'Page Not Found',
    description:
      "The page you are looking for could not be found.",
    noindex: true,
  });

  const destinations = [
    { to: '/research', label: 'Research' },
    { to: '/projects', label: 'Projects' },
    { to: '/career', label: 'Career' },
    { to: '/awards', label: 'Awards' },
    { to: '/skills', label: 'Skills' },
    { to: '/blog', label: 'Journal' },
  ];

  return (
    <main className="notfound-page">
      <div className="notfound-inner">
        <p className="notfound-code">
          <Compass size={15} aria-hidden="true" />
          <span>404</span>
        </p>

        <h1 className="notfound-heading">This page could not be found.</h1>

        <p className="notfound-body">
          The link may be outdated, or the page may have moved. Everything else
          is still here &mdash; pick up from one of these instead.
        </p>

        <nav className="notfound-links" aria-label="Site sections">
          {destinations.map(({ to, label }) => (
            <Link key={to} to={to} className="notfound-chip">
              {label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="notfound-home">
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to the homepage</span>
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
