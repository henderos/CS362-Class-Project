const express = require("express");
const { registerUser, loginUser, getAllUsers } = require("../controllers/userController");

const router = express.Router();

// Signup Route
router.post("/signup", registerUser);

// Login Route
router.post("/login", loginUser);

// Fetch All Users Route
router.get("/", getAllUsers);

module.exports = router;
