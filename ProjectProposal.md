## Team info

### <ins>Team Info</ins>

- America Pacheco: Front-End Developer (HTML, CSS, UI design)
- Bailey Bounnam: Back-End Developer (Node.js, Express, API integration)
- Ross Henderson: Back-End Developer (Feature implementation and functionality)
- Brian Fang: Database Manager (MySQL design, secure storage of financial data)
- Bryan Partida: API Specialist (Plaid API integration, financial data processing)


### <ins>Github Link</ins>

https://github.com/henderos/CS362-Class-Project 



### <ins>Communication Method</ins>

Our main form of communication will be Discord, where we will establish clear threads for tasks, announcements, and questions. We will try to respond within 17 hours of a message of discord. If no one responds, then politely give a reminder. 


## Product description

### <ins>Project Title</ins>

**Personal Finance Analyzer**


### <ins>Abstract</ins>

Personal Finance Analyzer is a web application designed to simplify financial management for users, providing tools to track spending and manage subscriptions. With an intuitive user interface and analytics, it aims to empower users to make informed financial decisions effortlessly.


### <ins>Goal</ins>

This project will help users to manage and keep track of their personal finances, see where their money is going, and make decisions for future spending based on these facts.


### <ins>Current Practice</ins>

Today, people commonly use spreadsheets, individual banking apps, or third-party apps to track their finances. These methods are often not automated, or if you have accounts in different banks, then you have to individually log into each banks’ account. The features that we will implement are also commonly locked behind some sort of paywall. With our web app, you will be able to link every account so that you can see everything in one spot with advanced features such as subscription tracking or personalized savings advice.


### <ins>Novelty</ins>

Our finance manager will not only allow users to see their finances, but also will tell users where certain “problem areas” may be, allowing them to see where they are likely able to improve.


### <ins>Effects</ins>

The people who will be using our web app are people who want to see all their financial information with a user-friendly interface. If we are successful in our app, our app will show more transparency with how our users' money is being handled. This will help reduce unnecessary expenses by identifying underused subscriptions and help users allocate their income effectively by highlighting spending patterns.

### <ins>Use Cases</ins>

**<ins>Subscription Tracking</ins>**:\
**Actors**: User, System\
**Triggers**: User navigates to the “Subscriptions” section of the app.\
**Preconditions**: User has linked financial accounts, and transaction data is available.\
**Postconditions**: The system identifies recurring transactions and displays them as subscriptions.\
**List of Steps**: User selects the “Subscriptions” tab. System retrieves recurring transactions from the linked accounts.
System categorizes these transactions and flags underused subscriptions. User reviews and optionally adjusts subscription tracking preferences.\
**Extensions/Variations**: User can manually add subscriptions. User can flag a subscription as “not recurring.”\
**Exceptions**: Errors in identifying recurring transactions. Incomplete transaction data.




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

Our project will employ a scalable and efficient system architecture. The front end will be built using HTML and CSS, with JavaScript to enhance interactivity and responsiveness. For the back end, we will use Node.js with Express to handle server-side functionality and API routing. 
Data storage will be managed using MySQL to securely handle user information, while the Plaid API will enable integration with users’ bank accounts for retrieving financial data.



### <ins>Risks</ins>

One of the most significant challenges we face is ensuring effective and efficient communication within a large team. Miscommunication or delays in responding to inquiries could lead to misunderstandings, duplicated efforts, or even missed deadlines in some cases. Additionally, with multiple members handling interconnected tasks, it can be challenging to maintain a clear and cohesive understanding of project progress and priorities.

To mitigate this risk, we will establish clear communication expectations from the beginning. As mentioned above, team members will be required to regularly check Discord, our primary communication platform, and respond to messages within 17 hours. Tasks will be clearly assigned and tracked using GitHub Projects to provide transparency and accountability. Regular updates will be shared in designated channels to keep everyone informed of ongoing progress.


### <ins>Major Features</ins>

- **Dashboard Overview**: Display consolidated financial data, including recent transactions, and monthly spending summaries.
- **Subscription Tracking**: Identify and track recurring subscriptions, flagging underused services.
- **Spending Categories**: Provide visual breakdowns of expenses by category (e.g., groceries, rent, entertainment).
- **Budgeting Tool**: Allow users to set budgets for categories and receive alerts when nearing limits.


### <ins>Stretch Goals</ins>

- **AI**: Implement AI suggestions and advice for users.
- **Mobile Support**: Display content to be seen and used effectively on mobile devices.

### <ins>Timeline</ins>
**Week 1**: Set up GitHub Repository and initial project structure. (Ross Henderson)\
**Week 2**: Complete front-end skeleton and basic navigation. (America Pacheco)\
**Week 3**: Design database schema and set up MySQL database. (Brian Fang)\
**Week 4**: Integrate Plaid API and finalize HTML. (Bryan Partida, America Pacheco)\
**Week 5**: Establish basic financial data retrieval. (Bailey Bounnam, Ross Henderson)\
**Week 6**: Implement budgeting tools. (Bailey Bounnam, Brian Fang)\
**Week 7**: Implement subscription tracking. (Ross Henderson, Bryan Partida)\
**Week 8**: Conduct usability testing and refine UI/UX. (Everyone)\
**Week 9**: Finalize project features and perform end-to-end testing. (Everyone)\
**Week 10**: Finalize project documentation and deploy the application. (Everyone)
