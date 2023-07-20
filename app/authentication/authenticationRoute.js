const express = require("express");
const { login, register,logout} = require("./authenticationController");
const router = express.Router();

router.post("/login",login);
router.post("/register",register);
router.post("/logout/:id",logout);

module.exports = router