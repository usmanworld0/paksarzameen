import nodemailer from "nodemailer";

import { getOtpExpiryMinutes } from "@/lib/otp";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS are required for OTP emails.");
  }

  return { host, port, user, pass };
}

function getFromEmail() {
  return process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "no-reply@paksarzameen.org";
}

function createTransporter() {
  const { host, port, user, pass } = getSmtpConfig();

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOtpEmail(params: { email: string; otp: string }) {
  const transporter = createTransporter();

  const expiryMinutes = getOtpExpiryMinutes();
  const subject = "Paksarzameen Verification Code";

  const text = [
    "PakSarZameen - Verification Code",
    "",
    `Your one-time verification code is: ${params.otp}`,
    `This code will expire in ${expiryMinutes} minutes.`,
    "",
    "If you did not request this code, please ignore this email.",
    "PakSarZameen Team",
  ].join("\n");

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111827;">
      <div style="border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0f7a47, #0b5f38); color: #ffffff; padding: 20px 24px;">
          <h1 style="margin: 0; font-size: 22px; line-height: 1.2;">Paksarzameen</h1>
          <p style="margin: 6px 0 0; opacity: 0.9; font-size: 14px;">Community care through trusted action</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="margin: 0 0 14px; font-size: 15px; line-height: 1.6;">
            Use the verification code below to continue signing in to your Paksarzameen account.
          </p>
          <div style="margin: 18px 0; padding: 16px; border-radius: 12px; border: 1px dashed #0f7a47; background: #f7fbf8; text-align: center;">
            <span style="display: inline-block; letter-spacing: 0.36em; font-size: 28px; font-weight: 700; color: #0f7a47;">${params.otp}</span>
          </div>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
            This code expires in ${expiryMinutes} minutes and can only be used once.
          </p>
          <p style="margin: 18px 0 0; font-size: 13px; line-height: 1.6; color: #6b7280;">
            If you did not request this code, you can safely ignore this email.
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: getFromEmail(),
    to: params.email,
    subject,
    text,
    html,
  });
}

export async function sendPasswordResetEmail(params: { email: string; resetUrl: string }) {
  const transporter = createTransporter();
  const subject = "Reset your Paksarzameen password";

  const text = [
    "Paksarzameen Password Reset",
    "",
    "We received a request to reset your password.",
    `Reset link: ${params.resetUrl}`,
    "This link expires in 30 minutes and can only be used once.",
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111827;">
      <div style="border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0f7a47, #0b5f38); color: #ffffff; padding: 20px 24px;">
          <h1 style="margin: 0; font-size: 22px; line-height: 1.2;">Paksarzameen</h1>
          <p style="margin: 6px 0 0; opacity: 0.9; font-size: 14px;">Blood Bank Account Security</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="margin: 0 0 14px; font-size: 15px; line-height: 1.6;">
            We received a request to reset your password. Click the button below to continue.
          </p>
          <p style="margin: 20px 0;">
            <a
              href="${params.resetUrl}"
              style="display: inline-block; border-radius: 10px; background: #0f7a47; color: #ffffff; padding: 12px 18px; text-decoration: none; font-weight: 600;"
            >
              Reset Password
            </a>
          </p>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
            This link expires in 30 minutes and can only be used once.
          </p>
          <p style="margin: 12px 0 0; font-size: 12px; line-height: 1.6; color: #6b7280; word-break: break-all;">
            If the button does not work, copy this URL: ${params.resetUrl}
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: getFromEmail(),
    to: params.email,
    subject,
    text,
    html,
  });
}
