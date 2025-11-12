const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// ✅ Secure CORS setup — allow your frontend URLs
app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://myportfolio-7br8.onrender.com"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));


app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// ✅ Contact Schema
const contactSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

const Contact = mongoose.model("Contact", contactSchema);

// ✅ Nodemailer Setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // use true only for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ✅ POST API Route
app.post("/api/contact", async (req, res) => {
  console.log("📩 Received request body:", req.body);
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const newContact = new Contact({ email });
    await newContact.save();

    // Send notification email to you
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      text: `Someone submitted their email: ${email}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Email send failed:", error);
      } else {
        console.log("📩 Email sent successfully:", info.response);
      }
    });

    res.status(200).json({ message: "✅ Email saved and notification sent!" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
