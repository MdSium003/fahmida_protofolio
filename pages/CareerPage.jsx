import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, MapPin, ExternalLink, Award, CheckCircle2, 
  ArrowUpRight, Plus
} from 'lucide-react';
import { loadExperienceData, loadEducationData, loadVolunteerData } from '../src/utils/csvLoader';
import profileImage from '../images/fahmida.png';
import '../styles/CareerPage.css';

const CareerPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredEduId, setHoveredEduId] = useState(null);
  const [hoveredExpId, setHoveredExpId] = useState(null);
  const [hoveredVolId, setHoveredVolId] = useState(null);

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      setLoading(true);
      const [expData, eduData, volData] = await Promise.all([
        loadExperienceData(),
        loadEducationData(),
        loadVolunteerData()
      ]);

      setExperiences(expData || []);
      setEducation(eduData || []);
      setVolunteers(volData || []);
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

  const parseBulletPoints = (text) => {
    if (!text) return [];
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[\-*•>→]+\s*/, '').trim())
      .filter(line => line.length > 0 && !line.startsWith('vyfyifyi'));
  };

  const [hoveredExp, setHoveredExp] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, isLeft: false });

  const handleExpMouseEnter = (e, exp) => {
    setHoveredExp(exp);
    updateCursorPos(e);
  };

  const handleExpMouseMove = (e) => {
    updateCursorPos(e);
  };

  const handleExpMouseLeave = () => {
    setHoveredExp(null);
  };

  const updateCursorPos = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const cardWidth = 370;
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
      <header className="career-hero-split">
        <div className="career-hero-left">
          <h1 className="career-hero-quote">
            <span className="quote-lead">She Never</span>
            <span className="quote-highlight"> Stops.</span>
          </h1>

          <p className="career-hero-speech">
            From founding AI-driven healthcare platforms and conducting biomedical NLP research to graduating at the top tier of competitive academic institutions — every chapter is driven by a deep passion for strategic innovation, continuous intellectual growth, and impactful community leadership.
          </p>

          <div className="career-hero-tags">
            <span className="hero-tag-item">Startup Founder & CEO</span>
            <span className="hero-tag-dot">•</span>
            <span className="hero-tag-item">BUET CSE Scholar</span>
            <span className="hero-tag-dot">•</span>
            <span className="hero-tag-item">Social Impact Leader</span>
            <span className="hero-tag-dot">•</span>
            <span className="hero-tag-item">Strategic Finance & ACCA</span>
          </div>
        </div>

        <div className="career-hero-right">
          <div className="career-portrait-wrapper">
            <div className="portrait-ambient-glow" />
            <div className="portrait-frame">
              <img 
                src={profileImage} 
                alt="Mst. Fahmida Sultana Naznin" 
                className="career-portrait-img" 
              />
              <div className="portrait-glass-overlay" />
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="career-loading-state">
          <div className="career-spinner"></div>
          <p>Loading career milestones...</p>
        </div>
      ) : (
        <div className="career-sections-stack">

          {/* =================================================================
              1. EDUCATION (ON TOP — ATHOS ROW DESIGN + DOWNWARD REVEAL ONLY)
             ================================================================= */}
          <section className="career-block education-block">
            <div className="block-header">
              <div className="block-header-left">
                <h2 className="block-title">Education</h2>
              </div>
            </div>

            {/* Athos-Dark Minimalist Row List (Locked 100% Width) */}
            <div className="athos-list-container">
              {education.map((edu, index) => {
                const duration = edu.end_year ? `${edu.start_year} – ${edu.end_year}` : `${edu.start_year} – Present`;
                const isHovered = (hoveredEduId === edu.id);

                return (
                    <div 
                      key={edu.id || index}
                      className={`athos-row-card ${isHovered ? 'is-hovered' : ''}`}
                      onClick={() => setHoveredEduId(hoveredEduId === edu.id ? null : edu.id)}
                      onMouseEnter={() => setHoveredEduId(edu.id)}
                      onMouseLeave={() => setHoveredEduId(null)}
                    >
                    {/* Primary Visible Bar */}
                    <div className="athos-primary-row">
                      {/* Left: Role / Degree / Field */}
                      <div className="athos-left-col">
                        <div className="athos-degree-title">
                          {edu.field_of_study ? `${edu.degree_level} in ${edu.field_of_study}` : edu.degree_level}
                        </div>
                        <div className="athos-sub-degree">{edu.institution}</div>
                      </div>

                      {/* Right: Institution & Duration */}
                      <div className="athos-right-col">
                        <div className="athos-institution-name">{edu.institution.split(',')[0]}</div>
                        <div className="athos-date-text">{duration}</div>
                      </div>
                    </div>

                    {/* Downward Revealed Drawer */}
                    <div className="athos-reveal-drawer">
                      <div className="athos-drawer-inner">
                        {edu.grade && (
                          <div className="athos-grade-badge">
                            <Award size={14} />
                            <span>Academic Standing: <strong>{edu.grade}</strong></span>
                          </div>
                        )}

                        {edu.activities && (
                          <div className="athos-activities-content">
                            <p className="athos-activities-text">{edu.activities}</p>
                          </div>
                        )}

                        {edu.external_link && (
                          <div className="athos-link-wrapper">
                            <a 
                              href={edu.external_link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="athos-ext-btn"
                            >
                              <span>Official Institution Website</span>
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

          {/* =================================================================
              2. EXPERIENCE (CONTINUOUS TIMELINE + DYNAMIC CURSOR HOVER CARD)
             ================================================================= */}
          <section className="career-block experience-block">
            <div className="block-header">
              <div className="block-header-left">
                <h2 className="block-title">Experience</h2>
              </div>
            </div>

            {/* Desktop Horizontal Timeline (Visible on wide screens) */}
            <div className="pt-timeline-stage pt-desktop-timeline">
              <div className="pt-grid-stage">

                {/* ROW 1: TOP CONTENT ROW */}
                <div className="pt-row pt-row-top">
                  {experiences.map((exp, idx) => {
                    const isTop = (idx % 2 === 0);
                    const isItemHovered = (hoveredExp && String(hoveredExp.id) === String(exp.id));
                    const dateRange = `${formatDate(exp.start_date)} – ${formatDate(exp.end_date)}`;

                    if (!isTop) {
                      return <div key={`top-${exp.id || idx}`} className="pt-cell pt-spacer" />;
                    }

                    return (
                      <div 
                        key={`top-${exp.id || idx}`}
                        className={`pt-cell pt-cell-top pt-has-card ${isItemHovered ? 'is-active-cell' : ''}`}
                        onMouseEnter={(e) => handleExpMouseEnter(e, exp)}
                        onMouseMove={handleExpMouseMove}
                        onMouseLeave={handleExpMouseLeave}
                      >
                        <div className="pt-text-card">
                          <h3 className="pt-title-heading">
                            <span className="pt-company-bold">{exp.company}: </span>
                            <span className="pt-role-sub">{exp.job_title}</span>
                          </h3>
                          <div className="pt-meta-row">
                            <Calendar size={13} className="pt-meta-icon" />
                            <span>{dateRange}</span>
                          </div>
                          {exp.location && (
                            <div className="pt-meta-row">
                              <MapPin size={13} className="pt-meta-icon" />
                              <span>Location: {exp.location} {exp.employment_type ? `· ${exp.employment_type}` : ''}</span>
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
                  <div className="pt-dots-row">
                    {experiences.map((exp, idx) => {
                      const isItemHovered = (hoveredExp && String(hoveredExp.id) === String(exp.id));
                      const yearMarker = exp.start_date ? new Date(exp.start_date).getFullYear() : '';

                      return (
                        <div 
                          key={`dot-${exp.id || idx}`}
                          className="pt-dot-anchor"
                          onMouseEnter={(e) => handleExpMouseEnter(e, exp)}
                          onMouseMove={handleExpMouseMove}
                          onMouseLeave={handleExpMouseLeave}
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
                <div className="pt-row pt-row-bottom">
                  {experiences.map((exp, idx) => {
                    const isBottom = (idx % 2 === 1);
                    const isItemHovered = (hoveredExp && String(hoveredExp.id) === String(exp.id));
                    const dateRange = `${formatDate(exp.start_date)} – ${formatDate(exp.end_date)}`;

                    if (!isBottom) {
                      return <div key={`bottom-${exp.id || idx}`} className="pt-cell pt-spacer" />;
                    }

                    return (
                      <div 
                        key={`bottom-${exp.id || idx}`}
                        className={`pt-cell pt-cell-bottom pt-has-card ${isItemHovered ? 'is-active-cell' : ''}`}
                        onMouseEnter={(e) => handleExpMouseEnter(e, exp)}
                        onMouseMove={handleExpMouseMove}
                        onMouseLeave={handleExpMouseLeave}
                      >
                        <div className="pt-stem pt-stem-up" />
                        <div className="pt-text-card">
                          <h3 className="pt-title-heading">
                            <span className="pt-company-bold">{exp.company}: </span>
                            <span className="pt-role-sub">{exp.job_title}</span>
                          </h3>
                          <div className="pt-meta-row">
                            <Calendar size={13} className="pt-meta-icon" />
                            <span>{dateRange}</span>
                          </div>
                          {exp.location && (
                            <div className="pt-meta-row">
                              <MapPin size={13} className="pt-meta-icon" />
                              <span>Location: {exp.location} {exp.employment_type ? `· ${exp.employment_type}` : ''}</span>
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
                {experiences.map((exp, idx) => {
                  const dateRange = `${formatDate(exp.start_date)} – ${formatDate(exp.end_date)}`;
                  const yearMarker = exp.start_date ? new Date(exp.start_date).getFullYear() : '';
                  const bullets = parseBulletPoints(exp.description);

                  return (
                    <div key={`v-exp-${exp.id || idx}`} className="pt-v-item">
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
                            <h3 className="pt-v-company">{exp.company}</h3>
                            <h4 className="pt-v-role">{exp.job_title}</h4>
                          </div>
                          {exp.employment_type && (
                            <span className="pt-v-type-badge">{exp.employment_type}</span>
                          )}
                        </div>

                        <div className="pt-v-meta-row">
                          <div className="pt-v-meta-item">
                            <Calendar size={13} className="pt-meta-icon" />
                            <span>{dateRange}</span>
                          </div>
                          {exp.location && (
                            <div className="pt-v-meta-item">
                              <MapPin size={13} className="pt-meta-icon" />
                              <span>{exp.location}</span>
                            </div>
                          )}
                        </div>

                        {bullets.length > 0 && (
                          <ul className="pt-v-bullets">
                            {bullets.map((bullet, bIdx) => (
                              <li key={bIdx}>
                                <span className="pt-v-bullet-arrow">▸</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {exp.skills_used && (
                          <div className="pt-v-skills">
                            {exp.skills_used.split(',').map((skill, sIdx) => (
                              <span key={sIdx} className="pt-v-skill-pill">{skill.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Cursor Hover Card (Positioned next to cursor left/right based on available space) */}
            {hoveredExp && (
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
                    <div>
                      <h4 className="popover-company">{hoveredExp.company}</h4>
                      <h3 className="popover-role">{hoveredExp.job_title}</h3>
                    </div>
                    {hoveredExp.employment_type && (
                      <span className="popover-type-badge">{hoveredExp.employment_type}</span>
                    )}
                  </div>

                  <div className="popover-meta">
                    <span className="popover-meta-item">
                      <Calendar size={12} />
                      {formatDate(hoveredExp.start_date)} – {formatDate(hoveredExp.end_date)}
                    </span>
                    {hoveredExp.location && (
                      <span className="popover-meta-item">
                        <MapPin size={12} />
                        {hoveredExp.location}
                      </span>
                    )}
                  </div>

                  {parseBulletPoints(hoveredExp.description).length > 0 && (
                    <ul className="popover-bullets">
                      {parseBulletPoints(hoveredExp.description).map((bullet, bIdx) => (
                        <li key={bIdx}>
                          <span className="popover-bullet-arrow">▸</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {hoveredExp.skills_used && (
                    <div className="popover-skills">
                      {hoveredExp.skills_used.split(',').map((skill, sIdx) => (
                        <span key={sIdx} className="popover-skill-pill">{skill.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* =================================================================
              3. VOLUNTEER & COMMUNITY (PREMIUM UPGRADED CARDS)
             ================================================================= */}
          <section className="career-block volunteer-block">
            <div className="block-header">
              <div className="block-header-left">
                <h2 className="block-title">Volunteer & Community Leadership</h2>
              </div>
            </div>

            <div className="volunteer-cards-grid-v2">
              {volunteers.map((vol, index) => {
                const dateRange = `${formatDate(vol.start_date)} – ${formatDate(vol.end_date)}`;
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
                        <Calendar size={12} />
                        {vol.duration || dateRange}
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
                                <span className="vol-dot">▸</span>
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

        </div>
      )}
    </div>
  );
};

export default CareerPage;
