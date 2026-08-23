import { useMemo, useState } from "react";
import { Metric } from "../../components/ui/Metric";
import { NumberInput } from "../../components/ui/NumberInput";
import { PanelTitle } from "../../components/ui/PanelTitle";
import { ToolDocumentation } from "../../components/ui/ToolDocumentation";
import {
  NOTE_ROWS,
  beatMs,
  buildReverbRows,
  clampBpm,
  formatHz,
  formatMs,
  noteTiming,
} from "../../lib/musicMath";

const QUICK_TEMPOS = [72, 90, 100, 120, 128, 140, 174];

function TimingValue({ timing }) {
  return (
    <>
      <strong>{formatMs(timing.ms)}</strong>
      <span>{formatHz(timing.hz)}</span>
    </>
  );
}

export function DelayReverbTool({ copy, documentation, documentationLabels, isActive }) {
  const [bpm, setBpm] = useState(120);
  const reverbRows = useMemo(() => buildReverbRows(bpm), [bpm]);
  const oneBeat = beatMs(bpm);
  const smallRoom = reverbRows.find((row) => row.id === "smallRoom");

  return (
    <section
      id="delay-reverb"
      className="tool-panel app-view"
      hidden={!isActive}
      aria-labelledby="delay-reverb-title"
    >
      <PanelTitle
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        titleId="delay-reverb-title"
        isActive={isActive}
      />

      <p className="formula-note">
        <code>{copy.formula}</code> · <code>Hz = 1000 / ms</code> · {copy.dottedFormula} ·{" "}
        {copy.tripletFormula}
      </p>

      <div className="control-grid calculator-controls">
        <div className="field-block">
          <span>BPM</span>
          <NumberInput
            label="BPM"
            min={30}
            max={300}
            value={bpm}
            onChange={(value) => setBpm(clampBpm(value))}
          />
        </div>

        <label className="range-block">
          <span>{copy.tempo}</span>
          <input
            type="range"
            min="30"
            max="300"
            value={bpm}
            onChange={(event) => setBpm(clampBpm(event.target.value))}
          />
        </label>

        <div className="quick-row" aria-label={copy.quickTempos}>
          {QUICK_TEMPOS.map((tempo) => (
            <button
              key={tempo}
              type="button"
              onClick={() => setBpm(tempo)}
              className={tempo === bpm ? "is-active" : ""}
            >
              {tempo}
            </button>
          ))}
        </div>
      </div>

      <div className="metric-grid">
        <Metric label={copy.beat} value={formatMs(oneBeat)} />
        <Metric label={copy.bar} value={formatMs(oneBeat * 4)} />
        <Metric
          label={copy.dottedEighth}
          value={formatMs(noteTiming(NOTE_ROWS[3], bpm, "dotted").ms)}
        />
        <Metric
          label={copy.quarterTriplet}
          value={formatMs(noteTiming(NOTE_ROWS[2], bpm, "triplet").ms)}
        />
      </div>

      <div className="delay-reverb-tables">
        <div className="table-wrap" tabIndex="0" role="region" aria-label={copy.reverbTableLabel}>
          <h3>{copy.reverbTitle}</h3>
          <table>
            <thead>
              <tr>
                <th>{copy.columns.space}</th>
                <th>{copy.columns.reference}</th>
                <th>{copy.columns.preDelay}</th>
                <th>{copy.columns.decay}</th>
                <th>{copy.columns.total}</th>
              </tr>
            </thead>
            <tbody>
              {reverbRows.map((row) => (
                <tr key={row.id}>
                  <td data-label={copy.columns.space}>{copy.reverbs[row.id].name}</td>
                  <td data-label={copy.columns.reference}>{copy.reverbs[row.id].size}</td>
                  <td data-label={copy.columns.preDelay}>{formatMs(row.preDelay)}</td>
                  <td data-label={copy.columns.decay}>{formatMs(row.decay)}</td>
                  <td data-label={copy.columns.total}>{formatMs(row.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-wrap" tabIndex="0" role="region" aria-label={copy.delayTableLabel}>
          <h3>{copy.delayTitle}</h3>
          <table>
            <thead>
              <tr>
                <th>{copy.columns.note}</th>
                <th>{copy.columns.normal}</th>
                <th>{copy.columns.dotted}</th>
                <th>{copy.columns.triplet}</th>
              </tr>
            </thead>
            <tbody>
              {NOTE_ROWS.map((row) => (
                <tr key={row.label}>
                  <td data-label={copy.columns.note}>
                    <strong>{row.label}</strong>
                    <span>{copy.notes[row.label]}</span>
                  </td>
                  <td data-label={copy.columns.normal}>
                    <TimingValue timing={noteTiming(row, bpm)} />
                  </td>
                  <td data-label={copy.columns.dotted}>
                    <TimingValue timing={noteTiming(row, bpm, "dotted")} />
                  </td>
                  <td data-label={copy.columns.triplet}>
                    <TimingValue timing={noteTiming(row, bpm, "triplet")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToolDocumentation
        doc={documentation}
        labels={documentationLabels}
        liveExample={
          <section className="doc-live-card" aria-labelledby="delay-live-title">
            <div className="doc-live-copy">
              <p className="eyebrow">
                {documentationLabels.liveExample} · {bpm} BPM
              </p>
              <h3 id="delay-live-title">{documentation.liveTitle}</h3>
              <p>{documentation.liveDescription}</p>
            </div>
            <div className="doc-live-values">
              <Metric label={documentation.liveLabels.beat} value={formatMs(oneBeat)} />
              <Metric
                label={documentation.liveLabels.dotted}
                value={formatMs(noteTiming(NOTE_ROWS[3], bpm, "dotted").ms)}
              />
              <Metric
                label={documentation.liveLabels.preDelay}
                value={formatMs(smallRoom?.preDelay)}
              />
              <Metric label={documentation.liveLabels.decay} value={formatMs(smallRoom?.decay)} />
            </div>
          </section>
        }
      />
    </section>
  );
}
