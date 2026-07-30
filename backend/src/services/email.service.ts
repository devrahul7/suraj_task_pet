type EmailRecipient = {
  fullName?: string;
  email: string;
};

export class EmailService {
  async sendWelcomeEmail(user: EmailRecipient): Promise<void> {
    return;
  }

  async sendLoginNotificationEmail(user: EmailRecipient): Promise<void> {
    return;
  }

  async sendPasswordChangeEmail(user: EmailRecipient): Promise<void> {
    return;
  }

  async sendPasswordResetEmail(user: EmailRecipient, resetLink: string): Promise<void> {
    return;
  }

  async sendEmailVerificationEmail(user: EmailRecipient, verificationLink: string): Promise<void> {
    return;
  }

  async sendBookingEmail(user: EmailRecipient, details: string, link?: string): Promise<void> {
    return;
  }

  async sendApprovalEmail(user: EmailRecipient, details: string, link?: string): Promise<void> {
    return;
  }

  async sendCancellationEmail(user: EmailRecipient, details: string, link?: string): Promise<void> {
    return;
  }

  async sendCompletionEmail(user: EmailRecipient, details: string, link?: string): Promise<void> {
    return;
  }
}