const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const Email = require("./models/Email"); // ✅ USE EXISTING SCHEMA

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Brevo API Email Sender
async function sendBrevoEmail(email) {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.EMAIL_USER,
          name: "Portfolio Contact",
        },
        to: [{ email: process.env.EMAIL_USER }],
        subject: "📬 New Contact Form Submission",
        htmlContent: `<p>You received a new contact: <b>${email}</b></p>`,
      },
      {
        headers: {
          "api-key": process.env.EMAIL_PASS,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📧 Email sent successfully");
  } catch (error) {
    console.error(
      "❌ Email send failed:",
      error.response?.data || error.message
    );
  }
}

// ✅ POST API
app.post("/api/contact", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📩 Received:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // ✅ prevent duplicates
    const exists = await Email.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const savedEmail = await Email.create({ email });
    console.log("✅ Saved to MongoDB:", savedEmail);
    console.log("🗄️ DB NAME:", mongoose.connection.name);
    console.log("📂 COLLECTION:", Email.collection.name);

    await sendBrevoEmail(email);

    res.status(200).json({
      message: "✅ Email saved and notification sent!",
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
