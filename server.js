const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Default route (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Nodemailer (Hostinger/Titan) setup
 * If you prefer env vars, set:
 *   SMTP_USER=care@studiopatron.in
 *   SMTP_PASS=your_strong_password
 */
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,          // SSL
  secure: true,       // true = use SSL
  auth: {
    user: 'care@studiopatron.in',
    pass: 'Praxis@1947', // <-- put your Titan/Hostinger mailbox password here
  },
});

// 📌 Route for handling form submissions
app.post('/send-email', async (req, res) => {
  const { fullName, email, phone, message } = req.body;

  try {
    // 1) Send notification to you
    await transporter.sendMail({
      from: '"Studio Patron" <care@studiopatron.in>',
      to: 'thepatron.in@gmail.com', // internal notification recipient(s)
      subject: `New Consultation Request from ${fullName}`,
      text: `
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Message: ${message || 'No message provided'}
      `.trim(),
      replyTo: email || undefined, // reply directly to client from your inbox
    });

    // 2) Auto-reply to the client (if they provided an email)
    if (email && email.toLowerCase() !== 'care@studiopatron.in') {
      await transporter.sendMail({
        from: '"Studio Patron" <care@studiopatron.in>',
        to: email,
        subject: 'Thank you for contacting Studio Patron!',
        html: `
<div style="font-family: Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:auto; border:1px solid #eee; border-radius:8px; padding:20px;">
  <div style="text-align:center; margin-bottom:20px;">
    <img src="https://i.ibb.co/7JtHJc1D/6325413.jpg" alt="Studio Patron" style="max-width:200px;">
  </div>
  <h2 style="color:#FDBA21; text-align:center;">Thank You, ${fullName || 'there'}!</h2>
  <p>We’ve received your request and our team will get back to you soon. Here’s a copy of your details:</p>
  <ul style="background:#f9f9f9; padding:15px; border-radius:6px; list-style: none;">
    <li><strong>Email:</strong> ${email || '—'}</li>
    <li><strong>Phone:</strong> ${phone || '—'}</li>
    <li><strong>Message:</strong> ${message || 'No message provided'}</li>
  </ul>
  <p>If this wasn’t you, please ignore this email.</p>
  <br>
  <p style="text-align:center; color:#555;">Best Regards,</p>
  <p style="text-align:center; font-weight:bold;">Studio Patron Team</p>
  <div style="text-align:center; margin-top:20px; font-size:12px; color:#888;">
    <p>© ${new Date().getFullYear()} Studio Patron. All rights reserved.</p>
  </div>
</div>
        `.trim(),
        replyTo: 'care@studiopatron.in', // replies come back to your business inbox
      });
    }

    res.json({ message: '✅ Email sent successfully!' });
  } catch (err) {
    console.error('Mailer error:', err);
    res.status(500).json({ message: '❌ Failed to send email' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
