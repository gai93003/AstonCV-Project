const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../controllers/authController");
const { handleValidationErrors } = require("../middleware/validationMiddleware");

router.post(
	"/register",
	[
		body("name").trim().notEmpty().withMessage("Name is required"),
		body("email").trim().isEmail().withMessage("Valid email is required"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters"),
	],
	handleValidationErrors,
	auth.register
);

router.post(
	"/login",
	[
		body("email").trim().isEmail().withMessage("Valid email is required"),
		body("password").notEmpty().withMessage("Password is required"),
	],
	handleValidationErrors,
	auth.login
);

module.exports = router;