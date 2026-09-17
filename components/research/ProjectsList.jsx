import React, { useState, useEffect } from 'react';
import { loadCsv } from '../../src/utils/csvLoader';
import ProjectCard from './ProjectCard';

const ProjectsList = ({ selectedTopic, selectedStatus }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [selectedTopic, selectedStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const allProjects = await loadCsv('research');

      let filteredProjects = [...allProjects];

      // Filter by status
      if (selectedStatus && selectedStatus !== 'all') {
        filteredProjects = filteredProjects.filter(
          p => (p.status || '').toLowerCase() === selectedStatus.toLowerCase()
        );
      }

      // If a topic is selected, filter by topic
      if (selectedTopic) {
        const slugQuery = selectedTopic.toLowerCase().replace(/[^a-z0-9]/g, '');
        filteredProjects = filteredProjects.filter(project => {
          if (!project.topics) return false;
          const projectTopics = project.topics.split(/[,;]+/).map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''));
          return projectTopics.some(t => t.includes(slugQuery) || slugQuery.includes(t));
        });
      }

      // Order by year descending
      filteredProjects.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));

      setProjects(filteredProjects);
    } catch (error) {
      console.error('Error fetching research projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="projects-list">
        <div className="projects-loading">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="project-skeleton">
              <div className="skeleton-thumbnail"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-links"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="projects-list">
        <div className="no-projects">
          <span className="no-projects-icon"></span>
          <h3>No projects found</h3>
          <p>Try selecting a different topic or status filter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-list">
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
