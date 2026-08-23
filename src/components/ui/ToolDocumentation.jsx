export function ToolDocumentation({ doc, labels, liveExample = null }) {
  const titleId = `${doc.slug}-guide-title`;
  const quickStartId = `${doc.slug}-quick-start-title`;
  const notesId = `${doc.slug}-field-notes-title`;

  return (
    <article className="tool-docs" aria-labelledby={titleId}>
      <header className="docs-hero">
        <div className="docs-hero-copy">
          <p className="eyebrow">{doc.eyebrow}</p>
          <h2 id={titleId}>{doc.title}</h2>
          <p>{doc.intro}</p>
        </div>

        <aside className="docs-contents" aria-label={labels.contents}>
          <span>{labels.contents}</span>
          <ol>
            {doc.chapters.map((chapter, index) => (
              <li key={chapter.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {chapter.title}
              </li>
            ))}
          </ol>
        </aside>
      </header>

      <section className="docs-quickstart" aria-labelledby={quickStartId}>
        <div className="docs-section-heading">
          <p className="eyebrow">{labels.quickStartEyebrow}</p>
          <h3 id={quickStartId}>{labels.quickStart}</h3>
        </div>
        <ol className="docs-steps">
          {doc.quickStart.map((step, index) => (
            <li key={step.title}>
              <span className="docs-step-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {liveExample}

      <div className="docs-chapter-grid">
        {doc.chapters.map((chapter, index) => (
          <section className="docs-chapter" key={chapter.title}>
            <div className="docs-chapter-topline">
              <p className="eyebrow">{chapter.kicker}</p>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3>{chapter.title}</h3>
            {chapter.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {chapter.formula && <code className="docs-formula">{chapter.formula}</code>}
            {chapter.bullets && (
              <ul>
                {chapter.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <section className="docs-field-notes" aria-labelledby={notesId}>
        <div className="docs-section-heading">
          <p className="eyebrow">{labels.fieldNotesEyebrow}</p>
          <h3 id={notesId}>{labels.fieldNotes}</h3>
        </div>
        <div className="docs-note-grid">
          {doc.fieldNotes.map((note) => (
            <div key={note.label}>
              <strong>{note.label}</strong>
              <p>{note.text}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
