import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

export async function sendStatusEmail({ to, name, title, status }) {
  if (!to) return;

  const subject = `Update on your application: ${title}`;
  const text = `Hi ${name || "there"},\n\nYour application for "${title}" is now: ${status.replace("_", " ")}.\n\n— Job Portal`;

  const mailer = getTransporter();
  if (!mailer) {
    console.log(`[email skipped] to=${to} job="${title}" status=${status}`);
    return;
  }

  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  });
}
