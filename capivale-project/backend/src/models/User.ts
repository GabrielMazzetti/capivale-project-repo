import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Define the interface for User document
export interface IUser extends Document {
  id: string; // Mongoose uses _id by default, but we can map it
  name: string;
  email: string;
  cpf: string;
  cnpj?: string; // Added CNPJ
  companyName?: string; // Added Company Name
  phone?: string; // Added Phone
  address?: string; // Added Address
  password?: string;
  role: 'citizen' | 'merchant' | 'admin';
  status: 'active' | 'pending_verification' | 'inactive';
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  // Mongoose automatically creates _id as ObjectId
  // We can add a virtual 'id' getter if needed, or just use _id
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  cnpj: { // Added CNPJ schema definition
    type: String,
    required: false,
    unique: true, // CNPJ should also be unique
    sparse: true, // Allows multiple documents to have null/undefined CNPJ
    trim: true,
  },
  companyName: { // Added Company Name schema definition
    type: String,
    required: false,
    trim: true,
  },
  phone: { // Added Phone schema definition
    type: String,
    required: false,
    trim: true,
  },
  address: { // Added Address schema definition
    type: String,
    required: false,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Do not return password by default in queries
  },
  role: {
    type: String,
    enum: ['citizen', 'merchant', 'admin'],
    default: 'citizen',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'pending_verification', 'inactive'],
    default: 'pending_verification',
    required: true,
  },
  emailVerifiedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // Mongoose handles createdAt and updatedAt
});

// Hash password before saving (pre-save hook)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser>('User', UserSchema);

export default User;