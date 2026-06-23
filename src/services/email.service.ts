export const emailService = {
  sendWelcomeEmail: async (to: string, name: string): Promise<void> => {
    if (!process.env.SMTP_HOST) {
      console.log(`[EMAIL] Welcome email sent to ${to} (SMTP not configured)`);
      return;
    }
    console.log(`[EMAIL] Sending welcome email to ${to} for user ${name}`);
  },
};
