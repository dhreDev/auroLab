export const SITE = {
  name: "auroLab",
  alternateNames: ["AuroLab", "aurolab.dhreian.com"],
  language: "en",
  locale: "en_US",
  defaultOrigin: "https://aurolab.dhreian.com",
  logoPath: "/logo.svg",
  socialImage: {
    path: "/social-preview.png",
    width: 1200,
    height: 630,
    alt: "auroLab music production tools",
  },
  twitterHandle: "@dhreian",
  creator: {
    name: "dhreian",
    url: "https://dhreian.com",
    social: [
      "https://x.com/dhreian",
      "https://instagram.com/dhreian",
      "https://www.tiktok.com/@dhreian_",
    ],
  },
};

export const SEO_ROUTES = {
  home: {
    sectionId: "home",
    slug: "",
    path: "/",
    name: "auroLab music production tools",
    title: "auroLab | Free music production tools for producers",
    description:
      "Free browser-based music production tools: delay and reverb calculator, metronome, tap tempo, BPM and key detection, Camelot wheel, and note converter.",
    features: [
      "BPM-synced delay and reverb calculator",
      "Online metronome",
      "Tap tempo calculator",
      "Local BPM and key detection",
      "Interactive Camelot wheel",
      "Note, frequency, and MIDI converter",
    ],
    keywords: [
      "free music production tools",
      "online music production tools",
      "music producer tools",
      "BPM tools",
      "audio analysis tools",
      "browser-based music tools",
    ],
  },
  "delay-reverb": {
    sectionId: "delay-reverb",
    slug: "delay-reverb",
    path: "/delay-reverb/",
    name: "BPM delay and reverb calculator",
    title: "auroLab | BPM delay & reverb calculator (ms & Hz)",
    description:
      "Calculate BPM-synced delay times in milliseconds and Hz, plus pre-delay and decay suggestions for reverb. Free, precise, and browser-based.",
    features: [
      "Delay times in milliseconds and Hz",
      "Normal, dotted, and triplet subdivisions",
      "Tempo-aligned reverb pre-delay and decay suggestions",
    ],
    alternateNames: ["BPM delay calculator", "Delay and reverb time calculator"],
    keywords: [
      "BPM delay calculator",
      "delay time calculator",
      "reverb calculator",
      "BPM to milliseconds calculator",
      "delay frequency calculator",
      "reverb pre-delay calculator",
    ],
  },
  metronome: {
    sectionId: "metronome",
    slug: "metronome",
    path: "/metronome/",
    name: "Online metronome",
    title: "auroLab | Online metronome with tap tempo",
    description:
      "Use a precise online metronome with accented downbeats, time signatures, volume control, tap tempo, and keyboard shortcuts. Free in your browser.",
    features: [
      "Web Audio clock scheduling",
      "Accented downbeats and selectable time signatures",
      "Tap tempo and keyboard shortcuts",
    ],
    alternateNames: ["BPM metronome", "Online BPM metronome"],
    keywords: [
      "online metronome",
      "free metronome",
      "metronome with tap tempo",
      "BPM metronome",
      "time signature metronome",
      "browser metronome",
    ],
  },
  "tap-tempo": {
    sectionId: "tap-tempo",
    slug: "tap-tempo",
    path: "/tap-tempo/",
    name: "Tap tempo BPM calculator",
    title: "auroLab | Tap tempo BPM calculator",
    description:
      "Find a song's tempo by tapping the beat. auroLab averages your taps, filters outliers, and supports half-time and double-time BPM. Free online.",
    features: [
      "Robust BPM averaging with outlier rejection",
      "Half-time and double-time conversion",
      "Optional visual and audio tap feedback",
    ],
    alternateNames: ["BPM tapper", "Tap BPM calculator"],
    keywords: [
      "tap tempo",
      "BPM tapper",
      "tap BPM calculator",
      "tempo finder",
      "song BPM tapper",
      "beats per minute calculator",
    ],
  },
  detector: {
    sectionId: "detector",
    slug: "bpm-key-detector",
    path: "/bpm-key-detector/",
    name: "BPM and key detector",
    title: "auroLab | Free BPM & key detector | Local audio analysis",
    description:
      "Detect BPM, musical key, confidence, alternatives, and Camelot code from audio. Analysis runs locally in your browser—your file is never uploaded.",
    features: [
      "Local BPM and musical key analysis",
      "Confidence scores and alternative results",
      "Camelot notation for harmonic mixing",
    ],
    alternateNames: ["Song BPM and key finder", "Music key detector"],
    keywords: [
      "BPM detector",
      "key detector",
      "song key finder",
      "audio BPM analyzer",
      "music key detector",
      "Camelot key detector",
      "local audio analysis",
    ],
  },
  camelot: {
    sectionId: "camelot",
    slug: "camelot-wheel",
    path: "/camelot-wheel/",
    name: "Interactive Camelot wheel",
    title: "auroLab | Interactive Camelot wheel for harmonic mixing",
    description:
      "Explore an interactive Camelot wheel: pick any key to see compatible codes for harmonic mixing, energy changes, and relative switches. Free online.",
    features: [
      "Interactive 24-key Camelot wheel",
      "Compatible-key suggestions with mixing roles",
      "Full Camelot-to-musical-key reference table",
    ],
    alternateNames: ["Harmonic mixing wheel", "DJ Camelot key wheel"],
    keywords: [
      "Camelot wheel",
      "harmonic mixing wheel",
      "Camelot key wheel",
      "DJ key compatibility",
      "harmonic mixing keys",
      "circle of fifths for DJs",
    ],
  },
  notefreq: {
    sectionId: "notefreq",
    slug: "note-frequency-midi",
    path: "/note-frequency-midi/",
    name: "Note frequency and MIDI converter",
    title: "auroLab | Note to frequency & MIDI converter",
    description:
      "Convert between note names, frequencies in Hz, and MIDI numbers with an adjustable A4 reference, cents offsets, and a per-octave chart. Free online.",
    features: [
      "Note, frequency, and MIDI conversion",
      "Adjustable A4 tuning reference",
      "Cents offset and per-octave frequency chart",
    ],
    alternateNames: ["Frequency to note converter", "MIDI note calculator"],
    keywords: [
      "note frequency calculator",
      "note to frequency",
      "frequency to note",
      "MIDI note converter",
      "Hz to note",
      "note frequency chart",
      "A4 tuning calculator",
    ],
  },
};

export const INDEXABLE_ROUTES = Object.values(SEO_ROUTES);

const LOWERCASE_TITLE_WORDS = new Set([
  "a",
  "al",
  "an",
  "and",
  "at",
  "by",
  "con",
  "de",
  "del",
  "el",
  "en",
  "for",
  "from",
  "in",
  "la",
  "las",
  "los",
  "o",
  "of",
  "on",
  "or",
  "para",
  "por",
  "the",
  "to",
  "un",
  "una",
  "with",
  "y",
]);

const TITLE_TOKEN_CASE = new Map([
  ["aurolab", SITE.name],
  ["bpm", "BPM"],
  ["hz", "Hz"],
  ["midi", "MIDI"],
  ["ms", "ms"],
]);

export function formatBrowserTitle(title) {
  return title.replace(/\p{L}[\p{L}\p{M}]*/gu, (word) => {
    const normalizedWord = word.toLocaleLowerCase();
    const fixedCase = TITLE_TOKEN_CASE.get(normalizedWord);

    if (fixedCase) return fixedCase;
    if (LOWERCASE_TITLE_WORDS.has(normalizedWord)) return normalizedWord;

    return `${word[0].toUpperCase()}${word.slice(1)}`;
  });
}

export function getSeoRoute(sectionId = "home") {
  return SEO_ROUTES[sectionId] || SEO_ROUTES.home;
}

/**
 * @param {string} sectionId
 * @param {string | URL} siteOrigin
 */
export function getCanonicalUrl(sectionId = "home", siteOrigin = SITE.defaultOrigin) {
  return new URL(getSeoRoute(sectionId).path, siteOrigin);
}

/**
 * @param {string} sectionId
 * @param {string | URL} siteOrigin
 */
export function buildStructuredData(sectionId = "home", siteOrigin = SITE.defaultOrigin) {
  const page = getSeoRoute(sectionId);
  const isHome = page.sectionId === "home";
  const canonicalUrl = getCanonicalUrl(sectionId, siteOrigin);
  const homeUrl = new URL("/", siteOrigin);
  const creatorId = new URL("/#creator", siteOrigin).href;
  const websiteId = new URL("/#website", siteOrigin).href;
  const primaryImageId = new URL("/#primary-image", siteOrigin).href;
  const primaryImageUrl = new URL(SITE.socialImage.path, siteOrigin).href;
  const applicationId = new URL(`${page.path}#application`, siteOrigin).href;
  const webpageId = new URL(`${page.path}#webpage`, siteOrigin).href;
  const toolListId = new URL("/#tool-list", siteOrigin).href;
  const breadcrumbId = new URL(`${page.path}#breadcrumb`, siteOrigin).href;

  const graph = [
    {
      "@type": "Person",
      "@id": creatorId,
      name: SITE.creator.name,
      url: SITE.creator.url,
      sameAs: SITE.creator.social,
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: SITE.name,
      alternateName: SITE.alternateNames,
      url: homeUrl.href,
      description: getSeoRoute("home").description,
      inLanguage: SITE.language,
      creator: { "@id": creatorId },
      publisher: { "@id": creatorId },
      image: { "@id": primaryImageId },
    },
    {
      "@type": "ImageObject",
      "@id": primaryImageId,
      url: primaryImageUrl,
      contentUrl: primaryImageUrl,
      width: SITE.socialImage.width,
      height: SITE.socialImage.height,
      caption: SITE.socialImage.alt,
      representativeOfPage: true,
    },
    {
      "@type": isHome ? "CollectionPage" : "WebPage",
      "@id": webpageId,
      url: canonicalUrl.href,
      name: page.title,
      description: page.description,
      keywords: page.keywords,
      inLanguage: SITE.language,
      isPartOf: { "@id": websiteId },
      primaryImageOfPage: { "@id": primaryImageId },
      thumbnailUrl: primaryImageUrl,
      mainEntity: { "@id": isHome ? toolListId : applicationId },
      ...(isHome ? {} : { breadcrumb: { "@id": breadcrumbId } }),
    },
  ];

  if (isHome) {
    graph.push({
      "@type": "ItemList",
      "@id": toolListId,
      name: page.name,
      numberOfItems: INDEXABLE_ROUTES.length - 1,
      itemListElement: INDEXABLE_ROUTES.filter((route) => route.sectionId !== "home").map(
        (route, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: route.name,
          url: new URL(route.path, siteOrigin).href,
        }),
      ),
    });
  } else {
    graph.push(
      {
        "@type": "WebApplication",
        "@id": applicationId,
        name: page.name,
        alternateName: page.alternateNames,
        url: canonicalUrl.href,
        description: page.description,
        keywords: page.keywords,
        inLanguage: SITE.language,
        applicationCategory: "MultimediaApplication",
        applicationSubCategory: "Music production",
        applicationSuite: SITE.name,
        operatingSystem: "Any",
        browserRequirements: "Requires a modern web browser; audio features use the Web Audio API.",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: page.features,
        creator: { "@id": creatorId },
        isPartOf: { "@id": websiteId },
        mainEntityOfPage: { "@id": webpageId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE.name,
            item: homeUrl.href,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.name,
            item: canonicalUrl.href,
          },
        ],
      },
    );
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function getSectionFromPath(pathname = "/") {
  const normalizedPath = `/${pathname
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "")}`;
  if (normalizedPath === "/") return "home";

  const slug = normalizedPath.split("/").filter(Boolean).at(-1);
  return INDEXABLE_ROUTES.find((route) => route.slug === slug)?.sectionId || "home";
}
