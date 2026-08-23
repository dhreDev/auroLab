export function getAudioContextClass() {
  if (typeof window === "undefined") return null;
  return window.AudioContext || null;
}

export function browserNow() {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

export async function resumeAudioContext(context) {
  if (context.state !== "suspended" || typeof context.resume !== "function") return context;

  const timeout = new Promise((resolve) => window.setTimeout(resolve, 350));
  await Promise.race([context.resume(), timeout]);
  return context.state === "suspended" ? null : context;
}
