import { useCallback, useState } from "react";

export const useMic = () => {
  const [mic, setMic] = useState<MediaRecorder | null>(null);

  const initMic = async () => {
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });

      const microphone = new MediaRecorder(userMedia);

      microphone.ondataavailable = (e) => console.log(e);

      setMic(microphone);
      return microphone;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const pauseMic = useCallback(() => {
    if (mic?.state === "recording") {
      mic.pause();
    }
  }, [mic]);

  const stopMic = useCallback(() => {
    mic?.stream.getAudioTracks().forEach((track) => track.stop());
    setMic(null);
  }, [mic]);

  const resumeMic = useCallback(() => {
    if (mic?.state === "paused") {
      mic?.resume();
    }
  }, [mic]);

  const startMic = useCallback(async () => {
    if (!mic) {
      const microphone = await initMic();
      microphone.start(250);
    } else {
      mic.start();
    }
  }, [mic]);

  return { initMic, startMic, pauseMic, stopMic, resumeMic };
};
