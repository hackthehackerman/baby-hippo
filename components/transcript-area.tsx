import { Textarea } from "@/components/ui/textarea";
import { Ref, forwardRef } from "react";

type Props = {
  transcript: string;
};

export const TranscriptArea = forwardRef(
  ({ transcript }: Props, ref: Ref<HTMLTextAreaElement>) => {
    return (
      <Textarea
        className="flex h-full min-h-96 flex-grow resize-none p-4 text-lg disabled:!opacity-100"
        disabled
        placeholder="A live transcript of your recording will appear here."
        defaultValue={transcript}
        ref={ref}
      />
    );
  },
);
