const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");


/**
 * @route GET /api/financial-data
 * @desc Get Monthly Spending & Account Balances
 */
router.get("/", async (req, res) => {
    const user_id = req.query.user_id;
    if (!user_id) return res.status(400).json({ error: "User ID is required" });

    try {
        // Fetch data from Plaid endpoint
        const plaidResponse = await fetch(`http://localhost:5000/api/plaid/user_transactions/${user_id}`);
        if (!plaidResponse.ok) throw new Error("Failed to fetch Plaid data");
        const { transactions, accounts } = await plaidResponse.json();

        // Calculate current month's spending
        const currentDate = new Date();
        const currentMonth = currentDate.getUTCMonth() + 1;
        const currentYear = currentDate.getUTCFullYear();
        
        const monthlySpending = transactions
            .filter(tx => {
                const txDate = new Date(tx.date);
                return txDate.getUTCMonth() + 1 === currentMonth && 
                       txDate.getUTCFullYear() === currentYear;
            })
            .reduce((sum, tx) => sum + (tx.amount), 0);

        // Format account balances
        const formattedAccounts = accounts.map(account => ({
            name: account.name,
            balance: account.balances.available
        }));

        res.json({
            monthlySpending: monthlySpending || 0,
            accounts: formattedAccounts || []
        });

    } catch (error) {
        console.error("Error fetching financial data:", error.message);
        res.status(500).json({ error: "Failed to retrieve financial data" });
    }
});

module.exports = router;