# README

## Project Title
**Dam Dollars**

## Abstract
Dam Dollars is a web-based personal finance platform designed to help users simplify and optimize their money management. It offers tools for budget-setting, subscription tracking, and real-time financial analytics, consolidating all banking data into one intuitive dashboard. By centralizing financial details from multiple accounts and providing advanced features without a paywall, Dam Dollars removes the hassle of manual tracking and helps users make informed spending and saving decisions. Moreover, it emphasizes user-friendly interfaces and actionable insights, aiming to motivate people to establish healthy financial habits. In essence, Dam Dollars acts as a one-stop solution for individuals seeking better control of their financial well-being.

## Goal
This project will help users manage and keep track of their personal finances, see where their money is going, and make decisions for future spending based on these facts.

## Build and Test Instructions

1. **Clone the Repository:**  
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Change into Correct Directory:** 
   - While in the parent directory, run:
   ```bash
    cd personal\ finance\ analyzer/backend/
   ```

3. **Install Dependencies:**  
   - While in the back-end directory, run:
     ```bash
     npm install
     ```

5. **Automated Testing:**  
   For automated tests, run:
   ```bash
   npm test
   ```
   Otherwise, manually test the system locally by verifying that each functionality (login, linking bank accounts, budgeting, spending reports, and dahsboard) works as expected.


## Running the System

1. **Start the Server:**  
   Run the following command from the backend directory:
   ```bash
   npm start
   ```
2. **Access the Application:**  
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Trello Link
[Trello Link](https://trello.com/invite/b/67859826cb1dd2f0bc0c0b1b/ATTI0b79cc2d74ed979d249e446c0995660497642802/pt14personal-finance-analyzer)

## Layout
Weekly reports are located in the `reports/` directory in files with the format `YYYYMMDD.md`.

## Operational Use Cases

### Use Case 1: Subscription Tracking
**Actors:**
- User
- System

**Triggers:**
- User navigates to the “Subscriptions” section of the app.

**Preconditions:**
- User has linked financial accounts.
- Transaction data is available.

**Postconditions:**
- The system identifies recurring transactions and displays them as subscriptions.

**List of Steps:**
1. User selects the “Subscriptions” tab.
2. System retrieves recurring transactions from the linked accounts.
3. System categorizes these transactions and flags underused subscriptions.
4. User reviews and optionally adjusts subscription tracking preferences.

**Exceptions:**
- Errors in identifying recurring transactions.
- Incomplete transaction data.

### Use Case 2: Budget Setting
**Actors:**
- User
- System

**Triggers:**
- User navigates to the “Budgeting Tool” section of the app.

**Preconditions:**
- User has linked financial accounts.
- User has access to spending categories.

**Postconditions:**
- The system stores the user’s budget for each selected category.

**List of Steps:**
1. User selects the “Budgeting Tool.”
2. User selects a spending category.
3. User enters budget amount.

**Extensions/Variations:**
- Applicable when the user is editing an existing budget.

**Exceptions:**
- If the budget amount is too small or too large.

### Use Case 3: Viewing Financial Data
**Actors:**
- User
- System

**Triggers:**
- User logs into the app.

**Preconditions:**
- User has linked financial accounts.

**Postconditions:**
- The user sees an overview of recent transactions, monthly spending, and account balances.

**List of Steps:**
1. User logs in.
2. System retrieves financial data.
3. Dashboard displays financial information.

**Exceptions:**
- If the system can’t connect to the bank account.

### Use Case 4: Generating Spending Reports
**Actors:**
- User
- System

**Triggers:**
- User selects “Generate Spending Report” on the app.

**Preconditions:**
- User has linked financial accounts.
- Financial data is available for the selected time period.

**Postconditions:**
- The system processes and generates a spending report for the selected time period.

**List of Steps:**
1. User selects “Generate Spending Report.”
2. User selects a time period for the report.
3. System processes and generates the spending report.

**Extensions/Variations:**
- User may want to export the report in a different file type.

**Exceptions:**
- Insufficient data for the selected time period.

