const { validationResult } = require("express-validator");

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.array().map(e => e.msg).join(", ");
    console.error("Validation errors:", message);
    return res.status(400).json({ message });
  }

  next();
};
