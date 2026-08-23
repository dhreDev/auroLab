import { useState } from "react";
import { CustomSelect } from "../../components/ui/CustomSelect";
import { Metric } from "../../components/ui/Metric";
import { NumberInput } from "../../components/ui/NumberInput";
import { PanelTitle } from "../../components/ui/PanelTitle";
import { ToolDocumentation } from "../../components/ui/ToolDocumentation";
import {
  A4_MIDI,
  NOTE_NAMES,
  clampA4,
  clampMidi,
  formatHz,
  formatMs,
  frequencyToMidi,
  midiToFrequency,
  midiToNote,
  noteToMidi,
  roundToHundredth,
} from "../../lib/musicMath";

const QUICK_REFERENCES = [415, 432, 440, 442, 444];
const OCTAVE_OPTIONS = Array.from({ length: 9 }, (_, value) => ({
  value,
  label: String(value),
}));
const NOTE_OPTIONS = NOTE_NAMES.map((name, value) => ({ value, label: name }));

export function NoteFrequencyTool({ copy, documentation, documentationLabels, isActive }) {
  const [a4, setA4] = useState(440);
  const [midiValue, setMidiValue] = useState(A4_MIDI);
  const [frequencyInput, setFrequencyInput] = useState("440");

  const nearestMidi = Math.round(midiValue);
  const { pitchClass, octave } = midiToNote(midiValue);
  const frequency = midiToFrequency(midiValue, a4);
  const cents = (midiValue - nearestMidi) * 100;
  const tableOctave = Math.min(8, Math.max(0, octave));

  const syncFrequencyInput = (midi, reference) => {
    setFrequencyInput(String(roundToHundredth(midiToFrequency(midi, reference))));
  };

  const setFromMidi = (nextMidi) => {
    const next = clampMidi(nextMidi);
    setMidiValue(next);
    syncFrequencyInput(next, a4);
  };

  const setFromFrequency = (rawValue) => {
    setFrequencyInput(String(rawValue));
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    setMidiValue(clampMidi(frequencyToMidi(parsed, a4)));
  };

  const setReference = (rawValue) => {
    const next = clampA4(rawValue);
    setA4(next);
    syncFrequencyInput(midiValue, next);
  };

  const centsLabel =
    Math.abs(cents) < 0.05 ? "0.0" : `${cents > 0 ? "+" : "−"}${Math.abs(cents).toFixed(1)}`;

  return (
    <section
      id="notefreq"
      className="tool-panel app-view"
      hidden={!isActive}
      aria-labelledby="note-frequency-title"
    >
      <PanelTitle
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        titleId="note-frequency-title"
        isActive={isActive}
      />

      <p className="formula-note">
        <code>{copy.formula}</code> · <code>{copy.formulaInverse}</code>
      </p>

      <div className="control-grid calculator-controls">
        <div className="field-block">
          <span>{copy.reference}</span>
          <NumberInput
            label={copy.reference}
            min={400}
            max={480}
            value={a4}
            onChange={setReference}
          />
        </div>

        <label className="range-block">
          <span>{`${copy.reference} · ${a4} Hz`}</span>
          <input
            type="range"
            min="400"
            max="480"
            value={a4}
            onChange={(event) => setReference(event.target.value)}
          />
        </label>

        <div className="quick-row" aria-label={copy.quickReferences}>
          {QUICK_REFERENCES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setReference(value)}
              className={value === a4 ? "is-active" : ""}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="control-grid">
        <div className="field-block">
          <span>{copy.note}</span>
          <CustomSelect
            value={pitchClass}
            options={NOTE_OPTIONS}
            onChange={(value) => setFromMidi(noteToMidi(value, tableOctave))}
            label={copy.note}
          />
        </div>
        <div className="field-block">
          <span>{copy.octave}</span>
          <CustomSelect
            value={tableOctave}
            options={OCTAVE_OPTIONS}
            onChange={(value) => setFromMidi(noteToMidi(pitchClass, value))}
            label={copy.octave}
          />
        </div>
        <div className="field-block">
          <span>{copy.frequency}</span>
          <NumberInput
            label={copy.frequency}
            min={8}
            max={13000}
            value={frequencyInput}
            onChange={setFromFrequency}
          />
        </div>
        <div className="field-block">
          <span>{copy.midi}</span>
          <NumberInput
            label={copy.midi}
            min={0}
            max={127}
            value={nearestMidi}
            onChange={(value) => setFromMidi(Math.round(Number(value)))}
          />
        </div>
      </div>

      <div className="metric-grid">
        <Metric label={copy.metrics.note} value={`${NOTE_NAMES[pitchClass]}${octave}`} />
        <Metric label={copy.metrics.cents} value={centsLabel} />
        <Metric label={copy.metrics.period} value={formatMs(1000 / frequency)} />
        <Metric label={copy.metrics.wavelength} value={`${roundToHundredth(343 / frequency)} m`} />
      </div>

      <div className="table-stack">
        <div className="table-wrap" tabIndex="0" role="region" aria-label={copy.tableLabel}>
          <h3>{copy.tableTitle}</h3>
          <table>
            <thead>
              <tr>
                <th>{copy.columns.note}</th>
                <th>{copy.columns.midi}</th>
                <th>{copy.columns.frequency}</th>
                <th>{copy.columns.period}</th>
              </tr>
            </thead>
            <tbody>
              {NOTE_NAMES.map((name, index) => {
                const rowMidi = noteToMidi(index, tableOctave);
                const rowFrequency = midiToFrequency(rowMidi, a4);

                return (
                  <tr key={name} className={rowMidi === nearestMidi ? "is-current" : undefined}>
                    <td data-label={copy.columns.note}>
                      <strong>{`${name}${tableOctave}`}</strong>
                    </td>
                    <td data-label={copy.columns.midi}>{rowMidi}</td>
                    <td data-label={copy.columns.frequency}>{formatHz(rowFrequency)}</td>
                    <td data-label={copy.columns.period}>{formatMs(1000 / rowFrequency)}</td>
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
