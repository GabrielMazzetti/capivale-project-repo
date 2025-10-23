import nodemailer from 'nodemailer';

/**
 * Service class for handling email sending.
 * In a real application, this would be configured with a proper email service provider.
 */
export class EmailService {

  /**
   * Simulates sending a verification email.
   * @param email - The recipient's email address.
   * @param token - The verification token.
   */
  static async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `http://localhost:3001/api/auth/verify-email?token=${token}`;
    console.log('---- SIMULATING EMAIL SEND ----');
    console.log(`To: ${email}`);
    console.log('Subject: Verify Your Capivale Account');
    console.log(`Body: Click here to verify your account: ${verificationLink}`);
    console.log('-------------------------------');
    // In a real implementation:
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({...});
  }

  /**
   * Simulates sending a password reset email.
   * @param email - The recipient's email address.
   * @param token - The password reset token.
   */
  static async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    console.log('---- SIMULATING EMAIL SEND ----');
    console.log(`To: ${email}`);
    console.log('Subject: Reset Your Capivale Password');
    console.log(`Body: Click here to reset your password: ${resetLink}`);
    console.log('-------------------------------');
  }
}
