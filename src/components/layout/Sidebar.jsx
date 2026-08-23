import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { SOCIAL_LINKS } from "../../config/navigation";
import { SEO_ROUTES } from "../../lib/seo";
import { Icon } from "../ui/Icon";
import { SocialIcon } from "../ui/SocialIcon";

export function Sidebar({
  activeSection,
  copy,
  language,
  onOpenSection,
  onToggleLanguage,
  sections,
}) {
  return (
    <aside className="side-panel" aria-label={copy.navigation}>
      <a
        className="brand-lockup"
        href={SEO_ROUTES.home.path}
        onClick={(event) => onOpenSection("home", event)}
      >
        <div>
          <span className="brand-name">auroLab</span>
          <p className="creator-credit">
            {copy.developedBy} <strong>dhreian</strong>
          </p>
        </div>
      </a>

      <nav className="tool-nav">
        {sections.map((section) => (
          <a
            key={section.id}
            className={`tool-nav-link${section.id === activeSection ? " is-active" : ""}`}
            href={section.path}
            onClick={(event) => onOpenSection(section.id, event)}
            aria-current={section.id === activeSection ? "page" : undefined}
            aria-label={section.label}
          >
            <Icon icon={section.icon} />
            <span>{section.label}</span>
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="language-toggle"
        onClick={onToggleLanguage}
        aria-label={copy.switchLanguage}
        title={copy.switchLanguage}
      >
        <Icon icon={faLanguage} />
        <span lang={language === "en" ? "es" : "en"}>{copy.languageCode}</span>
      </button>

      <nav className="social-links-list social-links" aria-label={copy.socialNavigation}>
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.name}
            className="social-link"
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${social.name}: ${social.handle}`}
            title={`${social.name}: ${social.handle}`}
          >
            <SocialIcon name={social.icon} />
          </a>
        ))}
      </nav>
    </aside>
  );
}
