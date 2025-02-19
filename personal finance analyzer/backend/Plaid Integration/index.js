require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const plaid = require('plaid');
const cors = require('cors');
const helmet = require('helmet'); // Added Helmet

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet()); // Use Helmet middleware to set secure HTTP headers

console.log("Client ID:", process.env.PLAID_CLIENT_ID);
console.log("Secret:", process.env.PLAID_SECRET);

const configuration = new plaid.Configuration({
  basePath: plaid.PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'PLAID-VERSION': '2020-09-14',
    },
  },
});

const plaidClient = new plaid.PlaidApi(configuration);

// Create link token
app.get('/create_link_token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: `user-${Date.now()}` },
      client_name: 'My Plaid App',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });

    console.log("Plaid Link Token Response:", response.data);
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error.response?.data || error);
    res.status(500).json({ error: 'Error creating link token', details: error.response?.data });
  }
});

// Exchange public token for access token
app.post('/exchange_public_token', async (req, res) => {
  const { public_token } = req.body;
  if (!public_token) return res.status(400).json({ error: 'Public token is required' });

  try {
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    console.log("Plaid Public Token Exchange Response:", response.data);
    
    // Store the access token for debugging purposes
    await fs.writeFile('access_token.txt', response.data.access_token);
    console.log('Access token saved to access_token.txt');
    
    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error('Error exchanging public token:', error.response?.data || error);
    res.status(500).json({ error: 'Error exchanging public token', details: error.response?.data });
  }
});

// Get transactions
app.post('/get_transactions', async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ error: 'Access token is required' });

  try {
    console.log('Fetching transactions with access token:', access_token);
    
    const now = new Date();
    const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
    
    const response = await plaidClient.transactionsGet({
      access_token,
      start_date: oneYearAgo.toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      options: {
        count: 100,
        offset: 0,
      }
    });

    console.log('Plaid Transactions Response:', {
      total_transactions: response.data.total_transactions,
      received_transactions: response.data.transactions.length,
    });

    if (!response.data.transactions.length) {
      console.warn('Warning: Received 0 transactions from Plaid');
    }

    await fs.writeFile('transactions.json', JSON.stringify(response.data.transactions, null, 2));
    console.log('Transactions saved to transactions.json');

    res.json({ 
      transactions: response.data.transactions,
      total_transactions: response.data.total_transactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error.response?.data || error);
    res.status(500).json({ 
      error: 'Error fetching transactions', 
      details: error.response?.data 
    });
  }
});

// Add a new endpoint to check the sandbox account's status
app.post('/check_item', async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ error: 'Access token is required' });

  try {
    const response = await plaidClient.itemGet({
      access_token,
    });

    console.log('Item status:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error checking item:', error.response?.data || error);
    res.status(500).json({ error: 'Error checking item', details: error.response?.data });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
