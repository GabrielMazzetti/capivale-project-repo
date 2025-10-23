import { Schema, model, Document } from 'mongoose';

// Interface for Activity document
export interface IActivity extends Document {
  title: string;
  description: string;
  reward_amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  reward_amount: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  timestamps: true, // Mongoose handles createdAt and updatedAt
});

const Activity = model<IActivity>('Activity', ActivitySchema);

export default Activity;
