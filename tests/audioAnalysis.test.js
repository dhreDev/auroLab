import assert from "node:assert/strict";
import test from "node:test";
import EssentiaPackage from "essentia.js";
import {
  analyzeWithEssentia,
  buildBpmResult,
  buildKeyResult,
  foldHpcpToChroma,
  refineTempoFromIntervals,
} from "../src/lib/essentiaAnalysisCore.js";

const SAMPLE_RATE = 44100;

function withEssentia(callback) {
  const essentia = new EssentiaPackage.Essentia(EssentiaPackage.EssentiaWASM);
  try {
    return callback(essentia);
  } finally {
    essentia.delete();
  }
}

function clickTrack(bpm, seconds = 10) {
  const samples = new Float32Array(SAMPLE_RATE * seconds);
  const samplesPerBeat = (SAMPLE_RATE * 60) / bpm;
  for (let start = 0; start < samples.length; start += samplesPerBeat) {
    for (let i = 0; i < 1200 && start + i < samples.length; i += 1) {
      const envelope = 1 - i / 1200;
      samples[Math.floor(start + i)] += envelope * Math.sin((2 * Math.PI * 100 * i) / SAMPLE_RATE);
    }
  }
  return samples;
}

function chord(notes, seconds = 7) {
  const samples = new Float32Array(SAMPLE_RATE * seconds);
  for (let i = 0; i < samples.length; i += 1) {
    const time = i / SAMPLE_RATE;
    for (const midi of notes) {
      const frequency = 440 * 2 ** ((midi - 69) / 12);
      samples[i] += Math.sin(2 * Math.PI * frequency * time) / notes.length;
    }
  }
  return samples;
}

function arrangedTrack(includeLead, bpm = 120, seconds = 12) {
  const samples = new Float32Array(SAMPLE_RATE * seconds);
  const progression = [
    [48, 52, 55],
    [43, 47, 50],
    [45, 48, 52],
    [41, 45, 48],
  ];
  const melody = [72, 76, 79, 76, 77, 76, 74, 72];
  const chordDuration = (60 * 4) / bpm;

  for (let i = 0; i < samples.length; i += 1) {
    const time = i / SAMPLE_RATE;
    const activeChord = progression[Math.floor(time / chordDuration) % progression.length];
    for (const midi of activeChord) {
      const frequency = 440 * 2 ** ((midi - 69) / 12);
      samples[i] += Math.sin(2 * Math.PI * frequency * time) * 0.12;
    }
    if (includeLead) {
      const midi = melody[Math.floor((time * bpm) / 60) % melody.length];
      const frequency = 440 * 2 ** ((midi - 69) / 12);
      samples[i] += Math.sin(2 * Math.PI * frequency * time) * 0.1;
    }
  }

  const samplesPerBeat = (SAMPLE_RATE * 60) / bpm;
  for (let start = 0; start < samples.length; start += samplesPerBeat) {
    for (let i = 0; i < 900 && start + i < samples.length; i += 1) {
      samples[Math.floor(start + i)] +=
        (1 - i / 900) * Math.sin((2 * Math.PI * 90 * i) / SAMPLE_RATE) * 0.45;
    }
  }
  return samples;
}

test("Essentia detects representative slow and medium tempos", () => {
  withEssentia((essentia) => {
    for (const expected of [72, 120]) {
      const result = analyzeWithEssentia(essentia, clickTrack(expected), SAMPLE_RATE);
      assert.ok(Math.abs(result.bpm.value - expected) <= 0.5);
      assert.ok(result.bpm.confidence > 0.5);
    }
  });
});

test("Essentia exposes double-time ambiguity instead of hiding it", () => {
  withEssentia((essentia) => {
    const result = analyzeWithEssentia(essentia, clickTrack(174), SAMPLE_RATE);
    const candidates = [result.bpm.value, ...result.bpm.alternatives];
    assert.ok(candidates.some((candidate) => Math.abs(candidate - 174) < 2));
  });
});

test("Essentia distinguishes representative major and minor harmony", () => {
  withEssentia((essentia) => {
    const cases = [
      { expected: [0, "major"], notes: [48, 52, 55, 60, 64, 67] },
      { expected: [6, "major"], notes: [54, 58, 61, 66, 70, 73] },
      { expected: [9, "minor"], notes: [45, 48, 52, 57, 60, 64] },
      { expected: [1, "minor"], notes: [49, 52, 56, 61, 64, 68] },
    ];
    for (const { expected, notes } of cases) {
      const result = analyzeWithEssentia(essentia, chord(notes), SAMPLE_RATE);
      assert.deepEqual([result.key.tonic, result.key.mode], expected);
    }
  });
});

test("instrumental and full-mix variants keep the same tempo and key", () => {
  withEssentia((essentia) => {
    for (const expectedBpm of [120, 150]) {
      const instrumental = analyzeWithEssentia(
        essentia,
        arrangedTrack(false, expectedBpm),
        SAMPLE_RATE,
      );
      const fullMix = analyzeWithEssentia(essentia, arrangedTrack(true, expectedBpm), SAMPLE_RATE);

      assert.equal(instrumental.bpm.value, expectedBpm);
      assert.equal(fullMix.bpm.value, expectedBpm);
      assert.deepEqual([instrumental.key.tonic, instrumental.key.mode], [0, "major"]);
      assert.deepEqual([fullMix.key.tonic, fullMix.key.mode], [0, "major"]);
    }
  });
});

test("invalid audio errors do not prevent a successful retry", () => {
  withEssentia((essentia) => {
    assert.throws(
      () => analyzeWithEssentia(essentia, new Float32Array(SAMPLE_RATE * 2), SAMPLE_RATE),
      /AUDIO_TOO_SHORT/,
    );
    assert.throws(
      () => analyzeWithEssentia(essentia, new Float32Array(SAMPLE_RATE * 5), SAMPLE_RATE),
      /AUDIO_IS_SILENT/,
    );

    const retry = analyzeWithEssentia(essentia, clickTrack(120), SAMPLE_RATE);
    assert.ok(Math.abs(retry.bpm.value - 120) <= 0.5);
  });
});

test("BPM confidence combines tracker strength and beat consistency", () => {
  const stable = buildBpmResult(120.04, 4, [120, 120.1, 119.9], [0.5, 0.5, 0.5]);
  const unstable = buildBpmResult(120.04, 0.2, [90, 120, 170], [0.4, 0.8, 0.55]);
  assert.equal(stable.value, 120);
  assert.ok(stable.confidence > unstable.confidence);
  assert.deepEqual(stable.alternatives, [60]);
});

test("beat-span refinement removes sub-BPM jitter without erasing fractional tempos", () => {
  const quantized150 = Array.from({ length: 44 }, (_, index) =>
    index % 11 < 5 ? 0.406349 : 0.394739,
  );
  const evidence = refineTempoFromIntervals(150.2, quantized150);
  const stabilized = buildBpmResult(150.2, 4, [], quantized150);
  const fractional = buildBpmResult(127.5, 4, [], new Array(24).fill(60 / 127.5));

  assert.ok(Math.abs(evidence.tempo - 150) < 0.2);
  assert.equal(stabilized.value, 150);
  assert.deepEqual(stabilized.alternatives, [75]);
  assert.equal(fractional.value, 127.5);
  assert.deepEqual(fractional.alternatives, [63.8]);
});

test("key consensus understands flats and reports measured alternatives", () => {
  const chroma = new Array(12).fill(0);
  chroma[8] = 1;
  const result = buildKeyResult(
    [
      { key: "Ab", scale: "minor", strength: 0.8, weight: 1 },
      { key: "G#", scale: "minor", strength: 0.7, weight: 1 },
      { key: "B", scale: "major", strength: 0.6, weight: 0.5 },
    ],
    chroma,
  );
  assert.deepEqual([result.tonic, result.mode, result.camelot], [8, "minor", "1A"]);
  assert.deepEqual(result.alternatives, [{ tonic: 11, mode: "major" }]);
});

test("HPCP bins are folded from Essentia's A origin to C-based chroma", () => {
  const hpcp = new Array(36).fill(0);
  hpcp[0] = 1;
  hpcp[9] = 2;
  const chroma = foldHpcpToChroma(hpcp);
  assert.equal(chroma[9], 1 / 3);
  assert.equal(chroma[0], 2 / 3);
});
