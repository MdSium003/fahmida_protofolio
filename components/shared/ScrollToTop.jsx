import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let observer;
    let frame;
    let timeout;

    if (hash) {
      const scrollToTarget = () => {
        const id = decodeURIComponent(hash.slice(1));
        const element = document.getElementById(id);
        if (!element) return false;

        frame = window.requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        observer?.disconnect();
        return true;
      };

      // Lazy routes and data-backed sections may add the anchor after this
      // route effect runs, so wait for it instead of falling back to page top.
      if (!scrollToTarget()) {
        observer = new MutationObserver(scrollToTarget);
        observer.observe(document.body, { childList: true, subtree: true });
        timeout = window.setTimeout(() => observer?.disconnect(), 10000);
      }

      return () => {
        observer?.disconnect();
        if (timeout) window.clearTimeout(timeout);
        if (frame) window.cancelAnimationFrame(frame);
      };
    }

    // Scroll to the absolute top of the page on route transition
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    return undefined;
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
