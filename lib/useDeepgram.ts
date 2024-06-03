import {
  LiveClient,
  LiveConnectionState,
  LiveTranscriptionEvents,
  createClient,
} from "@deepgram/sdk";
import { useCallback, useState } from "react";

const getApiKey = async (): Promise<string> => {
  const response = await fetch("/api/authenticate", {
    cache: "no-store",
  });
  const result = await response.json();
  return result.key;
};

export const useDeepgram = () => {
  const [deepgram, setDeepgram] = useState<LiveClient | null>(null);

  const initializeDeepgram = async () => {
    const key = await getApiKey();
    if (
      key &&
      (!deepgram || deepgram.getReadyState() === LiveConnectionState.CLOSED)
    ) {
      const client = createClient(key);

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

  const disconnect = () => {
    deepgram?.finish();
  };

  return { deepgram, disconnect, initializeDeepgram };
};
