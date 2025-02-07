const express = require("express");
const db = require("./src/config/db"); // Import DB connection
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Test Database Connection
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 'Database connected' AS message");
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
