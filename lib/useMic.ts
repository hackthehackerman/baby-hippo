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

      setMic(microphone);
      return microphone;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const stopMic = useCallback(() => {
    mic?.stream.getAudioTracks().forEach((track) => track.stop());
    setMic(null);
  }, [mic]);

  const startMic = useCallback(async () => {
    if (!mic) {
      const microphone = await initMic();
      microphone.start(250);
    } else {
      mic.start(250);
    }
  }, [mic]);

  return { mic, initMic, startMic, stopMic };
};
