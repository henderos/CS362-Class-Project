const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");
const db = require("../../src/config/db");

chai.use(chaiHttp);
const { expect } = chai;

describe("User Routes Unique API Tests", () => {
  const testUser = {
    email: "userroute_test@example.com",
    password: "testpassword",
  };

  let userId;

  before(async () => {
    // Ensure no existing user with the test email
    await db.query("DELETE FROM users WHERE email = ?", [testUser.email]);
    // Create a user using the /signup endpoint so that we have one in the system.
    const res = await chai.request(app)
      .post("/api/users/signup")
      .send(testUser);
    userId = res.body.userId;
  });

  after(async () => {
    // Clean up the test user from the database
    await db.query("DELETE FROM users WHERE email = ?", [testUser.email]);
  });

  it("should log out a user", (done) => {
    chai.request(app)
      .post("/api/users/logout")
      .send({}) // No additional data needed for logout
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Logout successful");
        done();
      });
  });

  it("should not register a user with missing fields", (done) => {
    chai.request(app)
      .post("/api/users/signup")
      .send({ email: "incomplete@example.com" }) // Missing password
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error", "All fields are required");
        done();
      });
  });
});
