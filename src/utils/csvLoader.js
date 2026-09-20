import Papa from 'papaparse';
import { asset } from './assetUrl';

// In-memory cache for fast instant lookups
const cache = new Map();

/**
 * Normalizes boolean strings or numbers to native boolean
 */
export function normalizeBoolean(val) {
  if (val === true || val === false) return val;
  if (typeof val === 'number') return val === 1;
  if (!val) return false;
  const s = String(val).trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
}

/**
 * Normalizes image paths so users can write "public/image.png", "/wall/img.jpg",
 * "wall/img.jpg", or external URLs "https://..." interchangeably.
 */
export function normalizeImagePath(pathStr) {
  if (!pathStr || typeof pathStr !== 'string') return '';
  const trimmed = pathStr.trim();
  if (!trimmed) return '';
  // Return web URLs or data URIs as-is
  if (/^(https?:|\/\/|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }
  // Strip any leading "public/" or "/public/"
  let clean = trimmed.replace(/^\/?public\//i, '/');
  // Strip leading "./"
  if (clean.startsWith('./')) {
    clean = clean.slice(1);
  }
  // Ensure leading slash
  if (!clean.startsWith('/')) {
    clean = `/${clean}`;
  }
  // Resolve against the deployment base (site ships under a sub-path).
  return asset(clean);
}

/**
 * Loads and parses a CSV file from /data/<name>.csv
 * @param {string} fileName - Name of the CSV file (with or without .csv extension)
 * @returns {Promise<Array<Object>>} - Parsed array of row objects
 */
export async function loadCsv(fileName) {
  const cleanName = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
  const url = asset(`/data/${cleanName}`);

  if (cache.has(url)) {
    return cache.get(url);
  }

  try {
    const fetchUrl = import.meta.env?.DEV ? `${url}?t=${Date.now()}` : url;
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      console.warn(`CSV file not found: ${url}`);
      return [];
    }
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      cache.set(url, []);
      return [];
    }

    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically parse numbers and booleans
    });

    const data = result.data || [];

    // Dev-mode validation check
    if (import.meta.env?.DEV) {
      validateDataset(cleanName, data);
    }

    cache.set(url, data);
    return data;
  } catch (error) {
    console.error(`Error loading CSV from ${url}:`, error);
    return [];
  }
}

/**
 * Development mode runtime validation
 */
function validateDataset(fileName, rows) {
  const seenIds = new Set();
  rows.forEach((row, idx) => {
    if (!row || typeof row !== 'object') return;
    if (row.id !== undefined && row.id !== null) {
      const idStr = String(row.id);
      if (seenIds.has(idStr)) {
        console.warn(`[Data Architecture Warning] Duplicate ID "${idStr}" detected in ${fileName} at row ${idx + 1}.`);
      }
      seenIds.add(idStr);
    }
  });
}

/**
 * Clears the CSV in-memory cache (useful for dev/hot-reload)
 */
export function clearCsvCache() {
  cache.clear();
}

/**
 * Parses a delimited string (commas, pipes, semicolons, or newlines) into an array of clean strings.
 */
export function parseList(str, delimiter = /[,;|\n]+/) {
  if (!str) return [];
  if (Array.isArray(str)) return str;
  return String(str)
    .split(delimiter)
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Detects link/media type from URL
 */
function inferType(url) {
  if (!url) return 'link';
  const u = url.toLowerCase();
  if (u.includes('github.com')) return 'github';
  if (u.includes('youtu.be') || u.includes('youtube.com')) return 'video';
  if (u.includes('linkedin.com')) return 'linkedin';
  if (u.includes('researchgate.net') || u.includes('arxiv.org') || u.endsWith('.pdf')) return 'documentation';
  return 'link';
}

/**
 * Parses a consolidated sources string (e.g., "type:url|label ; github:https://...")
 * into structured objects: [{ id, type, label, url }]
 */
export function parseSources(sourcesStr) {
  if (!sourcesStr) return [];
  if (Array.isArray(sourcesStr)) return sourcesStr;

  const entries = String(sourcesStr)
    .split(/[\r\n;]+/)
    .map(s => s.trim())
    .filter(Boolean);

  return entries.map((entry, idx) => {
    let type = 'link';
    let url = entry;
    let label = '';

    const colonIdx = entry.indexOf(':');
    if (colonIdx > -1) {
      const prefix = entry.substring(0, colonIdx).trim().toLowerCase();
      const knownTypes = ['github', 'live_demo', 'documentation', 'download', 'video', 'paper', 'code', 'demo', 'other', 'website', 'linkedin', 'external'];
      
      if (knownTypes.includes(prefix) && entry.charAt(colonIdx + 1) === '/') {
        type = prefix;
        url = entry.substring(colonIdx + 1).trim();
      } else if (knownTypes.includes(prefix)) {
        type = prefix;
        url = entry.substring(colonIdx + 1).trim();
      }
    }

    if (url.includes('|')) {
      const parts = url.split('|');
      url = parts[0].trim();
      label = parts.slice(1).join('|').trim();
    }

    if (!label) {
      if (type === 'github') label = 'Source Code';
      else if (type === 'live_demo') label = 'Live Demo';
      else if (type === 'documentation' || type === 'paper') label = 'Documentation';
      else if (type === 'video') label = 'Video Demo';
      else if (type === 'download') label = 'Download';
      else label = type;
    }

    return {
      id: idx + 1,
      type: type || inferType(url),
      label: label,
      url: url
    };
  });
}

export function parseLinks(linksStr) {
  return parseSources(linksStr);
}

/**
 * Parses authors column (e.g., "Mst. Fahmida Sultana Naznin|https://github.com/... ; Dr. Jane Doe")
 * into structured objects: [{ id, name, isMe, github_url, website }]
 */
export function parseAuthors(authorsStr) {
  if (!authorsStr) return [];
  if (Array.isArray(authorsStr)) return authorsStr;

  const entries = String(authorsStr)
    .split(/[\r\n;]+/)
    .map(s => s.trim())
    .filter(Boolean);

  return entries.map((entry, idx) => {
    const parts = entry.split('|').map(p => p.trim());
    const name = parts[0] || '';
    const lower = name.toLowerCase();
    const isMe = lower.includes('fahmida') || lower.includes('sultana') || lower.includes('naznin') || lower.includes('f. sultana');

    return {
      id: idx + 1,
      name,
      isMe,
      github_url: parts[1] || '',
      website: parts[2] || ''
    };
  });
}

/**
 * Dynamically generates standard BibTeX citation string if missing
 */
export function generateBibtex(pub) {
  if (pub.bibtex && String(pub.bibtex).trim().startsWith('@')) {
    return String(pub.bibtex).trim();
  }

  const authorsArr = pub.authorsList || (typeof pub.authors === 'string' ? parseAuthors(pub.authors) : []);
  const authorNames = authorsArr.length > 0 
    ? authorsArr.map(a => a.name).join(' and ') 
    : 'Mst. Fahmida Sultana Naznin';

  const firstAuthor = authorsArr.length > 0 ? authorsArr[0].name.split(' ').pop().toLowerCase() : 'naznin';
  const year = pub.year || new Date().getFullYear();
  const firstWord = (pub.title || 'paper').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toLowerCase();
  const citationKey = `${firstAuthor}${year}${firstWord}`;
  
  const venue = pub.venue || 'Research Publication';
  const isConference = !venue.toLowerCase().includes('journal') && !venue.toLowerCase().includes('ieee access') && !venue.toLowerCase().includes('preprint');
  const type = isConference ? 'inproceedings' : 'article';
  
  if (type === 'inproceedings') {
    return `@inproceedings{${citationKey},\n  title={${pub.title}},\n  author={${authorNames}},\n  booktitle={${venue}},\n  year={${year}}\n}`;
  } else {
    return `@article{${citationKey},\n  title={${pub.title}},\n  author={${authorNames}},\n  journal={${venue}},\n  year={${year}}\n}`;
  }
}

/**
 * Parses media column (e.g., "image:https://...|Caption ; youtube:https://...")
 * into structured objects: [{ id, media_type, media_url, caption }]
 */
export function parseMedia(mediaStr) {
  if (!mediaStr) return [];
  if (Array.isArray(mediaStr)) return mediaStr;

  const entries = String(mediaStr)
    .split(/[\r\n;]+/)
    .map(s => s.trim())
    .filter(Boolean);

  return entries.map((entry, idx) => {
    let media_type = 'image';
    let media_url = entry;
    let caption = '';

    const colonIdx = entry.indexOf(':');
    if (colonIdx > -1) {
      const prefix = entry.substring(0, colonIdx).trim().toLowerCase();
      if (prefix === 'image' || prefix === 'youtube' || prefix === 'video' || prefix === 'pdf') {
        media_type = prefix;
        media_url = entry.substring(colonIdx + 1).trim();
      }
    }

    if (media_url.includes('|')) {
      const parts = media_url.split('|');
      media_url = parts[0].trim();
      caption = parts.slice(1).join('|').trim();
    }

    if (media_type === 'image') {
      if (/youtu\.be|youtube\.com/.test(media_url)) {
        media_type = 'youtube';
      } else {
        media_url = normalizeImagePath(media_url);
      }
    }

    return {
      id: idx + 1,
      media_type,
      media_url,
      caption
    };
  });
}

// =============================================================================
// DOMAIN-SPECIFIC NORMALIZED DATA LOADERS
// =============================================================================

export async function loadProjectsData() {
  const raw = await loadCsv('projects');
  const processed = (raw || []).map(p => {
    const rawKeywords = p.keywords ? String(p.keywords).split(',').map(k => k.trim()).filter(Boolean) : [];
    const kwLower = ((p.keywords || '') + ' ' + (p.title || '') + ' ' + (p.description || '')).toLowerCase();
    
    let category = 'WEB & SYSTEMS';
    let categoryId = 'web';

    if (kwLower.includes('3d') || kwLower.includes('vision') || kwLower.includes('reconstruction') || kwLower.includes('rendering') || kwLower.includes('graphics')) {
      category = 'COMPUTER VISION & 3D';
      categoryId = 'vision';
    } else if (kwLower.includes('robot') || kwLower.includes('slam') || kwLower.includes('iot') || kwLower.includes('sensor') || kwLower.includes('hardware') || kwLower.includes('path planning')) {
      category = 'ROBOTICS & IOT';
      categoryId = 'robotics';
    } else if (kwLower.includes('nlp') || kwLower.includes('neural') || kwLower.includes('machine learning') || kwLower.includes('deep learning') || kwLower.includes('mnist') || kwLower.includes('classifier') || kwLower.includes('chatbot') || kwLower.includes('regression') || kwLower.includes('cnn') || kwLower.includes('style transfer')) {
      category = 'AI & MACHINE LEARNING';
      categoryId = 'ai';
    }

    const normalizedImg = normalizeImagePath(p.thumbnail_url);

    return {
      ...p,
      id: String(p.id),
      category,
      categoryId,
      technologies: rawKeywords,
      thumbnail_url: normalizedImg,
      image: normalizedImg,
      isFeatured: normalizeBoolean(p.is_featured),
      featuredOrder: Number(p.featured_order) || 999,
      sourcesList: parseSources(p.sources)
    };
  });

  // Sort by featured_order, then by year
  processed.sort((a, b) => {
    if (a.featuredOrder !== b.featuredOrder) return a.featuredOrder - b.featuredOrder;
    return (Number(b.year) || 0) - (Number(a.year) || 0);
  });

  return processed;
}

export async function loadResearchData() {
  const raw = await loadCsv('research');
  const processed = (raw || []).map(p => {
    const topics = parseList(p.topics);
    const normalizedImg = normalizeImagePath(p.thumbnail_url);
    const authorsList = parseAuthors(p.authors);
    const linksList = parseLinks(p.links);
    const mediaList = parseMedia(p.media);
    const hasDemo = normalizeBoolean(p.has_demo);

    // Identify genuine paper / PDF / DOI URL (excluding generic root domains)
    const isRealPaperUrl = (url) => {
      if (!url || typeof url !== 'string') return false;
      const clean = url.trim().toLowerCase();
      if (!clean.startsWith('http://') && !clean.startsWith('https://')) return false;
      if (clean === 'https://arxiv.org/' || clean === 'https://arxiv.org' || clean === 'http://arxiv.org/' || clean === 'http://arxiv.org') return false;
      if (clean === 'https://signalprocessingsociety.org/' || clean === 'https://signalprocessingsociety.org') return false;
      if (clean.includes('example.com')) return false;
      return true;
    };

    let rawExt = (p.external_url && String(p.external_url).trim()) || '';
    if (!isRealPaperUrl(rawExt)) {
      rawExt = '';
      if (linksList.length > 0) {
        const paperLink = linksList.find(l => ['paper', 'pdf', 'doi'].includes(l.type) && isRealPaperUrl(l.url));
        if (paperLink) rawExt = paperLink.url;
      }
    }
    const externalUrl = rawExt;

    // Identify primary Demo URL
    let demoUrl = (p.demo_url && String(p.demo_url).trim()) || '';
    if (!demoUrl && linksList.length > 0) {
      const demoLink = linksList.find(l => ['video', 'demo', 'live_demo'].includes(l.type));
      if (demoLink) demoUrl = demoLink.url;
    }

    const pubObj = {
      ...p,
      id: String(p.id),
      title: p.title ? String(p.title).trim() : '',
      venue: (p.venue && String(p.venue).trim()) || 'Research Publication',
      year: Number(p.year) || new Date().getFullYear(),
      status: (p.status ? String(p.status).trim().toLowerCase() : 'published'),
      category: topics,
      topicsList: topics,
      coverImage: normalizedImg || asset('/images/research_1.jpg'),
      thumbnail_url: normalizedImg || asset('/images/research_1.jpg'),
      displayImg: normalizedImg && !normalizedImg.includes('example.com') ? normalizedImg : asset('/images/research_1.jpg'),
      abstract: p.abstract ? String(p.abstract).trim() : '',
      description: p.description ? String(p.description).trim() : '',
      externalUrl: externalUrl,
      external_url: externalUrl,
      hasDemo: hasDemo || Boolean(demoUrl),
      has_demo: hasDemo || Boolean(demoUrl),
      demoUrl: demoUrl,
      demo_url: demoUrl,
      authors: authorsList,
      authorsList: authorsList,
      linksList: linksList,
      mediaList: mediaList,
      kicker: topics[0] || 'Medical AI',
      isFeatured: normalizeBoolean(p.is_featured),
      featuredOrder: Number(p.featured_order) || 999
    };

    // Dynamically attach bibtex citation
    pubObj.bibtex = generateBibtex(pubObj);

    return pubObj;
  });

  processed.sort((a, b) => {
    if (a.featuredOrder !== b.featuredOrder) return a.featuredOrder - b.featuredOrder;
    return (Number(b.year) || 0) - (Number(a.year) || 0);
  });

  return processed;
}

export async function loadAwardsData() {
  const raw = await loadCsv('awards');
  const processed = (raw || []).map(a => {
    return {
      ...a,
      id: String(a.id),
      // Award thumbnails feed <img src> directly in the home and awards
      // showcases, so they must be resolved against the deployment base here.
      thumbnail_url: normalizeImagePath(a.thumbnail_url) || a.thumbnail_url,
      isFeatured: normalizeBoolean(a.is_featured),
      featuredOrder: Number(a.featured_order) || 999,
      showcaseHome: normalizeBoolean(a.showcase_home || a.is_home_featured || a.showcase_in_home),
      showcase_home: normalizeBoolean(a.showcase_home || a.is_home_featured || a.showcase_in_home),
      mediaList: parseMedia(a.media)
    };
  });

  processed.sort((a, b) => {
    if (a.featuredOrder !== b.featuredOrder) return a.featuredOrder - b.featuredOrder;
    return (Number(b.year) || 0) - (Number(a.year) || 0);
  });

  return processed;
}

export async function loadBlogsData() {
  const raw = await loadCsv('blogs');
  const processed = (raw || []).map(item => {
    const isVlog = (item.title || '').toLowerCase().includes('vlog') || (item.media || '').includes('youtube');
    
    let coverImg = item.thumbnail_url;
    if (!coverImg || coverImg.includes('youtube') || coverImg.includes('youtu.be')) {
      const parsed = parseMedia(item.media);
      const firstImg = parsed.find(m => m.media_type === 'image' || (!m.media_url.includes('youtube') && !m.media_url.includes('youtu.be')));
      coverImg = firstImg ? firstImg.media_url : asset('/images/fahmida_blog.jpeg');
    }

    const normalizedCover = normalizeImagePath(coverImg);

    return {
      ...item,
      id: String(item.id),
      title: item.title ? String(item.title).trim() : '',
      description: item.description ? String(item.description).trim() : (item.summary || ''),
      summary: item.summary ? String(item.summary).trim() : (item.description || ''),
      content: item.content ? String(item.content).trim() : (item.description || ''),
      location: item.location ? String(item.location).trim() : '',
      category: item.category ? String(item.category).trim() : (isVlog ? 'Vlog' : 'Article'),
      read_time: item.read_time ? String(item.read_time).trim() : '6 min read',
      isVlog,
      thumbnail_url: normalizeImagePath(item.thumbnail_url),
      coverImage: normalizedCover,
      isFeatured: normalizeBoolean(item.is_featured),
      featuredOrder: Number(item.featured_order) || 999,
      mediaList: parseMedia(item.media),
      linksList: parseLinks(item.links)
    };
  });

  processed.sort((a, b) => {
    if (a.featuredOrder !== b.featuredOrder) return a.featuredOrder - b.featuredOrder;
    return new Date(b.published_date || 0) - new Date(a.published_date || 0);
  });

  return processed;
}

export async function loadSkillsData() {
  const raw = await loadCsv('skills');
  return (raw || []).map(s => ({
    ...s,
    id: String(s.id),
    tagsList: parseList(s.tags),
    isPrimary: normalizeBoolean(s.is_primary),
    displayOrder: Number(s.display_order) || 999
  })).sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function loadMomentsData() {
  const raw = await loadCsv('moments');
  return (raw || []).map(m => {
    const norm = normalizeImagePath(m.image_url);
    return {
      ...m,
      id: String(m.id),
      image_url: norm,
      image: norm,
      displayOrder: Number(m.display_order) || 999
    };
  }).sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function loadSocialLinksData() {
  const raw = await loadCsv('social_links');
  return (raw || []).map(s => ({
    ...s,
    id: String(s.id),
    // The CV row points at a file in public/ — resolve it against the base.
    // External profile links already carry a scheme and pass through untouched.
    url: asset(s.url),
    sortOrder: Number(s.sort_order) || 999
  })).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function loadExperienceData() {
  const raw = await loadCsv('experience');
  return (raw || []).map(e => ({
    ...e,
    id: String(e.id),
    logo_url: normalizeImagePath(e.logo_url),
    sortOrder: Number(e.sort_order) || 999
  })).sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
}

export async function loadEducationData() {
  const raw = await loadCsv('education');
  return (raw || []).map(e => ({
    ...e,
    id: String(e.id),
    logo_url: normalizeImagePath(e.logo_url),
    sortOrder: Number(e.sort_order) || 999
  })).sort((a, b) => (Number(b.start_year) || 0) - (Number(a.start_year) || 0));
}

export async function loadVolunteerData() {
  const raw = await loadCsv('volunteer');
  return (raw || []).map(v => ({
    ...v,
    id: String(v.id),
    logo_url: normalizeImagePath(v.logo_url),
    sortOrder: Number(v.sort_order) || 999
  })).sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
}

export async function loadLeadershipData() {
  const raw = await loadCsv('leadership');
  return (raw || []).map(l => ({
    ...l,
    id: String(l.id),
    logo_url: normalizeImagePath(l.logo_url),
    sortOrder: Number(l.sort_order) || 999
  })).sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
}

export async function loadNewsData() {
  const raw = await loadCsv('news');
  return (raw || []).map(n => ({
    ...n,
    id: String(n.id),
    image_url: normalizeImagePath(n.image_url),
    image: normalizeImagePath(n.image_url),
    isFeatured: normalizeBoolean(n.is_featured),
    sortOrder: Number(n.sort_order) || 999
  })).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

export async function loadMediaMentionsData() {
  const raw = await loadCsv('media_mentions');
  return (raw || []).map(m => {
    const normImg = normalizeImagePath(m.image_url);
    const mediaType = (m.media_type ? String(m.media_type).trim().toLowerCase() : 'newspaper');
    return {
      ...m,
      id: String(m.id),
      title: m.title ? String(m.title).trim() : '',
      outlet: m.outlet ? String(m.outlet).trim() : '',
      media_type: mediaType,
      mediaType: mediaType,
      image_url: normImg,
      image: normImg,
      media_url: m.media_url ? String(m.media_url).trim() : '',
      external_link: m.external_link ? String(m.external_link).trim() : '',
      date: m.date ? String(m.date).trim() : '',
      caption: m.caption ? String(m.caption).trim() : '',
      isFeatured: normalizeBoolean(m.is_featured),
      displayOrder: Number(m.display_order) || 999
    };
  }).sort((a, b) => a.displayOrder - b.displayOrder);
}

