import { useRef, useState } from "react";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../components/ui/Icon";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";
import { ToolDocumentation } from "../../components/ui/ToolDocumentation";

const CHROMA_LABELS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const AUDIO_EXTENSION = /\.(aac|aif|aiff|flac|m4a|mp3|ogg|opus|wav|webm)$/i;
const ANALYSIS_ERROR_KEYS = {
  AUDIO_IS_SILENT: "silent",
  AUDIO_TOO_SHORT: "tooShort",
  WEB_AUDIO_UNSUPPORTED: "unsupported",
};

function isAudioFile(file) {
  return file.type?.startsWith("audio/") || AUDIO_EXTENSION.test(file.name);
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatKeyName(key, copy) {
  if (key?.tonic == null || !key.mode) return "";
  return `${CHROMA_LABELS[key.tonic]} ${copy.modes[key.mode]}`;
}

export function AudioDetectorTool({
  audioSupported,
  copy,
  documentation,
  documentationLabels,
  isActive,
}) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (nextFile) => {
    if (!nextFile || isAnalyzing) return;
    if (audioSupported === false) {
      setError("unsupported");
      setStatus("");
      return;
    }

    if (!isAudioFile(nextFile)) {
      setError("invalidFile");
      setStatus("");
      return;
    }

    setFile(nextFile);
    setResult(null);
    setError("");
    setIsAnalyzing(true);

    try {
      // Keep the decoder and Essentia worker out of the initial application bundle.
      const { analyzeAudioFile } = await import("../../lib/audioAnalysisClient");
      const analysis = await analyzeAudioFile(nextFile, setStatus);
      setResult(analysis);
      setStatus("complete");
    } catch (analysisError) {
      setError(ANALYSIS_ERROR_KEYS[analysisError?.message] || "analysis");
      setStatus("");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section
      id="detector"
      className="tool-panel app-view"
      hidden={!isActive}
      aria-labelledby="bpm-key-detector-title"
    >
      <PanelTitle
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        titleId="bpm-key-detector-title"
        isActive={isActive}
      />

      <p className="formula-note">{copy.formula}</p>

      <div
        className={`${isDragging ? "drop-zone is-dragging" : "drop-zone"}${audioSupported === false ? " is-disabled" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleFile(event.dataTransfer.files?.[0]);
        }}
      >
        <Icon icon={faUpload} className="drop-zone-icon" />
        <div>
          <strong>{file ? file.name : copy.drop}</strong>
          <span>
            {file ? `${formatFileSize(file.size)} · ${file.type || "audio"}` : copy.chooseHint}
          </span>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() => inputRef.current?.click()}
          disabled={isAnalyzing || audioSupported === false}
        >
          {copy.chooseAudio}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0];
            event.target.value = "";
            void handleFile(selectedFile);
          }}
          hidden
        />
      </div>

      {audioSupported === false && <p className="support-message">{copy.disabled}</p>}

      {status && (
        <div className={isAnalyzing ? "analysis-status is-loading" : "analysis-status"}>
          <span />
          {copy.progress[status]}
        </div>
      )}

      {error && <p className="error-message">{copy.errors[error]}</p>}

      {result && (
        <div className="analysis-results">
          <Metric
            label={copy.detectedBpm}
            value={result.bpm.value ? String(result.bpm.value) : copy.unclearMasculine}
          />
          <Metric
            label={copy.bpmConfidence}
            value={`${Math.round(result.bpm.confidence * 100)}%`}
          />
          <Metric
            label={copy.estimatedKey}
            value={formatKeyName(result.key, copy) || copy.unclearFeminine}
          />
          <Metric
            label={copy.keyConfidence}
            value={`${Math.round(result.key.confidence * 100)}%`}
          />

          {result.key.tonic != null && result.key.camelot && (
            <div className="key-badge" aria-label={copy.camelotLabel}>
              <span className="camelot-chip">{result.key.camelot}</span>
              <div>
                <strong>{formatKeyName(result.key, copy)}</strong>
                <span>{copy.camelotCode}</span>
              </div>
            </div>
          )}

          <div className="result-line">
            <strong>{copy.bpmAlternatives}</strong>
            <span>
              {result.bpm.alternatives.length
                ? result.bpm.alternatives.join(", ")
                : copy.noAlternatives}
            </span>
          </div>
          <div className="result-line">
            <strong>{copy.keyAlternatives}</strong>
            <span>
              {result.key.alternatives.length
                ? result.key.alternatives.map((key) => formatKeyName(key, copy)).join(", ")
                : copy.noAlternatives}
            </span>
          </div>
          <div className="chroma-chart" aria-label={copy.noteEnergy}>
            {result.key.chroma.map((value, index) => (
              <div
                key={CHROMA_LABELS[index]}
                className={index === result.key.peak ? "chroma-bar is-peak" : "chroma-bar"}
              >
                <span style={{ height: `${Math.max(5, value * 420)}px` }} />
                <small>{CHROMA_LABELS[index]}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToolDocumentation doc={documentation} labels={documentationLabels} />
    </section>
  );
}
