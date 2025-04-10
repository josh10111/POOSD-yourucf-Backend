const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  throw new Error('Missing SENDGRID_API_KEY environment variable');
}
sgMail.setApiKey(apiKey);

const sendVerificationEmail = async (to, token) => {
  const verificationUrl = `https://yourucf.com/api/verify-email?token=${token}`;

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #0077cc;">Welcome to Your UCF!</h2>
    <p>Thanks for signing up. Please verify your email address by clicking the button below:</p>
    <a href="${verificationUrl}" style="
        display: inline-block;
        background-color: #0077cc;
        color: #fff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 4px;
        margin: 10px 0;
      ">Verify Email</a>
    <p>If the button doesn't work, copy and paste the following link into your browser:</p>
    <p style="word-break: break-all;"><a href="${verificationUrl}">${verificationUrl}</a></p>
    <p>Thank you,<br/>The Your UCF Team</p>
  </div>
`;

  const msg = {
    to,
    from: 'no-reply@yourucf.com',
    subject: 'Verify Your Email',
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending email', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (to, token) => {
  const resetUrl = `https://yourucf.com/resetpassword?token=${token}`;

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #0077cc;">Reset Your Password</h2>
    <p>You requested to reset your password. Click the button below to set a new password:</p>
    <a href="${resetUrl}" style="
        display: inline-block;
        background-color: #F1CA3B;
        color: #000;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 4px;
        margin: 10px 0;
      ">Reset Password</a>
    <p>If the button doesn't work, copy and paste the following link into your browser:</p>
    <p style="word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you didn't request this password reset, you can safely ignore this email.</p>
    <p>Thank you,<br/>The Your UCF Team</p>
  </div>
`;

  const msg = {
    to,
    from: 'no-reply@yourucf.com',
    subject: 'Reset Your Password',
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log('Password reset email sent');
  } catch (error) {
    console.error('Error sending email', error);
    throw error;
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
