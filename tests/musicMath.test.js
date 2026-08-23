import assert from "node:assert/strict";
import test from "node:test";
import {
  NOTE_ROWS,
  beatMs,
  buildReverbRows,
  camelotCode,
  camelotRelations,
  frequencyToMidi,
  midiToFrequency,
  midiToNote,
  noteTiming,
  noteToMidi,
  tapTempoStats,
} from "../src/lib/musicMath.js";

test("converts tempo to beat and subdivision timings", () => {
  const eighthNote = NOTE_ROWS.find(({ label }) => label === "1/8");

  assert.equal(beatMs(120), 500);
  assert.equal(noteTiming(eighthNote, 120).ms, 250);
  assert.equal(noteTiming(eighthNote, 120, "dotted").ms, 375);
  assert.ok(Math.abs(noteTiming(eighthNote, 120, "triplet").ms - 166.67) < 0.01);
});

test("builds tempo-aligned reverb values", () => {
  const smallRoom = buildReverbRows(120).find(({ id }) => id === "smallRoom");

  assert.equal(smallRoom.total, 1000);
  assert.equal(smallRoom.preDelay, 15.625);
  assert.equal(smallRoom.decay, 984.375);
});

test("converts consistently between notes, MIDI, and frequency", () => {
  assert.equal(noteToMidi(9, 4), 69);
  assert.deepEqual(midiToNote(69), { pitchClass: 9, octave: 4 });
  assert.equal(midiToFrequency(69), 440);
  assert.ok(Math.abs(frequencyToMidi(440) - 69) < Number.EPSILON);
});

test("maps musical keys and compatible Camelot positions", () => {
  assert.equal(camelotCode(0, "major"), "8B");
  assert.deepEqual(
    camelotRelations(8, "B").map(({ id, code }) => [id, code]),
    [
      ["same", "8B"],
      ["up", "9B"],
      ["down", "7B"],
      ["relative", "8A"],
      ["boost", "10B"],
    ],
  );
});

test("estimates tap tempo while rejecting a long outlier", () => {
  const stats = tapTempoStats([0, 500, 1000, 1500, 2600, 3100, 3600]);

  assert.equal(stats.bpm, 120);
  assert.equal(stats.stability, 1);
});
