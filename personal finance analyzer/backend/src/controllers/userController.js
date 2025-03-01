const db = require("../config/db");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    //insert user into database (no hashing)
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    res.status(201).json({ message: "User created successfully", userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //find user by email
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    //check if the password matches (no hashing)
    if (users[0].password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //if using sessions, you might set a session property here:
    // req.session.userId = users[0].id;

    res.json({ message: "Login successful", userId: users[0].id });
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

//logout functionality using session destruction
const logoutUser = (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: "Logout failed. Please try again." });
      }
      return res.json({ message: "Logout successful" });
    });
  } else {
    //if no session exists, simply respond with a success message
    return res.json({ message: "Logout successful" });
  }
};

module.exports = { registerUser, loginUser, getAllUsers, logoutUser };
