const plaid = require("plaid");
require("dotenv").config();

// Configure Plaid API Client
const configuration = new plaid.Configuration({
    basePath: plaid.PlaidEnvironments.sandbox, // Change if moving to production
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
            "PLAID-VERSION": "2020-09-14",
        },
    },
});

const plaidClient = new plaid.PlaidApi(configuration);
module.exports = plaidClient;
