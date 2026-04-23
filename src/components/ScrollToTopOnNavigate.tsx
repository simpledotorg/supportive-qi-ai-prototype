import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

function getScrollContainer(): HTMLElement | Window {
  // In the prototype shell, the React app is inside an <aside> that is the scroll container.
  const aside = document.getElementById("prototype-aside");
  return aside ?? window;
}

function getScrollTop(target: HTMLElement | Window): number {
  return target === window ? window.scrollY : target.scrollTop;
}

function setScrollTop(target: HTMLElement | Window, top: number) {
  if (target === window) {
    window.scrollTo({ top, left: 0, behavior: "auto" });
  } else {
    target.scrollTo({ top, left: 0, behavior: "auto" });
  }
}

/**
 * Scroll the prototype aside panel to top on link navigations (PUSH/REPLACE),
 * but preserve scroll position when user goes back/forward (POP).
 */
export function ScrollToTopOnNavigate() {
  const location = useLocation();
  const navType = useNavigationType(); // "POP" | "PUSH" | "REPLACE"
  const scrollPositionsByKey = useRef<Map<string, number>>(new Map());
  const rafId = useRef<number | null>(null);

  // Track scroll position continuously for the *current* route.
  useEffect(() => {
    const container = getScrollContainer();
    const key = location.key;

    const onScroll = () => {
      if (rafId.current != null) return;
      rafId.current = window.requestAnimationFrame(() => {
        rafId.current = null;
        scrollPositionsByKey.current.set(key, getScrollTop(container));
      });
    };

    if (container === window) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      container.addEventListener("scroll", onScroll, { passive: true });
    }

    // Capture initial position as well.
    scrollPositionsByKey.current.set(key, getScrollTop(container));

    return () => {
      if (rafId.current != null) {
        window.cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      if (container === window) {
        window.removeEventListener("scroll", onScroll);
      } else {
        container.removeEventListener("scroll", onScroll);
      }
    };
  }, [location.key]);

  // Apply scroll restoration/reset as soon as the new route is committed.
  useLayoutEffect(() => {
    const container = getScrollContainer();

    // Restore or reset on the destination.
    if (navType === "POP") {
      const saved = scrollPositionsByKey.current.get(location.key);
      setScrollTop(container, typeof saved === "number" ? saved : 0);
    } else {
      // Only force scroll-to-top when entering a facility detail page.
      if (location.pathname.startsWith("/facility/")) setScrollTop(container, 0);
    }
  }, [location.key, location.pathname, navType]);

  return null;
}

