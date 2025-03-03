const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import Routes
const userRoutes = require("./src/routes/userRoutes");
const budgetRoutes = require("./src/routes/budgetRoutes");
const plaidRoutes = require("./src/routes/plaidRoutes"); //  Added Plaid Routes
const financialDataRoutes = require("./src/routes/financialDataRoutes");
const subscriptionsRoutes = require("./src/routes/subscriptionsRoutes");
const spendingReportRoutes = require("./src/routes/spendingReportRoutes");
const authRoutes = require("./src/routes/authRoutes");



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend/public
app.use(express.static(path.join(__dirname, "..", "frontend", "public")));

// Serve login.html when accessing the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "public", "login.html"));
});

//  API Routes
app.use("/api/users", userRoutes);
app.use("/api/plaid", plaidRoutes); //  Plaid Routes Integrated
app.use("/api/budgets", budgetRoutes);
app.use("/api/financial-data", financialDataRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);
app.use("/api/spending-report", spendingReportRoutes);
app.use("/api/auth", authRoutes);



//  Test DB Connection Endpoint
const db = require("./src/config/db");
app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 'Database connected' AS message");
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
  
module.exports = server;
