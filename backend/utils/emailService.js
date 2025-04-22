import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendConfirmationEmail = async (to, name) => {
  const htmlContent = `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
      <!-- Header with branding -->
      <div style="background-color: #4f46e5; padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">SwiftBazaar</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 14px;">Your Ultimate E-Commerce Partner</p>
      </div>
      
      <!-- Main content -->
      <div style="padding: 30px;">
        <h2 style="color: #4f46e5; margin-top: 0;">Welcome to SwiftBazaar, ${name}! 🎉</h2>
        
        <p>Thank you for registering your shop with <strong>SwiftBazaar</strong> - the fastest growing e-commerce platform!</p>
        
        <p>You're now part of a community that helps businesses like yours reach millions of customers.</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4f46e5;">
          <p style="margin: 0;">Next steps to get started:</p>
          <ol style="margin: 10px 0 0 20px; padding-left: 15px;">
            <li>Complete your shop profile</li>
            <li>Add your products to the catalog</li>
            <li>Set up your payment methods</li>
          </ol>
        </div>
        
        <a href="https://swiftbazaar.com/dashboard" 
           style="display: inline-block; background-color: #4f46e5; color: white; 
                  padding: 12px 25px; text-decoration: none; border-radius: 6px; 
                  font-weight: bold; margin: 15px 0;">
          Go to Your Dashboard
        </a>
        
        <p style="margin-bottom: 0;">We're excited to see your business grow with us!</p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #eaeaea;">
        <p style="margin: 0;">© ${new Date().getFullYear()} SwiftBazaar. All rights reserved.</p>
        <p style="margin: 5px 0 0;">Need help? Contact us at <a href="mailto:support@swiftbazaar.com" style="color: #4f46e5;">support@swiftbazaar.com</a></p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"SwiftBazaar" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🚀 Welcome to SwiftBazaar - Your Shop is Ready!",
      html: htmlContent,
    });
  } catch (error) {
    console.error("❌ Failed to send confirmation email:", error.message);
    throw error;
  }
};

export const sendOTPEmail = async (to, name, otp) => {
  const htmlContent = `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
      <!-- Header with branding -->
      <div style="background-color: #4f46e5; padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">SwiftBazaar</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 14px;">Secure Shop Verification</p>
      </div>
      
      <!-- Main content -->
      <div style="padding: 30px;">
        <h2 style="color: #4f46e5; margin-top: 0;">Verify Your Shop, ${name}!</h2>
        
        <p>For your security, please use the following One-Time Password to verify your shop registration:</p>
        
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 6px; 
                    border: 1px dashed #d1d5db; margin: 25px 0; font-size: 32px; font-weight: bold; 
                    letter-spacing: 2px; color: #4f46e5;">
          ${otp}
        </div>
        
        <p style="margin-bottom: 25px;">
          <span style="color: #ef4444; font-weight: bold;">⚠️ Important:</span> 
          This OTP is valid for <strong>10 minutes</strong>. Never share this code with anyone.
        </p>
        
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #ef4444;">
          <p style="margin: 0; color: #7c2d12; font-size: 14px;">
            If you didn't request this OTP, please secure your account by changing your password immediately 
            and contact our support team at <a href="mailto:support@swiftbazaar.com" style="color: #4f46e5;">support@swiftbazaar.com</a>.
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #eaeaea;">
        <p style="margin: 0;">© ${new Date().getFullYear()} SwiftBazaar. All rights reserved.</p>
        <p style="margin: 5px 0 0;">This is an automated message - please do not reply directly to this email.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"SwiftBazaar" <${process.env.EMAIL_USER}>`,
      to,
      subject: `🔐 Your SwiftBazaar Verification Code: ${otp}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    throw error;
  }
};

export const sendPasswordResetEmail = async (to, name, resetURL) => {
  const htmlContent = `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
      <!-- Header with branding -->
      <div style="background-color: #4f46e5; padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">SwiftBazaar</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 14px;">Password Reset Request</p>
      </div>
      
      <!-- Main content -->
      <div style="padding: 30px;">
        <h2 style="color: #4f46e5; margin-top: 0;">Hello, ${name}!</h2>
        
        <p>We received a request to reset your SwiftBazaar account password. Click the button below to create a new password:</p>
        
        <a href="${resetURL}" 
           style="display: inline-block; background-color: #4f46e5; color: white; 
                  padding: 12px 25px; text-decoration: none; border-radius: 6px; 
                  font-weight: bold; margin: 20px 0;">
          Reset Your Password
        </a>
        
        <p style="margin-bottom: 20px;">
          <span style="color: #ef4444; font-weight: bold;">⚠️ Important:</span> 
          This link will expire in <strong>15 minutes</strong>. If you didn't request a password reset, please ignore this email.
        </p>
        
        <p style="font-size: 14px; color: #6b7280;">
          Can't click the button? Copy and paste this link into your browser:<br>
          <span style="word-break: break-all;">${resetURL}</span>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #eaeaea;">
        <p style="margin: 0;">© ${new Date().getFullYear()} SwiftBazaar. All rights reserved.</p>
        <p style="margin: 5px 0 0;">For security reasons, please do not share this email with anyone.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"SwiftBazaar" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🔒 Password Reset Request for Your SwiftBazaar Account",
      html: htmlContent,
    });
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error.message);
    throw error;
  }
};