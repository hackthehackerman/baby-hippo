import {
  LiveClient,
  LiveConnectionState,
  LiveTranscriptionEvents,
  createClient,
} from "@deepgram/sdk";
import { useCallback, useState } from "react";

const DEEPGRAM_API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

export const useDeepgram = () => {
  const [deepgram, setDeepgram] = useState<LiveClient | null>(null);

  const initializeDeepgram = () => {
    if (
      DEEPGRAM_API_KEY &&
      (!deepgram || deepgram.getReadyState() === LiveConnectionState.CLOSED)
    ) {
      const client = createClient(DEEPGRAM_API_KEY);

      const liveClient = client.listen.live({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
        diarize: true,
      });

      liveClient.on(LiveTranscriptionEvents.Open, (e) =>
        console.log("open", e),
      );
      liveClient.on(LiveTranscriptionEvents.Close, (e) =>
        console.log("closed", e),
      );

      setDeepgram(liveClient);
    }
  };

  const disconnect = useCallback(() => {
    if (
      deepgram &&
      (deepgram.getReadyState() !== LiveConnectionState.CLOSED ||
        deepgram?.getReadyState() !== LiveConnectionState.CLOSING)
    ) {
      deepgram.removeAllListeners();
      deepgram.finish();
      setDeepgram(null);
    }
  }, [deepgram]);

  return { deepgram, disconnect, initializeDeepgram };
};
