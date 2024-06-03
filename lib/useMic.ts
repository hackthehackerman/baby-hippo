import { useCallback, useState } from "react";

export const useMic = () => {
  const [mic, setMic] = useState<MediaRecorder | null>(null);

  const initializeMic = async () => {
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });

      const microphone = new MediaRecorder(userMedia);

      setMic(microphone);
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const stopMic = useCallback(() => {
    if (mic?.state === "recording") {
      mic.stop();
    }
  }, [mic]);

  const startMic = useCallback(() => {
    if (mic?.state === "paused") {
      mic.resume();
    } else {
      mic?.start(250);
    }
  }, [mic]);

  return { mic, initializeMic, startMic, stopMic };
};
