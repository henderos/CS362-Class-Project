# Setup and Deployment Instructions

This document provides instructions for setting up and deploying the Personal Finance Analyzer web application.

## Prerequisites

Before setting up the application, ensure that you have the following software installed on your server:

1. **Node.js**: Version 14.x or later is recommended.
2. **npm**: Comes with Node.js, used for managing packages.
3. **MySQL**: Version 5.7 or later is recommended.
4. **Git**: For cloning the repository.

## Environment Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Change into Correct Directory:** 
   - While in the parent directory, run:
   ```bash
    cd personal\ finance\ analyzer/backend/
   ```
   - If that causes an error, run each line seperately:
   ```bash
    cd 'personal finance analyzer'
    cd backend
   ```

3. **Install Node.js Dependencies**:
    Make sure you're in the backend folder and run:
   ```bash
   npm install
   ```

4. **Setup MySQL Database**:
   - Create a new database in MySQL.
   - Run the SQL scripts to create necessary tables. You can find the table creation scripts in the `backend/src/databasemodels` file, referring to as `schema.sql`.

5. **Create Plaid Account**:
   - Create a new Plaid account.
   - Make sure you have access to your Plaid Client ID and your Secret ID.

6. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following environment variables using the credentials from your created database and Plaid account:
   ```plaintext
   DB_HOST=<your-database-host>
   DB_USER=<your-database-username>
   DB_PASS=<your-database-password>
   DB_NAME=<your-database-name>
   PLAID_CLIENT_ID=<your-plaid-client-id>
   PLAID_SECRET=<your-plaid-secret>
   ```

## Running the Application

1. **Start the Server**:
    Make sure you're in the backend folder and run:
   ```bash
   node server.js
   ```

2. **Access the Application**:
   Open a web browser and navigate to `http://localhost:5000` to access the application.

## Testing

1. **Run Tests**:
    Make sure you're in the backend folder and run:
   ```bash
   npm test
   ```

## Additional Notes

- Ensure that the MySQL server is configured to allow remote connections if the database is hosted separately.
- Regularly update the Node.js dependencies to patch any security vulnerabilities.