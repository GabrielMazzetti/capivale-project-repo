import { Request, Response } from 'express';
import { IUser } from '../models/User'; // Import IUser interface

/**
 * Placeholder for the user controller.
 */
export const getProfile = async (req: Request, res: Response) => {
  // The user object is attached to the request by the `protect` middleware
  const user = req.user as IUser; // Cast req.user to IUser
  res.status(200).json({ user });
};