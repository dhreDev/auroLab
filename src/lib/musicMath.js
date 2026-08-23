export const NOTE_ROWS = [
  { label: "1/1", beats: 4 },
  { label: "1/2", beats: 2 },
  { label: "1/4", beats: 1 },
  { label: "1/8", beats: 0.5 },
  { label: "1/16", beats: 0.25 },
  { label: "1/32", beats: 0.125 },
  { label: "1/64", beats: 0.0625 },
  { label: "1/128", beats: 0.03125 },
  { label: "1/256", beats: 0.015625 },
  { label: "1/512", beats: 0.0078125 },
];

const REVERB_PRESETS = [
  { id: "hall", totalBeats: 8, preDelayBeats: 0.125 },
  { id: "largeRoom", totalBeats: 4, preDelayBeats: 0.0625 },
  { id: "smallRoom", totalBeats: 2, preDelayBeats: 0.03125 },
  { id: "tightAmbience", totalBeats: 1, preDelayBeats: 0.0078125 },
];

export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const FLAT_NOTE_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const CAMELOT_MAJOR = {
  0: "8B",
  1: "3B",
  2: "10B",
  3: "5B",
  4: "12B",
  5: "7B",
  6: "2B",
  7: "9B",
  8: "4B",
  9: "11B",
  10: "6B",
  11: "1B",
};
const CAMELOT_MINOR = {
  0: "5A",
  1: "12A",
  2: "7A",
  3: "2A",
  4: "9A",
  5: "4A",
  6: "11A",
  7: "6A",
  8: "1A",
  9: "8A",
  10: "3A",
  11: "10A",
};

export function camelotCode(tonic, mode) {
  const pc = ((tonic % 12) + 12) % 12;
  return (mode === "minor" ? CAMELOT_MINOR : CAMELOT_MAJOR)[pc] || "";
}

function camelotTonic(table, code) {
  return Number(Object.keys(table).find((tonic) => table[tonic] === code));
}

export const CAMELOT_WHEEL = Array.from({ length: 12 }, (_, index) => {
  const number = index + 1;
  return {
    number,
    major: { code: `${number}B`, tonic: camelotTonic(CAMELOT_MAJOR, `${number}B`), mode: "major" },
    minor: { code: `${number}A`, tonic: camelotTonic(CAMELOT_MINOR, `${number}A`), mode: "minor" },
  };
});

function wrapCamelotNumber(value) {
  return ((((value - 1) % 12) + 12) % 12) + 1;
}

export function camelotEntry(number, letter) {
  const slice = CAMELOT_WHEEL[wrapCamelotNumber(number) - 1];
  return letter === "B" ? slice.major : slice.minor;
}

export function camelotRelations(number, letter) {
  const partnerLetter = letter === "A" ? "B" : "A";
  return [
    { id: "same", ...camelotEntry(number, letter) },
    { id: "up", ...camelotEntry(number + 1, letter) },
    { id: "down", ...camelotEntry(number - 1, letter) },
    { id: "relative", ...camelotEntry(number, partnerLetter) },
    { id: "boost", ...camelotEntry(number + 2, letter) },
  ];
}

export const A4_MIDI = 69;

export function clampA4(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) return 440;
  return Math.min(480, Math.max(400, Math.round(next)));
}

export function clampMidi(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) return A4_MIDI;
  return Math.min(127, Math.max(0, next));
}

export function midiToFrequency(midi, a4 = 440) {
  return a4 * 2 ** ((midi - A4_MIDI) / 12);
}

export function frequencyToMidi(frequency, a4 = 440) {
  return A4_MIDI + 12 * Math.log2(frequency / a4);
}

export function midiToNote(midi) {
  const rounded = Math.round(midi);
  return {
    pitchClass: ((rounded % 12) + 12) % 12,
    octave: Math.floor(rounded / 12) - 1,
  };
}

export function noteToMidi(pitchClass, octave) {
  return (octave + 1) * 12 + pitchClass;
}

export function clampBpm(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) return 120;
  return Math.min(300, Math.max(30, Math.round(next)));
}

export function beatMs(bpm) {
  return 60000 / clampBpm(bpm);
}

export function formatMs(value) {
  if (!Number.isFinite(value)) return "--";
  return `${formatRounded(value)} ms`;
}

export function formatHz(value) {
  if (!Number.isFinite(value) || value <= 0) return "--";
  return `${formatRounded(value)} Hz`;
}

function formatRounded(value) {
  return String(roundToHundredth(value));
}

export function roundToHundredth(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

const MODIFIER_FACTORS = { normal: 1, dotted: 1.5, triplet: 2 / 3 };

export function noteTiming(row, bpm, modifier = "normal") {
  const factor = MODIFIER_FACTORS[modifier] ?? 1;
  const ms = beatMs(bpm) * row.beats * factor;
  const roundedMs = roundToHundredth(ms);
  return { ms, hz: 1000 / roundedMs };
}

export function buildReverbRows(bpm) {
  const msPerBeat = beatMs(bpm);

  return REVERB_PRESETS.map((preset) => {
    const total = preset.totalBeats * msPerBeat;
    const preDelay = preset.preDelayBeats * msPerBeat;
    return {
      ...preset,
      preDelay,
      decay: Math.max(0, total - preDelay),
      total,
    };
  });
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function tapTempoStats(taps) {
  const empty = { bpm: 0, stability: 0 };
  if (!Array.isArray(taps) || taps.length < 2) return empty;

  const raw = [];
  for (let i = 1; i < taps.length; i += 1) {
    const delta = taps[i] - taps[i - 1];
    if (delta >= 180 && delta <= 2500) raw.push(delta);
  }
  if (!raw.length) return empty;

  const med = median(raw);
  const mad = median(raw.map((d) => Math.abs(d - med))) || 1;
  const cutoff = 3 * 1.4826 * mad;
  const inliers = raw.filter((d) => Math.abs(d - med) <= cutoff);
  const used = inliers.length ? inliers : raw;

  const mean = used.reduce((sum, d) => sum + d, 0) / used.length;
  if (mean <= 0) return empty;

  const variance = used.reduce((sum, d) => sum + (d - mean) ** 2, 0) / used.length;
  const cv = Math.sqrt(variance) / mean;

  return {
    bpm: 60000 / mean,
    stability: Math.max(0, Math.min(1, 1 - cv * 4)),
  };
}

export function averageTapBpm(taps) {
  return tapTempoStats(taps).bpm;
}
