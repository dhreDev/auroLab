import Essentia from "essentia.js/dist/essentia.js-core.es.js";
import essentiaWasmUrl from "essentia.js/dist/essentia-wasm.es.js?url";
import { analyzeWithEssentia } from "./essentiaAnalysisCore.js";

let essentiaWasmPromise;

self.onmessage = async ({ data }) => {
  let essentia;
  try {
    const essentiaWasm = await loadEssentiaWasm();
    essentia = new Essentia(essentiaWasm);
    const result = analyzeWithEssentia(essentia, data.samples, data.sampleRate, (status) => {
      self.postMessage({ type: "progress", status });
    });
    self.postMessage({ type: "result", result });
  } catch (error) {
    self.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : "ANALYSIS_FAILED",
    });
  } finally {
    essentia?.delete();
  }
};

function loadEssentiaWasm() {
  if (!essentiaWasmPromise) {
    // Essentia 0.1.x detects workers through importScripts, which module workers omit.
    self.importScripts ||= () => {};
    essentiaWasmPromise = import(/* @vite-ignore */ essentiaWasmUrl).then(
      ({ EssentiaWASM }) => EssentiaWASM,
    );
  }
  return essentiaWasmPromise;
}
