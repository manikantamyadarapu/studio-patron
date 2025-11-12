// /api/sendMail.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { fullName, email, phone, message } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ message: "Name and Email are required" });
  }

  try {
    // ✅ Create transporter (Hostinger Titan SMTP)
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.EMAIL_USER, // from env var
        pass: process.env.EMAIL_PASS, // from env var
      },
    });

    // ✅ 1) Send notification to you
    await transporter.sendMail({
      from: `"Studio Patron" <${process.env.EMAIL_USER}>`,
      to: "thepatron.in@gmail.com",
      subject: `New Consultation Request from ${fullName}`,
      text: `
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Message: ${message || "No message provided"}
      `.trim(),
      replyTo: email || undefined,
    });

    // ✅ 2) Auto-reply to client
    if (email && email.toLowerCase() !== process.env.EMAIL_USER.toLowerCase()) {
      await transporter.sendMail({
        from: `"Studio Patron" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Thank you for contacting Studio Patron!",
        html: `
<div style="font-family: Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:auto; border:1px solid #eee; border-radius:8px; padding:20px;">
  <div style="text-align:center; margin-bottom:20px;">
    <img src="https://i.ibb.co/7JtHJc1D/6325413.jpg" alt="Studio Patron" style="max-width:200px;">
  </div>
  <h2 style="color:#FDBA21; text-align:center;">Thank You, ${fullName || "there"}!</h2>
  <p>We’ve received your request and our team will get back to you soon. Here’s a copy of your details:</p>
  <ul style="background:#f9f9f9; padding:15px; border-radius:6px; list-style: none;">
    <li><strong>Email:</strong> ${email || "—"}</li>
    <li><strong>Phone:</strong> ${phone || "—"}</li>
    <li><strong>Message:</strong> ${message || "No message provided"}</li>
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
        replyTo: process.env.EMAIL_USER,
      });
    }

    return res.status(200).json({ message: "✅ Email sent successfully!" });
  } catch (err) {
    console.error("Mailer error:", err);
    return res.status(500).json({ message: "❌ Failed to send email", error: String(err) });
  }
}
