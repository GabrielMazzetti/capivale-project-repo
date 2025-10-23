import { Schema, model, Document } from 'mongoose';

export interface ISale extends Document {
  totalAmountBRL: number;
  paymentMethod: 'external_cash' | 'external_pix' | 'external_card';
  merchantId: Schema.Types.ObjectId; // Reference to the User (merchant)
  customerId?: Schema.Types.ObjectId; // Optional reference to a User (customer)
  createdAt: Date;
  updatedAt: Date;
}

const SaleSchema = new Schema<ISale>({
  totalAmountBRL: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['external_cash', 'external_pix', 'external_card'],
    required: true,
  },
  merchantId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming 'User' is the name of your User model
    required: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
}, {
  timestamps: true,
});

const Sale = model<ISale>('Sale', SaleSchema);

export default Sale;
