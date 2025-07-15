import { Resend } from "resend";
import { validateEnv } from "../config/env.config";

const {
  RESEND_API_KEY_WAITLIST,
  CLIENT_URL,
  RESEND_API_KEY_VERIFY_ACCOUNT,
  RESEND_API_KEY_WELCOME,
} = validateEnv();

const waitlistResend = new Resend(RESEND_API_KEY_WAITLIST);
const verifyAccountResend = new Resend(RESEND_API_KEY_VERIFY_ACCOUNT);
const welcomeResend = new Resend(RESEND_API_KEY_WELCOME);

/**
 * Sends a confirmation email to a user who has just joined the waitlist.
 * @param email The email address of the recipient.
 */
export const sendWaitlistConfirmationEmail = async (email: string) => {
  try {
    const { data, error } = await waitlistResend.emails.send({
      from: "taskipline@emmy-akintz.tech",
      to: [email],
      subject: "You're on the Taskipline Waitlist!",
      // background-color: oklch(0.145 0 0); color: oklch(1 0 0);
      html: `
        <div style="font-family: sans-serif; padding: 20px; font-size: 16px; line-height: 1.5; font-weight: 400;">
          <h2>Welcome to the Taskipline Waitlist!</h2>
          <p>Thank you for signing up. We're thrilled to have you on board.</p>
          <p>We are working hard to build a platform to help you master discipline and achieve your goals. We'll be in touch with updates and an invitation to join as soon as we're ready.</p>
          <p>Stay disciplined!</p>
          <br>
          <p><strong>The Taskipline Team</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending waitlist confirmation email:", error);
      return; // Do not block the main request if email fails
    }

    console.log("Confirmation email sent successfully:", data);
  } catch (error) {
    console.error("An unexpected error occurred while sending email:", error);
  }
};

/**
 * Sends an account verification email to a new user.
 * @param email The email address of the recipient.
 * @param token The unhashed verification token.
 */
export const sendAccountVerificationEmail = async (
  email: string,
  token: string
) => {
  const verificationUrl = `${CLIENT_URL}/verify-account/${token}`;

  try {
    const { data, error } = await verifyAccountResend.emails.send({
      from: "taskipline@emmy-akintz.tech",
      to: [email],
      subject: "Verify Your Taskipline Account",
      html: `
        <div style="font-family: sans-serif; padding: 20px; font-size: 16px; line-height: 1.5;">
          <h2>Welcome to Taskipline!</h2>
          <p>Please click the button below to verify your email address and activate your account.</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Account</a>
          <p>This link will expire in 10 minutes.</p>
          <p>If you did not sign up for an account, you can safely ignore this email.</p>
          <br>
          <p><strong>The Taskipline Team</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending verification email:", error);
      return;
    }
    console.log("Verification email sent successfully:", data);
  } catch (error) {
    console.error("An unexpected error occurred while sending email:", error);
  }
};

/**
 * Sends a welcome email to a user who has successfully verified their account.
 * @param email The email address of the recipient.
 * @param firstName The first name of the user.
 */
export const sendWelcomeEmail = async (email: string, firstName: string) => {
  try {
    const { data, error } = await welcomeResend.emails.send({
      from: "taskipline@emmy-akintz.tech",
      to: [email],
      subject: "Welcome to Taskipline!",
      html: `
        <div style="font-family: sans-serif; padding: 20px; font-size: 16px; line-height: 1.5;">
          <h2>Welcome aboard, ${firstName}!</h2>
          <p>Your account has been successfully verified. We're excited to have you join our community of disciplined achievers.</p>
          <p>You can now sign in and start organizing your tasks and goals.</p>
          <p>Stay disciplined!</p>
          <br>
          <p><strong>The Taskipline Team</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return;
    }
    console.log("Welcome email sent successfully:", data);
  } catch (error) {
    console.error("An unexpected error occurred while sending email:", error);
  }
};
