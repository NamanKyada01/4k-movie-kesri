// Nodemailer — Email service (same pattern as reference project)
// 4K Movie Kesri Surat
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Email Templates ────────────────────────────────────────────────────────

const brandHeader = (title: string) => `
  <div style="background: #0E0E0E; padding: 24px 32px; border-bottom: 2px solid #E8550A;">
    <h1 style="font-family: system-ui, sans-serif; font-size: 20px; color: #E5E2E1; margin: 0; font-weight: 800; letter-spacing: -0.02em;">
      4K MOVIE KESRI SURAT
    </h1>
    <p style="font-family: system-ui, sans-serif; font-size: 12px; color: #E8550A; margin: 4px 0 0; letter-spacing: 0.1em; text-transform: uppercase;">${title}</p>
  </div>
`;

const brandFooter = () => `
  <div style="background: #131313; padding: 16px 32px; margin-top: 24px; text-align: center;">
    <p style="font-family: system-ui, sans-serif; font-size: 11px; color: #6B6B6B; margin: 0;">
      © ${new Date().getFullYear()} 4K Movie Kesri Surat · Surat, Gujarat, India
    </p>
    <p style="font-family: system-ui, sans-serif; font-size: 11px; color: #6B6B6B; margin: 4px 0 0;">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>
`;

// 1. OTP Email (Admin Login)
export async function sendOtpEmail(email: string, otp: string) {
  return transporter.sendMail({
    from: `"4K Movie Kesri Surat" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Admin Login OTP — 4K Movie Kesri Surat`,
    html: `
      <div style="background: #0E0E0E; min-height: 300px; font-family: system-ui, sans-serif;">
        ${brandHeader('Admin Panel · Login Verification')}
        <div style="padding: 32px; background: #0E0E0E;">
          <p style="color: #B0ACA9; font-size: 15px; margin-bottom: 24px;">
            Hello Admin,
          </p>
          <p style="color: #B0ACA9; font-size: 15px; margin-bottom: 24px;">
            Use the code below to securely sign in to the Antigravity admin panel.
          </p>
          <div style="background: #1A1A1A; border: 1px solid #2A2A2A; border-left: 4px solid #E8550A; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 42px; font-weight: 900; color: #E8550A; letter-spacing: 12px; margin: 0; font-family: monospace;">${otp}</p>
            <p style="font-size: 12px; color: #6B6B6B; margin: 12px 0 0; letter-spacing: 0.05em;">EXPIRES IN 10 MINUTES</p>
          </div>
        </div>
        ${brandFooter()}
      </div>
    `,
  });
}

// 2. Event Reminder Email (24 hours before)
export async function sendEventReminderEmail(
  adminEmails: string[],
  event: {
    name: string;
    clientName: string;
    date: string;
    time: string;
    reachTime: string;
    location: string;
    teamLead: string;
    staff: string[];
    equipment: string[];
    notes?: string;
  }
) {
  return transporter.sendMail({
    from: `"4K Movie Kesri Surat" <${process.env.EMAIL_USER}>`,
    to: adminEmails.join(', '),
    subject: `📸 Event Tomorrow: ${event.name} — Action Required`,
    html: `
      <div style="background: #0E0E0E; font-family: system-ui, sans-serif;">
        ${brandHeader('Event Reminder · 24 Hours Notice')}
        <div style="padding: 32px; background: #0E0E0E;">
          <h2 style="color: #E5E2E1; font-size: 22px; margin-bottom: 8px;">${event.name}</h2>
          <p style="color: #E8550A; font-size: 13px; margin-bottom: 24px;">CLIENT: ${event.clientName}</p>

          <table style="width: 100%; border-collapse: collapse;">
            ${[
              ['📅 Date', event.date],
              ['🕐 Start Time', event.time],
              ['⏰ Reach Time (Staff Arrival)', event.reachTime],
              ['📍 Location', event.location],
              ['👤 Team Lead', event.teamLead],
              ['👥 Team', event.staff.join(', ')],
              ['📷 Equipment', event.equipment.join(', ')],
            ].map(([label, value]) => `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #1A1A1A; color: #6B6B6B; font-size: 13px; width: 180px;">${label}</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #1A1A1A; color: #E5E2E1; font-size: 13px;">${value}</td>
              </tr>
            `).join('')}
          </table>

          ${event.notes ? `
            <div style="background: #1A1A1A; border-radius: 8px; padding: 16px; margin-top: 20px;">
              <p style="color: #6B6B6B; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Special Notes</p>
              <p style="color: #B0ACA9; font-size: 14px; margin: 0;">${event.notes}</p>
            </div>
          ` : ''}
        </div>
        ${brandFooter()}
      </div>
    `,
  });
}

// 3. New Contact / Inquiry Notification
export async function sendInquiryNotificationEmail(
  adminEmails: string[],
  inquiry: {
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    message: string;
  }
) {
  return transporter.sendMail({
    from: `"4K Movie Kesri Surat" <${process.env.EMAIL_USER}>`,
    to: adminEmails.join(', '),
    replyTo: inquiry.email,
    subject: `💌 New Inquiry from ${inquiry.name} — ${inquiry.serviceType}`,
    html: `
      <div style="background: #0E0E0E; font-family: system-ui, sans-serif;">
        ${brandHeader('New Inquiry · Antigravity Website')}
        <div style="padding: 32px; background: #0E0E0E;">
          <h2 style="color: #E5E2E1; font-size: 20px; margin-bottom: 4px;">${inquiry.name}</h2>
          <p style="color: #C9A84C; font-size: 13px; margin-bottom: 24px;">${inquiry.serviceType} Inquiry</p>

          <table style="width: 100%; border-collapse: collapse;">
            ${[
              ['📧 Email', inquiry.email],
              ['📱 Phone', inquiry.phone],
              ['🎯 Service', inquiry.serviceType],
            ].map(([label, value]) => `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #1A1A1A; color: #6B6B6B; font-size: 13px; width: 120px;">${label}</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #1A1A1A; color: #E5E2E1; font-size: 13px;">${value}</td>
              </tr>
            `).join('')}
          </table>

          <div style="background: #1A1A1A; border-radius: 8px; padding: 16px; margin-top: 20px;">
            <p style="color: #6B6B6B; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
            <p style="color: #B0ACA9; font-size: 14px; margin: 0; line-height: 1.6;">${inquiry.message}</p>
          </div>

          <p style="color: #6B6B6B; font-size: 12px; margin-top: 20px;">Reply directly to this email to respond to ${inquiry.name}.</p>
        </div>
        ${brandFooter()}
      </div>
    `,
  });
}
