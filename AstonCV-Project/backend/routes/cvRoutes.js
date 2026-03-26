const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const cv = require("../controllers/cvController");
const auth = require("../middleware/authMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");

router.get("/", cv.getAllCVs);
router.get("/search", cv.searchCVs);
router.get("/:id", cv.getCVById);
router.post(
	"/update",
	auth.verifyToken,
	[
		body("skills").optional().isLength({ max: 255 }),
		body("keyprogramming").optional().isLength({ max: 255 }),
		body("education").optional().isLength({ max: 500 }),
		body("profile").optional().isLength({ max: 500 }),
		body("urllinks").optional().isLength({ max: 500 }),
	],
	handleValidationErrors,
	cv.updateCV
);

module.exports = router;