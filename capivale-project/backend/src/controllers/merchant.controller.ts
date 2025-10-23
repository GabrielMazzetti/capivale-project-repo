import { Request, Response } from 'express';
import Wallet, { IWallet } from '../models/Wallet';
import Transaction, { ITransaction } from '../models/Transaction';
import User, { IUser } from '../models/User'; // Added User import
import Product from '../models/Product';
import Sale from '../models/Sale';
import SaleItem from '../models/SaleItem';
import { Types } from 'mongoose'; // Import Types for ObjectId

/**
 * Retrieves dashboard data for a merchant, including wallet balance and sales summary.
 * @param req - The Express request object, containing the authenticated user.
 * @param res - The Express response object.
 */
export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id; // Merchant's user ID (Mongoose _id)

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Get wallet balance
    const wallet = await Wallet.findOne({ userId: userId.toString() }); // Convert ObjectId to string for query
    const balance = wallet ? wallet.balance : 0;

    // Calculate sales summary (transactions where merchant is receiver)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Mongoose aggregation for sum
    const salesSummary = await Transaction.aggregate([
      {
        $match: {
          receiverId: userId.toString(), // Convert ObjectId to string
          type: { $in: ['payment', 'transfer'] },
          createdAt: { $gte: startOfMonth }, // Start from the beginning of the month
        },
      },
      {
        $group: {
          _id: null,
          totalSalesThisMonth: { $sum: '$amount' },
          totalSalesThisWeek: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', startOfWeek] }, '$amount', 0],
            },
          },
          totalSalesToday: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', today] }, '$amount', 0],
            },
          },
        },
      },
    ]);

    const summary = salesSummary.length > 0 ? salesSummary[0] : { totalSalesToday: 0, totalSalesThisWeek: 0, totalSalesThisMonth: 0 };

    res.status(200).json({
      balance,
      salesSummary: {
        today: summary.totalSalesToday,
        thisWeek: summary.totalSalesThisWeek,
        thisMonth: summary.totalSalesThisMonth,
      },
    });
  } catch (error) {
    console.error('Error fetching merchant dashboard data:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data.' });
  }
};

/**
 * Retrieves a list of transactions for a merchant (sales history).
 * @param req - The Express request object, containing the authenticated user and query parameters for filtering.
 * @param res - The Express response object.
 */
export const getSalesHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id; // Merchant's user ID (Mongoose _id)
    const { startDate, endDate, paymentMethod } = req.query; // Filters

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    const query: any = { merchantId: userId };

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate as string);
      }
    }

    const sales = await Sale.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    const salesWithItems = await Promise.all(sales.map(async (sale) => {
      const items = await SaleItem.find({ saleId: sale._id }).populate('productId', 'name priceBRL');
      return {
        ...sale.toObject(), // Convert Mongoose document to plain object
        items: items.map(item => ({
          productId: (item.productId as any)._id,
          productName: (item.productId as any).name,
          unitPriceBRL: item.unitPriceBRL,
          quantity: item.quantity,
        })),
      };
    }));


    res.status(200).json(salesWithItems);
  } catch (error) {
    console.error('Error fetching merchant sales history:', error);
    res.status(500).json({ message: 'Server error fetching sales history.' });
  }
};

/**
 * Generates a payment request (e.g., QR code data) for a merchant.
 * This is a placeholder for actual QR code generation logic.
 * @param req - The Express request object, containing the authenticated user and amount.
 * @param res - The Express response object.
 */
export const generatePaymentRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id; // Merchant's user ID (Mongoose _id)
    const { amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ message: 'User ID and amount are required.' });
    }

    // In a real application, this would generate a unique payment ID and QR code data.
    // For now, we'll return a mock QR code string.
    const paymentId = `PAY-${Date.now()}-${userId.toString().substring(0, 4)}`; // Use toString()
    const qrCodeData = `capivale://pay?merchantId=${userId.toString()}&amount=${amount}&paymentId=${paymentId}`; // Use toString()

    res.status(200).json({
      paymentId,
      qrCodeData,
      message: 'Payment request generated. Display this QR code data to the customer.',
    });
  } catch (error) {
    console.error('Error generating payment request:', error);
    res.status(500).json({ message: 'Server error generating payment request.' });
  }
};

// Profile Management
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id;

    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id;
    const { name, email, cnpj, companyName, phone, address } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email; // Consider adding email verification if email is changed
    if (cnpj) user.cnpj = cnpj;
    if (companyName) user.companyName = companyName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};

// Product Management

export const createProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id;
    const { name, description, priceBRL, categoryId, type } = req.body; // Changed category to categoryId

    if (!name || priceBRL === undefined || priceBRL < 0 || !categoryId || !type) { // Changed category to categoryId
      return res.status(400).json({ message: 'Product name, price in BRL, category, and type are required.' });
    }

    if (!['product', 'service'].includes(type)) { // Validate type enum
      return res.status(400).json({ message: 'Invalid product type. Must be \'product\' or \'service\'.' });
    }

    const product = new Product({
      name,
      description,
      priceBRL,
      categoryId, // Changed category to categoryId
      type,
      merchantId: userId,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error creating product.' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id;
    const products = await Product.find({ merchantId: userId }).populate('categoryId', 'name'); // Populate category name
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products.' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id;
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, merchantId: userId }).populate('categoryId', 'name'); // Populate category name

    if (!product) {
      return res.status(404).json({ message: 'Product not found or not owned by merchant.' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error fetching product.' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id;
    const { id } = req.params;
    const { name, description, priceBRL, categoryId, type } = req.body; // Changed category to categoryId

    if (!name || priceBRL === undefined || priceBRL < 0 || !categoryId || !type) { // Changed category to categoryId
      return res.status(400).json({ message: 'Product name, price in BRL, category, and type are required.' });
    }

    if (!['product', 'service'].includes(type)) { // Validate type enum
      return res.status(400).json({ message: 'Invalid product type. Must be \'product\' or \'service\'.' });
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, merchantId: userId },
      { name, description, priceBRL, categoryId, type }, // Changed category to categoryId
      { new: true } // Return the updated document
    );


    if (!product) {
      return res.status(404).json({ message: 'Product not found or not owned by merchant.' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error updating product.' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id;
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id, merchantId: userId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or not owned by merchant.' });
    }

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error deleting product.' });
  }
};

// Sales Management (POS)

export const registerSale = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id;
    const { items, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0 || !paymentMethod) {
      return res.status(400).json({ message: 'Items and payment method are required.' });
    }

    let totalAmountBRL = 0;
    const saleItemsData = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, merchantId: userId });

      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found or not owned by merchant.` });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({ message: `Quantity for product ${product.name} must be positive.` });
      }

      const unitPriceBRL = product.priceBRL;
      totalAmountBRL += unitPriceBRL * item.quantity;
      saleItemsData.push({
        productId: product._id,
        quantity: item.quantity,
        unitPriceBRL: unitPriceBRL,
      });
    }

    const sale = new Sale({
      merchantId: userId,
      totalAmountBRL,
      paymentMethod,
      // customerId: (optional, if you want to link to a specific customer user)
    });

    await sale.save();

    // Create SaleItem documents and link them to the created sale
    const createdSaleItems = saleItemsData.map(item => ({
      ...item,
      saleId: sale._id,
    }));
    await SaleItem.insertMany(createdSaleItems);

    // TODO: FASE 2 - Integrar lógica de pagamento com Carteira Capivale

    res.status(201).json({
      message: 'Sale registered successfully!',
      saleId: sale._id,
      totalAmountBRL: sale.totalAmountBRL,
      paymentMethod: sale.paymentMethod,
      items: saleItemsData,
    });
  } catch (error) {
    console.error('Error registering sale:', error);
    res.status(500).json({ message: 'Server error registering sale.' });
  }
};