import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "../lib/translations";

const LANGUAGE_STORAGE_KEY = "aurolab-language";

function isSupportedLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language);
}

export function useLanguage() {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const restoredPreferenceRef = useRef(false);

  useEffect(() => {
    if (!restoredPreferenceRef.current) {
      restoredPreferenceRef.current = true;

      try {
        const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (isSupportedLanguage(savedLanguage) && savedLanguage !== language) {
          document.documentElement.lang = savedLanguage;
          setLanguage(savedLanguage);
          return;
        }
      } catch {
        // Language selection still works when storage is unavailable.
      }
    }

    document.documentElement.lang = language;

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Keep the in-memory selection when storage is unavailable.
    }
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((currentLanguage) => (currentLanguage === "en" ? "es" : "en"));
  }, []);

  return { language, toggleLanguage };
}
