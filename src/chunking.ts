import { encoding_for_model } from "tiktoken";

export function chunkText(
  text: string,
  chunkSize: number = 800,
  overlap: number = 100
): string[] {
  const enc = encoding_for_model("text-embedding-3-small");
  const tokens = enc.encode(text);

  const chunks: string[] = [];
  for (let i = 0; i < tokens.length; i += chunkSize - overlap) {
    const chunkTokens = tokens.slice(i, i + chunkSize);
    const chunk = enc.decode(chunkTokens);
    chunks.push(Buffer.from(chunk).toString());
  }

  enc.free(); // release WASM memory
  return chunks;
}
