import { Request, Response } from 'express';
import { ConversionRate } from '../../models';

export const getLatestCapivaleBRLRate = async (req: Request, res: Response) => {
  try {
    // Find the latest conversion rate by effectiveDate in descending order
    const latestRate = await ConversionRate.findOne().sort({ effectiveDate: -1 }).exec();

    if (!latestRate) {
      return res.status(404).json({ message: 'No conversion rate found.' });
    }

    res.status(200).json({ rate: latestRate.rate });
  } catch (error) {
    console.error('Error fetching latest Capivale-BRL rate:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
