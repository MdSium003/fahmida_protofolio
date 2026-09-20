import React from 'react';

/**
 * Parses markdown-like blog story content and renders inline figures, headings, blockquotes, and paragraphs.
 * Supports:
 * - ![Caption](imageUrl) or [image:imageUrl|Caption]
 * - ### Heading or ## Heading
 * - > Blockquote
 * - Regular paragraphs
 */
const BlogContentRenderer = ({ content = '' }) => {
  if (!content) return null;

  // Split content by double newlines or standalone markdown lines
  const rawBlocks = content.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);

  const parsedNodes = [];

  rawBlocks.forEach((block, bIdx) => {
    // 1. Heading (### or ## or #)
    if (block.startsWith('#')) {
      const headingLevel = block.match(/^#+/)[0].length;
      const text = block.replace(/^#+\s*/, '').trim();
      parsedNodes.push({
        id: `heading-${bIdx}`,
        type: 'heading',
        level: headingLevel,
        text
      });
      return;
    }

    // 2. Blockquote (> quote)
    if (block.startsWith('>')) {
      const text = block.replace(/^>\s*/, '').trim();
      parsedNodes.push({
        id: `quote-${bIdx}`,
        type: 'quote',
        text
      });
      return;
    }

    // 3. Standalone Image block: ![Caption](url) or [image:url|Caption]
    const singleImgMatch = block.match(/^!\[(.*?)\]\((.*?)\)$/) || block.match(/^\[image:(.*?)(?:\|(.*?))?\]$/i);
    if (singleImgMatch) {
      const isMd = block.startsWith('!');
      const url = isMd ? singleImgMatch[2] : singleImgMatch[1];
      const caption = isMd ? singleImgMatch[1] : (singleImgMatch[2] || '');
      parsedNodes.push({
        id: `img-${bIdx}`,
        type: 'image',
        url: url.trim(),
        caption: caption.trim()
      });
      return;
    }

    // 4. Mixed block (Paragraph that contains inline images)
    if (block.includes('![') || block.includes('[image:')) {
      const lines = block.split(/\r?\n/);
      let textLines = [];

      lines.forEach((line, lIdx) => {
        const trimmed = line.trim();
        const inlineImg = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/) || trimmed.match(/^\[image:(.*?)(?:\|(.*?))?\]$/i);
        if (inlineImg) {
          if (textLines.length > 0) {
            parsedNodes.push({
              id: `p-${bIdx}-${lIdx}-pre`,
              type: 'paragraph',
              text: textLines.join('\n')
            });
            textLines = [];
          }
          const isMd = trimmed.startsWith('!');
          const url = isMd ? inlineImg[2] : inlineImg[1];
          const caption = isMd ? inlineImg[1] : (inlineImg[2] || '');
          parsedNodes.push({
            id: `inline-img-${bIdx}-${lIdx}`,
            type: 'image',
            url: url.trim(),
            caption: caption.trim()
          });
        } else if (trimmed) {
          textLines.push(trimmed);
        }
      });

      if (textLines.length > 0) {
        parsedNodes.push({
          id: `p-${bIdx}-post`,
          type: 'paragraph',
          text: textLines.join('\n')
        });
      }
      return;
    }

    // 5. Standard text paragraph
    parsedNodes.push({
      id: `p-${bIdx}`,
      type: 'paragraph',
      text: block
    });
  });

  return (
    <div className="blog-rendered-content">
      {parsedNodes.map((node) => {
        switch (node.type) {
          case 'heading':
            if (node.level <= 2) {
              return (
                <h2 key={node.id} className="blog-inline-heading h2-heading font-serif">
                  {node.text}
                </h2>
              );
            }
            return (
              <h3 key={node.id} className="blog-inline-heading h3-heading font-serif">
                {node.text}
              </h3>
            );

          case 'image':
            return (
              <figure key={node.id} className="blog-inline-figure">
                <div className="blog-inline-img-frame">
                  <img 
                    src={node.url} 
                    alt={node.caption || 'Blog illustration'} 
                    className="blog-inline-img"
                    loading="lazy"
                  />
                </div>
                {node.caption && (
                  <figcaption className="blog-inline-caption">
                    <span className="caption-dot">•</span>
                    <span>{node.caption}</span>
                  </figcaption>
                )}
              </figure>
            );

          case 'quote':
            return (
              <blockquote key={node.id} className="blog-inline-quote">
                <p className="quote-text font-serif">“{node.text.replace(/^["“”]|["“”]$/g, '')}”</p>
              </blockquote>
            );

          case 'paragraph':
          default:
            return (
              <p key={node.id} className="blog-inline-paragraph">
                {node.text}
              </p>
            );
        }
      })}
    </div>
  );
};

export default React.memo(BlogContentRenderer);
