const express = require("express");
const plaidClient = require("../config/plaidConfig");
const db = require("../config/db");
require("dotenv").config();

const router = express.Router();

/**
 * @route GET /api/plaid/create_link_token
 * @desc Create a Plaid Link Token
 */
router.get("/create_link_token", async (req, res) => {
    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: `user-${Date.now()}` },
            client_name: "Personal Finance Analyzer",
            products: ["auth", "transactions"],
            country_codes: ["US"],
            language: "en",
        });

        res.json({ link_token: response.data.link_token });
    } catch (error) {
        console.error("Plaid Link Token Error:", error.response?.data || error);
        res.status(500).json({ error: "Failed to create Plaid link token" });
    }
});

/**
 * @route GET /api/plaid/check_account/:user_id
 * @desc Check if a user already has a linked bank account
 */
router.get("/check_account/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const [users] = await db.query("SELECT access_token, account_id FROM users WHERE id = ?", [user_id]);

        if (!users.length || !users[0].access_token) {
            return res.json({ hasLinkedAccount: false });
        }

        res.json({
            hasLinkedAccount: true,
            access_token: users[0].access_token,
            account_id: users[0].account_id
        });
    } catch (error) {
        console.error("Error checking account link:", error.message);
        res.status(500).json({ error: "Failed to check account status" });
    }
});

/**
 * @route POST /api/plaid/exchange_public_token
 * @desc Exchange a Public Token for an Access Token and Store It
 */
router.post("/exchange_public_token", async (req, res) => {
    const { public_token, user_id } = req.body;

    if (!public_token || !user_id) {
        return res.status(400).json({ error: "Public token and user ID are required" });
    }

    try {
        // ✅ Exchange the public token for an access token
        const response = await plaidClient.itemPublicTokenExchange({ public_token });
        const access_token = response.data.access_token;

        // ✅ Retrieve the account ID from Plaid
        const accountsResponse = await plaidClient.accountsGet({ access_token });
        const account_id = accountsResponse.data.accounts.length > 0 
            ? accountsResponse.data.accounts[0].account_id 
            : null;

        // ✅ Save the access_token and account_id in the database
        await db.query("UPDATE users SET access_token = ?, account_id = ? WHERE id = ?", 
            [access_token, account_id, user_id]);

        res.json({ message: "Bank account linked successfully!", access_token, account_id });
    } catch (error) {
        console.error("Plaid Token Exchange Error:", error.response?.data || error);
        res.status(500).json({ error: "Failed to exchange Plaid public token" });
    }
});

module.exports = router;
