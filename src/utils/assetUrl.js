/**
 * Resolves a site-root-absolute public asset path against the deployment base.
 *
 * The site ships to GitHub Pages under a sub-path (/fahmida_protofolio/), so a
 * bare "/images/foo.jpg" would resolve against the domain root and 404. Every
 * runtime reference to a file in public/ must go through here.
 *
 * Vite rewrites asset URLs it can see at build time (index.html, CSS url(),
 * imported modules) on its own — this covers the ones it cannot: string
 * literals in components and paths that arrive from the CSV data files.
 *
 * Switching to a custom domain later is a one-line change in vite.config.js;
 * BASE_URL follows automatically and nothing here needs touching.
 */
const BASE = import.meta.env.BASE_URL || '/';

export function asset(path) {
  if (!path || typeof path !== 'string') return path;
  const trimmed = path.trim();
  if (!trimmed) return '';

  // Leave absolute URLs and inline data alone.
  if (/^(https?:|\/\/|data:|blob:|mailto:|tel:)/i.test(trimmed)) return trimmed;

  // Already carries the base (avoid double-prefixing on re-normalization).
  if (BASE !== '/' && trimmed.startsWith(BASE)) return trimmed;

  return `${BASE.replace(/\/$/, '')}/${trimmed.replace(/^\//, '')}`;
}

/**
 * Maps a full-size wall image to its pre-generated WebP thumbnail.
 *
 *   /wall/(3).jpg  ->  /wall/thumbs/thumb_(3).webp
 *
 * Accepts paths with or without the deployment base already applied, and
 * returns the input untouched for anything that is not a wall image or is
 * already a thumbnail. Callers must not test `startsWith('/wall/')` themselves
 * — under a sub-path deploy the string is prefixed and that test fails.
 */
export function wallThumb(pathStr) {
  if (!pathStr || typeof pathStr !== 'string') return pathStr;

  const prefix = asset('/wall/');
  if (!pathStr.startsWith(prefix) || pathStr.includes('/thumbs/')) return pathStr;

  const filename = pathStr.slice(prefix.length);
  const dot = filename.lastIndexOf('.');
  const stem = dot > 0 ? filename.slice(0, dot) : filename;
  return `${prefix}thumbs/thumb_${stem}.webp`;
}

export default asset;
