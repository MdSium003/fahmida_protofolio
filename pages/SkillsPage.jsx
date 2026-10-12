import React, { useState, useEffect } from 'react';
import SkillsHero from '../components/skills/SkillsHero';
import TechnologyStack from '../components/skills/TechnologyStack';
import ProfessionalTraining from '../components/skills/ProfessionalTraining';
import SkillsCTA from '../components/skills/SkillsCTA';
import ScrollReveal from '../components/shared/ScrollReveal';
import { loadSkillsData, loadProfessionalTrainingData } from '../src/utils/csvLoader';
import '../styles/SkillsPage.css';
import LoadingState from '../components/shared/LoadingState';
import { usePageMeta } from '../src/hooks/usePageMeta';

const SkillsPage = () => {
  usePageMeta({
    title: 'Skills & Expertise',
    description:
      "Programming languages, web and database technologies, data science and machine learning, specialized areas, soft skills, languages, and professional training.",
    path: '/skills',
  });

  const [skills, setSkills] = useState([]);
  const [training, setTraining] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [skillsData, trainingData] = await Promise.all([
          loadSkillsData(),
          loadProfessionalTrainingData()
        ]);
        setSkills(skillsData || []);
        setTraining(trainingData || []);
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
        <LoadingState variant="grid" count={6} label="Loading technical stack" />
      ) : (
        <>
          {/* Technical skills */}
          <ScrollReveal delay={0.05}>
            <TechnologyStack skills={skills} />
          </ScrollReveal>

          {/* Professional development */}
          <ScrollReveal delay={0.05}>
            <ProfessionalTraining training={training} />
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
