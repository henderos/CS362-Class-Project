const express = require("express");
const db = require("../config/db");
const router = express.Router();

/**
 * @route GET /api/financial-data
 * @desc Get Monthly Spending & Account Balances
 */
router.get("/", async (req, res) => {
    const user_id = req.query.user_id;
    if (!user_id) return res.status(400).json({ error: "User ID is required" });

    try {
        // Get total spending for the current month
        const [spending] = await db.query(`
            SELECT COALESCE(SUM(amount), 0) AS total_spent 
            FROM transactions 
            WHERE user_id = ? AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())`, 
        [user_id]);

        // Get account balances
        const [accounts] = await db.query(`
            SELECT account_id AS name, SUM(amount) AS balance 
            FROM transactions 
            WHERE user_id = ? 
            GROUP BY account_id`, 
        [user_id]);

        res.json({
            monthlySpending: spending[0]?.total_spent || 0,
            accounts: accounts || []
        });

    } catch (error) {
        console.error("Error fetching financial data:", error.message);
        res.status(500).json({ error: "Failed to retrieve financial data" });
    }
});

module.exports = router;
