import { verifyToken } from "../../../middleware/verifyToken";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import connectDB from "@/utils/mongodb";
import connectPinecone from "@/utils/pinecone";
import mongoose from 'mongoose';
import axios from 'axios';

const handler = async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ error: "Message and userId are required" });
  }

  try {
    await connectDB();
    const index = await connectPinecone();

    // Split message into chunks
    const CHUNK_SIZE = 500;
    const messageChunks = [];
    for (let i = 0; i < message.length; i += CHUNK_SIZE) {
      messageChunks.push(message.slice(i, i + CHUNK_SIZE));
    }

    // Generate embeddings for message chunks
    const embeddingModel = new HuggingFaceTransformersEmbeddings({
      model: "Xenova/all-MiniLM-L6-v2",
    });

    const messageEmbeddings = [];
    for (const chunk of messageChunks) {
      const embedding = await embeddingModel.embedQuery(chunk);
      messageEmbeddings.push(embedding);
    }

    // Match embeddings with file embeddings and get top 5 matching chunks
    const topChunks = await index.query({
      topK: 5,
      vector: messageEmbeddings[0], // Assuming single chunk for simplicity
      includeMetadata: true,
    });

    // Combine top chunks into a single context
    const context = topChunks.matches.map(match => match.metadata.chunk).join(" ");

    // Generate response using Hugging Face Inference API
    const response = await axios.post('https://api-inference.huggingface.co/models/gpt-3.5-turbo', {
      inputs: {
        context,
        message,
      },
    }, {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
      },
    });

    const botResponse = response.data.generated_text;

    // Save user query and bot response to MongoDB
    const ChatModel = mongoose.model("chats", new mongoose.Schema({
      userId: String,
      message: String,
      response: String,
      createdAt: Date,
    }));

    await ChatModel.create({
      userId,
      message,
      response: botResponse,
      createdAt: new Date(),
    });

    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', `*`); //${process.env.FRONTEND_URL}
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    // Pre-flight request (OPTIONS)
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  verifyToken(req, res, () => handler(req, res));
};