import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  priceBRL: number;
  categoryId: Schema.Types.ObjectId; // Changed from category: string
  type: 'product' | 'service';
  merchantId: Schema.Types.ObjectId; // Reference to the User (merchant)
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  priceBRL: {
    type: Number,
    required: true,
    min: 0, // Prices cannot be negative
  },
  categoryId: { // Changed from category schema definition
    type: Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
    required: true,
  },
  type: {
    type: String,
    enum: ['product', 'service'],
    required: true,
  },
  merchantId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming 'User' is the name of your User model
    required: true,
  },
}, {
  timestamps: true, // Mongoose handles createdAt and updatedAt
});

const Product = model<IProduct>('Product', ProductSchema);

export default Product;
