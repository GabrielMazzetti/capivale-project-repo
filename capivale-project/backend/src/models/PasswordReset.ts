import { Schema, model, Document } from 'mongoose';

// Define the interface for PasswordReset document
export interface IPasswordReset extends Document {
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>({
  email: {
    type: String,
    required: true,
    unique: true, // One reset token per email
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '1h' }, // Token expires after 1 hour
  },
}, {
  timestamps: true, // Mongoose handles createdAt and updatedAt
});

const PasswordReset = model<IPasswordReset>('PasswordReset', PasswordResetSchema);

export default PasswordReset;