import { Request, Response } from 'express';
import User, { IUser } from '../models/User'; // Import Mongoose User model and interface
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { EmailService } from '../services/EmailService';

// Extend the Request interface to include the user property for Mongoose User
declare global {
    namespace Express {
        interface Request {
            user?: IUser; // Use IUser for req.user
        }
    }
}

const generateTokens = (user: IUser) => { // Use IUser
    const accessToken = jwt.sign(
        { id: user._id, role: user.role }, // Use _id for Mongoose
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { id: user._id, role: user.role }, // Use _id for Mongoose
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
    // TODO: Add express-validator for input validation
    const { name, email, cpf, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email }); // Mongoose findOne
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, cpf, password, role }); // Mongoose create

        // In a real app, you would generate a verification token and send an email
        // await EmailService.sendVerificationEmail(user.email, 'some_verification_token');

        res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);
    console.log('Provided password:', password);

    try {
        const user = await User.findOne({ email }).select('+password'); // Mongoose findOne, select password
        console.log('User found:', user ? user.email : 'None');
        if (user) {
            console.log('User hashed password from DB:', user.password);
            const isPasswordCorrect = await user.comparePassword(password);
            console.log('Password comparison result:', isPasswordCorrect);

            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
            }
        } else {
            return res.status(401).json({ message: 'Invalid credentials (user not found)' });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ message: 'Account not verified or is inactive.' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } }); // Use _id

    } catch (error: any) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    // This is a placeholder. In a real app, you would have a token model
    // to verify against.
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ message: 'Verification token is required' });
    }

    // const user = await User.findOne({ verificationToken: token }); // Mongoose findOne
    // if (!user) return res.status(400).json({ message: 'Invalid token' });

    // user.status = 'active';
    // user.emailVerifiedAt = new Date();
    // await user.save(); // Mongoose save

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
};

export const forgotPassword = async (req: Request, res: Response) => {
    // Placeholder logic
    const { email } = req.body;
    const user = await User.findOne({ email }); // Mongoose findOne
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // In a real app, create a reset token, save it to DB, and send email
    // const resetToken = crypto.randomBytes(32).toString('hex');
    // await EmailService.sendPasswordResetEmail(email, resetToken);
    res.status(200).json({ message: 'Password reset link sent to your email' });
};

export const resetPassword = async (req: Request, res: Response) => {
    // Placeholder logic
    const { token, password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }
    // Here you would find user by token, verify token is not expired, update password
    // const user = await User.findOne({ resetToken: token }); // Mongoose findOne
    // if (!user) return res.status(400).json({ message: 'Invalid token' });
    // user.password = password;
    // await user.save(); // Mongoose save
    res.status(200).json({ message: 'Password has been reset successfully' });
};