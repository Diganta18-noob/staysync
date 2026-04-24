/**
 * Email Service — Transactional email via Nodemailer.
 * Uses SMTP config from environment variables.
 * Falls back to console logging in development.
 */

const nodemailer = require('nodemailer');

const isDev = process.env.NODE_ENV !== 'production';

let transporter;

// Lazy initialization
const getTransporter = () => {
  if (transporter) return transporter;

  if (isDev && !process.env.SMTP_HOST) {
    // Dev mode: log emails to console instead of sending
    transporter = {
      sendMail: async (options) => {
        console.log(`[Email-Dev] To: ${options.to} | Subject: ${options.subject}`);
        console.log(`[Email-Dev] Body preview: ${options.text?.slice(0, 100) || options.html?.slice(0, 100)}`);
        return { messageId: `dev-${Date.now()}` };
      },
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

const FROM = process.env.EMAIL_FROM || 'StaySync <noreply@staysync.app>';

// ─── Email Templates ─────────────────────────────────────

const templates = {
  welcome: (data) => ({
    subject: 'Welcome to StaySync! 🏠',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:24px;border-radius:16px 16px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">Welcome to StaySync</h1>
        </div>
        <div style="padding:24px;background:#fff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 16px 16px;">
          <p>Hi <strong>${data.name}</strong>,</p>
          <p>Your account has been created successfully. You can now log in and start managing your PG.</p>
          <a href="${data.loginUrl || '#'}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Log In Now</a>
        </div>
      </div>
    `,
    text: `Welcome to StaySync, ${data.name}! Log in at ${data.loginUrl || 'staysync.app'}`,
  }),

  rentDue: (data) => ({
    subject: `Rent Due: ₹${data.amount.toLocaleString('en-IN')} — ${data.billingMonth}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:24px;border-radius:16px 16px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:20px;">🔔 Rent Due Reminder</h1>
        </div>
        <div style="padding:24px;background:#fff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 16px 16px;">
          <p>Hi <strong>${data.name}</strong>,</p>
          <p>Your rent of <strong>₹${data.amount.toLocaleString('en-IN')}</strong> for <strong>${data.billingMonth}</strong> is due by <strong>${data.dueDate}</strong>.</p>
          <table style="width:100%;margin:16px 0;border-collapse:collapse;">
            <tr><td style="padding:8px;color:#64748b;">Property</td><td style="padding:8px;font-weight:600;">${data.propertyName}</td></tr>
            <tr><td style="padding:8px;color:#64748b;">Room</td><td style="padding:8px;font-weight:600;">${data.roomNumber}</td></tr>
            <tr><td style="padding:8px;color:#64748b;">Amount</td><td style="padding:8px;font-weight:600;">₹${data.amount.toLocaleString('en-IN')}</td></tr>
          </table>
        </div>
      </div>
    `,
    text: `Rent of ₹${data.amount} due for ${data.billingMonth}. Property: ${data.propertyName}, Room: ${data.roomNumber}`,
  }),

  paymentReceipt: (data) => ({
    subject: `Payment Receipt — ₹${data.amount.toLocaleString('en-IN')}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#10b981,#059669);padding:24px;border-radius:16px 16px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:20px;">✅ Payment Received</h1>
        </div>
        <div style="padding:24px;background:#fff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 16px 16px;">
          <p>Hi <strong>${data.name}</strong>,</p>
          <p>We've received your payment of <strong>₹${data.amount.toLocaleString('en-IN')}</strong>.</p>
          <p style="color:#64748b;font-size:14px;">Transaction ID: ${data.transactionId || 'N/A'}</p>
        </div>
      </div>
    `,
    text: `Payment of ₹${data.amount} received. Transaction: ${data.transactionId || 'N/A'}`,
  }),
};

/**
 * Send an email using a template.
 * @param {string} to - Recipient email
 * @param {string} template - Template name
 * @param {Object} data - Template data
 */
const sendEmail = async (to, template, data) => {
  const tmpl = templates[template];
  if (!tmpl) throw new Error(`Email template '${template}' not found`);

  const { subject, html, text } = tmpl(data);

  const result = await getTransporter().sendMail({
    from: FROM,
    to,
    subject,
    html,
    text,
  });

  return { messageId: result.messageId, template, to };
};

module.exports = { sendEmail, templates };
