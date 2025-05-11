# VectorStore LangChain

A vector store implementation using LangChain for semantic search and document retrieval.

## Overview

This project builds a vector store from documents stored in the `docs` directory. It uses OpenAI embeddings to convert text into vectors and allows semantic search against the stored documents.

## Features

- Automatically indexes all files in the `docs` directory
- Converts documents into text chunks with configurable size and overlap
- Uses OpenAI's `text-embedding-3-small` model for generating embeddings
- Implements in-memory vector storage with LangChain's `MemoryVectorStore`
- Provides semantic search capabilities

## How It Works

1. The application recursively navigates through the `docs` directory
2. Text files are read and chunked into smaller pieces for better embedding
3. Each chunk is converted to a vector using OpenAI's embedding model
4. Chunks are stored in an in-memory vector store
5. The vector store can be queried to find semantically similar documents

## Getting Started

### Prerequisites

- Node.js (v16+)
- OpenAI API key

### Installation

1. Clone this repository
2. Install dependencies:

```
npm install
```

3. Copy the example environment file and add your OpenAI API key:

```
cp .env.example .env
```

4. Edit the `.env` file and add your OpenAI API key

### Usage

1. Place your documents in the `docs` directory
2. Run the application with your query as a command-line argument:

```
npm start -- "your search query here"
```

For example:

```
npm start -- "How to implement vector search"
```

The script will process all documents in the `docs` directory, create vector embeddings, and return the most relevant document chunks for your query.

## Configuration

You can customize the text chunking parameters in `src/chunking.ts`:

- `chunkSize`: Maximum size of each text chunk (default: 800 tokens)
- `overlap`: Number of tokens overlapping between chunks (default: 100 tokens)

## Technology Stack

- TypeScript
- LangChain
- OpenAI API
- tiktoken for token counting

## Reference

For more information about LangChain's vector stores:

- [LangChain Vector Stores Documentation](https://js.langchain.com/docs/integrations/vectorstores/memory/)
