import { verifyToken } from "../../../middleware/verifyToken";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import connectDB from "@/utils/mongodb";
import connectPinecone from "@/utils/pinecone";
import mongoose from 'mongoose';
import axios from 'axios';

const handler = async (req, res) => {
  const {message} = req.body;
  //const userId = user?.uid;
  if (!message) {
    return res.status(400).json({ error: "Message and userId are required" });
  }

  try {
    await connectDB();
    const index = await connectPinecone();

    
    const indexInfo = await index.describeIndexStats();
    console.log("Index stats:", indexInfo);
    
    
    // Split message into chunks
    const CHUNK_SIZE = 1000;
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

    // Debug: Log embeddings and userId
    //console.log("User ID:", userId);
    //console.log("Query vector dimension:", messageEmbeddings[0]?.length);

    // Match embeddings with file embeddings and get top 5 matching chunks
    const searchResponse = await index.namespace('ns1').query({
      vector: messageEmbeddings[0],
      topK: 5,
      //filter: { userId },
      includeMetadata: true,
      includeValues: true
    });

    //console.log("Search response----------------->:", JSON.stringify(searchResponse, null, 2));

    // Extract matching chunks from metadata
    const matchingChunks = searchResponse.matches.map(match => match.metadata.chunk);
    const context = matchingChunks.join(" ");

    // Debug logs
    console.log("Number of matches found:", searchResponse.matches.length);
    //console.log("First chunk:", matchingChunks[0]);
    //console.log("Context:", context);

    // Generate response using Hugging Face Inference API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/timpal0l/mdeberta-v3-base-squad2',
      {
        inputs: {
          question: message,
          context: context
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // The response format from this model will be different
    // It returns an array with answer, score, and start/end positions
    console.log("Bot response:+++++++++++++++++++++++", response.data.answer);
    const botResponse = response.data.answer;
    if(!response.data.answer){
      botResponse = "No answer found";
    }


    // Save user query and bot response to MongoDB
    // const ChatModel = mongoose.model("chats", new mongoose.Schema({
    //   userId: String,
    //   message: String,
    //   response: String,
    //   createdAt: Date,
    // }));

    // await ChatModel.create({
    //   userId,
    //   message,
    //   response: botResponse,
    //   createdAt: new Date(),
    // });

    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Internal server erro r" });
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