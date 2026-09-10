import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import '../../styles/ProjectsPage.css';

const ProjectsLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = ['HOME', 'RESEARCH', 'PROJECTS', 'AWARDS', 'SKILLS', 'UPCYCLING', 'BLOG', 'EDUCATION', 'WORK EXPERIENCE', 'VOLUNTEER'];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavLink = (item) => {
    if (item === 'RESEARCH') return '/research';
    if (item === 'AWARDS') return '/awards';
    if (item === 'PROJECTS') return '/projects';
    if (item === 'BLOG') return '/blog';
    if (item === 'EDUCATION') return '/education';
    if (item === 'WORK EXPERIENCE') return '/experience';
    if (item === 'VOLUNTEER') return '/volunteer';
    if (item === 'SKILLS') return '/skills';
    if (item === 'UPCYCLING') return '/upcycling';
    if (item === 'HOME') return '/';
    return `/#${item.toLowerCase().replace(' ', '-')}`;
  };

  return (
    <div className="projects-page">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-text">Fahmida</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navItems.map(item => (
              ['RESEARCH', 'AWARDS', 'PROJECTS', 'BLOG', 'EDUCATION', 'WORK EXPERIENCE', 'VOLUNTEER', 'SKILLS', 'UPCYCLING', 'HOME'].includes(item) ? (
                <Link key={item} to={getNavLink(item)} className="nav-link">
                  {item}
                </Link>
              ) : (
                <a key={item} href={getNavLink(item)} className="nav-link">
                  {item}
                </a>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Navigation */}
          <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
            {navItems.map(item => (
              ['RESEARCH', 'AWARDS', 'PROJECTS', 'BLOG', 'EDUCATION', 'WORK EXPERIENCE', 'VOLUNTEER', 'SKILLS', 'UPCYCLING', 'HOME'].includes(item) ? (
                <Link 
                  key={item} 
                  to={getNavLink(item)} 
                  className="mobile-nav-link" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item} <ChevronRight size={16} />
                </Link>
              ) : (
                <a 
                  key={item} 
                  href={getNavLink(item)} 
                  className="mobile-nav-link" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item} <ChevronRight size={16} />
                </a>
              )
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}
    </div>
  );
};

export default ProjectsLayout;
