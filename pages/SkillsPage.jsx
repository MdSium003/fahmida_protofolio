import React, { useState, useEffect } from 'react';
import SkillsHero from '../components/skills/SkillsHero';
import CoreExpertise from '../components/skills/CoreExpertise';
import TechnologyStack from '../components/skills/TechnologyStack';
import SkillsInPractice from '../components/skills/SkillsInPractice';
import SkillsCTA from '../components/skills/SkillsCTA';
import ScrollReveal from '../components/shared/ScrollReveal';
import { loadSkillsData, loadProjectsData, loadResearchData } from '../src/utils/csvLoader';
import '../styles/SkillsPage.css';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [skillsData, projData, resData] = await Promise.all([
          loadSkillsData(),
          loadProjectsData(),
          loadResearchData()
        ]);
        setSkills(skillsData || []);
        setProjects(projData || []);
        setResearch(resData || []);
      } catch (err) {
        console.error('Error loading skills page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="skills-page-container">
      {/* Centered Hero Section */}
      <SkillsHero />

      {loading ? (
        <div className="skills-loading-container">
          <div className="skills-loader" />
          <p>Loading technical stack...</p>
        </div>
      ) : (
        <>
          {/* 01 — Core Expertise & Architecture (Merged Iconic Domain & Tech Tree) */}
          <ScrollReveal>
            <CoreExpertise skills={skills} />
          </ScrollReveal>

          {/* 02 — Technology Stack (Typographic clusters) */}
          <ScrollReveal delay={0.05}>
            <TechnologyStack skills={skills} />
          </ScrollReveal>

          {/* 03 — Skills In Practice (Image-First Proof of Work) */}
          <ScrollReveal delay={0.05}>
            <SkillsInPractice projects={projects} research={research} />
          </ScrollReveal>

          {/* Closing Strip */}
          <ScrollReveal delay={0.05}>
            <SkillsCTA />
          </ScrollReveal>
        </>
      )}
    </div>
  );
};

export default SkillsPage;
