import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { mailer } from "../services/mailer.js"; // make sure mailer.js uses named export

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check if email already exists
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0)
      return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = randomBytes(32).toString("hex");

    // Insert user with verification token
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, verification_token) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, verificationToken]
    );

    const verifyUrl = `http://localhost:5173/verify/${verificationToken}`;

    // Send verification email
    try {
      await mailer.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Verify your library account",
        html: `
          <h2>Welcome, ${name}</h2>
          <p>Click below to verify your account:</p>
          <a href="${verifyUrl}">${verifyUrl}</a>
        `,
      });
    } catch (mailErr) {
      console.error("Error sending verification email:", mailErr);
      // Optional: you can delete the user if email fails
      await pool.query("DELETE FROM users WHERE id = ?", [result.insertId]);
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    res.json({ message: "Registration successful. Please check your email." });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const [users] = await pool.query(
      "SELECT id, is_verified FROM users WHERE verification_token = ?",
      [token]
    );

    if (users.length === 0) {
      // Token does not exist → invalid/expired
      return res.status(400).json({ message: "token erased" });
    }

    const user = users[0];

    if (user.is_verified === 1) {
      return res.json({ message: "Email already verified." });
    }

    // Mark user as verified
    await pool.query(
      "UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?",
      [user.id]
    );

    res.json({ message: "Email verified successfully!" });

  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = users[0];

    if (user.is_verified === 0)
      return res.status(400).json({ message: "Please verify your email first." });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
