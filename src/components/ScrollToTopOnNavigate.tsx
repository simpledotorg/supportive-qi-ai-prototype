import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

function scrollAsideToTop() {
  const aside = document.getElementById("prototype-aside");
  if (aside) {
    aside.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return;
  }

  // Fallback (e.g. app running without the prototype aside shell)
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

/**
 * Scroll the prototype aside panel to top on link navigations (PUSH/REPLACE),
 * but preserve scroll position when user goes back/forward (POP).
 */
export function ScrollToTopOnNavigate() {
  const location = useLocation();
  const navType = useNavigationType(); // "POP" | "PUSH" | "REPLACE"

  useEffect(() => {
    if (navType === "POP") return;
    if (!location.pathname.startsWith("/facility/")) return;
    scrollAsideToTop();
  }, [location.key, location.pathname, navType]);

  return null;
}

