import { useEffect, useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { NAVIGATION_ITEMS } from "../../config/navigation";
import { AudioDetectorTool } from "../../features/audioDetector/AudioDetectorTool";
import { CamelotTool } from "../../features/camelot/CamelotTool";
import { DelayReverbTool } from "../../features/delayReverb/DelayReverbTool";
import { HomeSection } from "../../features/home/HomeSection";
import { MetronomeTool } from "../../features/metronome/MetronomeTool";
import { NoteFrequencyTool } from "../../features/noteFrequency/NoteFrequencyTool";
import { TapTempoTool } from "../../features/tapTempo/TapTempoTool";
import { useLanguage } from "../../hooks/useLanguage";
import { useSectionNavigation } from "../../hooks/useSectionNavigation";
import { useWebAudioSupport } from "../../hooks/useWebAudioSupport";
import { getDocumentation } from "../../lib/documentation";
import { formatBrowserTitle, getSeoRoute } from "../../lib/seo";
import { DEFAULT_LANGUAGE, getCopy } from "../../lib/translations";

export default function AuroLabApp({ initialSection = "home" }) {
  const [hasMounted, setHasMounted] = useState(false);
  const audioSupported = useWebAudioSupport();
  const { language, toggleLanguage } = useLanguage();
  const { activeSection, openSection } = useSectionNavigation(initialSection);
  const copy = getCopy(language);
  const documentation = getDocumentation(language);
  const sections = NAVIGATION_ITEMS.map((section) => ({
    ...section,
    ...copy.sections[section.id],
  }));

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    const section = copy.sections[activeSection] || copy.sections.home;
    const seoPage = getSeoRoute(activeSection);
    const title =
      language === DEFAULT_LANGUAGE
        ? seoPage.title
        : activeSection === "home"
          ? copy.meta.title
          : `auroLab | ${section.title}`;
    const description =
      language === DEFAULT_LANGUAGE
        ? seoPage.description
        : activeSection === "home"
          ? copy.meta.description
          : section.description;
    const updateMeta = (selector, value) =>
      document.querySelector(selector)?.setAttribute("content", value);

    document.title = formatBrowserTitle(title);
    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:locale"]', language === "es" ? "es_ES" : "en_US");
    updateMeta('meta[name="twitter:title"]', title);
    updateMeta('meta[name="twitter:description"]', description);
  }, [activeSection, copy, language]);

  useEffect(() => {
    const blurRangeInput = () => {
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLInputElement && activeElement.type === "range") {
        activeElement.blur();
      }
    };

    window.addEventListener("pointerup", blurRangeInput);
    window.addEventListener("pointercancel", blurRangeInput);
    return () => {
      window.removeEventListener("pointerup", blurRangeInput);
      window.removeEventListener("pointercancel", blurRangeInput);
    };
  }, []);

  return (
    <main className="app-shell">
      <Sidebar
        activeSection={activeSection}
        copy={copy.sidebar}
        language={language}
        onOpenSection={openSection}
        onToggleLanguage={toggleLanguage}
        sections={sections}
      />

      <div className="workspace">
        {(hasMounted || activeSection === "home") && (
          <HomeSection
            isActive={activeSection === "home"}
            onOpenSection={openSection}
            sections={sections}
            copy={copy.home}
          />
        )}
        {(hasMounted || activeSection === "delay-reverb") && (
          <DelayReverbTool
            copy={copy.delay}
            documentation={documentation.tools.delay}
            documentationLabels={documentation.labels}
            isActive={activeSection === "delay-reverb"}
          />
        )}
        {(hasMounted || activeSection === "metronome") && (
          <MetronomeTool
            audioSupported={audioSupported}
            documentation={documentation.tools.metronome}
            documentationLabels={documentation.labels}
            isActive={activeSection === "metronome"}
            copy={copy.metronome}
          />
        )}
        {(hasMounted || activeSection === "tap-tempo") && (
          <TapTempoTool
            audioSupported={audioSupported}
            documentation={documentation.tools.tap}
            documentationLabels={documentation.labels}
            isActive={activeSection === "tap-tempo"}
            copy={copy.tap}
          />
        )}
        {(hasMounted || activeSection === "detector") && (
          <AudioDetectorTool
            audioSupported={audioSupported}
            documentation={documentation.tools.detector}
            documentationLabels={documentation.labels}
            isActive={activeSection === "detector"}
            copy={copy.detector}
          />
        )}
        {(hasMounted || activeSection === "camelot") && (
          <CamelotTool
            copy={copy.camelot}
            documentation={documentation.tools.camelot}
            documentationLabels={documentation.labels}
            isActive={activeSection === "camelot"}
          />
        )}
        {(hasMounted || activeSection === "notefreq") && (
          <NoteFrequencyTool
            copy={copy.notefreq}
            documentation={documentation.tools.notefreq}
            documentationLabels={documentation.labels}
            isActive={activeSection === "notefreq"}
          />
        )}
      </div>
    </main>
  );
}
