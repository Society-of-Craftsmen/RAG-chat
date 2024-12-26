import mongoose from "mongoose";

let mongoConnection = null;

const connectDB = async () => {
  if (mongoConnection) return mongoConnection;

  try {
    mongoConnection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
    return mongoConnection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;