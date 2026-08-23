import { useCallback, useMemo, useState } from "react";
import { CustomSelect } from "../../components/ui/CustomSelect";
import { PanelTitle } from "../../components/ui/PanelTitle";
import { ToolDocumentation } from "../../components/ui/ToolDocumentation";
import {
  CAMELOT_WHEEL,
  FLAT_NOTE_NAMES,
  NOTE_NAMES,
  camelotEntry,
  camelotRelations,
} from "../../lib/musicMath";

const WHEEL_CENTER = 210;
const WHEEL_RINGS = {
  B: { outer: 204, inner: 148, label: 176 },
  A: { outer: 144, inner: 88, label: 116 },
};

function polarPoint(radius, degrees) {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: Math.round((WHEEL_CENTER + radius * Math.cos(radians)) * 100) / 100,
    y: Math.round((WHEEL_CENTER + radius * Math.sin(radians)) * 100) / 100,
  };
}

function annularSectorPath(outerRadius, innerRadius, startDegrees, endDegrees) {
  const point = (radius, degrees) => {
    const { x, y } = polarPoint(radius, degrees);
    return `${x} ${y}`;
  };

  return [
    `M ${point(outerRadius, startDegrees)}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${point(outerRadius, endDegrees)}`,
    `L ${point(innerRadius, endDegrees)}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${point(innerRadius, startDegrees)}`,
    "Z",
  ].join(" ");
}

function parseCamelotCode(code) {
  const match = /^(\d+)([AB])$/.exec(code);
  return match ? { number: Number(match[1]), letter: match[2] } : null;
}

export function CamelotTool({ copy, documentation, documentationLabels, isActive }) {
  const [selected, setSelected] = useState({ number: 8, letter: "A" });
  const [useFlats, setUseFlats] = useState(false);
  const noteNames = useFlats ? FLAT_NOTE_NAMES : NOTE_NAMES;
  const keyName = useCallback(
    (entry) => `${noteNames[entry.tonic]} ${copy.modes[entry.mode]}`,
    [noteNames, copy],
  );

  const selectedEntry = camelotEntry(selected.number, selected.letter);
  const relations = camelotRelations(selected.number, selected.letter);
  const relationByCode = useMemo(() => {
    const map = new Map();
    relations.forEach((relation) => {
      if (relation.id !== "same" && !map.has(relation.code)) map.set(relation.code, relation.id);
    });
    return map;
  }, [relations]);

  const selectCode = (code) => {
    const parsed = parseCamelotCode(code);
    if (parsed) setSelected(parsed);
  };

  const keyOptions = useMemo(
    () =>
      CAMELOT_WHEEL.flatMap((slice) => [slice.minor, slice.major]).map((entry) => ({
        value: entry.code,
        label: `${entry.code} · ${keyName(entry)}`,
      })),
    [keyName],
  );

  return (
    <section
      id="camelot"
      className="tool-panel app-view"
      hidden={!isActive}
      aria-labelledby="camelot-wheel-title"
    >
      <PanelTitle
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        titleId="camelot-wheel-title"
        isActive={isActive}
      />

      <p className="formula-note">
        <code>{copy.formula}</code> · {copy.formulaNote}
      </p>

      <div className="control-grid camelot-controls">
        <div className="field-block">
          <span>{copy.keySelectLabel}</span>
          <CustomSelect
            value={selectedEntry.code}
            options={keyOptions}
            onChange={selectCode}
            label={copy.keySelectLabel}
          />
        </div>
        <label className="toggle-pill">
          <input
            type="checkbox"
            checked={useFlats}
            onChange={(event) => setUseFlats(event.target.checked)}
          />
          {copy.notation}
        </label>
      </div>

      <div className="camelot-layout">
        <div className="camelot-wheel-wrap">
          <svg
            className="camelot-wheel"
            viewBox="0 0 420 420"
            role="group"
            aria-label={copy.wheelLabel}
          >
            {CAMELOT_WHEEL.map((slice) =>
              ["B", "A"].map((letter) => {
                const entry = letter === "B" ? slice.major : slice.minor;
                const ring = WHEEL_RINGS[letter];
                const centerDegrees = slice.number * 30 - 90;
                const label = polarPoint(ring.label, centerDegrees);
                const isSelected = entry.code === selectedEntry.code;
                const relationId = relationByCode.get(entry.code);
                const stateClass = isSelected
                  ? " is-selected"
                  : relationId === "boost"
                    ? " is-boost"
                    : relationId
                      ? " is-compatible"
                      : "";
                const shortName =
                  letter === "B" ? noteNames[entry.tonic] : `${noteNames[entry.tonic]}m`;

                return (
                  <g
                    key={entry.code}
                    className={`camelot-seg${letter === "A" ? " camelot-seg-inner" : ""}${stateClass}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${entry.code} · ${keyName(entry)}`}
                    aria-pressed={isSelected}
                    onClick={() => selectCode(entry.code)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectCode(entry.code);
                      }
                    }}
                  >
                    <path
                      className="camelot-seg-shape"
                      d={annularSectorPath(
                        ring.outer,
                        ring.inner,
                        centerDegrees - 15,
                        centerDegrees + 15,
                      )}
                    />
                    <text
                      className="camelot-seg-code"
                      x={label.x}
                      y={label.y - 2}
                      textAnchor="middle"
                    >
                      {entry.code}
                    </text>
                    <text
                      className="camelot-seg-name"
                      x={label.x}
                      y={label.y + 13}
                      textAnchor="middle"
                    >
                      {shortName}
                    </text>
                  </g>
                );
              }),
            )}
            <circle className="camelot-hub" cx={WHEEL_CENTER} cy={WHEEL_CENTER} r="76" />
            <text className="camelot-hub-code" x={WHEEL_CENTER} y="205" textAnchor="middle">
              {selectedEntry.code}
            </text>
            <text className="camelot-hub-name" x={WHEEL_CENTER} y="230" textAnchor="middle">
              {keyName(selectedEntry)}
            </text>
          </svg>
        </div>

        <aside className="camelot-detail">
          <div className="key-badge">
            <span className="camelot-chip">{selectedEntry.code}</span>
            <div>
              <strong>{keyName(selectedEntry)}</strong>
              <span>{copy.selectedKey}</span>
            </div>
          </div>

          <h3 className="camelot-subtitle">{copy.compatibleTitle}</h3>
          <div className="camelot-relations">
            {relations.map((relation) => (
              <button
                key={relation.id}
                type="button"
                className="camelot-relation"
                onClick={() => selectCode(relation.code)}
              >
                <span className="camelot-chip camelot-chip-sm">{relation.code}</span>
                <span className="camelot-relation-copy">
                  <strong>{keyName(relation)}</strong>
                  <span>
                    {copy.relationships[relation.id].name} ·{" "}
                    {copy.relationships[relation.id].detail}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <div className="table-stack">
        <div className="table-wrap" tabIndex="0" role="region" aria-label={copy.tableLabel}>
          <h3>{copy.tableTitle}</h3>
          <table>
            <thead>
              <tr>
                <th>{copy.columns.code}</th>
                <th>{copy.columns.key}</th>
                <th>{copy.columns.relative}</th>
                <th>{copy.columns.up}</th>
                <th>{copy.columns.down}</th>
              </tr>
            </thead>
            <tbody>
              {CAMELOT_WHEEL.flatMap((slice) => [slice.minor, slice.major]).map((entry) => {
                const parsed = parseCamelotCode(entry.code);
                const relative = camelotEntry(parsed.number, parsed.letter === "A" ? "B" : "A");
                const up = camelotEntry(parsed.number + 1, parsed.letter);
                const down = camelotEntry(parsed.number - 1, parsed.letter);

                return (
                  <tr
                    key={entry.code}
                    className={entry.code === selectedEntry.code ? "is-current" : undefined}
                  >
                    <td data-label={copy.columns.code}>
                      <strong>{entry.code}</strong>
                    </td>
                    <td data-label={copy.columns.key}>{keyName(entry)}</td>
                    <td
                      data-label={copy.columns.relative}
                    >{`${relative.code} · ${keyName(relative)}`}</td>
                    <td data-label={copy.columns.up}>{`${up.code} · ${keyName(up)}`}</td>
                    <td data-label={copy.columns.down}>{`${down.code} · ${keyName(down)}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ToolDocumentation doc={documentation} labels={documentationLabels} />
    </section>
  );
}
