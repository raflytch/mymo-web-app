import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(email: string, code: string): Promise<void> {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "MyMo - Email Verification",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `,
  });
}

export { transporter };
