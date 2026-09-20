import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, MapPin, ExternalLink, Award, CheckCircle2, 
  ArrowUpRight, Plus, Clock, Briefcase, GraduationCap, HeartHandshake,
  Users
} from 'lucide-react';
import { loadExperienceData, loadEducationData, loadVolunteerData, loadLeadershipData } from '../src/utils/csvLoader';
import ScrollReveal from '../components/shared/ScrollReveal';
import '../styles/CareerPage.css';

const careerImage = '/images/Career.jpg';

const CareerPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [leadership, setLeadership] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredExpId, setHoveredExpId] = useState(null);
  const [hoveredVolId, setHoveredVolId] = useState(null);
  const [hoveredLeadId, setHoveredLeadId] = useState(null);

  // For Education Timeline Popover
  const [hoveredEdu, setHoveredEdu] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, isLeft: false });

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      setLoading(true);
      const [expData, eduData, volData, leadData] = await Promise.all([
        loadExperienceData(),
        loadEducationData(),
        loadVolunteerData(),
        loadLeadershipData()
      ]);

      // Ensure experiences are sorted latest to past (descending)
      const sortedExp = (expData || []).slice().sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
      // Ensure education is sorted latest to past
      const sortedEdu = (eduData || []).slice().sort((a, b) => (Number(b.start_year) || 0) - (Number(a.start_year) || 0));
      // Ensure volunteer is sorted latest to past
      const sortedVol = (volData || []).slice().sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
      // Ensure leadership is sorted latest to past
      const sortedLead = (leadData || []).slice().sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));

      setExperiences(sortedExp);
      setEducation(sortedEdu);
      setVolunteers(sortedVol);
      setLeadership(sortedLead);
    } catch (error) {
      console.error('Error loading career data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Exact duration calculation: X years Y months Z days
  const calculateExactDuration = (startDateStr, endDateStr) => {
    if (!startDateStr) return '';
    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return '';

    const end = (!endDateStr || endDateStr.toLowerCase() === 'present')
      ? new Date()
      : new Date(endDateStr);

    if (isNaN(end.getTime()) || end < start) return '';

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const parts = [];
    if (years > 0) {
      parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    }
    if (months > 0) {
      parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    }
    if (days > 0 || parts.length === 0) {
      parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    }

    return parts.join(' ');
  };

  const parseBulletPoints = (text) => {
    if (!text) return [];
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[\-*•>→]+\s*/, '').trim())
      .filter(line => line.length > 0 && !line.startsWith('vyfyifyi'));
  };

  const handleEduMouseEnter = (e, edu) => {
    setHoveredEdu(edu);
    updateCursorPos(e);
  };

  const handleEduMouseMove = (e) => {
    updateCursorPos(e);
  };

  const handleEduMouseLeave = () => {
    setHoveredEdu(null);
  };

  const updateCursorPos = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const cardWidth = 380;
    const cardHeight = 360;
    const offset = 20;

    // Check if there is enough space on the right, otherwise show on left
    const showOnLeft = (mouseX + cardWidth + offset > window.innerWidth);
    
    let posX = showOnLeft ? (mouseX - cardWidth - offset) : (mouseX + offset);
    let posY = mouseY - 40;

    // Constrain Y within viewport
    if (posY + cardHeight > window.innerHeight - 16) {
      posY = Math.max(16, window.innerHeight - cardHeight - 16);
    }
    if (posY < 16) {
      posY = 16;
    }

    setCursorPos({ x: posX, y: posY, isLeft: showOnLeft });
  };

  return (
    <div className="career-page-v2">
      {/* Background Ambient Glows */}
      <div className="career-ambient-orb orb-1" aria-hidden="true" />
      <div className="career-ambient-orb orb-2" aria-hidden="true" />

      {/* Motivational Hero Section: "She Never Stops." with Profile Picture */}
      <motion.header 
        className="career-hero-split"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="career-hero-left">
          <h1 className="career-hero-quote">
            <span className="quote-lead">She Never</span>
            <span className="quote-highlight"> Stops.</span>
          </h1>

          <p className="career-hero-speech">
            From founding PinkLifeLine to make healthcare more accessible through AI, to conducting biomedical AI research, contributing to research at BUET, and teaching and mentoring future computer scientists, my journey has always been guided by one purpose: to learn deeply, build boldly, and turn knowledge and technology into meaningful change in people’s lives.
          </p>

          <div className="career-hero-tags">
            <span className="hero-tag-item">Founder & CEO</span>
            <span className="hero-tag-dot">•</span>
            <span className="hero-tag-item">Lecturer</span>
            <span className="hero-tag-dot">•</span>
            <span className="hero-tag-item">Research Assistant</span>
            <span className="hero-tag-dot">•</span>
            <span className="hero-tag-item">NUS Visiting Scholar 2026</span>
            <span className="hero-tag-dot">•</span>
            <span className="hero-tag-item">AI in Healthcare Researcher</span>
          </div>
        </div>

        <div className="career-hero-right">
          <div className="career-portrait-wrapper">
            <div className="portrait-ambient-glow" />
            <div className="portrait-frame">
              <img 
                src={careerImage} 
                alt="Mst. Fahmida Sultana Naznin" 
                className="career-portrait-img" 
              />
              <div className="portrait-glass-overlay" />
            </div>
          </div>
        </div>
      </motion.header>

      {loading ? (
        <div className="career-loading-state">
          <div className="career-spinner"></div>
          <p>Loading career milestones...</p>
        </div>
      ) : (
        <div className="career-sections-stack">

          {/* =================================================================
              1. EXPERIENCE (ATHOS ROW DESIGN + DOWNWARD REVEAL)
             ================================================================= */}
          <ScrollReveal>
            <section className="career-block experience-block">
              <div className="block-header">
                <div className="block-header-left">
                  <h2 className="block-title">Experience</h2>
                </div>
              </div>

              {/* Athos-Dark Minimalist Row List (Locked 100% Width) */}
              <div className="athos-list-container">
                {experiences.map((exp, index) => {
                  const dateRange = `${formatDate(exp.start_date)} – ${formatDate(exp.end_date)}`;
                  const durationStr = calculateExactDuration(exp.start_date, exp.end_date);
                  const bullets = parseBulletPoints(exp.description);
                  const isHovered = (hoveredExpId === exp.id);

                  return (
                    <div 
                      key={exp.id || index}
                      className={`athos-row-card ${isHovered ? 'is-hovered' : ''}`}
                      onClick={() => setHoveredExpId(hoveredExpId === exp.id ? null : exp.id)}
                      onMouseEnter={() => setHoveredExpId(exp.id)}
                      onMouseLeave={() => setHoveredExpId(null)}
                    >
                      {/* Primary Visible Bar */}
                      <div className="athos-primary-row">
                        {/* Left: Role / Job Title & Company */}
                        <div className="athos-left-col">
                          <div className="athos-degree-title">
                            {exp.job_title}
                          </div>
                          <div className="athos-sub-degree">{exp.company}</div>
                        </div>

                        {/* Right: Location & Duration */}
                        <div className="athos-right-col">
                          <div className="athos-institution-name">
                            {exp.location} {exp.employment_type ? `· ${exp.employment_type}` : ''}
                          </div>
                          <div className="athos-date-text">
                            {dateRange}
                          </div>
                        </div>
                      </div>

                      {/* Downward Revealed Drawer */}
                      <div className="athos-reveal-drawer">
                        <div className="athos-drawer-inner">
                          {durationStr && (
                            <div className="athos-grade-badge">
                              <Clock size={14} />
                              <span>Total Duration: <strong>{durationStr}</strong></span>
                            </div>
                          )}

                          {bullets.length > 0 && (
                            <div className="athos-activities-content">
                              <span className="vol-drawer-heading">Key Highlights & Responsibilities:</span>
                              <ul className="pt-v-bullets" style={{ marginTop: '0.4rem', borderTop: 'none', paddingTop: 0 }}>
                                {bullets.map((bullet, bIdx) => (
                                  <li key={bIdx}>
                                    <span className="pt-v-bullet-arrow"></span>
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {exp.skills_used && (
                            <div className="athos-skills-wrap">
                              <span className="vol-drawer-heading">Skills & Technologies:</span>
                              <div className="vol-skills-cloud" style={{ marginTop: '0.4rem' }}>
                                {exp.skills_used.split(',').map((skill, sIdx) => (
                                  <span key={sIdx} className="vol-skill-badge">{skill.trim()}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {exp.external_link && (
                            <div className="athos-link-wrapper">
                              <a 
                                href={exp.external_link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="athos-ext-btn"
                              >
                                <span>Official Organization Link</span>
                                <ArrowUpRight size={13} />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </ScrollReveal>

          {/* =================================================================
              2. EDUCATION (CONTINUOUS TIMELINE + DYNAMIC CURSOR HOVER CARD)
             ================================================================= */}
          <ScrollReveal delay={0.05}>
            <section className="career-block education-block">
              <div className="block-header">
                <div className="block-header-left">
                  <h2 className="block-title">Education</h2>
                </div>
              </div>

              {/* Desktop Horizontal Timeline (Visible on wide screens) */}
              <div className="pt-timeline-stage pt-desktop-timeline">
                <div className="pt-grid-stage">

                  {/* ROW 1: TOP CONTENT ROW */}
                  <div 
                    className="pt-row pt-row-top"
                    style={{ gridTemplateColumns: `repeat(${education.length || 1}, minmax(220px, 1fr))` }}
                  >
                    {education.map((edu, idx) => {
                      const isTop = (idx % 2 === 0);
                      const isItemHovered = (hoveredEdu && String(hoveredEdu.id) === String(edu.id));
                      const duration = edu.end_year ? `${edu.start_year} – ${edu.end_year}` : `${edu.start_year} – Present`;

                      const fullDegreeTitle = edu.field_of_study 
                        ? (edu.degree_level.includes('in') ? edu.degree_level : `${edu.degree_level} in ${edu.field_of_study}`)
                        : edu.degree_level;

                      if (!isTop) {
                        return <div key={`top-${edu.id || idx}`} className="pt-cell pt-spacer" />;
                      }

                      return (
                        <div 
                          key={`top-${edu.id || idx}`}
                          className={`pt-cell pt-cell-top pt-has-card ${isItemHovered ? 'is-active-cell' : ''}`}
                          onMouseEnter={(e) => handleEduMouseEnter(e, edu)}
                          onMouseMove={handleEduMouseMove}
                          onMouseLeave={handleEduMouseLeave}
                        >
                          <div className="pt-text-card">
                            <h3 className="pt-title-heading">
                              <span className="pt-company-bold">{edu.institution}: </span>
                              <span className="pt-role-sub">{fullDegreeTitle}</span>
                            </h3>
                            <div className="pt-meta-row">
                              <Calendar size={13} className="pt-meta-icon" />
                              <span>{duration}</span>
                            </div>
                            {edu.grade && (
                              <div className="pt-meta-row pt-duration-row">
                                <Award size={13} className="pt-meta-icon" />
                                <span className="pt-duration-text">{edu.grade}</span>
                              </div>
                            )}
                          </div>
                          <div className="pt-stem pt-stem-down" />
                        </div>
                      );
                    })}
                  </div>

                  {/* ROW 2: CONTINUOUS AXIS LINE & SOLID NODES */}
                  <div className="pt-row-axis">
                    <div className="pt-unbroken-line" />
                    <div 
                      className="pt-dots-row"
                      style={{ gridTemplateColumns: `repeat(${education.length || 1}, minmax(220px, 1fr))` }}
                    >
                      {education.map((edu, idx) => {
                        const isItemHovered = (hoveredEdu && String(hoveredEdu.id) === String(edu.id));
                        const yearMarker = edu.end_year || edu.start_year || '';

                        return (
                          <div 
                            key={`dot-${edu.id || idx}`}
                            className="pt-dot-anchor"
                            onMouseEnter={(e) => handleEduMouseEnter(e, edu)}
                            onMouseMove={handleEduMouseMove}
                            onMouseLeave={handleEduMouseLeave}
                          >
                            <div className={`pt-solid-dot ${isItemHovered ? 'dot-active' : ''}`}>
                              <div className="pt-dot-inner" />
                            </div>
                            {yearMarker && (
                              <span className={`pt-year-tag ${isItemHovered ? 'year-active' : ''}`}>
                                {yearMarker}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ROW 3: BOTTOM CONTENT ROW */}
                  <div 
                    className="pt-row pt-row-bottom"
                    style={{ gridTemplateColumns: `repeat(${education.length || 1}, minmax(220px, 1fr))` }}
                  >
                    {education.map((edu, idx) => {
                      const isBottom = (idx % 2 === 1);
                      const isItemHovered = (hoveredEdu && String(hoveredEdu.id) === String(edu.id));
                      const duration = edu.end_year ? `${edu.start_year} – ${edu.end_year}` : `${edu.start_year} – Present`;

                      const fullDegreeTitle = edu.field_of_study 
                        ? (edu.degree_level.includes('in') ? edu.degree_level : `${edu.degree_level} in ${edu.field_of_study}`)
                        : edu.degree_level;

                      if (!isBottom) {
                        return <div key={`bottom-${edu.id || idx}`} className="pt-cell pt-spacer" />;
                      }

                      return (
                        <div 
                          key={`bottom-${edu.id || idx}`}
                          className={`pt-cell pt-cell-bottom pt-has-card ${isItemHovered ? 'is-active-cell' : ''}`}
                          onMouseEnter={(e) => handleEduMouseEnter(e, edu)}
                          onMouseMove={handleEduMouseMove}
                          onMouseLeave={handleEduMouseLeave}
                        >
                          <div className="pt-stem pt-stem-up" />
                          <div className="pt-text-card">
                            <h3 className="pt-title-heading">
                              <span className="pt-company-bold">{edu.institution}: </span>
                              <span className="pt-role-sub">{fullDegreeTitle}</span>
                            </h3>
                            <div className="pt-meta-row">
                              <Calendar size={13} className="pt-meta-icon" />
                              <span>{duration}</span>
                            </div>
                            {edu.grade && (
                              <div className="pt-meta-row pt-duration-row">
                                <Award size={13} className="pt-meta-icon" />
                                <span className="pt-duration-text">{edu.grade}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* Vertical Timeline Track (Responsive for mobile & smaller screens) */}
              <div className="pt-vertical-timeline-stage">
                <div className="pt-v-track-line" />
                <div className="pt-v-items-list">
                  {education.map((edu, idx) => {
                    const duration = edu.end_year ? `${edu.start_year} – ${edu.end_year}` : `${edu.start_year} – Present`;
                    const yearMarker = edu.end_year || edu.start_year || '';

                    const fullDegreeTitle = edu.field_of_study 
                      ? (edu.degree_level.includes('in') ? edu.degree_level : `${edu.degree_level} in ${edu.field_of_study}`)
                      : edu.degree_level;

                    return (
                      <div key={`v-edu-${edu.id || idx}`} className="pt-v-item">
                        <div className="pt-v-node-col">
                          <div className="pt-v-solid-dot">
                            <div className="pt-v-dot-inner" />
                          </div>
                          {yearMarker && (
                            <span className="pt-v-year-tag">{yearMarker}</span>
                          )}
                        </div>

                        <div className="pt-v-card">
                          <div className="pt-v-card-header">
                            <div className="pt-v-title-group">
                              <h3 className="pt-v-company">{edu.institution}</h3>
                              <h4 className="pt-v-role">{fullDegreeTitle}</h4>
                            </div>
                            {edu.grade && (
                              <span className="pt-v-type-badge">{edu.grade}</span>
                            )}
                          </div>

                          <div className="pt-v-meta-row">
                            <div className="pt-v-meta-item">
                              <Calendar size={13} className="pt-meta-icon" />
                              <span>{duration}</span>
                            </div>
                          </div>

                          {edu.activities && (
                            <div className="pt-v-bullets" style={{ whiteSpace: 'pre-line', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                              {edu.activities}
                            </div>
                          )}

                          {edu.external_link && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <a 
                                href={edu.external_link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="vol-link-action"
                              >
                                <span>Official Institution Website</span>
                                <ArrowUpRight size={13} />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Cursor Hover Card for Education */}
              {hoveredEdu && (
                <div 
                  className={`exp-cursor-popover ${cursorPos.isLeft ? 'pos-left' : 'pos-right'}`}
                  style={{
                    position: 'fixed',
                    left: `${cursorPos.x}px`,
                    top: `${cursorPos.y}px`,
                  }}
                >
                  <div className="popover-inner-card">
                    <div className="popover-header">
                      {/* Line 1: Institution Name */}
                      <h4 className="popover-company">{hoveredEdu.institution}</h4>

                      {/* Line 2: Degree */}
                      <h3 className="popover-role">
                        {hoveredEdu.field_of_study 
                          ? (hoveredEdu.degree_level.includes('in') ? hoveredEdu.degree_level : `${hoveredEdu.degree_level} in ${hoveredEdu.field_of_study}`)
                          : hoveredEdu.degree_level}
                      </h3>

                      {/* Line 3: Awards / Grade */}
                      {hoveredEdu.grade && (
                        <div className="popover-grade-line">
                          <Award size={13} className="popover-award-icon" />
                          <span className="popover-grade-text">{hoveredEdu.grade}</span>
                        </div>
                      )}
                    </div>

                    {/* Line 4: Dates */}
                    <div className="popover-meta">
                      <span className="popover-meta-item">
                        <Calendar size={12} />
                        {hoveredEdu.end_year ? `${hoveredEdu.start_year} – ${hoveredEdu.end_year}` : `${hoveredEdu.start_year} – Present`}
                      </span>
                    </div>

                    {hoveredEdu.activities && (
                      <div className="popover-activities" style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: '1.5', whiteSpace: 'pre-line', borderTop: '1px solid var(--border)', paddingTop: '0.65rem' }}>
                        {hoveredEdu.activities}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </ScrollReveal>

          {/* =================================================================
              3. VOLUNTEER & COMMUNITY (THIRD SECTION)
             ================================================================= */}
          <ScrollReveal delay={0.05}>
            <section className="career-block volunteer-block">
              <div className="block-header">
                <div className="block-header-left">
                  <h2 className="block-title">Volunteering & Community</h2>
                </div>
              </div>

              <div className="volunteer-cards-grid-v2">
                {volunteers.map((vol, index) => {
                  const dateRange = `${formatDate(vol.start_date)} – ${formatDate(vol.end_date)}`;
                  const calculatedDur = calculateExactDuration(vol.start_date, vol.end_date);
                  const displayDuration = vol.duration || calculatedDur || dateRange;
                  const bullets = parseBulletPoints(vol.responsibilities || vol.description);
                  const isHovered = (hoveredVolId === vol.id);

                  return (
                    <div 
                      key={vol.id || index}
                      className={`vol-card-v2 ${isHovered ? 'is-hovered' : ''}`}
                      onClick={() => setHoveredVolId(hoveredVolId === vol.id ? null : vol.id)}
                      onMouseEnter={() => setHoveredVolId(vol.id)}
                      onMouseLeave={() => setHoveredVolId(null)}
                    >
                      {/* Top Header with Large Logo & Prominent Titles */}
                      <div className="vol-card-top">
                        <div className="vol-logo-box">
                          <img 
                            src={vol.logo_url || 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Volunteers/ASF.png'} 
                            alt={vol.organization}
                            className="vol-logo-img"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                        <div className="vol-header-info">
                          <div className="vol-org-name">{vol.organization}</div>
                          <h3 className="vol-role-title">{vol.role}</h3>
                        </div>
                      </div>

                      {/* Meta Bar with Category & Duration Badges */}
                      <div className="vol-meta-bar">
                        {vol.category && <span className="vol-cat-pill">{vol.category}</span>}
                        <span className="vol-duration-pill">
                          <Clock size={12} />
                          {displayDuration}
                        </span>
                      </div>

                      {/* Main Summary / Description */}
                      {vol.description && (
                        <p className="vol-lead-desc">
                          {vol.description.split('\n')[0].replace(/^[\-*•>→]+\s*/, '')}
                        </p>
                      )}

                      {/* Downward Revealed Content Drawer */}
                      <div className="vol-drawer-body">
                        {bullets.length > 0 && (
                          <div className="vol-bullets-wrap">
                            <span className="vol-drawer-heading">Key Contributions:</span>
                            <ul className="vol-bullets-list">
                              {bullets.map((b, bIdx) => (
                                <li key={bIdx}>
                                  <span className="vol-dot"></span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {vol.skills_gained && (
                          <div className="vol-skills-wrap">
                            <span className="vol-drawer-heading">Impact & Skills:</span>
                            <div className="vol-skills-cloud">
                              {vol.skills_gained.split(',').map((skill, sIdx) => (
                                <span key={sIdx} className="vol-skill-badge">{skill.trim()}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {vol.external_link && (
                          <a 
                            href={vol.external_link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="vol-link-action"
                          >
                            <span>Official Initiative Portal</span>
                            <ArrowUpRight size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </ScrollReveal>

          {/* =================================================================
              4. LEADERSHIP & CO-CURRICULAR (FOURTH SECTION: AFTER VOLUNTEER)
             ================================================================= */}
          <ScrollReveal delay={0.05}>
            <section className="career-block leadership-block">
              <div className="block-header">
                <div className="block-header-left">
                  <h2 className="block-title">Leadership & Campus Governance</h2>
                </div>
              </div>

              {/* Leadership Static Grid (Uniform, No Expand, Concise Paragraph, Time Span) */}
              <div className="leadership-static-grid">
                {leadership.map((lead, index) => {
                  const dateRange = `${formatDate(lead.start_date)} – ${formatDate(lead.end_date)}`;

                  return (
                    <div 
                      key={lead.id || index}
                      className="leadership-static-card"
                    >
                      {/* Organization & Role Header */}
                      <div className="lead-card-header">
                        <div className="lead-org-name">{lead.organization}</div>
                        <h3 className="lead-role-title">{lead.role}</h3>
                      </div>

                      {/* Short Description Paragraph */}
                      {lead.description && (
                        <p className="lead-desc-text">
                          {lead.description}
                        </p>
                      )}

                      {/* Time Span: From when to when & Category */}
                      <div className="lead-timespan-bar">
                        <div className="lead-timespan-item">
                          <Calendar size={13} className="lead-calendar-icon" />
                          <span>{dateRange}</span>
                        </div>
                        {lead.category && (
                          <span className="vol-cat-pill">{lead.category}</span>
                        )}
                      </div>

                      {/* External Link */}
                      {lead.external_link && (
                        <div className="lead-footer-link">
                          <a 
                            href={lead.external_link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="vol-link-action"
                          >
                            <span>Organization Link</span>
                            <ArrowUpRight size={13} />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </ScrollReveal>

        </div>
      )}
    </div>
  );
};

export default CareerPage;
