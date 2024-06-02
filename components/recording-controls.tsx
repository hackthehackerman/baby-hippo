import { RecordingState } from "@/app/page";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import {
  Check,
  Disc,
  Mic,
  Pause,
  Redo,
  Sparkles,
  StepForward,
} from "lucide-react";

type Props = {
  recordingState: RecordingState;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  reset: () => void;
  transcript: string;
  audioURL: string;
  timer: number;
};

export const RecordingControls: React.FC<Props> = ({
  recordingState,
  startRecording,
  pauseRecording,
  resumeRecording,
  stopRecording,
  reset,
  transcript,
  audioURL,
  timer,
}) => {
  return (
    <div className="flex h-20 items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        {recordingState === "stopped" && !transcript && !audioURL && (
          <Button size={"sm"} onClick={startRecording}>
            <Mic className="mr-2 h-5 w-5" /> Start Recording
          </Button>
        )}
        {recordingState === "stopped" && (!!transcript || !!audioURL) && (
          <>
            <Button size={"sm"} onClick={reset} variant={"outline"}>
              <Redo className="mr-2 h-5 w-5" /> Restart Recording
            </Button>
            <Button size={"sm"}>
              <Sparkles className="mr-2 h-5 w-5" /> Fill Form
            </Button>
          </>
        )}
        {recordingState === "active" && (
          <Button size={"sm"} variant={"outline"} onClick={pauseRecording}>
            <Pause className="mr-2 h-5 w-5" /> Pause
          </Button>
        )}
        {recordingState === "paused" && (
          <Button size={"sm"} onClick={resumeRecording}>
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
          {recordingState === "paused" && (
            <div className="flex items-center gap-2 font-semibold">
              <Pause />
            </div>
          )}
          {recordingState === "active" && (
            <div className="flex items-center gap-2 font-semibold">
              <Disc className="animate-pulse text-red-500" />
            </div>
          )}
          <div className="font-mono text-lg">{formatTime(timer)}</div>
        </div>
      )}

      {audioURL && recordingState === "stopped" && (
        <audio className="max-h-10 flex-grow" src={audioURL} controls />
      )}
    </div>
  );
};
