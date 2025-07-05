import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { validateEnv } from "../config/env.config";

interface MailOptions {
  email: string | string[];
  subject: string;
  template: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export const sendMail = async (options: MailOptions): Promise<void> => {
  try {
    const env = validateEnv();

    if (!env) {
      throw new Error("Environment validation failed");
    }

    // Validate required SMTP configuration
    if (!env.smtp.mail || !env.smtp.password) {
      throw new Error("SMTP email and password are required");
    }

    // Create transporter based on whether service is specified
    const transporter =
      env.smtp.service && env.smtp.service.trim()
        ? nodemailer.createTransport({
            service: env.smtp.service,
            auth: {
              user: env.smtp.mail,
              pass: env.smtp.password,
            },
          })
        : nodemailer.createTransport({
            host: env.smtp.host,
            port: +env.smtp.port,
            secure: +env.smtp.port === 465, // true for 465, false for other ports
            auth: {
              user: env.smtp.mail,
              pass: env.smtp.password,
            },
          });

    // Verify the connection to the SMTP server
    await transporter.verify();
    const { email, subject, template, data } = options;

    // Use absolute path for template resolution
    const templatePath = path.resolve(
      process.cwd(),
      "src",
      "mails",
      `${template}.ejs`
    );
    console.log({ templatePath });

    // Render the EJS template
    const html = await ejs.renderFile(templatePath, data);
    const mailOption = {
      from: env.smtp.mail,
      to: email,
      subject,
      html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOption);
    console.log("Email sent: " + info.response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error sending email:", errorMessage);
    throw error; // Re-throw to allow caller to handle
  }
};
