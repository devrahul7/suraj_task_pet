import nodemailer from "nodemailer";
import {
  EMAIL_FROM,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_USER,
} from "../config/constant";
import { EmailTemplates } from "../templates/email.template";

type EmailRecipient = {
  fullName?: string;
  email: string;
};

export class EmailService {
  private createTransporter() {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
      return null;
    }

    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string
  ) {
    const transporter = this.createTransporter();

    if (!transporter) {
      console.warn(`SMTP is not configured. Skipping email to ${to}.`);
      return;
    }

    try {
      await transporter.sendMail({
        from: EMAIL_FROM,
        to,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.warn("Failed to send email notification.", error);
    }
  }

  async sendWelcomeEmail(user: EmailRecipient) {
    const name = user.fullName || "there";

    return this.sendEmail(
      user.email,
      "Welcome to PetEy",
      `Hi ${name}, your PetEy account has been created successfully.`,
      `<p>Hi ${name},</p><p>Your PetEy account has been created successfully.</p><p>You can now sign in and start exploring pets.</p>`
    );
  }

  async sendLoginNotificationEmail(user: EmailRecipient) {
    const name = user.fullName || "there";

    return this.sendEmail(
      user.email,
      "New PetEy login detected",
      `Hi ${name}, we detected a successful login to your PetEy account. If this was not you, please change your password immediately.`,
      `<p>Hi ${name},</p><p>We detected a successful login to your PetEy account.</p><p>If this was not you, please change your password immediately.</p>`
    );
  }

  async sendPasswordChangeEmail(user: EmailRecipient) {
    const name = user.fullName || "there";

    return this.sendEmail(
      user.email,
      "Your PetEy password was changed",
      `Hi ${name}, your PetEy password has been updated successfully. If this was not you, please secure your account immediately.`,
      `<p>Hi ${name},</p><p>Your PetEy password has been updated successfully.</p><p>If this was not you, please secure your account immediately.</p>`
    );
  }

  async sendPasswordResetEmail(user: EmailRecipient, resetLink: string) {
    const template = EmailTemplates.resetPassword(user.fullName || "there", resetLink);

    return this.sendEmail(
      user.email,
      template.subject,
      template.text,
      template.html
    );
  }

  async sendEmailVerificationEmail(user: EmailRecipient, verificationLink: string) {
    const name = user.fullName || "there";

    return this.sendEmail(
      user.email,
      "Verify your PetEy email address",
      `Hi ${name}, verify your PetEy account using this link: ${verificationLink}`,
      `<p>Hi ${name},</p><p>Please verify your PetEy account using the link below:</p><p><a href="${verificationLink}">${verificationLink}</a></p><p>If you did not create this account, you can ignore this email.</p>`
    );
  }

  async sendBookingEmail(user: EmailRecipient, details: string, link?: string) {
    const template = EmailTemplates.booking(user.fullName || "there", details, link);

    return this.sendEmail(user.email, template.subject, template.text, template.html);
  }

  async sendApprovalEmail(user: EmailRecipient, details: string, link?: string) {
    const template = EmailTemplates.approval(user.fullName || "there", details, link);

    return this.sendEmail(user.email, template.subject, template.text, template.html);
  }

  async sendCancellationEmail(user: EmailRecipient, details: string, link?: string) {
    const template = EmailTemplates.cancellation(user.fullName || "there", details, link);

    return this.sendEmail(user.email, template.subject, template.text, template.html);
  }

  async sendCompletionEmail(user: EmailRecipient, details: string, link?: string) {
    const template = EmailTemplates.completion(user.fullName || "there", details, link);

    return this.sendEmail(user.email, template.subject, template.text, template.html);
  }
}