import { useEffect, useState } from "react";
import { getAudioContextClass } from "../lib/webAudio";

export function useWebAudioSupport() {
  const [isSupported, setIsSupported] = useState(null);

  useEffect(() => {
    setIsSupported(Boolean(getAudioContextClass()));
  }, []);

  return isSupported;
}
