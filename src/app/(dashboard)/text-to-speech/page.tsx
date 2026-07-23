import { TextToSpeechView } from "@/features/views/text-to-speech-view";
import type { Metadata } from "next";
import { trpc, HydrateClient, prefetch } from "@/trpc/server";

export const metadata: Metadata = { title: "Text to Speech" };

export default async function TextToSpeechPage({
  searchParams,
}: {
  searchParams: Promise<{
    text?: string;
    voiceId?: string;
    voiceid?: string;
  }>;
}) {
  const params = await searchParams;

  const text = params.text;
  const voiceId = params.voiceId ?? params.voiceid;

  prefetch(trpc.voices.getAll.queryOptions());

  return (
    <HydrateClient>
      <TextToSpeechView initialValues={{ text, voiceId }} />
    </HydrateClient>
  );
}
