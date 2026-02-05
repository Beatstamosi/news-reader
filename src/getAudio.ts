import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
});

/**
 * Converts text to an MP3 Blob using ElevenLabs TTS
 * @param text The text to convert to speech
 * @returns A Blob containing the audio
 */
export default async function getAudio(text: string): Promise<Blob> {
  // convert text to audio (ElevenLabs)
  const audio = await elevenlabs.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
    text,
    modelId: "eleven_multilingual_v2",
    outputFormat: "mp3_44100_128",
  });

  // collect all chunks from the ReadableStream
  const reader = audio.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return new Blob(
    chunks.map((c) => c.slice()),
    { type: "audio/mpeg" },
  );
}
