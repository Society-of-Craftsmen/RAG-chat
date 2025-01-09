import { verifyToken } from "../../../middleware/verifyToken";
import multer from "multer";
import pdfParse from "pdf-parse";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import connectDB from "@/utils/mongodb";
import connectPinecone from "@/utils/pinecone";
import mongoose from 'mongoose';

const upload = multer({storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 }}).single("file");

export const config = {
  api: {
    bodyParser: false,
  }
};

const handler = async (req, res) => {

  upload( req, res, async (err) => {
    if (err) return res.status(400).json({error: "File upload unsuccessful"});
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const index = await connectPinecone();
      await connectDB();
      // decoded uid from authenticate middleware
      const userId = req.user.uid;

      // Parse the PDF
      const fileBuffer = file.buffer;
      const parsedPDF = await pdfParse(fileBuffer);
      const text = parsedPDF.text;

      // Split text into chunks
      const CHUNK_SIZE = 500;
      const textChunks = [];
      for (let i = 0; i < text.length; i += CHUNK_SIZE) {
        textChunks.push(text.slice(i, i + CHUNK_SIZE));
      }

      // Generate embeddings
      const embeddingModel = new HuggingFaceTransformersEmbeddings({
        model: "Xenova/all-MiniLM-L6-v2",
      });

      const embeddings = [];
      for (const chunk of textChunks) {
        const embedding = await embeddingModel.embedQuery(chunk); // test this result
        embeddings.push({
          vector: embedding,
          chunk: chunk
        });
      }

      // Store embeddings in Pinecone
      let i = 0;
      for (const { vector, chunk } of embeddings) {
        await index.namespace('ns1').upsert([{ id: `${file.originalname}-${Date.now()}-${i}`, values: vector, metadata: { chunk, userId } }]);
        i++;
      }

      // Save metadata in MongoDB
      const PDFModel = mongoose.models.pdfs || mongoose.model("pdfs", new mongoose.Schema({
        userId: String,
        fileName: String,
        uploadedAt: Date
      }));
      await PDFModel.create({
        userId: userId,
        fileName: file.originalname,
        uploadedAt: new Date()
      });

      return res.status(200).json({ message: "File uploaded and processed successfully" });

    } catch (err) {
      return res.status(500).json({error : `Internal server error ${err}`});
    }
  });
};

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  await verifyToken(req, res, async () => handler(req, res));
}