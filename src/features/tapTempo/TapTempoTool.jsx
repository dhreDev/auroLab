import { useCallback, useEffect, useRef, useState } from "react";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { CustomSelect } from "../../components/ui/CustomSelect";
import { Icon } from "../../components/ui/Icon";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";
import { ToolDocumentation } from "../../components/ui/ToolDocumentation";
import { tapTempoStats } from "../../lib/musicMath";
import { browserNow, getAudioContextClass } from "../../lib/webAudio";

const RESET_OPTIONS = [2, 3, 5, 8].map((value) => ({ value, label: `${value}s` }));

export function TapTempoTool({
  audioSupported,
  copy,
  documentation,
  documentationLabels,
  isActive,
}) {
  const [taps, setTaps] = useState([]);
  const [bpm, setBpm] = useState(0);
  const [stability, setStability] = useState(0);
  const [resetAfter, setResetAfter] = useState(3);
  const [soundOn, setSoundOn] = useState(true);
  const [audioMessage, setAudioMessage] = useState("");
  const contextRef = useRef(null);

  const playFeedback = useCallback(() => {
    if (!soundOn) return;

    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) {
      setAudioMessage("noAudio");
      return;
    }

    try {
      if (!contextRef.current) contextRef.current = new AudioContextClass();
      const context = contextRef.current;
      if (context.state === "suspended") void context.resume?.();

      const time = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(760, time);
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.35, time + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(time);
      oscillator.stop(time + 0.05);
      setAudioMessage("");
    } catch {
      setAudioMessage("soundError");
    }
  }, [soundOn]);

  const registerTap = useCallback(() => {
    const now = browserNow();
    playFeedback();
    setTaps((current) => {
      const next =
        current.length && now - current.at(-1) > resetAfter * 1000
          ? [now]
          : [...current, now].slice(-24);
      const stats = tapTempoStats(next);
      setBpm(stats.bpm);
      setStability(stats.stability);
      return next;
    });
  }, [playFeedback, resetAfter]);

  const reset = useCallback(() => {
    setTaps([]);
    setBpm(0);
    setStability(0);
  }, []);

  useEffect(
    () => () => {
      void contextRef.current?.close?.();
    },
    [],
  );

  const adjustedBpm = bpm ? Math.round(bpm * 10) / 10 : 0;

  return (
    <section
      id="tap-tempo"
      className="tool-panel tap-panel app-view"
      hidden={!isActive}
      aria-labelledby="tap-tempo-title"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.code === "Space" || event.key.toLowerCase() === "t") {
          event.preventDefault();
          registerTap();
        }
        if (event.key === "Escape") reset();
      }}
    >
      <PanelTitle
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        titleId="tap-tempo-title"
        isActive={isActive}
      />

      <p className="formula-note">
        <code>{copy.formula}</code> · {copy.formulaNote}
      </p>

      <div className="tap-layout">
        <button type="button" className="tap-button" onClick={registerTap}>
          {copy.tapButton}
        </button>

        <div className="tap-readout" aria-live="polite">
          <span>{adjustedBpm || "--"}</span>
          <small>BPM</small>
        </div>

        <div className="tap-actions">
          <button type="button" onClick={() => setBpm((current) => current / 2)}>
            /2
          </button>
          <button type="button" onClick={() => setBpm((current) => current * 2)}>
            ×2
          </button>
          <button type="button" onClick={reset}>
            <Icon icon={faRotateRight} />
            {copy.reset}
          </button>
        </div>
      </div>

      {(audioMessage || audioSupported === false) && (
        <p className="support-message">{audioMessage ? copy[audioMessage] : copy.visualSupport}</p>
      )}

      <div className="control-grid tap-controls">
        <Metric label={copy.taps} value={String(taps.length)} />
        <div className="stability-meter" aria-live="polite">
          <span>{copy.stability}</span>
          <div className="stability-value">
            {taps.length >= 2 ? `${Math.round(stability * 100)}%` : "--"}
          </div>
          <div className="stability-track">
            <div className="stability-fill" style={{ width: `${Math.round(stability * 100)}%` }} />
          </div>
        </div>
        <div className="field-block">
          <span>{copy.autoReset}</span>
          <CustomSelect
            value={resetAfter}
            options={RESET_OPTIONS}
            onChange={setResetAfter}
            label={copy.autoReset}
          />
        </div>
        <label className="toggle-pill">
          <input
            type="checkbox"
            checked={soundOn && audioSupported !== false}
            disabled={audioSupported === false}
            onChange={(event) => setSoundOn(event.target.checked)}
          />
          {audioSupported === false ? copy.visualTap : copy.tapSound}
        </label>
      </div>

      <ToolDocumentation doc={documentation} labels={documentationLabels} />
    </section>
  );
}
