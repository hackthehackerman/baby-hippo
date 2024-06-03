"use server";

import { formSchema } from "@/lib/formSchema";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";

const buildPrompt = (transcript: string) => {
  return `You are a scribe for a physical therapist. Below is the transcript for the conversation between the physical therapist and the patient:
  
      "${transcript}"
      
       Your job is to understand the conversation and fill up a form in JSON only (NOTHING ELSE IN YOUR RESPONSE) just as a scribe would. The zod schema of the form is below:
      
      ${formSchema.shape}
      
      Your response should be in the following format:
      {
        "fieldName": "value",
        ...
        ...
      }

      Datestrings should be in the format "yyyy-MM-dd". Do not include utterences/filler words from the transcript. 
      
      This is a professional medical form. Based on the transcript, make appropriate assumptions, but nothing that is far-reaching, or medically ambiguous.

      The goal is to take the content of this spoken-word transcript, and fill the form with professional medical language/tone.
      
      DO NOT RESPOND WITH ANYTHING ELSE. DO NOT RESPOND IN MARKDOWN FORMAT.`;
};

export async function generateCompletion(transcript: string) {
  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai("gpt-4o"),
      prompt: buildPrompt(transcript),
      schema: formSchema,
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
}
