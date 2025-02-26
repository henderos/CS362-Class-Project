const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

// Import Routes
const userRoutes = require("./src/routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Test DB Connection Endpoint
const db = require("./src/config/db");
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 'Database connected' AS message");
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the frontend/public directory
app.use(express.static(path.join(__dirname, "..", "frontend", "public")));

// Serve login.html when accessing the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "public", "login.html"));
});

// Use Routes
app.use("/api/users", userRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
