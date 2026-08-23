import {
  faCompactDisc,
  faFileAudio,
  faGaugeHigh,
  faHouse,
  faMusic,
  faStopwatch,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import { SEO_ROUTES } from "../lib/seo";

export const NAVIGATION_ITEMS = [
  { id: "home", icon: faHouse, path: SEO_ROUTES.home.path },
  { id: "delay-reverb", icon: faWaveSquare, path: SEO_ROUTES["delay-reverb"].path },
  { id: "metronome", icon: faStopwatch, path: SEO_ROUTES.metronome.path },
  { id: "tap-tempo", icon: faGaugeHigh, path: SEO_ROUTES["tap-tempo"].path },
  { id: "detector", icon: faFileAudio, path: SEO_ROUTES.detector.path },
  { id: "camelot", icon: faCompactDisc, path: SEO_ROUTES.camelot.path },
  { id: "notefreq", icon: faMusic, path: SEO_ROUTES.notefreq.path },
];

export const SOCIAL_LINKS = [
  { name: "Web", handle: "dhreian.com", href: "https://dhreian.com", icon: "website" },
  { name: "X", handle: "@dhreian", href: "https://x.com/dhreian", icon: "x" },
  {
    name: "Instagram",
    handle: "@dhreian",
    href: "https://instagram.com/dhreian",
    icon: "instagram",
  },
  {
    name: "TikTok",
    handle: "@dhreian_",
    href: "https://www.tiktok.com/@dhreian_",
    icon: "tiktok",
  },
];
