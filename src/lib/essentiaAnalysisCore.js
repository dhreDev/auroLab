import { camelotCode } from "./musicMath.js";

const PROFILE_WEIGHTS = {
  bgate: 1,
  braw: 0.9,
  edma: 1,
  krumhansl: 1,
  shaath: 0.9,
  temperley: 0.85,
};
const NOTE_TO_TONIC = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

export function analyzeWithEssentia(essentia, samples, sampleRate, onProgress = () => {}) {
  if (sampleRate !== 44100) throw new Error("INVALID_ANALYSIS_SAMPLE_RATE");
  if (samples.length < sampleRate * 4) throw new Error("AUDIO_TOO_SHORT");
  if (signalRms(samples) < 0.0001) throw new Error("AUDIO_IS_SILENT");

  const signal = essentia.arrayToVector(samples);
  try {
    onProgress("analyzingTempo");
    const bpm = analyzeTempo(essentia, signal);
    onProgress("analyzingTuning");
    const tuningFrequency = analyzeTuning(essentia, signal);
    onProgress("analyzingKey");
    const key = analyzeTonality(essentia, signal, tuningFrequency);
    return { bpm, key, tuningFrequency: round(tuningFrequency, 2) };
  } finally {
    signal.delete();
  }
}

function analyzeTempo(essentia, signal) {
  const output = essentia.RhythmExtractor2013(signal, 208, "multifeature", 40);
  try {
    const estimates = vectorToArray(essentia, output.estimates);
    const intervals = vectorToArray(essentia, output.bpmIntervals);
    return buildBpmResult(output.bpm, output.confidence, estimates, intervals);
  } finally {
    deleteValues(output);
  }
}

function analyzeTuning(essentia, signal) {
  const output = essentia.TuningFrequencyExtractor(signal, 4096, 2048);
  try {
    const values = vectorToArray(essentia, output.tuningFrequency).filter(
      (value) => Number.isFinite(value) && value >= 400 && value <= 480,
    );
    return values.length ? median(values) : 440;
  } finally {
    deleteValues(output);
  }
}

function analyzeTonality(essentia, signal, tuningFrequency) {
  const tonal = essentia.TonalExtractor(signal, 4096, 2048, tuningFrequency);
  try {
    const frames = vectorVectorToArrays(essentia, tonal.hpcp);
    if (frames.length < 2) return emptyKey();
    const analyses = buildTonalSegments(frames);
    const candidates = [];

    for (const analysis of analyses) {
      const pcp = essentia.arrayToVector(analysis.hpcp);
      try {
        for (const [profile, profileWeight] of Object.entries(PROFILE_WEIGHTS)) {
          const result = essentia.Key(pcp, 4, 36, profile, 0.6, false, true, true);
          candidates.push({
            ...result,
            profile,
            weight: profileWeight * analysis.weight,
          });
        }
      } finally {
        pcp.delete();
      }
    }

    candidates.push({
      key: tonal.key_key,
      scale: tonal.key_scale,
      strength: tonal.key_strength,
      firstToSecondRelativeStrength: 0,
      profile: "tonal",
      weight: 0.75,
    });
    return buildKeyResult(candidates, foldHpcpToChroma(analyses[0].hpcp));
  } finally {
    deleteValues(tonal);
  }
}

function buildTonalSegments(frames) {
  const segments = [{ hpcp: robustFrameAverage(frames), weight: 2 }];
  if (frames.length < 24) return segments;
  const segmentLength = Math.floor(frames.length / 3);
  for (let segment = 0; segment < 3; segment += 1) {
    const start = segment * segmentLength;
    const end = segment === 2 ? frames.length : start + segmentLength;
    segments.push({ hpcp: robustFrameAverage(frames.slice(start, end)), weight: 0.5 });
  }
  return segments;
}

export function buildBpmResult(bpm, rawConfidence, estimates = [], intervals = []) {
  if (!Number.isFinite(bpm) || bpm <= 0) {
    return { value: null, confidence: 0, alternatives: [] };
  }

  const validEstimates = estimates.filter((estimate) => Number.isFinite(estimate) && estimate > 0);
  const center = validEstimates.length ? median(validEstimates) : bpm;
  const deviations = validEstimates.map((estimate) => Math.abs(estimate - center));
  const consistency = validEstimates.length
    ? clamp01(1 - (median(deviations) / Math.max(center, 1)) * 24)
    : 0.35;
  const intervalEvidence = refineTempoFromIntervals(bpm, intervals);
  const refinedBpm = intervalEvidence.tempo || bpm;
  const value = stabilizeTempo(refinedBpm, intervalEvidence);
  const intervalConsistency = intervalEvidence.count ? intervalEvidence.consistency : consistency;
  const trackerConfidence = clamp01(1 - Math.exp(-Math.max(0, rawConfidence) / 2));
  const confidence = clamp01(
    trackerConfidence * 0.55 + consistency * 0.25 + intervalConsistency * 0.2,
  );

  const clusters = clusterTempos(validEstimates);
  const alternatives = [];
  const addAlternative = (tempo) => {
    const rounded = round(tempo, 1);
    if (rounded < 40 || rounded > 208 || Math.abs(rounded - value) <= 4) return;
    if (!alternatives.some((candidate) => Math.abs(candidate - rounded) <= 2)) {
      alternatives.push(rounded);
    }
  };
  addAlternative(value / 2);
  addAlternative(value * 2);
  clusters.forEach(({ tempo }) => addAlternative(tempo));

  return { value, confidence, alternatives: alternatives.slice(0, 3) };
}

export function refineTempoFromIntervals(referenceBpm, intervals) {
  if (!Number.isFinite(referenceBpm) || referenceBpm <= 0) {
    return { tempo: null, consistency: 0, count: 0 };
  }

  const expectedPeriod = 60 / referenceBpm;
  const candidates = intervals
    .filter((interval) => Number.isFinite(interval) && interval > 0)
    .map((interval) => {
      const beats = Math.min(8, Math.max(1, Math.round(interval / expectedPeriod)));
      return { beats, interval, period: interval / beats };
    })
    .filter(({ period }) => Math.abs(60 / period - referenceBpm) / referenceBpm <= 0.12);

  if (candidates.length < 4) {
    return { tempo: null, consistency: 0, count: candidates.length };
  }

  const center = median(candidates.map(({ period }) => period));
  const stable = candidates.filter(({ period }) => Math.abs(period - center) / center <= 0.12);
  const totalDuration = stable.reduce((sum, { interval }) => sum + interval, 0);
  const totalBeats = stable.reduce((sum, { beats }) => sum + beats, 0);
  const periods = stable.map(({ period }) => period);

  return {
    tempo: totalDuration > 0 ? (60 * totalBeats) / totalDuration : null,
    consistency: periods.length ? clamp01(1 - coefficientOfVariation(periods) * 5) : 0,
    count: stable.length,
  };
}

function stabilizeTempo(tempo, evidence) {
  const nearestInteger = Math.round(tempo);
  const hasStableBeatSpan = evidence.count >= 8 && evidence.consistency >= 0.75;
  if (hasStableBeatSpan && Math.abs(tempo - nearestInteger) <= 0.25) {
    return nearestInteger;
  }
  return round(tempo, 1);
}

export function buildKeyResult(results, chroma) {
  const votes = new Map();
  let totalWeight = 0;

  for (const result of results) {
    const tonic = NOTE_TO_TONIC[result.key];
    const mode = normalizeMode(result.scale);
    if (tonic == null || !mode) continue;
    const strength = clamp01(Number(result.strength) || 0);
    const weight = Math.max(0, Number(result.weight) || 0) * (0.5 + strength * 0.5);
    const id = `${tonic}:${mode}`;
    const current = votes.get(id) || {
      tonic,
      mode,
      score: 0,
      sourceWeight: 0,
      strengthTotal: 0,
      separationTotal: 0,
    };
    current.score += weight;
    current.sourceWeight += Number(result.weight) || 0;
    current.strengthTotal += strength * weight;
    current.separationTotal += clamp01(Number(result.firstToSecondRelativeStrength) || 0) * weight;
    votes.set(id, current);
    totalWeight += Number(result.weight) || 0;
  }

  const ranked = [...votes.values()].sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best) return emptyKey(chroma);
  const runnerUp = ranked[1];
  const agreement = best.sourceWeight / Math.max(totalWeight, 0.0001);
  const strength = best.strengthTotal / Math.max(best.score, 0.0001);
  const separation = best.separationTotal / Math.max(best.score, 0.0001);
  const voteMargin = (best.score - (runnerUp?.score || 0)) / Math.max(best.score, 0.0001);
  const peak = chroma.reduce(
    (maxIndex, value, index, values) => (value > values[maxIndex] ? index : maxIndex),
    0,
  );

  return {
    tonic: best.tonic,
    mode: best.mode,
    camelot: camelotCode(best.tonic, best.mode),
    peak,
    confidence: clamp01(agreement * 0.45 + strength * 0.25 + separation * 0.15 + voteMargin * 0.15),
    chroma,
    alternatives: ranked.slice(1, 4).map(({ tonic, mode }) => ({ tonic, mode })),
  };
}

function emptyKey(chroma = new Array(12).fill(0)) {
  return {
    tonic: null,
    mode: null,
    camelot: "",
    peak: 0,
    confidence: 0,
    chroma,
    alternatives: [],
  };
}

function robustFrameAverage(frames) {
  const dimensions = frames[0]?.length || 36;
  const output = new Float32Array(dimensions);
  for (let bin = 0; bin < dimensions; bin += 1) {
    const values = frames.map((frame) => frame[bin] || 0).sort((a, b) => a - b);
    const trim = values.length >= 10 ? Math.floor(values.length * 0.1) : 0;
    const retained = values.slice(trim, values.length - trim || values.length);
    output[bin] = retained.reduce((sum, value) => sum + value, 0) / Math.max(1, retained.length);
  }
  return output;
}

export function foldHpcpToChroma(hpcp) {
  const chroma = new Array(12).fill(0);
  const binsPerSemitone = hpcp.length / 12;
  for (let bin = 0; bin < hpcp.length; bin += 1) {
    const essentiaPitchClass = Math.round(bin / binsPerSemitone) % 12;
    const cBasedPitchClass = (essentiaPitchClass + 9) % 12;
    chroma[cBasedPitchClass] += Math.max(0, hpcp[bin]);
  }
  const total = chroma.reduce((sum, value) => sum + value, 0) || 1;
  return chroma.map((value) => value / total);
}

function vectorVectorToArrays(essentia, vector) {
  const output = [];
  for (let i = 0; i < vector.size(); i += 1) {
    const frame = vector.get(i);
    try {
      output.push(Array.from(essentia.vectorToArray(frame)));
    } finally {
      frame.delete?.();
    }
  }
  return output;
}

function vectorToArray(essentia, vector) {
  return vector?.size ? Array.from(essentia.vectorToArray(vector)) : [];
}

function deleteValues(output) {
  for (const value of Object.values(output)) value?.delete?.();
}

function clusterTempos(values) {
  const counts = new Map();
  for (const value of values) {
    const tempo = Math.round(value);
    counts.set(tempo, (counts.get(tempo) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([tempo, count]) => ({ tempo, count }))
    .sort((a, b) => b.count - a.count);
}

function normalizeMode(scale) {
  const normalized = String(scale || "").toLowerCase();
  if (normalized === "major" || normalized === "minor") return normalized;
  return null;
}

function coefficientOfVariation(values) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance) / Math.max(mean, 0.0001);
}

function signalRms(samples) {
  const stride = Math.max(1, Math.floor(samples.length / 200000));
  let sum = 0;
  let count = 0;
  for (let i = 0; i < samples.length; i += stride) {
    sum += samples[i] ** 2;
    count += 1;
  }
  return Math.sqrt(sum / Math.max(1, count));
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}
