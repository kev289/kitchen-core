import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.EMAIL_REFRESH_TOKEN,
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporterOptions = {
      host: 'smtp.gmail.com' as const,
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2' as const,
        user: process.env.EMAIL_FROM,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken: accessToken?.token,
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transporter = nodemailer.createTransport(transporterOptions as any);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};