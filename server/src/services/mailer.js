import nodemailer from "nodemailer";
import env from "../config/env.js";

let transporter;

export function getTransporter() {
  if (transporter) return transporter;

  const isSecure = process.env.SMTP_PORT === "465" || process.env.SMTP_SECURE === "true";

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || env.smtpHost || "smtp-relay.brevo.com",
    port: parseInt(process.env.SMTP_PORT || env.smtpPort, 10) || 587,
    secure: isSecure, // false for 587, true for 465
    auth: {
      user: process.env.SMTP_USER || env.smtpUser,
      pass: process.env.SMTP_PASS || env.smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
    connectionTimeout: 10000, // 10s timeout
  });

  return transporter;
}

export async function verifySmtpConnection() {
  const user = process.env.SMTP_USER || env.smtpUser;
  const pass = process.env.SMTP_PASS || env.smtpPass;

  if (!user || !pass) {
    console.warn("⚠️ Brevo SMTP credentials (SMTP_USER / SMTP_PASS) not configured.");
    return false;
  }

  try {
    const mailer = getTransporter();
    await mailer.verify();
    console.log("✅ Brevo SMTP Relay Connected Successfully");
    return true;
  } catch (error) {
    console.error("❌ Brevo SMTP Auth Failed:", error.message);
    return false;
  }
}

export async function sendMail({ subject, text, html, to }) {
  const user = process.env.SMTP_USER || env.smtpUser;
  const pass = process.env.SMTP_PASS || env.smtpPass;

  if (!user || !pass) {
    console.error("[SMTP ERROR]: SMTP credentials (SMTP_USER / SMTP_PASS) not configured.");
    return { success: false, error: "SMTP credentials not configured" };
  }

  const mailer = getTransporter();
  const from =
    process.env.EMAIL_FROM ||
    process.env.MAIL_FROM ||
    env.mailFrom ||
    '"WellSphere" <wellsphere.official@gmail.com>';

  try {
    const result = await mailer.sendMail({
      from,
      to,
      subject,
      text,
      ...(html ? { html } : {}),
    });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("[SMTP ERROR]:", error.message || error);
    return { success: false, error: error.message || "SMTP dispatch failed" };
  }
}

export async function sendOtpEmail({ to, code, role = "User" }) {
  const subject = "Your WellSphere Security Verification Code";
  const text = `Your WellSphere 2FA verification code is: ${code}\n\nThis code is valid for 10 minutes. If you did not request this login attempt, please change your password immediately.`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="margin-bottom: 24px;">
        <span style="font-size: 20px; font-weight: bold; color: #134e4a;">WellSphere</span>
        <span style="display: inline-block; margin-left: 8px; padding: 2px 8px; font-size: 11px; font-weight: 600; text-transform: uppercase; background: #f0fdfa; color: #0f766e; border-radius: 6px; border: 1px solid #ccfbf1;">${role} Security</span>
      </div>
      <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px;">Two-Factor Authentication Code</h2>
      <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
        A sign-in request was initiated for your ${role} account. Enter the verification code below to complete authentication:
      </p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0f766e;">${code}</span>
      </div>
      <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 0;">
        This code expires in <strong>10 minutes</strong>. If you did not attempt to sign in, please secure your account immediately.
      </p>
    </div>
  `;

  return sendMail({ to, subject, text, html });
}

export const sendEmail = sendMail;
export const send2FAEmail = sendOtpEmail;
export default { sendMail, sendEmail, sendOtpEmail, send2FAEmail, verifySmtpConnection, getTransporter };

