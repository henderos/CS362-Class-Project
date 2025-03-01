const express = require("express");
const db = require("../config/db");

const router = express.Router();

const ensureTableExists = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS budgets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                category VARCHAR(255) NOT NULL,
                budget_amount DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log("✅ 'budgets' table checked/created successfully.");
    } catch (error) {
        console.error("❌ Error ensuring 'budgets' table exists:", error);
    }
};




/**
 * @route POST /api/budgets
 * @desc Create or Update a budget for a user
 */
router.post("/", async (req, res) => {
    const { user_id, category, budget_amount } = req.body; // ✅ Use body instead of headers

    // console.log("🔍 Incoming Budget Request:", { user_id, category, budget_amount });

    if (!user_id || !category || !budget_amount) {
        console.error("❌ Missing fields:", { user_id, category, budget_amount });
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // console.log(`✅ Processing budget for user ${user_id}: ${category} - $${budget_amount}`);

        const [existingBudget] = await db.query(
            "SELECT * FROM budgets WHERE user_id = ? AND category = ?",
            [user_id, category]
        );

        if (existingBudget.length > 0) {
            await db.query(
                "UPDATE budgets SET budget_amount = ? WHERE user_id = ? AND category = ?",
                [budget_amount, user_id, category]
            );
            res.json({ message: "Budget updated successfully" });
        } else {
            const [result] = await db.query(
                "INSERT INTO budgets (user_id, category, budget_amount) VALUES (?, ?, ?)",
                [user_id, category, budget_amount]
            );
            res.status(201).json({ message: "Budget created successfully", budgetId: result.insertId });
        }
    } catch (error) {
        console.error("❌ Error creating budget:", error);
        res.status(500).json({ error: error.message });
    }
});



/**
 * @route GET /api/budgets/:user_id
 * @desc Get all budgets for a user
 */
router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        // console.log(`Fetching budgets for user: ${user_id}`); // Debug log
        const [budgets] = await db.query(
            "SELECT category, budget_amount FROM budgets WHERE user_id = ?",
            [user_id]
        );
        res.json(budgets);
    } catch (error) {
        console.error("❌ Error fetching budgets:", error); // Logs error in the terminal
        res.status(500).json({ error: error.message });
    }
});


/**
 * @route PUT /api/budgets/:id
 * @desc Update a budget amount by ID
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { budget_amount } = req.body;

    if (!budget_amount) {
        return res.status(400).json({ error: "Budget amount is required" });
    }

    try {
        await db.query(
            "UPDATE budgets SET budget_amount = ? WHERE id = ?",
            [budget_amount, id]
        );
        res.json({ message: "Budget updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route DELETE /api/budgets/:category
 * @desc Delete a budget by category name
 */
router.delete("/:user_id/:category", async (req, res) => {
    const { user_id, category } = req.params;

    if (!user_id || !category) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        await db.query("DELETE FROM budgets WHERE user_id = ? AND category = ?", [
            user_id,
            category,
        ]);
        res.json({ message: "Budget deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server error: Could not delete budget" });
    }
});


/**
 * @route GET /api/budgets/track/:user_id
 * @desc Track spending against budgets
 */
router.get("/track/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const [trackingData] = await db.query(
            `SELECT 
                b.category,
                b.budget_amount,
                COALESCE(SUM(t.amount), 0) AS spent_amount,
                (b.budget_amount - COALESCE(SUM(t.amount), 0)) AS remaining_budget
            FROM budgets b
            LEFT JOIN transactions t ON b.user_id = t.user_id AND b.category = t.category
            WHERE b.user_id = ?
            GROUP BY b.category`,
            [user_id]
        );

        res.json(trackingData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
