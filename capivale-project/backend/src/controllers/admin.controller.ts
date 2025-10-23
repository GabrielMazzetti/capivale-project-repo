import { Request, Response } from 'express';
import User, { IUser } from '../models/User'; // Import Mongoose User model and interface
import Wallet, { IWallet } from '../models/Wallet'; // Import Mongoose Wallet model and interface
import Transaction, { ITransaction } from '../models/Transaction'; // Import Mongoose Transaction model and interface
import { Types } from 'mongoose'; // Import Types for ObjectId

// These are placeholders. In a real application, you would fetch this data from your database.

export const getPlatformStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalMerchants = await User.countDocuments({ role: 'merchant' });
        const totalWallets = await Wallet.countDocuments(); // Assuming each user has a wallet

        // Sum of all balances in wallets
        const totalCapivalesInCirculationResult = await Wallet.aggregate([
            {
                $group: {
                    _id: null,
                    totalBalance: { $sum: '$balance' },
                },
            },
        ]);
        const totalCapivalesInCirculation = totalCapivalesInCirculationResult.length > 0 ? totalCapivalesInCirculationResult[0].totalBalance : 0;

        // Volume transacted last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const volumeTransactedLast30DaysResult = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                    type: { $in: ['transfer', 'payment'] }, // Only count actual transfers/payments
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                },
            },
        ]);
        const volumeTransactedLast30Days = volumeTransactedLast30DaysResult.length > 0 ? volumeTransactedLast30DaysResult[0].totalAmount : 0;

        res.status(200).json({
            totalUsers,
            totalMerchants,
            totalCapivalesInCirculation,
            volumeTransactedLast30Days
        });
    } catch (error) {
        console.error('Error fetching platform stats:', error);
        res.status(500).json({ message: 'Server error fetching platform stats.' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password'); // Exclude password
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Server error fetching users.' });
    }
};

export const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!Types.ObjectId.isValid(id)) { // Validate ObjectId
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.status = status;
        await user.save();

        res.status(200).json({ message: `User ${user.email} status updated to ${status}`, user });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Server error updating user status.' });
    }
};

export const getAllTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find()
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching all transactions:', error);
        res.status(500).json({ message: 'Server error fetching all transactions.' });
    }
};

export const mintTokens = async (req: Request, res: Response) => {
    try {
        const { userId, amount } = req.body;

        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ message: 'User ID and a positive amount are required.' });
        }

        if (!Types.ObjectId.isValid(userId)) { // Validate ObjectId
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Ensure user._id is treated as a string for consistency with userId in Wallet/Transaction
        const userIdString = (user._id as Types.ObjectId).toString(); // Explicitly cast to Types.ObjectId

        let wallet = await Wallet.findOne({ userId: userIdString }); // Use userIdString
        if (!wallet) {
            // Create wallet if it doesn't exist
            wallet = await Wallet.create({ userId: userIdString, balance: 0 });
        }

        // Create mint transaction
        const mintTransaction = await Transaction.create({
            senderId: null,
            receiverId: userIdString, // Use userIdString
            amount: amount,
            type: 'admin_mint',
            status: 'completed',
            description: `Admin mint of ${amount} for ${user.email}`,
        });

        // Update wallet balance
        wallet.balance += amount;
        await wallet.save();

        res.status(200).json({
            message: `${amount} tokens minted for user ${user.email}`,
            transaction: mintTransaction,
            newBalance: wallet.balance,
        });
    } catch (error) {
        console.error('Error minting tokens:', error);
        res.status(500).json({ message: 'Server error minting tokens.' });
    }
};