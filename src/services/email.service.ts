import { Resend } from "resend";
import { validateEnv } from "../config/env.config";

const { RESEND_API_KEY: resendApiKey } = validateEnv();

const resend = new Resend(resendApiKey);

/**
 * Sends a confirmation email to a user who has just joined the waitlist.
 * @param email The email address of the recipient.
 */
export const sendWaitlistConfirmationEmail = async (email: string) => {
  try {
    const { data, error } = await resend.emails.send({
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
