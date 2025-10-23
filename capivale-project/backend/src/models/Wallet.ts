import { Schema, model, Document } from 'mongoose';

// Define the interface for Wallet document
export interface IWallet extends Document {
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>({
  userId: {
    type: String, // Assuming userId will be a string (ObjectId from User)
    required: true,
    unique: true, // One wallet per user
  },
  balance: {
    type: Number, // Mongoose uses Number for decimals
    default: 0.00,
    required: true,
  },
}, {
  timestamps: true, // Mongoose handles createdAt and updatedAt
});

const Wallet = model<IWallet>('Wallet', WalletSchema);

export default Wallet;