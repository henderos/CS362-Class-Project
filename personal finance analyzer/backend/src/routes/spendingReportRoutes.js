const express = require("express");
const router = express.Router();
const plaidClient = require("../config/plaidConfig");
const db = require("../config/db");

router.post("/", async (req, res) => {
  const { startDate, endDate, user_id } = req.body;
  if (!startDate || !endDate || !user_id) {
    return res.status(400).json({ error: "startDate, endDate, and user_id are required." });
  }
  
  try {
    // Retrieve the user's access token from the database.
    const [users] = await db.query("SELECT access_token FROM users WHERE id = ?", [user_id]);
    if (!users.length || !users[0].access_token) {
      return res.status(400).json({ error: "User has no linked bank account." });
    }
    const access_token = users[0].access_token;
    
    // Fetch transactions from Plaid for the given date range.
    const transactionsResponse = await plaidClient.transactionsGet({
      access_token,
      start_date: startDate,
      end_date: endDate,
      options: { count: 500 }
    });
    const transactions = transactionsResponse.data.transactions;
    
    // Aggregate spending by category.
    let totalSpent = 0;
    const categoryBreakdown = {};
    
    transactions.forEach(tx => {
      // Consider only transactions with a positive amount.
      if (tx.amount > 0) {
        totalSpent += tx.amount;
        const category = (tx.category && tx.category.length > 0) ? tx.category[0] : "Other";
        if (!categoryBreakdown[category]) {
          categoryBreakdown[category] = 0;
        }
        categoryBreakdown[category] += tx.amount;
      }
    });
    
    // Convert the breakdown object to an array for easier consumption.
    const breakdownArray = Object.keys(categoryBreakdown).map(cat => ({
      category: cat,
      amount: categoryBreakdown[cat].toFixed(2)
    }));
    
    res.json({
      totalSpent: totalSpent.toFixed(2),
      breakdown: breakdownArray,
      transactions  // (optional) raw transactions if needed
    });
  } catch (error) {
    console.error("Error generating spending report:", error);
    res.status(500).json({ error: "Failed to generate spending report." });
  }
});

module.exports = router;
