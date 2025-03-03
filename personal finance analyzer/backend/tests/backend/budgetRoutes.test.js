const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server"); // Adjust path if necessary
const db = require("../../src/config/db");

chai.use(chaiHttp);
const { expect } = chai;

describe("Budgets API Tests", () => {
  const testUserId = 1; // Use a test user ID from your database
  let budgetId;

  before(async () => {
    // Clean up test data before tests
    await db.query("DELETE FROM budgets WHERE user_id = ?", [testUserId]);
  });

  after(async () => {
    // Clean up test data after tests
    await db.query("DELETE FROM budgets WHERE user_id = ?", [testUserId]);
  });

  it("should create a new budget", (done) => {
    chai.request(app)
      .post("/api/budgets")
      .send({
        user_id: testUserId,
        category: "Groceries",
        budget_amount: 100,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message", "Budget created successfully");
        expect(res.body).to.have.property("budgetId");
        budgetId = res.body.budgetId; // Save the budgetId for later use
        done();
      });
  });

  it("should not create a budget if required fields are missing", (done) => {
    chai.request(app)
      .post("/api/budgets")
      .send({
        user_id: testUserId,
        category: "Groceries",
        // Missing budget_amount
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error", "All fields are required");
        done();
      });
  });

  it("should retrieve all budgets for a user", (done) => {
    chai.request(app)
      .get(`/api/budgets/${testUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        // The GET endpoint returns only category and budget_amount.
        const budget = res.body.find(b => b.category === "Groceries");
        expect(budget).to.exist;
        // If your database returns a string (e.g., "100.00"), adjust the expectation accordingly.
        expect(budget).to.have.property("budget_amount").that.satisfies(val => Number(val) === 100);
        done();
      });
  });

  it("should update a budget amount", (done) => {
    chai.request(app)
      .put(`/api/budgets/${budgetId}`)
      .send({
        budget_amount: 150,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Budget updated successfully");
        done();
      });
  });

  it("should not update a budget amount if missing field", (done) => {
    chai.request(app)
      .put(`/api/budgets/${budgetId}`)
      .send({})  // Missing budget_amount field
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error", "Budget amount is required");
        done();
      });
  });

  it("should delete a budget", (done) => {
    // Since the DELETE endpoint requires both user_id and category, we call:
    chai.request(app)
      .delete(`/api/budgets/${testUserId}/Groceries`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        // Note: the router responds with an exclamation at the end.
        expect(res.body).to.have.property("message", "Budget deleted successfully!");
        done();
      });
  });

  it("should track spending against budgets", (done) => {
    // Insert a new budget first for test tracking.
    db.query("INSERT INTO budgets (user_id, category, budget_amount) VALUES (?, ?, ?)", [testUserId, "TestCategory", 200])
      .then(() => {
        chai.request(app)
          .get(`/api/budgets/track/${testUserId}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            // Find the newly inserted budget in the response.
            const budget = res.body.find(b => b.category === "TestCategory");
            expect(budget).to.exist;
            expect(budget).to.have.property("category", "TestCategory");
            // Adjust for number or formatted string as needed.
            expect(budget).to.have.property("budget_amount").that.satisfies(val => Number(val) === 200);
            expect(budget).to.have.property("spent_amount", 0);
            expect(budget).to.have.property("remaining_budget").that.satisfies(val => Number(val) === 200);
            done();
          });
      })
      .catch(err => done(err));
  });
});
