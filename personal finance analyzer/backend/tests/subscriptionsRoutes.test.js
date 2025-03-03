const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../server"); // Adjust the path as needed
const db = require("../src/config/db");
const plaidClient = require("../src/config/plaidConfig");

chai.use(chaiHttp);
const { expect } = chai;

describe("Subscription API Tests", () => {
  // Restore stubs after each test
  afterEach(() => {
    sinon.restore();
  });

  it("should return recurring subscriptions for a valid user", (done) => {
    const testUserId = 1;

    // Stub DB query to return an access token for the user
    sinon.stub(db, "query").resolves([[{ access_token: "fake-access-token" }]]);

    // Stub Plaid transactionsGet to return mock transactions
    const fakeTransactions = [
      { date: "2025-01-01", amount: 15.99, name: "Netflix", logo_url: "netflix.png" },
      { date: "2025-02-01", amount: 15.99, name: "Netflix", logo_url: "netflix.png" },
      { date: "2025-03-01", amount: 15.99, name: "Netflix", logo_url: "netflix.png" },
      { date: "2025-01-10", amount: 9.99, name: "Spotify", logo_url: "spotify.png" },
      { date: "2025-02-10", amount: 9.99, name: "Spotify", logo_url: "spotify.png" },
      { date: "2025-03-10", amount: 9.99, name: "Spotify", logo_url: "spotify.png" },
      { date: "2025-03-15", amount: 50.00, name: "One-time Purchase" } // Not recurring
    ];
    
    sinon.stub(plaidClient, "transactionsGet").resolves({ data: { transactions: fakeTransactions } });

    chai
      .request(app)
      .get("/api/subscriptions")
      .query({ user_id: testUserId })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array").that.has.lengthOf(2);

        const netflixSub = res.body.find(sub => sub.name === "Netflix");
        const spotifySub = res.body.find(sub => sub.name === "Spotify");

        expect(netflixSub).to.exist;
        expect(netflixSub.cost).to.equal("15.99");
        expect(netflixSub.usageFrequency).to.equal("Monthly Recurring");
        expect(netflixSub.iconUrl).to.equal("netflix.png");

        expect(spotifySub).to.exist;
        expect(spotifySub.cost).to.equal("9.99");
        expect(spotifySub.usageFrequency).to.equal("Monthly Recurring");
        expect(spotifySub.iconUrl).to.equal("spotify.png");

        done();
      });
  });

  it("should return an error if user has no linked bank account", (done) => {
    const testUserId = 2;

    // Stub DB query to return no results
    sinon.stub(db, "query").resolves([[]]);

    chai
      .request(app)
      .get("/api/subscriptions")
      .query({ user_id: testUserId })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error", "User has no linked bank account");
        done();
      });
  });

  it("should return an empty array if no recurring transactions are found", (done) => {
    const testUserId = 3;

    // Stub DB query to return an access token
    sinon.stub(db, "query").resolves([[{ access_token: "fake-access-token" }]]);
    
    // Stub Plaid transactionsGet to return only one-time purchases
    sinon.stub(plaidClient, "transactionsGet").resolves({ 
      data: { transactions: [{ date: "2025-03-01", amount: 100, name: "One-time Purchase" }] }
    });

    chai
      .request(app)
      .get("/api/subscriptions")
      .query({ user_id: testUserId })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array").that.is.empty;
        done();
      });
  });

  it("should return a 500 error if Plaid API call fails", (done) => {
    const testUserId = 4;

    // Stub DB query to return an access token
    sinon.stub(db, "query").resolves([[{ access_token: "fake-access-token" }]]);
    
    // Stub Plaid transactionsGet to simulate a failure
    sinon.stub(plaidClient, "transactionsGet").rejects(new Error("Plaid API error"));

    chai
      .request(app)
      .get("/api/subscriptions")
      .query({ user_id: testUserId })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property("error", "Failed to fetch subscriptions");
        done();
      });
  });
});
