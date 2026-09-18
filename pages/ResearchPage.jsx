import React, { useState, useEffect, useMemo } from 'react';
import { loadResearchData } from '../src/utils/csvLoader';
import ResearchHero from '../components/research/ResearchHero';
import ResearchStats from '../components/research/ResearchStats';
import ResearchFilters, { RESEARCH_CATEGORIES, matchesResearchCategory } from '../components/research/ResearchFilters';
import LunitResearchGrid from '../components/research/LunitResearchGrid';
import ResearchThreads from '../components/research/ResearchThreads';
import ScrollReveal from '../components/shared/ScrollReveal';
import '../styles/ResearchPage.css';

const ResearchPage = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Calculated domain counts for Research categories
  const categoryCounts = useMemo(() => {
    const counts = { all: papers.length };
    RESEARCH_CATEGORIES.forEach((cat) => {
      if (cat.id === 'all') {
        counts.all = papers.length;
      } else {
        counts[cat.id] = papers.filter(p => matchesResearchCategory(p, cat.id)).length;
      }
    });
    return counts;
  }, [papers]);

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
        {/* Interactive Discovery Filters & Search (Identical to Projects Page) */}
        <section className="research-filters-section">
          <ResearchFilters 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryCounts={categoryCounts}
          />
        </section>

        {/* Bento Research Grid */}
        <section className="lunit-grid-section">
          <LunitResearchGrid 
            papers={papers}
            loading={loading}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
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

