import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, Tag, Calendar, Presentation, Layers } from 'lucide-react';
import DepthCarousel from '../shared/DepthCarousel';
import { loadCsv } from '../../src/utils/csvLoader';

const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length >= 11 
    ? `https://img.youtube.com/vi/${match[2].substring(0, 11)}/mqdefault.jpg`
    : null;
};

const isYouTubeUrl = (url) => {
  if (!url) return false;
  return /youtu\.be|youtube\.com/.test(url);
};

const FeaturedProjectsShowcase = () => {
  const [featuredList, setFeaturedList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await loadCsv('projects');
      
      const combined = (projectsData || [])
        .filter(p => p.is_featured === true || String(p.is_featured).toLowerCase() === 'true' || Number(p.featured_order) > 0)
        .sort((a, b) => (Number(a.featured_order) || 999) - (Number(b.featured_order) || 999))
        .map(project => {
          let imageSrc = project.thumbnail_url;
          if (isYouTubeUrl(project.thumbnail_url)) {
            imageSrc = getYouTubeThumbnail(project.thumbnail_url) || '/wall/fahmida_with_car.jpeg';
          }
          if (!imageSrc) {
            imageSrc = '/wall/fahmida_with_car.jpeg';
          }

          return {
            ...project,
            image: imageSrc,
            alt: project.title
          };
        });

      setFeaturedList(combined);
    } catch (error) {
      console.error('Error loading featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeProject = useMemo(() => {
    if (featuredList.length === 0) return null;
    return featuredList[activeIndex] || featuredList[0];
  }, [featuredList, activeIndex]);

  const parseKeywords = (kw) => {
    if (!kw) return [];
    return kw.split(',').map(k => k.trim()).filter(Boolean);
  };

  if (loading || featuredList.length === 0) {
    return null;
  }

  return (
    <section className="featured-showcase-section">
      <div className="showcase-container">
        
        {/* Section Header */}
        <div className="showcase-header">
          <div className="showcase-badge">
            <Sparkles size={13} />
            <span>Featured Innovation</span>
          </div>
          <h2 className="showcase-title">
            Key <span className="title-gradient">Technical Projects</span>
          </h2>
          <p className="showcase-subtitle">
            Interactive 3D showcase of highlighted engineering, AI, and software systems
          </p>
        </div>

        {/* 2-Column Showcase Layout */}
        <div className="showcase-grid">
          
          {/* Left Column: DepthCarousel */}
          <div className="showcase-carousel-col">
            <div className="carousel-stage-wrapper">
              <DepthCarousel
                items={featuredList}
                cardWidth={270}
                cardHeight={350}
                radius={16}
                depth={200}
                spread={85}
                tilt={20}
                tiltDirection="right"
                perspective={1300}
                visibleCards={4}
                falloff={0.22}
                blur={5}
                autoplay={true}
                autoplayDelay={3800}
                loop={true}
                onChange={(idx) => setActiveIndex(idx)}
              />
            </div>
          </div>

          {/* Right Column: Dynamic Project Description Card */}
          <div className="showcase-info-col">
            {activeProject && (
              <div className="showcase-desc-card" key={activeProject.id}>
                
                {/* Meta Bar */}
                <div className="desc-meta-bar">
                  <span className="desc-number-pill">
                    <Layers size={13} />
                    <span>Project {String(activeIndex + 1).padStart(2, '0')} / {String(featuredList.length).padStart(2, '0')}</span>
                  </span>
                  {activeProject.year && (
                    <span className="desc-year-pill">
                      <Calendar size={13} />
                      <span>{activeProject.year}</span>
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="desc-title">{activeProject.title}</h3>

                {/* Description */}
                <p className="desc-summary">
                  {activeProject.description}
                </p>

                {/* Keywords Cloud */}
                {parseKeywords(activeProject.keywords).length > 0 && (
                  <div className="desc-keywords-wrap">
                    <div className="keywords-label">
                      <Tag size={13} />
                      <span>Technologies & Domains:</span>
                    </div>
                    <div className="desc-keywords-cloud">
                      {parseKeywords(activeProject.keywords).map((kw, kIdx) => (
                        <span key={kIdx} className="desc-kw-pill">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Presented In Badge */}
                {activeProject.presented_in && (
                  <div className="desc-presented-row">
                    <Presentation size={14} className="presented-icon" />
                    <span>Presented in: <strong>{activeProject.presented_in}</strong></span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="desc-actions-row">
                  <Link to="/projects" className="btn-showcase-primary">
                    <span>Explore in Projects</span>
                    <ArrowUpRight size={15} />
                  </Link>
                  <Link to="/research" className="btn-showcase-secondary">
                    <span>View Research</span>
                  </Link>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default FeaturedProjectsShowcase;
