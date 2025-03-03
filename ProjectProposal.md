## Team info

### <ins>Team Info</ins>

- America Pacheco: Front-End Developer: UI design, HTML, CSS, JavaScript components
- Bailey Bounnam: Back-End Developer: API integration, authentication
- Ross Henderson: Back-End Developer: Feature implementation
- Brian Fang: Database Manager: Schema design, MySQL optimization
- Bryan Partida: Front-End Developer: JavaScript logic, UI interactivity

### <ins>Github Link</ins>

https://github.com/henderos/CS362-Class-Project 

### <ins>Communication Method</ins>

Our main form of communication will be Discord, where we will establish clear threads for tasks, announcements, and questions. We will try to respond within 17 hours of a message on Discord. If no one responds, then politely give a reminder.

## Product description

### <ins>Project Title</ins>

**Personal Finance Analyzer**

### <ins>Abstract</ins>

The Personal Finance Analyzer is a web-based personal finance management tool that empowers users to take control of their finances through automated tracking, real-time budget alerts, and spending analysis. Unlike traditional finance apps that require manual tracking or lock advanced features behind a paywall, this app offers a streamlined, all-in-one platform that integrates multiple accounts to provide a comprehensive financial overview.

### <ins>Goal</ins>

This project will help users to manage and keep track of their personal finances, see where their money is going, and make decisions for future spending based on these facts.

### <ins>Current Practice</ins>

Today, people commonly use spreadsheets, individual banking apps, or third-party apps to track their finances. These methods are often not automated, or if you have accounts in different banks, then you have to individually log into each bank’s account. The features that we will implement are also commonly locked behind some sort of paywall. With our web app, you will be able to link every account so that you can see everything in one spot with advanced features such as subscription tracking or personalized savings advice.

### <ins>Novelty</ins>

Our finance manager will not only allow users to see their finances but also will tell users where certain “problem areas” may be, allowing them to see where they are likely able to improve.

### <ins>Effects</ins>

The people who will be using our web app are people who want to see all their financial information with a user-friendly interface. If we are successful in our app, our app will show more transparency with how our users' money is being handled. This will help reduce unnecessary expenses by identifying underused subscriptions and help users allocate their income effectively by highlighting spending patterns.

### <ins>Use Cases</ins>

**<ins>Use Case 1: Subscription Tracking</ins>**:\
**Actors**: User, System\
**Triggers**: User navigates to the “Subscriptions” section of the app.\
**Preconditions**: User has linked financial accounts, and transaction data is available.\
**Postconditions**: The system identifies recurring transactions and displays them as subscriptions.\
**List of Steps**: User selects the “Subscriptions” tab. System retrieves recurring transactions from the linked accounts.
System categorizes these transactions and flags underused subscriptions. User reviews and optionally adjusts subscription tracking preferences.\
**Extensions/Variations**: User can manually add subscriptions. User can flag a subscription as “not recurring.”\
**Exceptions**: Errors in identifying recurring transactions. Incomplete transaction data.

**<ins>Use Case 2: Budget Setting</ins>**:\
**Actors**: User, System\
**Triggers**: User navigates to the “Budgeting Tool” section of the app.\
**Preconditions**: User has linked financial accounts and user has access to spending categories.\
**Postconditions**: The system stores the user’s budget for each selected category.\
**List of Steps**: User selects “Budgeting Tool”. User selects a spending category. User enters budget amount.\
**Extensions/Variations**: If user is editing an existing budget\
**Exceptions**: If the budget amount is too small/large

**<ins>Use Case 3: Viewing Financial Data</ins>**:\
**Actors**: User, System\
**Triggers**: User logs into the app\
**Preconditions**: User has linked financial accounts.\
**Postconditions**: The user sees an overview of recent transactions, monthly spending, and account balances\
**List of Steps**: User logs in. System retrieves financial data. Dashboard shows financial information.\
**Extensions/Variations**: User can change between light and dark mode\
**Exceptions**: If the system can’t connect to the bank account

**<ins>Use Case 4: Receiving Budget Alerts</ins>**:\
**Actors**: User, System\
**Triggers**: User is almost over budget for category\
**Preconditions**: The user has linked financial accounts, the user has set budgets for categories and the user has set alert preference (email, through app, etc.)\
**Postconditions**: The system notifies the user through an alert\
**List of Steps**: The user spends money in tracked category. The system calculates total spending in category. The system identifies that user is close to their set budget. The system sends an alert to the user.\
**Extensions/Variations**: The alert preference is changed\
**Exceptions**: Alert fails to send

**<ins>Use Case 5: Generating Spending Reports</ins>**:\
**Actors**: User, System\
**Triggers**: User selects “Generate Spending Report” on app\
**Preconditions**: The user has linked financial accounts and financial data is available for time period.\
**Postconditions**: The system processes and generates a spending report for selected time period\
**List of Steps**: The user selects “Generate Spending Report”. The user selects a time period for report. The system processes and generates a spending report.\
**Extensions/Variations**: The user wants to export report as a different file type\
**Exceptions**: Insufficient data for selected time period

### <ins>Non-functional Requirements</ins>

**Scalability**: The system should handle up to 10,000 concurrent users without performance degradation. This includes managing API calls to Plaid and retrieving data from the MySQL database efficiently.

**Security and Privacy**: User data must be encrypted in transit (HTTPS) and at rest (AES-256). Only authenticated and authorized users can access sensitive financial data.

**Usability**: The web application must be responsive and accessible on desktop devices and as a stretch goal, should also be accessible on mobile.

### <ins>External Requirements</ins>
- The product must validate and handle user input errors gracefully.
- Deployment must include a public URL accessible to end-users.
- Comprehensive documentation must be provided, including installation instructions for developers and usage instructions for users.
- The project scope must align with the team’s resources and timeline.

### <ins>Technical Approach</ins>

Refer to "Major Software Components"

### <ins>Risks</ins>

Refer to "Risk Assessment" inside the "Process Description"

### <ins>Major Features</ins>

- **Dashboard Overview**: Display consolidated financial data, including recent transactions, and monthly spending summaries.
- **Subscription Tracking**: Identify and track recurring subscriptions, flagging underused services.
- **Spending Categories**: Provide visual breakdowns of expenses by category (e.g., groceries, rent, entertainment).
- **Budgeting Tool**: Allow users to set budgets for categories and receive alerts when nearing limits.

### <ins>Stretch Goals</ins>

- **AI**: Implement AI suggestions and advice for users.
- **Mobile Support**: Display content to be seen and used effectively on mobile devices.

### <ins>Timeline</ins>
**Week 1**: Project Initialization: Set up project environment, configure version control, establish coding standards, and set up MySQL databased.\
**Week 2**: Front-End & Database Design: Design wireframes, create front-end skeleton, and finalize database schema. (Requires project setup from Week 1)\
**Week 3**: Plaid API Setup: Research, register, and integrate basic Plaid API functionality. (Requires database setup from Week 1)\
**Week 4**: Data Retrieval & Display: Fetch and display financial data from Plaid API on the front-end. (Requires Plaid API setup and front-end structure from Week 2)\
**Week 5**: Budgeting Tool Development: Implement budget categories, user input fields, and real-time data storage. (Requires database schema and financial data retrieval)\
**Week 6**: Subscription Tracking Feature: Identify recurring transactions and display user subscriptions. (Requires financial data retrieval from Week 4)\
**Week 7**: Spending Report Generation: Implement data visualization for spending trends and financial reports. (Requires data retrieval and categorization from previous weeks)\
**Week 8**: Usability Testing & UI Refinements: Conduct user testing, fix UI issues, improve accessibility, and refine navigation. (Requires major features to be implemented)\
**Week 9**: End-to-End Testing & Debugging: Test entire workflow, fix integration issues, and optimize performance. (Requires all major features completed)\
**Week 10**: Final Deployment & Documentation: Write final project documentation, deploy the application, and conduct final review. (Requires complete system testing)

---

## Software Architecture

### Overview
The Personal Finance Analyzer is a web application designed to help users track and analyze their spending habits, manage subscriptions, and set budgets. The application follows a layered architecture with a Front-End (UI/UX), Back-End (APIs and business logic), and a Database layer for secure financial data storage. We rely on the Plaid API for retrieving financial transactions from various financial institutions.

### Major Software Components

**Front-End (Client)**  
- **Technologies**: HTML, CSS, JavaScript  
- **Functionality**:  
  - Displays user dashboards, budget tools  
  - Sends requests to the Back-End for data  
  - Offers interactive visualization  

**Back-End (Server)**  
- **Technologies**: Node.js, Express  
- **Functionality**:  
  - Receives requests from Front-End and processes business logic  
  - Integrates with Plaid API to retrieve and normalize financial data  
  - Interacts with the database layer for secure data retrieval and updates  

**Database Layer**:  
- **Technologies**: MySQL  
- **Functionality**:  
  - Stores users, account information, transaction history, budget info  
  - Ensures data consistency, security, and integrity through relational schema constraints  

**Plaid API**  
- **Functionality**:  
  - Provides secure access to a user’s bank account and transactions  

### Interfaces Between Components
- **Front-End and Back-End**: RESTful API calls.  
- **Back-End and Database**: MySQL queries.  
- **Back-End and Plaid API**: Secure API calls for transaction retrieval.  

### Data Storage Details
- **User Data**: UserID, authentication credentials (hashed), account settings.  
- **Transactions**: Date, amount, category, merchant.  
- **Budgets**: Category, allocated amount, actual spending.  
- **Subscriptions**: Recurring payments identified via transaction patterns.  

### Assumptions
- Users will link their bank accounts via Plaid.  
- MySQL is scalable to compensate for user growth.  
- All sensitive data will be encrypted.  

### Alternative Architectural Decisions  
**Alternative 1: Using MongoDB Instead of MySQL**  
- **Pros**: Easier to manage, built-in authentication.  
- **Cons**: Complex queries can be slower, requires different indexing strategies.  

**Alternative 2: Using GraphQL Instead of REST**  
- **Pros**: Flexible schema, better scalability for unstructured data.  
- **Cons**: More complex implementation, potential over-fetching issues.  

---

## Software Design

### Front-End
- **Dashboard.js**: Displays financial summary.  
- **Budget.js**: Allows users to set and adjust budgets.  
- **Transactions.js**: Lists user transactions with filtering.  

### Back-End
- **server.js**: Initializes Express app.  
- **transactions.js**: Handles transaction-related API calls.  
- **plaidService.js**: Fetches data from Plaid.  

### Database Tables
- **users (id, email, passwordHash, settings)**  
- **transactions (id, userID, date, amount, category, merchant)**  
- **budgets (id, userID, category, limit, spent)**  

---

## Coding Guidelines

- **JavaScript (Node.js, Front-End)**: [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)  
- **SQL (MySQL)**: [SQL Style Guide](https://www.sqlstyle.guide/)  

We chose these guidelines because they are widely accepted industry standards, ensuring code readability, maintainability, and consistency across the project. To enforce them, we will do continuous checks each week on the new pushes to the GitHub repo and make sure they follow the guidelines.

---

## Process Description

### Risk Assessment
1. **API Downtime**  
   - **Likelihood**: Medium  
   - **Impact**: High  
   - **Evidence**: Plaid API has occasional service outages
   - **Steps to Reduce Likelihood/Impact**: Implement error handling and retry mechanisms. Monitor Plaid’s status page and API response logs.
   - **Plan for Detecting the Problem**: Set up API health checks to monitor response failures. Implement logging for API calls to detect failures early.
   - **Mitigation**: Implement caching, fallback strategies  

2. **Security Breach**  
   - **Likelihood**: Low  
   - **Impact**: High  
   - **Evidence**: Financial data is a high-value target for attackers, and API keys or database vulnerabilities could be exploited.
   - **Steps to Reduce Likelihood/Impact**: Use AES-256 encryption for sensitive data. Implement authentication and authorization best practices.
   - **Plan for Detecting the Problem**: Set up monitoring for unauthorized access attempts.
   - **Mitigation**: Immediately revoke compromised credentials and notify affected users and follow a data breach response plan.

3. **Database Performance Issues**  
   - **Likelihood**: Medium  
   - **Impact**: Medium  
   - **Evidence**: The project aims to scale up to 10,000 users, and MySQL performance may degrade with large datasets.
   - **Steps to Reduce Likelihood/Impact**: Optimize queries and indexing strategies.
   - **Plan for Detecting the Problem**: Monitor query performance and server load.
   - **Mitigation**: Indexing, query optimization  

4. **Team Coordination Issues**  
   - **Likelihood**: Medium  
   - **Impact**: Medium  
   - **Evidence**: Remote team and different schedules, which may slow down debugging or feature development.
   - **Steps to Reduce Likelihood/Impact**: Use Discord for real-time communication. Hold weekly progress meetings.
   - **Plan for Detecting the Problem**: Track missed deadlines and delayed responses in GitHub.
   - **Mitigation**: Clear communication  

5. **Feature Integration Conflicts**  
   - **Likelihood**: Medium  
   - **Impact**: Medium  
   - **Evidence**: Multiple developers are working on different components simultaneously, which increases the chances of merge conflicts, API mismatches, or integration bugs.
   - **Steps to Reduce Likelihood/Impact**: Require thorough code reviews before merging to detect potential conflicts early.
   - **Plan for Detecting the Problem**: Run automated integration tests after every merge to detect breakages.
   - **Mitigation**: Use feature branches, thorough code reviews, automated integration testing  


Since we submitted the Requirements document, we realized that combining different parts of the project might be harder than we first thought. This is because multiple people are working on different features at the same time. To help with this, we are focusing on better communication and doing regular tests to catch problems early. We are also making a clearer schedule to make sure everything fits together smoothly.

### Project Schedule
- Refer to "Timeline" inside the "Product Description"

### Team Structure
- Refer to "Team Members" at the top of the page

### Test Plan & Bug Tracking
- **Unit Testing**: Jest for JavaScript, Mocha for Node.js.  
- **Integration Testing**: Postman for API validation.  
- **Usability Testing**: User feedback sessions.  
- **Bug Tracking**: GitHub Issues.

### Documentation Plan (User Guide)
1. **Introduction**  
   - Overview of the Personal Finance Analyzer.  
   - Key features: Dashboard, Budgeting, Subscription Tracking, Spending Reports.  
   - How it helps users manage their finances.  

2. **Getting Started**  
   - System Requirements: Browser compatibility, internet connection.  
   - Account Creation: Signing up, logging in, password recovery.  
   - Linking Bank Accounts: Using Plaid API for secure integration.  

3. **Using the Dashboard**  
   - Overview of financial summary.  
   - Navigating different sections (transactions, budgets, reports).  
   - Customizing the dashboard.  

4. **Managing Transactions**  
   - Viewing and filtering transactions.  
   - Categorizing expenses.  
   - Identifying recurring subscriptions.  

5. **Budgeting Tools**  
   - Setting up budget categories.  
   - Tracking spending vs. budget.  
   - Adjusting budget limits.  

6. **Generating Reports**  
   - Viewing spending trends.  
   - Exporting financial summaries.  
   - Customizing reports.  




# Testing and Continuous Integration Plan

## Test Automation and CI Integration

### Test-Automation Infrastructure
Our project utilizes the following test automation tools:
- **Mocha & Chai**: For unit and integration testing on the back-end (Node.js/Express).
- **Jest**: For front-end testing of JavaScript logic and React components.
- **Postman/Newman**: For API validation and integration testing.
- **MySQL Test Containers**: To facilitate database integration testing in an isolated environment.

### Justification for Choosing These Tools
- **Mocha & Chai**:
  - Widely used for Node.js applications.
  - Supports asynchronous testing.
  - Provides flexible and readable reporting.
  - Requires additional setup for assertions.

- **Jest**:
  - Optimized for JavaScript and front-end testing.
  - Includes built-in mocking capabilities.
  - Fast execution and easy configuration.
  - Can be slower for larger test suites.

- **Postman/Newman**:
  - Facilitates API testing with minimal setup.
  - Provides automation for integration tests.
  - Useful for validating endpoints before deployment.
  - Requires GUI-dependent setup, which can be complex.

- **MySQL Test Containers**:
  - Enables database testing without external dependencies.
  - Ensures data integrity during test execution.
  - Requires Docker for setup and execution.

These tools ensure robust testing coverage for both front-end and back-end components while being easy to integrate with CI.

### Adding a New Test
1. **Back-end Test (Mocha & Chai):**
   - Navigate to `server/tests` directory.
   - Create a new test file, e.g., `transactions.test.js`.
   - Use Mocha syntax for writing tests:
     ```javascript
     const chai = require('chai');
     const chaiHttp = require('chai-http');
     const app = require('../server');

     chai.use(chaiHttp);
     describe('Transactions API Tests', () => {
       it('should retrieve all transactions', (done) => {
         chai.request(app)
           .get('/api/transactions')
           .end((err, res) => {
             chai.expect(res).to.have.status(200);
             done();
           });
       });
     });
     ```

2. **Front-end Test (Jest):**
   - Navigate to `client/src/__tests__`.
   - Create a new test file, e.g., `BudgetTool.test.js`.
   - Write Jest-based test:
     ```javascript
     import { render, screen } from '@testing-library/react';
     import BudgetTool from '../components/BudgetTool';

     test('renders budget tool component', () => {
       render(<BudgetTool />);
       expect(screen.getByText(/Set Your Budget/)).toBeInTheDocument();
     });
     ```

### CI Service and Repository Linkage
We have chosen **GitHub Actions** as our CI service.

#### Justification for Choosing GitHub Actions
- Fully integrated with GitHub, making configuration straightforward.
- Free for open-source projects and provides cost-effective CI/CD.
- Supports extensive custom workflows with YAML configuration.
- Runs CI/CD pipelines directly within GitHub, reducing external dependencies.
- Can be slower compared to dedicated CI tools like CircleCI.

#### CI Service Comparison
| CI Service         | Pros                                                                                                                       | Cons                                                                                                        |
|--------------------|----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| **GitHub Actions** | - Deep integration with GitHub <br> - Free for open-source projects <br> - Flexible YAML workflow definitions              | - May have slower performance for large projects <br> - Free tier has limited parallelism and minutes       |
| **Travis CI**      | - Long-standing reputation and proven integration with GitHub <br> - Simple configuration with a straightforward `.travis.yml` file | - Build queues can be slow during peak times <br> - Limited free build minutes for private repositories     |
| **CircleCI**       | - Excellent parallelism and customizable workflows <br> - Good performance with advanced caching options <br> - Detailed build insights and reporting | - Steeper learning curve for configuration <br> - Pricing may be less competitive for larger teams          |



### CI Service Configuration
1. **Creating the CI Workflow**
   - Add a `.github/workflows/ci.yml` file to the repository:
     ```yaml
     name: CI Pipeline
     on:
       push:
         branches:
           - main
       pull_request:
         branches:
           - main
     jobs:
       build:
         runs-on: ubuntu-latest
         steps:
           - name: Checkout repository
             uses: actions/checkout@v3
           - name: Set up Node.js
             uses: actions/setup-node@v3
             with:
               node-version: '16'
           - name: Install dependencies
             run: npm install
           - name: Run tests
             run: npm test
     ```
2. **Repository Linkage**
   - GitHub Actions automatically integrates with our repository.
   - We ensure that every push or pull request triggers the CI pipeline.

### Tests Executed in CI Builds
- **Unit Tests**: Run using Mocha/Chai and Jest.
- **Integration Tests**: API endpoint validation with Postman/Newman.
- **Database Tests**: Run MySQL test containers to validate queries.
- **End-to-End Tests**: (Future Implementation)

### CI Triggers
- **On Push**: Runs the full test suite whenever code is pushed to the `main` branch.
- **On Pull Request**: Runs the test suite before merging PRs to ensure stability.
- **Scheduled Runs**: (Future Implementation) Nightly builds to detect regressions.
