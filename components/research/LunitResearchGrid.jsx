import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, BookCheck, FlaskConical } from 'lucide-react';
import { loadResearchData } from '../../src/utils/csvLoader';
import { matchesResearchCategory } from './ResearchFilters';
import PublicationCard from './PublicationCard';
import PublicationModal from './PublicationModal';
import OngoingWorks from './OngoingWorks';

const LunitResearchGrid = ({ 
  papers = null, 
  loading = false, 
  selectedCategory = 'all',
  searchQuery = '',
  selectedTopics = [], 
  selectedStatuses = [] 
}) => {
  const [searchParams] = useSearchParams();
  const targetPaperId = searchParams.get('id') || searchParams.get('paper') || searchParams.get('pub');
  const [internalPapers, setInternalPapers] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [activeModalPaper, setActiveModalPaper] = useState(null);

  useEffect(() => {
    if (!papers) {
      const fetchPapers = async () => {
        try {
          setInternalLoading(true);
          const data = await loadResearchData();
          setInternalPapers(data || []);
        } catch (err) {
          console.error('Error loading research publications:', err);
          setInternalPapers([]);
        } finally {
          setInternalLoading(false);
        }
      };
      fetchPapers();
    }
  }, [papers]);

  const publications = papers !== null ? papers : internalPapers;
  const isLoading = papers !== null ? loading : internalLoading;

  // Sync with URL query parameter for direct link to specific paper
  useEffect(() => {
    if (targetPaperId && publications.length > 0) {
      const found = publications.find(p => String(p.id) === String(targetPaperId));
      if (found) {
        setActiveModalPaper(found);
      }
    }
  }, [targetPaperId, publications]);

  // Unified Filter Logic
  const filteredPublications = useMemo(() => {
    let list = [...publications];

    // 1. Category Filter
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(p => matchesResearchCategory(p, selectedCategory));
    }

    // 2. Search Query Filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        (p.title || '').toLowerCase().includes(q) || 
        (p.venue || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.abstract || '').toLowerCase().includes(q) ||
        (p.topics || '').toLowerCase().includes(q) ||
        (p.authorsList || []).some(a => a.name.toLowerCase().includes(q))
      );
    }

    // 3. Status Filters (if provided)
    if (selectedStatuses.length > 0) {
      list = list.filter(p => {
        const pStatus = (p.status || '').toLowerCase();
        return selectedStatuses.some(s => s.toLowerCase() === pStatus);
      });
    }

    // 4. Topic Filters (if provided)
    if (selectedTopics.length > 0) {
      list = list.filter(p => {
        const pTopics = (p.topics || '').toLowerCase();
        return selectedTopics.some(t => pTopics.includes(t.toLowerCase()));
      });
    }

    return list;
  }, [publications, selectedCategory, searchQuery, selectedTopics, selectedStatuses]);

  // Section 1: Published Works
  const publishedPublications = useMemo(() => {
    return filteredPublications.filter(p => (p.status || '').toLowerCase() === 'published');
  }, [filteredPublications]);

  // Section 2: Preprints & Ongoing Research
  const ongoingAndPreprints = useMemo(() => {
    return filteredPublications.filter(p => (p.status || '').toLowerCase() !== 'published');
  }, [filteredPublications]);

  if (isLoading) {
    return (
      <div className="lunit-loading-container">
        <div className="lunit-spinner" />
        <p>Loading scientific publications & research manuscripts...</p>
      </div>
    );
  }

  if (filteredPublications.length === 0) {
    return (
      <div className="lunit-empty-state">
        <BookOpen size={44} className="empty-icon" />
        <h3>No research publications found</h3>
        <p>Try adjusting your category filter or keyword search query.</p>
      </div>
    );
  }

  return (
    <div className="research-publications-layout">
      {/* 1. Section 1: Published Works */}
      {publishedPublications.length > 0 && (
        <section className="research-status-group published-group" aria-labelledby="heading-published-works">
          <div className="research-group-header">
            {/* <div className="research-group-badge published-badge">
              <BookCheck size={14} />
              <span>Peer-Reviewed & Archival</span>
            </div> */}
            <h2 id="heading-published-works" className="research-group-title">
              Published <span className="text-highlight">Works</span>
            </h2>
            <p className="research-group-subtitle">
              Peer-reviewed conference proceedings, journal articles, and archival publications ({publishedPublications.length})
            </p>
          </div>

          <div className="publication-cards-grid">
            {publishedPublications.map((pub) => (
              <PublicationCard 
                key={pub.id} 
                publication={pub} 
                onSelect={(p) => setActiveModalPaper(p)} 
              />
            ))}
          </div>
        </section>
      )}

      {/* 2. Section 2: Preprints & Under Review */}
      {ongoingAndPreprints.length > 0 && (
        <section className="research-status-group ongoing-group" aria-labelledby="heading-ongoing-preprints">
          <div className="research-group-header">
            <h2 id="heading-ongoing-preprints" className="research-group-title">
              Preprints & <span className="text-highlight">Under Review</span>
            </h2>
            <p className="research-group-subtitle">
              Active laboratory models, clinical validation studies, and preprints under peer review ({ongoingAndPreprints.length})
            </p>
          </div>

          <div className="publication-cards-grid">
            {ongoingAndPreprints.map((pub) => (
              <PublicationCard 
                key={pub.id} 
                publication={pub} 
                onSelect={(p) => setActiveModalPaper(p)} 
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Section 3: Ongoing Works & Active Research Tracks */}
      <OngoingWorks 
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />

      {/* Accessible Detail Modal */}
      {activeModalPaper && (
        <PublicationModal 
          publication={activeModalPaper}
          onClose={() => setActiveModalPaper(null)}
        />
      )}
    </div>
  );
};

export default React.memo(LunitResearchGrid);
