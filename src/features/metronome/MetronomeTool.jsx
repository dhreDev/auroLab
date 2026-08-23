import { useCallback, useEffect, useRef, useState } from "react";
import { faPause, faPlay, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { CustomSelect } from "../../components/ui/CustomSelect";
import { Icon } from "../../components/ui/Icon";
import { NumberInput } from "../../components/ui/NumberInput";
import { PanelTitle } from "../../components/ui/PanelTitle";
import { ToolDocumentation } from "../../components/ui/ToolDocumentation";
import { averageTapBpm, clampBpm } from "../../lib/musicMath";
import { browserNow, getAudioContextClass, resumeAudioContext } from "../../lib/webAudio";

const BEAT_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 12].map((value) => ({
  value,
  label: `${value}/4`,
}));

export function MetronomeTool({
  audioSupported,
  copy,
  documentation,
  documentationLabels,
  isActive,
}) {
  const [bpm, setBpm] = useState(120);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [volume, setVolume] = useState(0.75);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState(-1);
  const [audioMessage, setAudioMessage] = useState(false);
  const audioContextRef = useRef(null);
  const timerRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const nextVisualBeatRef = useRef(0);
  const beatIndexRef = useRef(0);
  const playModeRef = useRef("visual");
  const playTokenRef = useRef(0);
  const bpmRef = useRef(bpm);
  const beatsPerBarRef = useRef(beatsPerBar);
  const volumeRef = useRef(volume);
  const tapHistoryRef = useRef([]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    beatsPerBarRef.current = beatsPerBar;
  }, [beatsPerBar]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const ensureAudioContext = useCallback(async () => {
    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) return null;

    try {
      if (!audioContextRef.current) audioContextRef.current = new AudioContextClass();
      return await resumeAudioContext(audioContextRef.current);
    } catch {
      return null;
    }
  }, []);

  const scheduleVisualBeat = useCallback((delayMs, beat) => {
    const playToken = playTokenRef.current;
    window.setTimeout(
      () => {
        if (playTokenRef.current === playToken) setActiveBeat(beat);
      },
      Math.max(0, delayMs),
    );
  }, []);

  const scheduleClick = useCallback(
    (time, beat) => {
      const context = audioContextRef.current;
      if (!context) return;

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const accent = beat === 0;

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(accent ? 1180 : 820, time);
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volumeRef.current), time + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(time);
      oscillator.stop(time + 0.065);

      scheduleVisualBeat((time - context.currentTime) * 1000, beat);
    },
    [scheduleVisualBeat],
  );

  // Schedule slightly ahead so UI work does not interrupt the audio clock.
  const scheduler = useCallback(() => {
    if (playModeRef.current === "audio") {
      const context = audioContextRef.current;
      if (!context) return;

      while (nextNoteTimeRef.current < context.currentTime + 0.12) {
        const beat = beatIndexRef.current;
        scheduleClick(nextNoteTimeRef.current, beat);
        nextNoteTimeRef.current += 60 / bpmRef.current;
        beatIndexRef.current = (beat + 1) % beatsPerBarRef.current;
      }
      return;
    }

    const now = browserNow();
    while (nextVisualBeatRef.current < now + 120) {
      const beat = beatIndexRef.current;
      scheduleVisualBeat(nextVisualBeatRef.current - now, beat);
      nextVisualBeatRef.current += (60 / bpmRef.current) * 1000;
      beatIndexRef.current = (beat + 1) % beatsPerBarRef.current;
    }
  }, [scheduleClick, scheduleVisualBeat]);

  const stop = useCallback(() => {
    playTokenRef.current += 1;
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setActiveBeat(-1);
  }, []);

  const start = useCallback(() => {
    if (timerRef.current) return;

    playTokenRef.current += 1;
    const startToken = playTokenRef.current;
    beatIndexRef.current = 0;
    playModeRef.current = "visual";
    nextVisualBeatRef.current = browserNow() + 60;
    setIsPlaying(true);
    setAudioMessage(audioSupported === false);
    scheduler();
    timerRef.current = window.setInterval(scheduler, 25);

    ensureAudioContext()
      .then((context) => {
        if (playTokenRef.current !== startToken || !timerRef.current) return;
        if (!context) {
          setAudioMessage(true);
          return;
        }

        playModeRef.current = "audio";
        nextNoteTimeRef.current = context.currentTime + 0.06;
        setAudioMessage(false);
      })
      .catch(() => {
        if (playTokenRef.current === startToken && timerRef.current) setAudioMessage(true);
      });
  }, [audioSupported, ensureAudioContext, scheduler]);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else start();
  }, [isPlaying, start, stop]);

  useEffect(() => {
    if (!isActive) stop();
  }, [isActive, stop]);

  useEffect(
    () => () => {
      stop();
      void audioContextRef.current?.close?.();
    },
    [stop],
  );

  useEffect(() => {
    if (!isActive) return undefined;

    const handleKeyDown = (event) => {
      const tagName = event.target?.tagName?.toLowerCase();
      if (["input", "select", "textarea"].includes(tagName)) return;

      if (event.code === "Space") {
        event.preventDefault();
        toggle();
      }
      if (event.key === "Enter") start();
      if (event.key === "Escape") stop();
      if (event.key === "+" || event.key === "=" || event.key === "ArrowUp") {
        setBpm((current) => clampBpm(current + (event.shiftKey ? 10 : 1)));
      }
      if (event.key === "-" || event.key === "_" || event.key === "ArrowDown") {
        setBpm((current) => clampBpm(current - (event.shiftKey ? 10 : 1)));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, start, stop, toggle]);

  const handleTapTempo = () => {
    const now = browserNow();
    const current = tapHistoryRef.current;
    const next =
      current.length && now - current.at(-1) > 2200 ? [now] : [...current, now].slice(-12);
    tapHistoryRef.current = next;
    const tappedBpm = averageTapBpm(next);
    if (tappedBpm) setBpm(clampBpm(tappedBpm));
  };

  return (
    <section
      id="metronome"
      className="tool-panel app-view"
      hidden={!isActive}
      aria-labelledby="metronome-title"
    >
      <PanelTitle
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        titleId="metronome-title"
        isActive={isActive}
      />

      <p className="formula-note">
        <code>{copy.formula}</code> · {copy.formulaNote}
      </p>

      <div className="metronome-board">
        <div className="tempo-display" aria-live="polite">
          <span>{bpm}</span>
          <small>BPM</small>
        </div>

        <div className="transport-row">
          <button
            type="button"
            className="transport-button"
            onClick={toggle}
            aria-label={isPlaying ? copy.pause : copy.play}
          >
            <Icon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button type="button" onClick={handleTapTempo} className="secondary-button">
            {copy.tap}
          </button>
          <button type="button" onClick={stop} className="secondary-button">
            {copy.stop}
          </button>
        </div>

        <div className="beat-row" aria-label={copy.beatIndicator}>
          {Array.from({ length: beatsPerBar }, (_, index) => (
            <span key={index} className={activeBeat === index ? "beat-dot is-on" : "beat-dot"}>
              {index + 1}
            </span>
          ))}
        </div>
      </div>

      {(audioMessage || audioSupported === false) && (
        <p className="support-message">{audioMessage ? copy.visualWarning : copy.visualSupport}</p>
      )}

      <div className="control-grid metronome-controls">
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
        <div className="field-block">
          <span>{copy.beats}</span>
          <CustomSelect
            value={beatsPerBar}
            options={BEAT_OPTIONS}
            onChange={setBeatsPerBar}
            label={copy.beats}
          />
        </div>
        <label className="range-block volume-control">
          <span>
            <Icon icon={faVolumeHigh} />
            {copy.volume}
          </span>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="shortcut-strip">
        <kbd>{copy.shortcuts.spaceKey}</kbd> {copy.shortcuts.space}
        <kbd>+</kbd>/<kbd>-</kbd> BPM
        <kbd>{copy.shortcuts.shiftKey}</kbd> {copy.shortcuts.shift}
        <kbd>{copy.shortcuts.escapeKey}</kbd> {copy.shortcuts.escape}
      </div>

      <ToolDocumentation doc={documentation} labels={documentationLabels} />
    </section>
  );
}
