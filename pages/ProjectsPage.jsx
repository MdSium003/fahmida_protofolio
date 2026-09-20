import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Award, ArrowRight } from 'lucide-react';
import { loadProjectsData } from '../src/utils/csvLoader';
import ProjectsHero from '../components/projects/ProjectsHero';
import ProjectFilters from '../components/projects/ProjectFilters';
import FeaturedProjectHero from '../components/projects/FeaturedProjectHero';
import ProjectBentoGrid from '../components/projects/ProjectBentoGrid';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectDetailModal from '../components/projects/ProjectDetailModal';
import ScrollReveal from '../components/shared/ScrollReveal';
import StaggerReveal from '../components/shared/StaggerReveal';
import '../styles/ProjectsPage.css';
import LoadingState from '../components/shared/LoadingState';
import { usePageMeta } from '../src/hooks/usePageMeta';

const ProjectsPage = () => {
  usePageMeta({
    title: 'Projects',
    description:
      "Engineered systems and applications across AI, computer vision, robotics and interactive technologies.",
    path: '/projects',
  });

  const [searchParams] = useSearchParams();
  const targetProjectId = searchParams.get('id') || searchParams.get('project');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProject, setActiveModalProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (targetProjectId && projects.length > 0) {
      const found = projects.find(p => String(p.id) === String(targetProjectId));
      if (found) {
        setActiveModalProject(found);
      }
    }
  }, [targetProjectId, projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await loadProjectsData();
      setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculated domain counts
  const categoryCounts = useMemo(() => {
    const counts = { all: projects.length, vision: 0, ai: 0, robotics: 0, web: 0 };
    projects.forEach((p) => {
      if (counts[p.categoryId] !== undefined) {
        counts[p.categoryId]++;
      }
    });
    return counts;
  }, [projects]);

  // Unique domains count
  const domainCount = useMemo(() => {
    const unique = new Set(projects.map(p => p.categoryId));
    return unique.size || 4;
  }, [projects]);

  // Filtered List
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        (p.title || '').toLowerCase().includes(q) || 
        (p.description || '').toLowerCase().includes(q) ||
        (p.keywords || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [projects, selectedCategory, searchQuery]);

  // Top Featured Flagship
  const featuredFlagship = useMemo(() => {
    return projects.find(p => p.isFeatured) || projects[0] || null;
  }, [projects]);

  // Selected Bento Highlights (Top featured projects excluding the main flagship)
  const bentoProjects = useMemo(() => {
    return projects.filter(p => p.isFeatured && String(p.id) !== String(featuredFlagship?.id)).slice(0, 3);
  }, [projects, featuredFlagship]);

  return (
    <div className="projects-page-container">
      {/* 1. Clear, Impactful Hero Section */}
      <ProjectsHero 
        totalProjects={projects.length}
        domainCount={domainCount}
        featuredCount={projects.filter(p => p.isFeatured).length}
      />

      {/* 2. Interactive Discovery Filters & Search */}
      <ProjectFilters 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryCounts={categoryCounts}
      />

      {loading ? (
        <LoadingState variant="grid" count={6} label="Loading engineered systems" />
      ) : (
        <div className="projects-sections-container">
          {/* 3. Hero Project Showcase (Only when viewing All and no search) */}
          {selectedCategory === 'all' && !searchQuery && featuredFlagship && (
            <ScrollReveal threshold={0} margin="0px 0px -20px 0px">
              <FeaturedProjectHero 
                project={featuredFlagship}
                onOpenProject={(p) => setActiveModalProject(p)}
              />
            </ScrollReveal>
          )}

          {/* 4. Highlight Systems Bento Grid (Only when viewing All and no search) */}
          {selectedCategory === 'all' && !searchQuery && bentoProjects.length > 0 && (
            <ScrollReveal threshold={0} margin="0px 0px -20px 0px">
              <ProjectBentoGrid 
                projects={bentoProjects}
                onOpenProject={(p) => setActiveModalProject(p)}
              />
            </ScrollReveal>
          )}

          {/* 5. Complete Curated Project Collection */}
          <section className="curated-collection-section" aria-label="Engineered Project Collection">
            <ScrollReveal threshold={0} margin="0px 0px -20px 0px">
              <div className="section-header-compact">
                <h2 className="section-title">
                  {selectedCategory === 'all' && !searchQuery ? 'All Engineering Projects' : `Filtered Projects (${filteredProjects.length})`}
                </h2>
              </div>
            </ScrollReveal>

            {filteredProjects.length > 0 ? (
              <StaggerReveal className="curated-projects-grid" staggerDelay={0.04} threshold={0} margin="0px 0px -20px 0px">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    project={project}
                    onOpenProject={(p) => setActiveModalProject(p)}
                  />
                ))}
              </StaggerReveal>
            ) : (
              <div className="projects-empty-state">
                <p>No projects match your filter criteria.</p>
              </div>
            )}
          </section>

          {/* 6. Cross-Connection Bottom Banner */}
          <ScrollReveal threshold={0} margin="0px 0px -20px 0px">
            <section className="projects-bottom-explore-banner" aria-label="Cross-portfolio exploration">
              <div className="bottom-banner-content">
                <h3 className="bottom-banner-title">
                  Explore the research behind these systems
                </h3>
                <p className="bottom-banner-desc">
                  Dive into peer-reviewed research publications, dataset benchmarks, and academic honors.
                </p>
                <div className="bottom-banner-actions">
                  <Link to="/research" className="bottom-banner-btn primary">
                    <BookOpen size={15} />
                    <span>View Research Papers</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link to="/awards" className="bottom-banner-btn secondary">
                    <Award size={15} />
                    <span>Awards & Recognition</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </section>
          </ScrollReveal>
        </div>
      )}

      {/* Case Study Detail Modal */}
      {activeModalProject && (
        <ProjectDetailModal 
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
