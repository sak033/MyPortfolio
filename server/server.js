const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// ✅ CORS setup (allow your frontend)
app.use(
  cors({
    origin: [
      "http://localhost:5500", // for local testing
      "https://myportfolio-7br8.onrender.com", // your deployed frontend
    ],
    methods: ["GET", "POST"],
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Schema
const contactSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

const Contact = mongoose.model("Contact", contactSchema);

// ✅ POST route for contact form
app.post("/api/contact", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📩 Received request body:", req.body);

    if (!email) return res.status(400).json({ message: "Email is required" });

    // Save email to MongoDB
    const newContact = new Contact({ email });
    await newContact.save();

    // ✅ Send email via Brevo API
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.EMAIL_USER, name: "Sakshi Portfolio" },
        to: [{ email: process.env.EMAIL_USER }], // send to yourself
        subject: "📩 New Contact Form Submission",
        htmlContent: `<p>Someone submitted their email on your portfolio: <b>${email}</b></p>`,
      },
      {
        headers: {
          "api-key": process.env.EMAIL_PASS, // your Brevo API key
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully:", response.data);

    res.status(200).json({ message: "✅ Email saved and notification sent!" });
  } catch (error) {
    console.error("❌ Server error:", error.response?.data || error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
