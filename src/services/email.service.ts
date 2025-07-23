import { Resend } from "resend";
import { validateEnv } from "../config/env.config";

const {
  RESEND_API_KEY_WAITLIST,
  CLIENT_URL,
  RESEND_API_KEY_VERIFY_ACCOUNT,
  RESEND_API_KEY_WELCOME,
  RESEND_API_KEY_PASSWORD_RESET_LINK,
  RESEND_API_KEY_PASSWORD_RESET_SUCCESSFUL,
  RESEND_API_KEY_PASSWORD_DELETE_ACCOUNT,
} = validateEnv();

const waitlistResend = new Resend(RESEND_API_KEY_WAITLIST);
const verifyAccountResend = new Resend(RESEND_API_KEY_VERIFY_ACCOUNT);
const welcomeResend = new Resend(RESEND_API_KEY_WELCOME);
const passwordResetLinkResend = new Resend(RESEND_API_KEY_PASSWORD_RESET_LINK);
const passwordResetSuccessResend = new Resend(
  RESEND_API_KEY_PASSWORD_RESET_SUCCESSFUL
);
const accountDeletedResend = new Resend(RESEND_API_KEY_PASSWORD_DELETE_ACCOUNT);

const emailCallToActionButtonBackgroundColor = "#007bff";
const emailCallToActionButtonTextColor = "#ffffff";
// background-color: oklch(0.145 0 0); color: oklch(1 0 0);

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
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: ${emailCallToActionButtonTextColor}; background-color: ${emailCallToActionButtonBackgroundColor}; text-decoration: none; border-radius: 5px;">Verify Account</a>
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

/**
 * Sends an email with a link to reset the user's password.
 * @param email The email address of the recipient.
 * @param token The unhashed password reset token.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${CLIENT_URL}/reset-password/${token}`;

  try {
    const { data, error } = await passwordResetLinkResend.emails.send({
      from: "taskipline@emmy-akintz.tech",
      to: [email],
      subject: "Reset Your Taskipline Password",
      html: `
        <div style="font-family: sans-serif; padding: 20px; font-size: 16px; line-height: 1.5;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Please click the button below to set a new password.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: ${emailCallToActionButtonTextColor}; background-color: ${emailCallToActionButtonBackgroundColor}; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link will expire in 10 minutes.</p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          <br>
          <p><strong>The Taskipline Team</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      return;
    }
    console.log("Password reset email sent successfully:", data);
  } catch (error) {
    console.error("An unexpected error occurred while sending email:", error);
  }
};

/**
 * Sends a confirmation email after a user's password has been successfully reset.
 * @param email The email address of the recipient.
 */
export const sendPasswordResetSuccessEmail = async (email: string) => {
  try {
    const { data, error } = await passwordResetSuccessResend.emails.send({
      from: "taskipline@emmy-akintz.tech",
      to: [email],
      subject: "Your Taskipline Password Has Been Reset",
      html: `
        <div style="font-family: sans-serif; padding: 20px; font-size: 16px; line-height: 1.5;">
          <h2>Password Changed Successfully</h2>
          <p>This email confirms that the password for your Taskipline account has been successfully changed.</p>
          <p>If you did not make this change, please contact our support team immediately.</p>
          <br>
          <p><strong>The Taskipline Team</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending password reset success email:", error);
      return;
    }
    console.log("Password reset success email sent successfully:", data);
  } catch (error) {
    console.error("An unexpected error occurred while sending email:", error);
  }
};

/**
 * Sends a final confirmation email after a user's account has been deleted.
 * @param email The email address of the recipient.
 * @param firstName The first name of the user.
 */
export const sendAccountDeletionEmail = async (
  email: string,
  firstName: string
) => {
  try {
    const { data, error } = await accountDeletedResend.emails.send({
      from: "taskipline@emmy-akintz.tech",
      to: [email],
      subject: "Your Taskipline Account Has Been Deleted",
      html: `
        <div style="font-family: sans-serif; padding: 20px; font-size: 16px; line-height: 1.5;">
          <h2>Goodbye, ${firstName}</h2>
          <p>This email confirms that your Taskipline account and all associated data have been permanently deleted as you requested.</p>
          <p>We're sorry to see you go, but we wish you the best in your future endeavors.</p>
          <br>
          <p><strong>The Taskipline Team</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending account deletion email:", error);
      return;
    }
    console.log("Account deletion email sent successfully:", data);
  } catch (error) {
    console.error("An unexpected error occurred while sending email:", error);
  }
};

// import nodemailer from "nodemailer";
// import { validateEnv } from "../config/env.config";

// const { CLIENT_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } =
//   validateEnv();

// // Create a single, reusable transporter object
// const transporter = nodemailer.createTransport({
//   host: SMTP_HOST,
//   port: SMTP_PORT,
//   secure: SMTP_PORT === 465, // true for 465, false for other ports
//   auth: {
//     user: SMTP_USER,
//     pass: SMTP_PASS,
//   },
// });

// const emailCallToActionButtonBackgroundColor = "#007bff";
// const emailCallToActionButtonTextColor = "#ffffff";

// /**
//  * Sends a confirmation email to a user who has just joined the waitlist.
//  * @param email The email address of the recipient.
//  */
// export const sendWaitlistConfirmationEmail = async (email: string) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `The Taskipline Team <${EMAIL_FROM}>`,
//       to: email,
//       subject: "You're on the Taskipline Waitlist!",
//       html: `
//         <div style="font-family: sans-serif; padding: 20px; font-size: 16px; line-height: 1.5; font-weight: 400;">
//           <h2>Welcome to the Taskipline Waitlist!</h2>
//           <p>Thank you for signing up. We're thrilled to have you on board.</p>
//           <p>We are working hard to build a platform to help you master discipline and achieve your goals. We'll be in touch with updates and an invitation to join as soon as we're ready.</p>
//           <p>Stay disciplined!</p>
//           <br>
//           <p><strong>The Taskipline Team</strong></p>
//         </div>
//       `,
//     });
//     console.log("Confirmation email sent successfully:", info.messageId);
//   } catch (error) {
//     console.error("Error sending waitlist confirmation email:", error);
//   }
// };

// /**
//  * Sends an account verification email to a new user.
//  * @param email The email address of the recipient.
//  * @param token The unhashed verification token.
//  */
// export const sendAccountVerificationEmail = async (
//   email: string,
//   token: string
// ) => {
//   const verificationUrl = `${CLIENT_URL}/verify-account/${token}`;
//   try {
//     const info = await transporter.sendMail({
//       from: `The Taskipline Team <${EMAIL_FROM}>`,
//       to: email,
//       subject: "Verify Your Taskipline Account",
//       html: `
//         <div style="font-family: sans-serif; padding: 20px; font-size: 16px; line-height: 1.5;">
//           <h2>Welcome to Taskipline!</h2>
//           <p>Please click the button below to verify your email address and activate your account.</p>
//           <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: ${emailCallToActionButtonTextColor}; background-color: ${emailCallToActionButtonBackgroundColor}; text-decoration: none; border-radius: 5px;">Verify Account</a>
//           <p>This link will expire in 10 minutes.</p>
//           <p>If you did not sign up for an account, you can safely ignore this email.</p>
//           <br>
//           <p><strong>The Taskipline Team</strong></p>
//         </div>
//       `,
//     });
//     console.log("Verification email sent successfully:", info.messageId);
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//   }
// };

// /**
//  * Sends a welcome email to a user who has successfully verified their account.
//  * @param email The email address of the recipient.
//  * @param firstName The first name of the user.
//  */
// export const sendWelcomeEmail = async (email: string, firstName: string) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `The Taskipline Team <${EMAIL_FROM}>`,
//       to: email,
//       subject: "Welcome to Taskipline!",
//       html: `
//         <div style="font-family: sans-serif; padding: 20px; font-size: 16px; line-height: 1.5;">
//           <h2>Welcome aboard, ${firstName}!</h2>
//           <p>Your account has been successfully verified. We're excited to have you join our community of disciplined achievers.</p>
//           <p>You can now sign in and start organizing your tasks and goals.</p>
//           <p>Stay disciplined!</p>
//           <br>
//           <p><strong>The Taskipline Team</strong></p>
//         </div>
//       `,
//     });
//     console.log("Welcome email sent successfully:", info.messageId);
//   } catch (error) {
//     console.error("Error sending welcome email:", error);
//   }
// };

// /**
//  * Sends an email with a link to reset the user's password.
//  * @param email The email address of the recipient.
//  * @param token The unhashed password reset token.
//  */
// export const sendPasswordResetEmail = async (email: string, token: string) => {
//   const resetUrl = `${CLIENT_URL}/reset-password/${token}`;
//   try {
//     const info = await transporter.sendMail({
//       from: `The Taskipline Team <${EMAIL_FROM}>`,
//       to: email,
//       subject: "Reset Your Taskipline Password",
//       html: `
//         <div style="font-family: sans-serif; padding: 20px; font-size: 16px; line-height: 1.5;">
//           <h2>Password Reset Request</h2>
//           <p>We received a request to reset your password. Please click the button below to set a new password.</p>
//           <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: ${emailCallToActionButtonTextColor}; background-color: ${emailCallToActionButtonBackgroundColor}; text-decoration: none; border-radius: 5px;">Reset Password</a>
//           <p>This link will expire in 10 minutes.</p>
//           <p>If you did not request a password reset, you can safely ignore this email.</p>
//           <br>
//           <p><strong>The Taskipline Team</strong></p>
//         </div>
//       `,
//     });
//     console.log("Password reset email sent successfully:", info.messageId);
//   } catch (error) {
//     console.error("Error sending password reset email:", error);
//   }
// };

// /**
//  * Sends a confirmation email after a user's password has been successfully reset.
//  * @param email The email address of the recipient.
//  */
// export const sendPasswordResetSuccessEmail = async (email: string) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `The Taskipline Team <${EMAIL_FROM}>`,
//       to: email,
//       subject: "Your Taskipline Password Has Been Reset",
//       html: `
//         <div style="font-family: sans-serif; padding: 20px; font-size: 16px; line-height: 1.5;">
//           <h2>Password Changed Successfully</h2>
//           <p>This email confirms that the password for your Taskipline account has been successfully changed.</p>
//           <p>If you did not make this change, please contact our support team immediately.</p>
//           <br>
//           <p><strong>The Taskipline Team</strong></p>
//         </div>
//       `,
//     });
//     console.log(
//       "Password reset success email sent successfully:",
//       info.messageId
//     );
//   } catch (error) {
//     console.error("Error sending password reset success email:", error);
//   }
// };
