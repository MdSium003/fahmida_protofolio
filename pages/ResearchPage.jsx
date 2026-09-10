import React, { useState, useEffect } from 'react';
import { loadResearchData } from '../src/utils/csvLoader';
import ResearchHero from '../components/research/ResearchHero';
import ResearchStats from '../components/research/ResearchStats';
import ResearchFilterDisclosure from '../components/research/ResearchFilterDisclosure';
import LunitResearchGrid from '../components/research/LunitResearchGrid';
import ResearchThreads from '../components/research/ResearchThreads';
import ScrollReveal from '../components/shared/ScrollReveal';
import '../styles/ResearchPage.css';

const ResearchPage = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const data = await loadResearchData();
        setPapers(data || []);
      } catch (err) {
        console.error('Error loading research papers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  return (
    <div className="research-page-wrapper">
      {/* 1. Large Centered Editorial Hero */}
      <ResearchHero />

      {/* 2. Research Statistics Strip */}
      {!loading && (
        <ScrollReveal>
          <ResearchStats papers={papers} />
        </ScrollReveal>
      )}

      {/* 3. Main Research Content */}
      <main className="research-main-content">
        {/* Editorial Filter Trigger */}
        <section className="lunit-filter-disclosure-section">
          <ResearchFilterDisclosure 
            selectedTopics={selectedTopics}
            onTopicsChange={setSelectedTopics}
            selectedStatuses={selectedStatuses}
            onStatusesChange={setSelectedStatuses}
          />
        </section>

        {/* Bento Research Grid */}
        <section className="lunit-grid-section">
          <LunitResearchGrid 
            papers={papers}
            loading={loading}
            selectedTopics={selectedTopics}
            selectedStatuses={selectedStatuses}
          />
        </section>

        {/* 5. Bottom Research Pipeline & Threads Banner */}
        <ScrollReveal>
          <ResearchThreads />
        </ScrollReveal>
      </main>
    </div>
  );
};

export default ResearchPage;
