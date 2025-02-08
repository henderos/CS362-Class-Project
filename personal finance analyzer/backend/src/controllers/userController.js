const db = require("../config/db");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Hash password before saving (assuming bcrypt is installed)
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User created successfully", userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, created_at FROM users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, getAllUsers };
