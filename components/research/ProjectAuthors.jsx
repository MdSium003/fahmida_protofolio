import React from 'react';

const ProjectAuthors = ({ authors }) => {
  if (!authors || authors.length === 0) return null;

  return (
    <div className="project-authors">
      {authors.map((author, index) => (
        <span key={author.id || index} className="author-item">
          {author.website ? (
            <a 
              href={author.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="author-link"
            >
              {author.name}
            </a>
          ) : (
            <span className="author-name">{author.name}</span>
          )}
          {index < authors.length - 1 && <span className="author-separator">, </span>}
        </span>
      ))}
    </div>
  );
};

export default ProjectAuthors;
