import { useCallback, useEffect, useState } from "react";
import { NAVIGATION_ITEMS } from "../config/navigation";
import { formatBrowserTitle, getSectionFromPath, getSeoRoute } from "../lib/seo";

function updateDocumentMetadata(sectionId) {
  const page = getSeoRoute(sectionId);
  const canonicalElement = document.querySelector('link[rel="canonical"]');
  const origin = canonicalElement?.href
    ? new URL(canonicalElement.href).origin
    : window.location.origin;
  const canonicalUrl = new URL(page.path, origin).href;

  document.title = formatBrowserTitle(page.title);
  document.querySelector('meta[name="description"]')?.setAttribute("content", page.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", page.title);
  document
    .querySelector('meta[property="og:description"]')
    ?.setAttribute("content", page.description);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonicalUrl);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", page.title);
  document
    .querySelector('meta[name="twitter:description"]')
    ?.setAttribute("content", page.description);
  canonicalElement?.setAttribute("href", canonicalUrl);
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => {
    link.setAttribute("href", canonicalUrl);
  });
}

export function useSectionNavigation(initialSection) {
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => updateDocumentMetadata(activeSection), [activeSection]);

  useEffect(() => {
    const syncFromUrl = () => {
      const hashSection = window.location.hash.slice(1);
      const sectionId = NAVIGATION_ITEMS.some(({ id }) => id === hashSection)
        ? hashSection
        : getSectionFromPath(window.location.pathname);

      setActiveSection(sectionId);

      if (hashSection === sectionId) {
        const cleanUrl = `${getSeoRoute(sectionId).path}${window.location.search}`;
        window.history.replaceState({ sectionId }, "", cleanUrl);
      }
    };

    syncFromUrl();
    window.addEventListener("hashchange", syncFromUrl);
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("hashchange", syncFromUrl);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);

  const openSection = useCallback((sectionId, event) => {
    if (
      event &&
      (event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey)
    ) {
      return;
    }

    event?.preventDefault();
    setActiveSection(sectionId);

    const nextUrl = `${getSeoRoute(sectionId).path}${window.location.search}`;
    window.history.pushState({ sectionId }, "", nextUrl);
  }, []);

  return { activeSection, openSection };
}
