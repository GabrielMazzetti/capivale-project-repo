import { Schema, model, Document } from 'mongoose';

type TransactionType = 'transfer' | 'payment' | 'health_reward' | 'admin_mint';
type TransactionStatus = 'completed' | 'pending' | 'failed';

// Define the interface for Transaction document
export interface ITransaction extends Document {
  senderId: string | null; // Reference to User _id
  receiverId: string; // Reference to User _id
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  senderId: {
    type: String, // Will store User ObjectId as string
    ref: 'User', // Reference to User model
    default: null,
  },
  receiverId: {
    type: String, // Will store User ObjectId as string
    ref: 'User', // Reference to User model
    required: true,
  },
  amount: {
    type: Number, // Mongoose uses Number for decimals
    required: true,
  },
  type: {
    type: String,
    enum: ['transfer', 'payment', 'health_reward', 'admin_mint'],
    required: true,
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'completed',
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
}, {
  timestamps: true, // Mongoose handles createdAt and updatedAt
});

const Transaction = model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;