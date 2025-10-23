import { Schema, model, Document } from 'mongoose';

// Define the interface for Question document
export interface IQuestion extends Document {
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String, // Mongoose uses String for TEXT
    required: true,
  },
}, {
  timestamps: true, // Mongoose handles createdAt and updatedAt
});

const Question = model<IQuestion>('Question', QuestionSchema);

export { Question };