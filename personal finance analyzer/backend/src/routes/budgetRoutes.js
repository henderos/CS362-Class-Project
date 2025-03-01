const express = require("express");
const db = require("../config/db");

const router = express.Router();

/**
 * @route POST /api/budgets
 * @desc Create a new budget for a user
 */
router.post("/", async (req, res) => {
    const { user_id, category, budget_amount } = req.body;

    if (!user_id || !category || !budget_amount) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO budgets (user_id, category, budget_amount) VALUES (?, ?, ?)",
            [user_id, category, budget_amount]
        );
        res.status(201).json({ message: "Budget created successfully", budgetId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/budgets
 * @desc Get all budgets for a user
 */
router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const [budgets] = await db.query("SELECT * FROM budgets WHERE user_id = ?", [user_id]);
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route PUT /api/budgets/:id
 * @desc Update a budget amount
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { budget_amount } = req.body;

    if (!budget_amount) {
        return res.status(400).json({ error: "Budget amount is required" });
    }

    try {
        await db.query("UPDATE budgets SET budget_amount = ? WHERE id = ?", [budget_amount, id]);
        res.json({ message: "Budget updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route DELETE /api/budgets/:id
 * @desc Delete a budget
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM budgets WHERE id = ?", [id]);
        res.json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/budgets/track/:user_id
 * @desc Track spending against budgets
 */
router.get("/track/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const [trackingData] = await db.query(`
            SELECT 
                b.category,
                b.budget_amount,
                COALESCE(SUM(t.amount), 0) AS spent_amount,
                (b.budget_amount - COALESCE(SUM(t.amount), 0)) AS remaining_budget
            FROM budgets b
            LEFT JOIN transactions t ON b.user_id = t.user_id AND b.category = t.category
            WHERE b.user_id = ?
            GROUP BY b.category;
        `, [user_id]);

        res.json(trackingData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
