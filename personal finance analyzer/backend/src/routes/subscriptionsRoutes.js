const express = require("express");
const plaidClient = require("../config/plaidConfig");
const db = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  // In a real-world scenario, you'd get the user ID from your authentication middleware.
  // For this example, we use a query parameter (or default to 1).
  const userId = req.query.user_id || 1;

  try {
    // Retrieve the access token for the user from the database
    const [users] = await db.query("SELECT access_token FROM users WHERE id = ?", [userId]);
    if (!users.length || !users[0].access_token) {
      return res.status(400).json({ error: "User has no linked bank account" });
    }
    const access_token = users[0].access_token;

    // Fetch transactions from the last 3 months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    const endDate = new Date();

    const transactionsResponse = await plaidClient.transactionsGet({
      access_token,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      options: { count: 250 } // fetch more transactions to catch recurring ones
    });
    const transactions = transactionsResponse.data.transactions;

    // Group transactions by merchant (or fallback to transaction name)
    const groups = {};
    transactions.forEach(tx => {
      const merchant = tx.merchant_name || tx.name;
      if (merchant) {
        if (!groups[merchant]) groups[merchant] = [];
        groups[merchant].push(tx);
      }
    });

    // Determine monthly recurring subscriptions:
    // Only consider groups that span at least 2 distinct month periods with a minimum 28-day gap.
    const subscriptions = [];
    for (const merchant in groups) {
      const txGroup = groups[merchant];
      const uniqueMonths = new Set(txGroup.map(tx => tx.date.substring(0, 7))); // "YYYY-MM"
      const dates = txGroup.map(tx => new Date(tx.date));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
      const diffDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);

      if (uniqueMonths.size >= 2 && diffDays >= 28) {
        const total = txGroup.reduce((sum, tx) => sum + tx.amount, 0);
        const avgCost = total / txGroup.length;
        subscriptions.push({
          name: merchant,
          cost: avgCost.toFixed(2),
          usageFrequency: "Monthly Recurring",
          // Use the first transaction's logo_url as the company image
          iconUrl: txGroup[0].logo_url || ""
        });
      }
    }

    res.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
});

module.exports = router;
