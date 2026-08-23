import { Icon } from "../../components/ui/Icon";

export function HomeSection({ isActive, onOpenSection, sections, copy }) {
  const tools = sections.filter((section) => section.id !== "home");

  return (
    <section
      id="home"
      className="home-view app-view"
      hidden={!isActive}
      aria-labelledby="home-title"
    >
      <div className="home-hero">
        <div className="home-copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 id="home-title">{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
      </div>

      <div id="home-tools" className="home-tools">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.toolsEyebrow}</p>
            <h2>{copy.toolsTitle}</h2>
          </div>
        </div>

        <div className="tool-card-grid">
          {tools.map((tool, index) => (
            <a
              key={tool.id}
              className="tool-card"
              href={tool.path}
              onClick={(event) => onOpenSection(tool.id, event)}
            >
              <span className="tool-card-topline">
                <span className="tool-card-icon">
                  <Icon icon={tool.icon} />
                </span>
                <span className="tool-card-number">{String(index + 1).padStart(2, "0")}</span>
              </span>
              <span className="tool-card-kicker">{tool.eyebrow}</span>
              <strong>{tool.title}</strong>
              <p>{tool.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
