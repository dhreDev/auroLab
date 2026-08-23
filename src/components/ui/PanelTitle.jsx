export function PanelTitle({ eyebrow, title, description, titleId, isActive }) {
  const TitleTag = isActive ? "h1" : "h2";

  return (
    <header className="panel-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <TitleTag id={titleId}>{title}</TitleTag>
        <p>{description}</p>
      </div>
    </header>
  );
}
