"use client";

import { PatientForm } from "@/components/patient-form";
import { RecordingControls } from "@/components/recording-controls";
import { TranscriptArea } from "@/components/transcript-area";
import { useDeepgram } from "@/lib/useDeepgram";
import { useMic } from "@/lib/useMic";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";
import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema } from "@/lib/formSchema";
import { StreamableValue, readStreamableValue } from "ai/rsc";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateCompletion } from "./actions/completion";
import { Spinner } from "@/components/spinner";

export type RecordingState = "active" | "paused" | "stopped";

export default function Home() {
  const [recordingState, setRecordingState] =
    useState<RecordingState>("stopped");

  const [transcript, setTranscript] = useState("");

  const { deepgram, initializeDeepgram, disconnect } = useDeepgram();

  const { mic, startMic, stopMic, initializeMic } = useMic();
  const chunksRef = useRef<Blob[]>([]);

  const [audioURL, setAudioURL] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [timer, setTimer] = useState(0);
  const keepAliveInterval = useRef<NodeJS.Timeout>();
  const [streamedData, setStreamedData] = useState("");
  const [isFillingForm, setIsFillingForm] = useState(false);
  const [isDeepgramInitializing, setIsDeepgramInitializing] = useState(false);

  useEffect(() => {
    if (!deepgram) return;

    if (
      recordingState === "paused" &&
      deepgram.getReadyState() === LiveConnectionState.OPEN
    ) {
      deepgram.keepAlive();
      keepAliveInterval.current = setInterval(() => {
        deepgram.keepAlive();
      }, 5000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
  }, [deepgram, recordingState]);

  useEffect(() => {
    initializeMic();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (recordingState === "active") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (recordingState === "paused" || recordingState === "stopped") {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recordingState]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  });

  const processChunks = () => {
    const blob = new Blob(chunksRef.current, {
      type: "audio/mpeg",
    });
    setAudioURL(window.URL.createObjectURL(blob));
  };

  useEffect(() => {
    if (!mic || !deepgram) return;

    const onData = (e: BlobEvent) => {
      if (deepgram && deepgram.getReadyState() === LiveConnectionState.OPEN) {
        chunksRef.current.push(e.data);
        deepgram?.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal } = data;
      let thisCaption = data.channel.alternatives[0].transcript;

      if (thisCaption !== "" && isFinal) {
        setTranscript((prev) => prev + " " + thisCaption);
      }
    };

    deepgram.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
    mic.addEventListener("dataavailable", onData);

    return () => {
      deepgram.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      mic.removeEventListener("dataavailable", onData);
    };
  }, [deepgram, mic]);

  const startRecording = async () => {
    setIsDeepgramInitializing(true);
    await initializeDeepgram();
    startMic();
    setIsDeepgramInitializing(false);
    if (recordingState === "stopped") {
      setTimer(0);
    }
    setRecordingState("active");
  };

  const pauseRecording = () => {
    if (mic && mic.state === "recording") {
      mic.pause();
    }
    setRecordingState("paused");
  };

  const resumeRecording = () => {
    if (mic && mic.state === "paused") {
      mic.resume();
    } else {
      startMic();
    }
    setRecordingState("active");
  };

  const stopRecording = () => {
    processChunks();
    stopMic();
    setRecordingState("stopped");
    disconnect();
  };

  const reset = async () => {
    setAudioURL("");
    setTranscript("");
    setRecordingState("stopped");
    form.reset();
    setStreamedData("");
    chunksRef.current = [];
    setTimer(0);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      dateOfBirth: "",
      caseNumber: "",
      injuryDescription: "",
      previousTreatment: "",
      patientGoals: "",
      referralSource: "",
      therapistNotes: "",
    },
  });

  const processStreamedObject = async (object: StreamableValue) => {
    for await (const partialObject of readStreamableValue(object)) {
      if (partialObject) {
        setStreamedData(partialObject);
      }
    }
  };

  const fillForm = async () => {
    setIsFillingForm(true);
    const { object } = await generateCompletion(transcript);
    await processStreamedObject(object);
    setIsFillingForm(false);
  };

  useEffect(() => {
    for (let [k, v] of Object.entries(streamedData)) {
      form.setValue(k as any, v);
    }
  }, [streamedData, form]);

  return (
    <main className="relative flex max-h-screen min-h-screen gap-3">
      <main className="relative flex max-h-screen min-h-screen w-full gap-3 p-4">
        <div className="flex w-1/2 flex-grow flex-col gap-3">
          <RecordingControls
            audioURL={audioURL}
            pauseRecording={pauseRecording}
            recordingState={recordingState}
            reset={reset}
            resumeRecording={resumeRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            timer={timer}
            transcript={transcript}
            fillForm={fillForm}
            isDeepgramInitializing={isDeepgramInitializing}
          />
          <TranscriptArea transcript={transcript} ref={textareaRef} />
        </div>
        <div className="relative flex w-1/2 flex-grow flex-col gap-3 overflow-scroll rounded-lg border border-border bg-background p-4">
          {isFillingForm && (
            <div className="absolute z-40 flex h-full w-full items-center justify-center bg-white/60">
              <Spinner />
            </div>
          )}
          <PatientForm form={form} />
        </div>
      </main>
    </main>
  );
}
