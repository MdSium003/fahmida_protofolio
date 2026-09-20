import { useEffect, useRef } from 'react';

/**
 * Makes the slide-in mobile menu behave like a real modal dialog.
 *
 * The menu previously left 97 focusable elements reachable behind its overlay,
 * and Escape did nothing. This adds the three behaviours a dialog needs:
 *
 *   1. Escape closes it.
 *   2. Tab is trapped inside while it is open (wrapping at both ends).
 *   3. Focus moves in on open and returns to the trigger on close.
 *
 * The panel stays mounted when closed (it animates via a `.active` class and
 * transform), so `inert` is what actually keeps its links out of the tab order
 * — a focus trap alone would not stop a user tabbing into a closed panel.
 *
 * @param {boolean}  isOpen
 * @param {Function} onClose
 * @returns {{panelRef: React.RefObject, triggerRef: React.RefObject}}
 */
export function useMenuDialog(isOpen, onClose) {
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const lastFocused = useRef(null);

  // Keep the closed panel out of the tab order entirely.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (isOpen) {
      panel.removeAttribute('inert');
      panel.removeAttribute('aria-hidden');
    } else {
      panel.setAttribute('inert', '');
      panel.setAttribute('aria-hidden', 'true');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    lastFocused.current = document.activeElement;

    const focusables = () =>
      Array.from(
        panel?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);

    // Move focus into the panel so the next Tab starts inside it.
    const first = focusables()[0];
    first?.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;

      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement;

      // Wrap at both ends, and pull focus back in if it escaped the panel.
      if (event.shiftKey && (active === firstItem || !panel.contains(active))) {
        event.preventDefault();
        lastItem.focus({ preventScroll: true });
      } else if (!event.shiftKey && (active === lastItem || !panel.contains(active))) {
        event.preventDefault();
        firstItem.focus({ preventScroll: true });
      }
    };

    // Captured now rather than read during cleanup: by then React may have
    // detached the node, and the linter rightly flags reading .current there.
    const trigger = triggerRef.current;
    const previouslyFocused = lastFocused.current;

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // Return focus to whatever opened the menu, so keyboard users are not
      // dropped back at the top of the document.
      const target = trigger || previouslyFocused;
      if (target && typeof target.focus === 'function') {
        target.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose]);

  return { panelRef, triggerRef };
}

export default useMenuDialog;
