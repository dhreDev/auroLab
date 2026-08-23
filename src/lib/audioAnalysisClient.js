const ANALYSIS_SAMPLE_RATE = 44100;

export async function analyzeAudioFile(file, onProgress = () => {}) {
  const AudioContextClass = window.AudioContext || window["webkitAudioContext"];
  if (!AudioContextClass || typeof Worker === "undefined") {
    throw new Error("WEB_AUDIO_UNSUPPORTED");
  }

  const context = new AudioContextClass();
  try {
    onProgress("decoding");
    const encoded = await file.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(encoded.slice(0));
    onProgress("preparingAudio");
    const samples = await renderMonoAtAnalysisRate(audioBuffer);
    onProgress("loadingEngine");
    return await runAnalysisWorker(samples, onProgress);
  } finally {
    await context.close?.();
  }
}

async function renderMonoAtAnalysisRate(audioBuffer) {
  const mono = mixToMono(audioBuffer);
  if (audioBuffer.sampleRate === ANALYSIS_SAMPLE_RATE) return mono;

  const OfflineAudioContextClass =
    window.OfflineAudioContext || window["webkitOfflineAudioContext"];
  if (!OfflineAudioContextClass) {
    return resampleLinear(mono, audioBuffer.sampleRate, ANALYSIS_SAMPLE_RATE);
  }

  const outputLength = Math.max(1, Math.round(audioBuffer.duration * ANALYSIS_SAMPLE_RATE));
  const offlineContext = new OfflineAudioContextClass(1, outputLength, ANALYSIS_SAMPLE_RATE);
  const sourceBuffer = offlineContext.createBuffer(1, mono.length, audioBuffer.sampleRate);
  sourceBuffer.copyToChannel(mono, 0);
  const source = offlineContext.createBufferSource();
  source.buffer = sourceBuffer;
  source.connect(offlineContext.destination);
  source.start(0);
  const rendered = await offlineContext.startRendering();
  return new Float32Array(rendered.getChannelData(0));
}

function mixToMono(audioBuffer) {
  const mono = new Float32Array(audioBuffer.length);
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
    const source = audioBuffer.getChannelData(channel);
    for (let i = 0; i < mono.length; i += 1) mono[i] += source[i] / audioBuffer.numberOfChannels;
  }
  return mono;
}

function resampleLinear(samples, sourceRate, targetRate) {
  const length = Math.max(1, Math.round((samples.length * targetRate) / sourceRate));
  const output = new Float32Array(length);
  const ratio = sourceRate / targetRate;
  for (let i = 0; i < length; i += 1) {
    const position = i * ratio;
    const first = Math.floor(position);
    const second = Math.min(samples.length - 1, first + 1);
    const fraction = position - first;
    output[i] = samples[first] * (1 - fraction) + samples[second] * fraction;
  }
  return output;
}

function runAnalysisWorker(samples, onProgress) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./audioAnalysis.worker.js", import.meta.url), {
      type: "module",
    });

    const finish = (callback, value) => {
      worker.terminate();
      callback(value);
    };

    worker.onmessage = ({ data }) => {
      if (data.type === "progress") {
        onProgress(data.status);
        return;
      }
      if (data.type === "result") finish(resolve, data.result);
      if (data.type === "error") {
        finish(reject, new Error(data.message || "ANALYSIS_FAILED"));
      }
    };
    worker.onerror = (event) => {
      finish(reject, event.error || new Error(event.message));
    };
    worker.postMessage({ samples, sampleRate: ANALYSIS_SAMPLE_RATE }, [samples.buffer]);
  });
}
