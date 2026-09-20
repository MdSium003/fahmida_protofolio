import { useEffect } from 'react';

const SITE = 'Mst. Fahmida Sultana Naznin';
const ORIGIN = 'https://mdsium003.github.io/fahmida_protofolio';

/**
 * Sets the document title and the per-route meta tags.
 *
 * The site is a client-rendered SPA on GitHub Pages, so index.html ships one
 * static <title> and description for all seven routes — every tab, bookmark
 * and history entry read identically. This updates them per route, and keeps
 * the canonical URL and the og:/twitter: pairs in step so shared links preview
 * with the right page rather than the homepage.
 *
 * @param {{title:string, description:string, path?:string, noindex?:boolean}} meta
 */
export function usePageMeta({ title, description, path, noindex = false }) {
  useEffect(() => {
    if (!title) return;

    const fullTitle = `${title} | ${SITE}`;
    document.title = fullTitle;

    const setMeta = (selector, attr, value) => {
      if (!value) return;
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [, kind, name] = selector.match(/\[(property|name)="([^"]+)"\]/) ?? [];
        if (!kind) return;
        el.setAttribute(kind, name);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);

    const canonical = document.head.querySelector('link[rel="canonical"]');
    const robots = document.head.querySelector('meta[name="robots"]');

    if (noindex) {
      // A not-found page must not advertise another page as its canonical —
      // without this it kept whichever URL the previous route had set.
      canonical?.remove();
      setMeta('meta[name="robots"]', 'content', 'noindex, follow');
    } else if (path) {
      robots?.remove();
      const url = `${ORIGIN}${path}`;
      setMeta('meta[property="og:url"]', 'content', url);
      let link = canonical;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    }
  }, [title, description, path, noindex]);
}

export default usePageMeta;
