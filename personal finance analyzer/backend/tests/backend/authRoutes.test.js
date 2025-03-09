const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server"); // Adjust path if necessary
const db = require("../../src/config/db");

chai.use(chaiHttp);
const { expect } = chai;

describe("Auth API Tests", () => {
  before(async () => {
    // Clean up test users before running tests
    await db.query("DELETE FROM users WHERE email = ?", ["test@example.com"]);
  });

  after(async () => {
    // Cleanup test users after tests finish
    await db.query("DELETE FROM users WHERE email = ?", ["test@example.com"]);
  });

  let userId;

  it("should register a new user", (done) => {
    chai.request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message", "User registered successfully");
        done();
      });
  });

  it("should not allow duplicate registration", (done) => {
    chai.request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error");
        done();
      });
  });

  it("should log in an existing user", (done) => {
    chai.request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "password123",
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Login successful");
        expect(res.body).to.have.property("userId");
        userId = res.body.userId;
        done();
      });
  });

  it("should not log in with an incorrect password", (done) => {
    chai.request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "wrongpassword",
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message", "Invalid credentials");
        done();
      });
  });

  it("should not log in a non-existent user", (done) => {
    chai.request(app)
      .post("/api/auth/login")
      .send({
        email: "doesnotexist@example.com",
        password: "password123",
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message", "User not found");
        done();
      });
  });
});
