import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import '../styles/Homepage.css';
import DriftWall from '../components/shared/DriftWall';
import HomePositioning from '../components/home/HomePositioning';
import HomeNews from '../components/home/HomeNews';
import HomeResearchSpotlight from '../components/home/HomeResearchSpotlight';
import HomeRecognitionPreview from '../components/home/HomeRecognitionPreview';
import HomeMentionsPreview from '../components/home/HomeMentionsPreview';
import HomeContactCTA from '../components/home/HomeContactCTA';
import { 
  Linkedin, Mail, Download, ChevronRight, Menu, X,
  Facebook, Youtube, Github, Instagram, FileText,
  ArrowRight, ArrowDown
} from 'lucide-react';
import { 
  loadNewsData,
  loadResearchData, 
  loadAwardsData, 
  loadBlogsData, 
  loadSocialLinksData, 
  loadMomentsData,
  loadMediaMentionsData
} from '../src/utils/csvLoader';
import PortfolioPreloader from '../components/shared/PortfolioPreloader';

const profileImage = '/images/fahmida.webp';

// Fallback Drift Wall Real Portfolio Assets if moments data empty
const DEFAULT_WALL_IMAGES = Array.from({ length: 31 }, (_, i) => `/wall/thumbs/thumb_(${i + 1}).webp`);

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [news, setNews] = useState([]);
  const [papers, setPapers] = useState([]);
  const [awards, setAwards] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [moments, setMoments] = useState([]);
  const [mediaMentions, setMediaMentions] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [cvLink, setCvLink] = useState('');
  const [loading, setLoading] = useState(true);

  // Preloader session state and hero coordination
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return !window.sessionStorage.getItem('portfolio_preloader_seen');
    }
    return true;
  });
  const [isHeroRevealed, setIsHeroRevealed] = useState(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return !!window.sessionStorage.getItem('portfolio_preloader_seen');
    }
    return false;
  });

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
        const [newsData, researchData, awardsData, blogData, socialData, momentsData, mediaData] = await Promise.all([
          loadNewsData().catch(() => []),
          loadResearchData().catch(() => []),
          loadAwardsData().catch(() => []),
          loadBlogsData().catch(() => []),
          loadSocialLinksData().catch(() => []),
          loadMomentsData().catch(() => []),
          loadMediaMentionsData().catch(() => [])
        ]);

        setNews(newsData || []);
        setPapers(researchData || []);
        setAwards(awardsData || []);
        setBlogs(blogData || []);
        setMoments(momentsData || []);
        setMediaMentions(mediaData || []);

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
    const target = document.getElementById('philosophy') || document.getElementById('news');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const driftWallItems = useMemo(() => {
    if (moments && moments.length > 0) {
      return moments.map((m, idx) => {
        const rawImg = m.image_url || m.image;
        let thumbImg = rawImg;
        if (typeof rawImg === 'string' && rawImg.startsWith('/wall/')) {
          const filename = rawImg.replace('/wall/', '').replace(/\.[^/.]+$/, '');
          thumbImg = `/wall/thumbs/thumb_${filename}.webp`;
        }
        return {
          image: thumbImg || rawImg,
          title: m.caption || `Wall Image ${idx + 1}`
        };
      });
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

  // Idle background pre-fetching of remaining CSV datasets for instant navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => {
        import('../src/utils/csvLoader').then(({ loadSkillsData, loadEducationData, loadExperienceData, loadVolunteerData }) => {
          loadSkillsData().catch(() => {});
          loadEducationData().catch(() => {});
          loadExperienceData().catch(() => {});
          loadVolunteerData().catch(() => {});
        });
      }, { timeout: 3500 });
      return () => window.cancelIdleCallback(idleId);
    }
  }, []);

  const prefetchRoute = (path) => {
    switch (path) {
      case '/career': import('./CareerPage'); break;
      case '/projects': import('./ProjectsPage'); break;
      case '/research': import('./ResearchPage'); break;
      case '/awards': import('./AwardsPage'); break;
      case '/skills': import('./SkillsPage'); break;
      case '/blog': import('./BlogPage'); break;
      default: break;
    }
  };

  return (
    <div className="homepage">
      {showPreloader && (
        <PortfolioPreloader 
          onRevealHero={() => setIsHeroRevealed(true)}
          onComplete={() => {
            setShowPreloader(false);
            try {
              sessionStorage.setItem('portfolio_preloader_seen', 'true');
            } catch (e) {}
          }}
        />
      )}

      {/* 1. Header Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-text">Fahmida</span>
          </Link>

          <div className="nav-links">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="nav-link"
                onMouseEnter={() => prefetchRoute(item.path)}
                onTouchStart={() => prefetchRoute(item.path)}
              >
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
          <motion.div
            className="hero-profile-column"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isHeroRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="profile-card-wrapper">
              <div className="profile-ambient-glow" />
              <div className="profile-card">
                <div className="profile-img-container">
                  <img 
                    src={profileImage} 
                    alt="Mst. Fahmida Sultana Naznin" 
                    className="profile-main-img" 
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Name & Identity */}
          <div className="hero-content-column">
            <motion.div
              className="hero-intro-lead"
              initial={{ opacity: 0, y: 18 }}
              animate={isHeroRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="lead-dash" />
              <span className="lead-text">This is</span>
            </motion.div>

            <motion.h1
              className="hero-name-title"
              initial={{ opacity: 0, y: 18 }}
              animate={isHeroRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="hero-name-gradient">Mst. Fahmida Sultana Naznin</span>
            </motion.h1>

            <motion.div
              className="hero-role-line"
              initial={{ opacity: 0, y: 18 }}
              animate={isHeroRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="role-segment role-primary">AI in Healthcare Researcher</span>
              <span className="role-dot">•</span>
              <span className="role-segment">Entrepreneur</span>
              <span className="role-dot">•</span>
              <span className="role-segment">Educator</span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="hero-actions-row"
              initial={{ opacity: 0, y: 18 }}
              animate={isHeroRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
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
            </motion.div>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <motion.button 
          className="hero-scroll-indicator" 
          onClick={scrollToFirstSection}
          aria-label="Scroll to explore"
          type="button"
          initial={{ opacity: 0 }}
          animate={isHeroRevealed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="scroll-text">SCROLL TO EXPLORE</span>
          <ArrowDown size={14} className="scroll-arrow-anim" />
        </motion.button>
      </section>

      {/* 3. Section 01: Positioning & Manifesto Statement */}
      <HomePositioning />

      {/* 4. Section 02: Latest News & Updates */}
      <HomeNews news={news} />

      {/* 5. Section 03: Research Spotlight */}
      <HomeResearchSpotlight papers={papers} />

      {/* 6. Section 04: Recognition Preview */}
      <HomeRecognitionPreview awards={awards} />

      {/* 7. Section 05: Key Media Mentions & Press Highlights */}
      <HomeMentionsPreview mediaMentions={mediaMentions} />

      {/* 9. Section 07: Closing Contact CTA */}
      <HomeContactCTA />

      {/* 10. Minimal Clean Footer */}
      <footer className="home-footer">
        <div className="home-footer-content">
          <div className="home-footer-logo">
            <span className="logo-text">Fahmida</span>
            <span className="logo-subtitle">AI in Healthcare Researcher</span>
          </div>
          <p className="footer-text">
            Founder & CEO, PinkLifeLine | AI in Healthcare Researcher | Educator<br />
            Building intelligent AI for better healthcare, deeper clinical insights, and meaningful human impact.
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
