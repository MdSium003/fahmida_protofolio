import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Homepage.css';
import DriftWall from '../components/shared/DriftWall';
import HomePositioning from '../components/home/HomePositioning';
import HomeSelectedProjects from '../components/home/HomeSelectedProjects';
import HomeResearchSpotlight from '../components/home/HomeResearchSpotlight';
import HomeRecognitionPreview from '../components/home/HomeRecognitionPreview';
import HomeJournalPreview from '../components/home/HomeJournalPreview';
import HomeContactCTA from '../components/home/HomeContactCTA';
import { 
  Linkedin, Mail, Download, ChevronRight, Menu, X,
  Facebook, Youtube, Github, Instagram, FileText,
  ArrowRight, ArrowDown
} from 'lucide-react';
import { 
  loadProjectsData, 
  loadResearchData, 
  loadAwardsData, 
  loadBlogsData, 
  loadSocialLinksData, 
  loadMomentsData 
} from '../src/utils/csvLoader';
import profileImage from '../images/fahmida.png';

// Fallback Drift Wall Real Portfolio Assets if moments data empty
const DEFAULT_WALL_IMAGES = [
  '/wall/fahmida_with_lal_background.jpeg',
  '/wall/fahmida_with_purdue.jpeg',
  '/wall/fahmida_with_robot.jpeg',
  '/wall/fahmida_with_show_pice.jpeg',
  '/wall/fahmida_with_car.jpeg',
  '/wall/fahmida_with_ddn.jpeg',
  '/wall/fahmida_blog.jpeg',
  '/wall/fahmida_blog_2.jpeg',
  '/wall/fahmida_blog_3.jpeg',
  '/wall/fahmida_blog_4.jpeg',
  '/wall/up_1.jpeg',
  '/wall/up_2.jpeg',
  '/wall/up_3.jpeg',
  '/wall/up_4.jpeg',
  '/wall/research_1.jpg',
  '/wall/research_4.jpg',
  '/wall/college.jpeg',
  '/wall/undergrad.jpeg'
];

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [projects, setProjects] = useState([]);
  const [papers, setPapers] = useState([]);
  const [awards, setAwards] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [moments, setMoments] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [cvLink, setCvLink] = useState('');
  const [loading, setLoading] = useState(true);

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
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Fetch all portfolio datasets for previews
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [projData, researchData, awardsData, blogData, socialData, momentsData] = await Promise.all([
          loadProjectsData().catch(() => []),
          loadResearchData().catch(() => []),
          loadAwardsData().catch(() => []),
          loadBlogsData().catch(() => []),
          loadSocialLinksData().catch(() => []),
          loadMomentsData().catch(() => [])
        ]);

        setProjects(projData || []);
        setPapers(researchData || []);
        setAwards(awardsData || []);
        setBlogs(blogData || []);
        setMoments(momentsData || []);

        const sortedSocial = socialData || [];
        setSocialLinks(sortedSocial);
        const cvData = sortedSocial.find(link => String(link.platform).toLowerCase() === 'cv');
        if (cvData && cvData.url) setCvLink(cvData.url);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const scrollToFirstSection = () => {
    const target = document.getElementById('about-the-work');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const driftWallItems = useMemo(() => {
    if (moments && moments.length > 0) {
      return moments.map((m, idx) => ({
        image: m.image_url || m.image,
        title: m.caption || `Wall Image ${idx + 1}`
      }));
    }
    return DEFAULT_WALL_IMAGES.map((img, idx) => ({
      image: img,
      title: `Wall Image ${idx + 1}`
    }));
  }, [moments]);

  const getFooterIcon = (platform) => {
    switch(String(platform).toLowerCase()) {
      case 'facebook': return <Facebook size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'youtube': return <Youtube size={16} />;
      case 'github': return <Github size={16} />;
      case 'instagram': return <Instagram size={16} />;
      case 'cv': return <FileText size={16} />;
      default: return <Mail size={16} />;
    }
  };

  return (
    <div className="homepage">
      {/* 1. Header Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-text">Fahmida</span>
          </Link>

          <div className="nav-links">
            {navItems.map(item => (
              <Link key={item.path} to={item.path} className="nav-link">
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {isMenuOpen && (
            <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)} />
          )}

          <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-header">
              <span className="logo-text">Fahmida</span>
              <button onClick={() => setIsMenuOpen(false)} className="close-menu-btn" aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <div className="mobile-nav-items">
              {navItems.map(item => (
                <Link key={item.path} to={item.path} className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  {item.label} <ChevronRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Signature Drift Wall Hero */}
      <section className="hero" id="home">
        {/* Drift Wall Background */}
        <div className="hero-driftwall-wrapper" aria-hidden="true">
          <DriftWall
            items={driftWallItems}
            columns={8}
            tileWidth={200}
            tileHeight={135}
            gap={16}
            tilt={14}
            turn={-12}
            perspective={1200}
            depth={140}
            speed={10}
            direction="up"
            variance={0.35}
            parallax={0}
            interactive={false}
            lift={0}
            fade={0}
            dim={0.65}
            grayscale={false}
            overlayColor="#0a0a0a"
          />
          <div className="driftwall-overlay-gradient" />
        </div>

        {/* Foreground Hero Content */}
        <div className="hero-container">
          {/* Profile Portrait */}
          <div className="hero-profile-column">
            <div className="profile-card-wrapper">
              <div className="profile-ambient-glow" />
              <div className="profile-card">
                <div className="profile-img-container">
                  <img 
                    src={profileImage} 
                    alt="Mst. Fahmida Sultana Naznin" 
                    className="profile-main-img" 
                  />
                  <div className="profile-inner-border" />
                </div>
              </div>
            </div>
          </div>

          {/* Name & Identity */}
          <div className="hero-content-column">
            <div className="hero-intro-lead">
              <span className="lead-dash" />
              <span className="lead-text">This is</span>
            </div>

            <h1 className="hero-name-title">
              <span className="hero-name-gradient">Mst. Fahmida Sultana Naznin</span>
            </h1>

            <div className="hero-role-line">
              <span className="role-segment role-primary">ACCA Candidate</span>
              <span className="role-dot">•</span>
              <span className="role-segment">Finance & Strategy</span>
              <span className="role-dot">•</span>
              <span className="role-segment">Strategic Analyst</span>
            </div>

            {/* CTAs */}
            <div className="hero-actions-row">
              <button onClick={scrollToFirstSection} className="btn-hero-primary" type="button">
                <span>Explore My Work</span>
                <ArrowRight size={16} />
              </button>
              {cvLink ? (
                <a href={cvLink} target="_blank" rel="noopener noreferrer" className="btn-hero-secondary">
                  <Download size={16} />
                  <span>Download CV</span>
                </a>
              ) : (
                <Link to="/research" className="btn-hero-secondary">
                  <span>View Research</span>
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <button 
          className="hero-scroll-indicator" 
          onClick={scrollToFirstSection}
          aria-label="Scroll to explore"
          type="button"
        >
          <span className="scroll-text">SCROLL TO EXPLORE</span>
          <ArrowDown size={14} className="scroll-arrow-anim" />
        </button>
      </section>

      {/* 3. Section 01: Positioning Statement */}
      <HomePositioning />

      {/* 4. Section 02: Selected Projects */}
      <HomeSelectedProjects projects={projects} />

      {/* 5. Section 03: Research Spotlight */}
      <HomeResearchSpotlight papers={papers} />

      {/* 6. Section 04: Recognition Preview */}
      <HomeRecognitionPreview awards={awards} />

      {/* 7. Section 05: Journal & Reflections */}
      <HomeJournalPreview blogs={blogs} />

      {/* 9. Section 07: Closing Contact CTA */}
      <HomeContactCTA />

      {/* 10. Minimal Clean Footer */}
      <footer className="home-footer">
        <div className="home-footer-content">
          <div className="home-footer-logo">
            <span className="logo-text">Fahmida</span>
            <span className="logo-subtitle">Portfolio & Research</span>
          </div>
          <p className="footer-text">
            Strategic Finance Professional | ACCA Candidate | AI & Vision Researcher<br />
            Transforming complex systems and empirical data into impactful intelligence.
          </p>
          <div className="footer-social">
            {!loading && socialLinks
              .filter(link => String(link.platform).toLowerCase() !== 'cv')
              .map(link => (
                <a 
                  key={link.id} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link" 
                  title={link.platform}
                >
                  {getFooterIcon(link.platform)}
                  <span>{link.platform}</span>
                </a>
              ))
            }
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Mst. Fahmida Sultana Naznin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
