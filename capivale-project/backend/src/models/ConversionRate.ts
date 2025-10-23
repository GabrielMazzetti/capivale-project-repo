import { Schema, model, Document } from 'mongoose';

export interface IConversionRate extends Document {
  rate: number;
  effectiveDate: Date;
  adminId: Schema.Types.ObjectId; // Reference to the User (admin)
  createdAt: Date;
  updatedAt: Date;
}

const ConversionRateSchema = new Schema<IConversionRate>({
  rate: {
    type: Number,
    required: true,
    min: 0, // Rate cannot be negative
  },
  effectiveDate: {
    type: Date,
    required: true,
    default: Date.now, // Default to current date if not provided
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming 'User' is the name of your User model
    required: true,
  },
}, {
  timestamps: true,
});

const ConversionRate = model<IConversionRate>('ConversionRate', ConversionRateSchema);

export default ConversionRate;
