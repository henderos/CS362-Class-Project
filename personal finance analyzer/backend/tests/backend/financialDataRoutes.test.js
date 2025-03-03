const chai = require("chai");
const chaiHttp = require("chai-http");
const nock = require("nock"); // For mocking external HTTP requests
const app = require("../../server"); // Adjust path if necessary

chai.use(chaiHttp);
const { expect } = chai;

describe("Financial Data API Tests", () => {
  const testUserId = 1; // Adjust to an existing user ID for testing
  
  before(() => {
    // Mock the Plaid API response
    nock('http://localhost:5000')
      .get(`/api/plaid/user_transactions/${testUserId}`)
      .reply(200, {
        transactions: [
          { date: "2025-03-01", amount: 50.00 },
          { date: "2025-03-05", amount: 30.00 },
          { date: "2025-02-25", amount: 20.00 }
        ],
        accounts: [
          { name: "Checking", balances: { available: 1000.00 } },
          { name: "Savings", balances: { available: 5000.00 } }
        ]
      });
  });

  it("should retrieve financial data (monthly spending and account balances)", (done) => {
    chai.request(app)
      .get("/api/financial-data")
      .query({ user_id: testUserId })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("monthlySpending", 80.00); // 50 + 30
        expect(res.body).to.have.property("accounts").that.is.an("array");
        expect(res.body.accounts[0]).to.have.property("name", "Checking");
        expect(res.body.accounts[0]).to.have.property("balance", 1000.00);
        expect(res.body.accounts[1]).to.have.property("name", "Savings");
        expect(res.body.accounts[1]).to.have.property("balance", 5000.00);
        done();
      });
  });

  it("should return an error if user_id is missing", (done) => {
    chai.request(app)
      .get("/api/financial-data")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error", "User ID is required");
        done();
      });
  });

  it("should return a 500 error if Plaid data fetch fails", (done) => {
    // Mock a failure response from Plaid API
    nock('http://localhost:5000')
      .get(`/api/plaid/user_transactions/${testUserId}`)
      .reply(500);

    chai.request(app)
      .get("/api/financial-data")
      .query({ user_id: testUserId })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property("error", "Failed to retrieve financial data");
        done();
      });
  });

  after(() => {
    // Clean up any mocked requests after tests are done
    nock.cleanAll();
  });
});
