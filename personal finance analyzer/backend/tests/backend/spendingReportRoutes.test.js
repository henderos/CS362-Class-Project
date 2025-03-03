const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../../server"); // Adjust the path as needed
const db = require("../../src/config/db");
const plaidClient = require("../../src/config/plaidConfig");

chai.use(chaiHttp);
const { expect } = chai;

describe("Spending Report API Tests", () => {
  // Restore stubs after each test
  afterEach(() => {
    sinon.restore();
  });

  it("should generate a spending report for valid input", (done) => {
    const testUserId = 1;
    const startDate = "2025-03-01";
    const endDate = "2025-03-31";

    // Stub DB query to simulate a user with an access token
    sinon.stub(db, "query").resolves([[{ access_token: "fake-access-token" }]]);

    // Stub plaidClient.transactionsGet to simulate a successful API call
    // We'll simulate some transactions:
    //   • Two "Food" transactions (100 and 50)
    //   • One "Transport" transaction (20)
    //   • One negative amount transaction (ignored)
    const fakeTransactions = [
      { amount: 100, category: ["Food"] },
      { amount: 50, category: ["Food"] },
      { amount: 20, category: ["Transport"] },
      { amount: -30, category: ["Refund"] }
    ];
    sinon
      .stub(plaidClient, "transactionsGet")
      .resolves({ data: { transactions: fakeTransactions } });

    chai
      .request(app)
      .post("/api/spending-report")
      .send({ startDate, endDate, user_id: testUserId })
      .end((err, res) => {
        expect(res).to.have.status(200);
        // Total positive amounts: 100 + 50 + 20 = 170.00
        expect(res.body).to.have.property("totalSpent", "170.00");

        // Breakdown should include "Food" (100+50) and "Transport" (20)
        expect(res.body).to.have.property("breakdown").that.is.an("array");
        const foodCategory = res.body.breakdown.find(item => item.category === "Food");
        const transportCategory = res.body.breakdown.find(item => item.category === "Transport");
        expect(foodCategory).to.exist;
        expect(foodCategory.amount).to.equal("150.00");
        expect(transportCategory).to.exist;
        expect(transportCategory.amount).to.equal("20.00");

        // Verify that the raw transactions are also returned
        expect(res.body).to.have.property("transactions").that.deep.equals(fakeTransactions);
        done();
      });
  });

  it("should return an error if required fields are missing", (done) => {
    // Missing user_id in the payload
    chai
      .request(app)
      .post("/api/spending-report")
      .send({ startDate: "2025-03-01", endDate: "2025-03-31" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property(
          "error",
          "startDate, endDate, and user_id are required."
        );
        done();
      });
  });

  it("should return an error if user has no linked bank account", (done) => {
    const testUserId = 2;
    const startDate = "2025-03-01";
    const endDate = "2025-03-31";

    // Stub DB query to simulate no matching user record (or missing access token)
    sinon.stub(db, "query").resolves([[]]);

    chai
      .request(app)
      .post("/api/spending-report")
      .send({ startDate, endDate, user_id: testUserId })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error", "User has no linked bank account.");
        done();
      });
  });

  it("should return a 500 error if Plaid transactions fetch fails", (done) => {
    const testUserId = 1;
    const startDate = "2025-03-01";
    const endDate = "2025-03-31";

    // Stub DB query to return a valid access token
    sinon.stub(db, "query").resolves([[{ access_token: "fake-access-token" }]]);
    // Stub plaidClient.transactionsGet to simulate a failure (e.g., network or API error)
    sinon.stub(plaidClient, "transactionsGet").rejects(new Error("Plaid API error"));

    chai
      .request(app)
      .post("/api/spending-report")
      .send({ startDate, endDate, user_id: testUserId })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property("error", "Failed to generate spending report.");
        done();
      });
  });
});
