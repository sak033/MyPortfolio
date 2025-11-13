const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// ✅ Schema
const contactSchema = new mongoose.Schema({
  email: { type: String, required: true },
});
const Contact = mongoose.model("Contact", contactSchema);

// ✅ Brevo SMTP Setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp-relay.brevo.com
  port: process.env.SMTP_PORT, // 587
  auth: {
    user: process.env.EMAIL_USER, // your verified Brevo sender
    pass: process.env.EMAIL_PASS, // your Brevo API key
  },
});

// ✅ POST API
app.post("/api/contact", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📩 Received request body:", req.body);

    if (!email) return res.status(400).json({ message: "Email is required" });

    const newContact = new Contact({ email });
    await newContact.save();

    // ✅ Send email notification to you
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: "📬 New Contact from Portfolio",
      html: `<p>You received a new contact email from: <b>${email}</b></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);

    res.status(200).json({ message: "✅ Email saved and notification sent!" });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
