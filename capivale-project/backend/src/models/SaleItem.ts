import { Schema, model, Document } from 'mongoose';

export interface ISaleItem extends Document {
  saleId: Schema.Types.ObjectId; // Reference to the Sale
  productId: Schema.Types.ObjectId; // Reference to the Product
  quantity: number;
  unitPriceBRL: number;
  createdAt: Date;
  updatedAt: Date;
}

const SaleItemSchema = new Schema<ISaleItem>({
  saleId: {
    type: Schema.Types.ObjectId,
    ref: 'Sale',
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Quantity must be at least 1
  },
  unitPriceBRL: {
    type: Number,
    required: true,
    min: 0, // Price cannot be negative
  },
}, {
  timestamps: true,
});

const SaleItem = model<ISaleItem>('SaleItem', SaleItemSchema);

export default SaleItem;
