import { useState, useEffect } from 'react';
import { loadCsv } from '../../src/utils/csvLoader';

const AwardTopicFilter = ({ onTopicSelect, selectedTopic }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch topics from CSV
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await loadCsv('awards');
        const topicMap = new Map();
        (data || []).forEach(a => {
          const name = (a.topic || '').trim();
          if (name) {
            const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            if (!topicMap.has(slug)) {
              topicMap.set(slug, { id: slug, name, slug });
            }
          }
        });
        setTopics(Array.from(topicMap.values()));
      } catch (error) {
        console.error('Error fetching award topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleTopicClick = (topicSlug) => {
    // Toggle off if same topic is clicked
    if (selectedTopic === topicSlug) {
      onTopicSelect(null);
    } else {
      onTopicSelect(topicSlug);
    }
  };

  if (loading) {
    return (
      <div className="award-topics-filter">
        <h2 className="topics-section-title">Award Categories</h2>
        <p className="topics-subtitle">(click on a category to filter awards)</p>
        <div className="topics-grid-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="topic-skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="award-topics-filter">
      <h2 className="topics-section-title">Award Categories</h2>
      <p className="topics-subtitle">(click on a category to filter awards)</p>

      <div className="topics-tags">
        {topics.map((topic, index) => (
          <button
            key={topic.id}
            className={`topic-tag ${selectedTopic === topic.slug ? 'active' : ''}`}
            onClick={() => handleTopicClick(topic.slug)}
            title={topic.name}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <span className="topic-hash">#</span> {topic.name}
          </button>
        ))}
      </div>

      {/* Decorative dots */}
      <div className="topics-decoration">
        {[...Array(15)].map((_, i) => (
          <span key={i} className="decoration-dot"></span>
        ))}
      </div>
    </div>
  );
};

export default AwardTopicFilter;
