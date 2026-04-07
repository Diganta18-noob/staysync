const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    // Don't throw — email failure shouldn't block operations
    return null;
  }
};

const sendBookingConfirmation = async (user, booking) => {
  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; border-radius: 16px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🏠 StaySync</h1>
        <p style="margin: 8px 0 0; opacity: 0.9;">Booking Confirmation</p>
      </div>
      <div style="padding: 30px 20px;">
        <h2>Hi ${user.name},</h2>
        <p>Your booking has been confirmed! Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; color: #666;">Booking ID</td>
            <td style="padding: 12px 0; font-weight: 600;">${booking._id}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; color: #666;">Monthly Rent</td>
            <td style="padding: 12px 0; font-weight: 600;">₹${booking.monthlyRent}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; color: #666;">Security Deposit</td>
            <td style="padding: 12px 0; font-weight: 600;">₹${booking.depositAmount}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #666;">Start Date</td>
            <td style="padding: 12px 0; font-weight: 600;">${new Date(booking.startDate).toLocaleDateString()}</td>
          </tr>
        </table>
        <p style="color: #666; font-size: 14px;">Thank you for choosing StaySync!</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: '✅ Booking Confirmed — StaySync',
    html,
  });
};

const sendRentReminder = async (user, amount, dueDate) => {
  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="background: linear-gradient(135deg, #f093fb, #f5576c); padding: 30px; border-radius: 16px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🏠 StaySync</h1>
        <p style="margin: 8px 0 0; opacity: 0.9;">Rent Reminder</p>
      </div>
      <div style="padding: 30px 20px;">
        <h2>Hi ${user.name},</h2>
        <p>This is a friendly reminder that your rent of <strong>₹${amount}</strong> is due on <strong>${dueDate}</strong>.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin-top: 16px;">Pay Now</a>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: '💰 Rent Reminder — StaySync',
    html,
  });
};

module.exports = { sendEmail, sendBookingConfirmation, sendRentReminder };
