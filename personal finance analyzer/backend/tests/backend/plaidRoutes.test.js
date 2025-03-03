const chai = require("chai");
const chaiHttp = require("chai-http");
const nock = require("nock");
const app = require("../../server"); // Adjust path if necessary
const db = require("../../src/config/db");

chai.use(chaiHttp);
const { expect } = chai;

describe("Plaid API Tests", () => {
  const testUserId = 1; // Adjust to an existing user ID for testing
  const testPublicToken = "mockPublicToken";

  before(() => {
    // Modified mocked Plaid API responses.
    // Since axios wraps the response in a "data" property,
    // we return the raw data here (without an extra "data" wrapper).
    nock("https://sandbox.plaid.com")
      .post("/link/token/create")
      .reply(200, { link_token: "mockLinkToken" });
    
    nock("https://sandbox.plaid.com")
      .post("/item/public_token/exchange")
      .reply(200, { access_token: "mockAccessToken" });
    
    nock("https://sandbox.plaid.com")
      .post("/accounts/balance/get")
      .reply(200, { accounts: [{ account_id: "mockAccountId" }] });
    
    nock("https://sandbox.plaid.com")
      .post("/transactions/get")
      .reply(200, { transactions: [{ amount: -30, date: "2025-02-01", name: "Grocery Store" }] });
    
    // Also mock accountsGet for the exchange_public_token route.
    nock("https://sandbox.plaid.com")
      .post("/accounts/get")
      .reply(200, { accounts: [{ account_id: "mockAccountId" }] });
  });

  it("should create a Plaid link token", (done) => {
    chai.request(app)
      .get("/api/plaid/create_link_token")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("link_token").that.is.a("string");
        done();
      });
  });

  it("should check if a user has a linked account", (done) => {
    // Mock database response for a user with a linked account
    db.query = (query, params) => {
      return Promise.resolve([[{ access_token: "mockAccessToken", account_id: "mockAccountId" }]]);
    };

    chai.request(app)
      .get(`/api/plaid/check_account/${testUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("hasLinkedAccount", true);
        expect(res.body).to.have.property("access_token", "mockAccessToken");
        expect(res.body).to.have.property("account_id", "mockAccountId");
        done();
      });
  });

  it("should return hasLinkedAccount false for users with no linked account", (done) => {
    // Mock database response for a user with no linked account
    db.query = (query, params) => {
      return Promise.resolve([[{ access_token: null, account_id: null }]]);
    };

    chai.request(app)
      .get(`/api/plaid/check_account/${testUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("hasLinkedAccount", false);
        done();
      });
  });

  it("should exchange public token for access token and save to database", (done) => {
    const mockUserId = testUserId;
    // Mock database update (returning an empty result is fine)
    db.query = (query, params) => {
      return Promise.resolve([]);
    };

    chai.request(app)
      .post("/api/plaid/exchange_public_token")
      .send({ public_token: testPublicToken, user_id: mockUserId })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Bank account linked successfully!");
        expect(res.body).to.have.property("access_token", "mockAccessToken");
        expect(res.body).to.have.property("account_id", "mockAccountId");
        done();
      });
  });

  it("should return error if public token or user ID is missing when exchanging token", (done) => {
    chai.request(app)
      .post("/api/plaid/exchange_public_token")
      .send({ public_token: "", user_id: "" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error", "Public token and user ID are required");
        done();
      });
  });

  it("should fetch user transactions and account balances", (done) => {
    // Mock database response for a user with a linked account
    db.query = (query, params) => {
      return Promise.resolve([[{ access_token: "mockAccessToken" }]]);
    };

    chai.request(app)
      .get(`/api/plaid/user_transactions/${testUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("accounts").that.is.an("array");
        expect(res.body.accounts[0]).to.have.property("account_id", "mockAccountId");
        expect(res.body).to.have.property("transactions").that.is.an("array");
        expect(res.body.transactions[0]).to.have.property("amount", -30);
        done();
      });
  });

  it("should return error if user does not have a linked account when fetching transactions", (done) => {
    // Mock database response for a user with no linked account
    db.query = (query, params) => {
      return Promise.resolve([[{ access_token: null }]]);
    };

    chai.request(app)
      .get(`/api/plaid/user_transactions/${testUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error", "User has no linked bank account");
        done();
      });
  });

  after(() => {
    // Clean up any mocked requests after tests are done
    nock.cleanAll();
  });
});
