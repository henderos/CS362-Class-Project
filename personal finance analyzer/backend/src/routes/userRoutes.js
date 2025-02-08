const express = require("express");
const { registerUser, getAllUsers } = require("../controllers/userController");

const router = express.Router();

// Signup Route
router.post("/signup", registerUser);

// Fetch All Users Route
router.get("/", getAllUsers);

module.exports = router;
