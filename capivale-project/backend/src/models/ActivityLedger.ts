import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';
import { IActivity } from './Activity';

// Interface for ActivityLedger document
export interface IActivityLedger extends Document {
  userId: IUser['_id'];
  activityId: IActivity['_id'];
  amount: number;
  timestamp: Date;
  current_hash: string;
  previous_hash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLedgerSchema = new Schema<IActivityLedger>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  activityId: {
    type: Schema.Types.ObjectId,
    ref: 'Activity',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  current_hash: {
    type: String,
    required: true,
    unique: true,
  },
  previous_hash: {
    type: String,
    default: null,
  },
}, {
  timestamps: true, // Mongoose handles createdAt and updatedAt
});

const ActivityLedger = model<IActivityLedger>('ActivityLedger', ActivityLedgerSchema);

export default ActivityLedger;
