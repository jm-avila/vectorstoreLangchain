import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import { chunkText } from "./chunking";
import { navigation } from "./navigation";
import * as fs from "fs/promises";

// Load environment variables

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const vectorStore = new MemoryVectorStore(embeddings);

async function main(query: string) {
  try {
    const documents: Document[] = [];

    const updateDocuments = async (filePath: string) => {
      try {
        const text = await fs.readFile(filePath, "utf8");
        const chunks = chunkText(text);
        for (const chunk of chunks) {
          const document = new Document({
            pageContent: chunk,
            metadata: { source: filePath },
          });
          documents.push(document);
        }
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
      }
    };

    await navigation("./docs", updateDocuments);
    await vectorStore.addDocuments(documents);

    // Use the vector store as a retriever that returns a single document
    const retriever = vectorStore.asRetriever({
      // Optional filter
      k: 2,
    });

    const result = await retriever.invoke(query);

    console.log("result", result);
  } catch (error) {
    console.error("An error occurred in main:", error);
  }
}

// Parse command line arguments
function parseArgs(): string {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("No search query provided. Using default query.");
    throw new Error("No search query provided.");
  }
  return args.join(" ");
}

// Get the query from command line arguments
const query = parseArgs();

main(query);
