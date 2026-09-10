import { useState, useEffect } from 'react';
import { loadCsv } from '../../src/utils/csvLoader';

const TopicFilter = ({ onTopicSelect, selectedTopic }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch topics from CSV
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await loadCsv('research');
        const topicMap = new Map();
        (data || []).forEach(p => {
          if (p.topics) {
            p.topics.split(/[,;]+/).forEach(t => {
              const name = t.trim();
              if (name) {
                const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                if (!topicMap.has(slug)) {
                  topicMap.set(slug, { id: slug, name, slug });
                }
              }
            });
          }
        });
        setTopics(Array.from(topicMap.values()));
      } catch (error) {
        console.error('Error fetching topics:', error);
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
      <div className="topics-filter">
        <h2 className="topics-section-title">Research Topics</h2>
        <p className="topics-subtitle">(click on a specific category to see relevant works)</p>
        <div className="topics-grid-skeleton">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="topic-skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="topics-filter">
      <h2 className="topics-section-title">Research Topics</h2>
      <p className="topics-subtitle">(click on a specific category to see relevant works)</p>

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
        {[...Array(20)].map((_, i) => (
          <span key={i} className="decoration-dot"></span>
        ))}
      </div>
    </div>
  );
};

export default TopicFilter;