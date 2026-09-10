import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Career', path: '/career' },
    { label: 'Projects', path: '/projects' },
    { label: 'Research', path: '/research' },
    { label: 'Awards', path: '/awards' },
    { label: 'Skills', path: '/skills' },
    { label: 'Blog', path: '/blog' },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const prefetchRoute = (path) => {
    switch (path) {
      case '/career': import('../../pages/CareerPage'); break;
      case '/projects': import('../../pages/ProjectsPage'); break;
      case '/research': import('../../pages/ResearchPage'); break;
      case '/awards': import('../../pages/AwardsPage'); break;
      case '/skills': import('../../pages/SkillsPage'); break;
      case '/blog': import('../../pages/BlogPage'); break;
      case '/': import('../../pages/Homepage'); break;
      default: break;
    }
  };

  return (
    <div className="page-layout">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo" onMouseEnter={() => prefetchRoute('/')}>
            <span className="logo-text">Fahmida</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onMouseEnter={() => prefetchRoute(item.path)}
                onTouchStart={() => prefetchRoute(item.path)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Mobile Overlay */}
          {isMenuOpen && (
            <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)} />
          )}

          {/* Mobile Navigation */}
          <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-header">
              <span className="logo-text">Fahmida</span>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="close-menu-btn" 
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mobile-nav-items">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  <ChevronRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="page-main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <span className="logo-text">Fahmida</span>
          <span className="logo-subtitle">ACCA Portfolio</span>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Fahmida. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
