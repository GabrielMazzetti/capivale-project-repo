// backend/src/models/index.ts
// This file will be simplified as models are converted to Mongoose
import User from './User';
import Product from './Product';
import Sale from './Sale';
import SaleItem from './SaleItem';
import ConversionRate from './ConversionRate';

// Export all Mongoose models
export { User, Product, Sale, SaleItem, ConversionRate };

// Other models (Wallet, Transaction, PasswordReset, Question) will be converted
// and imported directly where needed, or added here as they are converted.
// Associations will be handled within Mongoose schemas.