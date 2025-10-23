import { Request, Response } from 'express';
import Wallet, { IWallet } from '../models/Wallet'; // Import Mongoose Wallet model and interface
import Transaction, { ITransaction } from '../models/Transaction'; // Import Mongoose Transaction model and interface
import { IUser } from '../models/User'; // Import IUser for req.user

/**
 * Retrieves the balance of the authenticated user's wallet.
 * @param req - The Express request object, containing the authenticated user.
 * @param res - The Express response object.
 */
export const getBalance = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id; // Get user ID from authenticated user

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found for this user.' });
    }

    res.status(200).json({ balance: wallet.balance });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ message: 'Server error fetching wallet balance.' });
  }
};

/**
 * Retrieves a list of transactions for the authenticated user's wallet.
 * @param req - The Express request object, containing the authenticated user and query parameters for filtering.
 * @param res - The Express response object.
 */
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)._id; // Get user ID from authenticated user
    const { type, startDate, endDate } = req.query; // Example filters

    const query: any = {
      $or: [{ senderId: userId }, { receiverId: userId }], // Transactions where user is sender or receiver
    };

    if (type) {
      query.type = type; // Filter by transaction type
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

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 }) // Sort by latest
      .limit(100); // Limit for transactions history

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({ message: 'Server error fetching wallet transactions.' });
  }
};