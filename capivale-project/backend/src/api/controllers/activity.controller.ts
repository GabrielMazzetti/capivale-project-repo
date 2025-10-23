import { Request, Response } from 'express';
import Activity from '../../models/Activity';
import crypto from 'crypto';
import ActivityLedger from '../../models/ActivityLedger';
import Wallet from '../../models/Wallet';
import { IUser } from '../../models/User';

// Admin: Create a new activity
export const createActivity = async (req: Request, res: Response) => {
  try {
    const { title, description, reward_amount } = req.body;

    if (!title || !description || reward_amount === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newActivity = new Activity({
      title,
      description,
      reward_amount,
    });

    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Get all activities
export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Update an activity
export const updateActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, reward_amount } = req.body;

    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      { title, description, reward_amount },
      { new: true, runValidators: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Delete an activity
export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedActivity = await Activity.findByIdAndDelete(id);

    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// ####################################################################
// #                          USER FACING                           #
// ####################################################################

// User: List all available activities
export const listActivitiesForUser = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// User: Complete an activity and get the reward
export const completeActivity = async (req: Request, res: Response) => {
  try {
    const { id: activityId } = req.params;
    const user = req.user as IUser; // From authMiddleware

    // 1. Find the activity
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // 2. Get the last block in the ledger to find the previous hash
    const lastBlock = await ActivityLedger.findOne().sort({ createdAt: -1 });
    const previous_hash = lastBlock ? lastBlock.current_hash : null;

    // 3. Create the data for the new block
    const blockData = {
      userId: user._id,
      activityId: activity._id,
      amount: activity.reward_amount,
      timestamp: new Date(),
      previous_hash: previous_hash,
    };

    // 4. Calculate the current hash
    const current_hash = crypto.createHash('sha256').update(JSON.stringify(blockData)).digest('hex');

    // 5. Create and save the new block (ledger entry)
    const newBlock = new ActivityLedger({ ...blockData, current_hash });
    await newBlock.save();

    // 6. Update user's wallet
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId: user._id },
      { $inc: { balance: activity.reward_amount } },
      { new: true, upsert: true } // upsert: create wallet if it doesn't exist
    );

    res.status(200).json({
      message: 'Activity completed successfully!',
      reward: activity.reward_amount,
      newBalance: updatedWallet?.balance,
      block: newBlock,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};