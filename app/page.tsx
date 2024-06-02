"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDeepgram } from "@/lib/useDeepgram";
import { useMic } from "@/lib/useMic";
import { formatTime } from "@/lib/utils";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";

import {
  Check,
  Disc,
  Mic,
  Pause,
  Redo,
  Sparkles,
  StepForward,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RecordingState = "active" | "paused" | "stopped";

export default function Home() {
  const [recordingState, setRecordingState] =
    useState<RecordingState>("stopped");

  const [transcript, setTranscript] = useState("");

  const { deepgram, initializeDeepgram, disconnect } = useDeepgram();

  const { mic, startMic, stopMic } = useMic();
  const chunksRef = useRef<Blob[]>([]);

  const [audioURL, setAudioURL] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [timer, setTimer] = useState(0);

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
      type: "audio/ogg; codecs=opus",
    });
    setAudioURL(window.URL.createObjectURL(blob));
  };

  useEffect(() => {
    if (!mic || !deepgram) return;

    const onData = (e: BlobEvent) => {
      if (deepgram && deepgram.getReadyState() === LiveConnectionState.OPEN) {
        chunksRef.current.push(e.data);
        console.log(chunksRef.current);

        deepgram?.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
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
    initializeDeepgram();
    startMic();
    if (recordingState === "stopped") {
      setTimer(0);
    }
    setRecordingState("active");
  };

  const pauseRecording = () => {
    processChunks();
    stopMic();
    setRecordingState("paused");
    disconnect();
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
    chunksRef.current = [];
    setTimer(0);
  };

  return (
    <main className="relative flex max-h-screen min-h-screen gap-3 p-4">
      <div className="flex w-1/2 flex-grow flex-col gap-3">
        <div className="flex h-20 items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            {recordingState === "stopped" && !transcript && !audioURL && (
              <Button size={"sm"} onClick={startRecording}>
                <Mic className="mr-2 h-5 w-5" /> Start Recording
              </Button>
            )}
            {recordingState === "stopped" && (!!transcript || !!audioURL) && (
              <Button size={"sm"} onClick={reset} variant={"outline"}>
                <Redo className="mr-2 h-5 w-5" /> Restart Recording
              </Button>
            )}
            {recordingState === "stopped" && (!!transcript || !!audioURL) && (
              <Button size={"sm"}>
                <Sparkles className="mr-2 h-5 w-5" /> Fill Form
              </Button>
            )}
            {recordingState === "active" && (
              <Button size={"sm"} variant={"outline"} onClick={pauseRecording}>
                <Pause className="mr-2 h-5 w-5" /> Pause
              </Button>
            )}
            {recordingState === "paused" && (
              <Button size={"sm"} onClick={startRecording}>
                <StepForward className="mr-2 h-5 w-5" /> Resume
              </Button>
            )}
            {recordingState !== "stopped" && (
              <Button size={"sm"} variant={"default"} onClick={stopRecording}>
                <Check className="mr-2 h-5 w-5" /> Done
              </Button>
            )}
          </div>

          {recordingState !== "stopped" && (
            <div className="flex items-center gap-2">
              {recordingState === "paused" && <Pause />}
              {recordingState === "active" && (
                <Disc className="animate-pulse text-red-500" />
              )}
              <div className="font-mono text-lg">{formatTime(timer)}</div>
            </div>
          )}

          {audioURL && recordingState === "stopped" && (
            <audio
              className="max-h-10 flex-grow"
              src={audioURL}
              controls={true}
            />
          )}
        </div>

        <Textarea
          className="flex h-full min-h-96 flex-grow resize-none p-4 text-lg disabled:!opacity-100"
          disabled
          placeholder="A live transcript of your recording will appear here."
          defaultValue={transcript}
          ref={textareaRef}
        />
      </div>
      <div className="flex w-1/2 flex-grow flex-col gap-3 overflow-scroll rounded-lg border border-border bg-background p-4">
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-name">Patient Name</Label>
              <Input id="patient-name" placeholder="Enter patient name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="chief-complaint">Chief Complaint</Label>
            <Textarea
              id="chief-complaint"
              placeholder="Describe the patient's main concern"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="history">History of Present Illness</Label>
            <Textarea
              id="history"
              placeholder="Provide details on the patient's current condition"
              className="min-h-[150px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="past-medical">Past Medical History</Label>
            <Textarea
              id="past-medical"
              placeholder="List the patient's relevant medical history"
              className="min-h-[150px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="objective-findings">Objective Findings</Label>
            <Textarea
              id="objective-findings"
              placeholder="Describe your observations and assessments"
              className="min-h-[150px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assessment">Assessment</Label>
            <Textarea
              id="assessment"
              placeholder="Provide your clinical analysis and diagnosis"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="treatment-plan">Treatment Plan</Label>
            <Textarea
              id="treatment-plan"
              placeholder="Outline the recommended treatment approach"
              className="min-h-[150px]"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
