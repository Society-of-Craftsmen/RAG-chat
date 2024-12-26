import {Pinecone} from '@pinecone-database/pinecone';

let pineconeIndex = null;

const connectPinecone = async () => {
  if (pineconeIndex) return pineconeIndex;

  try {
    const pineconeClient = new Pinecone({apiKey: process.env.PINECONE_API_KEY});
    const pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX_NAME);
    console.log("Pinecone client initialized");
    return pineconeIndex;
  } catch (error) {
    console.error("Pinecone connection error:", error);
  }
};

export default connectPinecone;