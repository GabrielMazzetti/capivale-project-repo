import mongoose from 'mongoose'; // Import mongoose
import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI } = process.env; // Use MONGO_URI for MongoDB

if (!MONGO_URI) {
  throw new Error('MongoDB connection URI is missing in .env file');
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit process with failure
  }
};
