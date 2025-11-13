const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

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

// ✅ Brevo API Email Sender
async function sendBrevoEmail(email) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.EMAIL_USER, name: "Portfolio Contact" },
        to: [{ email: process.env.EMAIL_USER }], // Send to yourself
        subject: "📬 New Contact Form Submission",
        htmlContent: `<p>You received a new contact: <b>${email}</b></p>`
      },
      {
        headers: {
          "api-key": process.env.EMAIL_PASS, // Your Brevo API KEY
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📧 Email sent successfully:", response.data);
  } catch (error) {
    console.error("❌ Email send failed:", error.response?.data || error.message);
  }
}

// ✅ POST API
app.post("/api/contact", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📩 Received request body:", req.body);

    if (!email) return res.status(400).json({ message: "Email is required" });

    const newContact = new Contact({ email });
    await newContact.save();

    // Send notification through Brevo
    await sendBrevoEmail(email);

    res.status(200).json({ message: "✅ Email saved and notification sent!" });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
