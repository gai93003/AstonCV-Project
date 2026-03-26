const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sanitizeText = (value = "") => value.trim().replace(/<[^>]*>?/gm, "");

const issueToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ id: userId }, secret, { expiresIn: "1d" });
};

// Register
const register = async (req, res) => {
  const name = sanitizeText(req.body.name || "");
  const email = sanitizeText(req.body.email || "").toLowerCase();
  const password = req.body.password || "";

  try {
    db.query("SELECT id FROM users WHERE email = ?", [email], async (findErr, users) => {
      if (findErr) {
        console.error("Register lookup error:", findErr);
        return res.status(500).json({ message: "Registration failed" });
      }
      if (users.length > 0) return res.status(409).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (insertErr, result) => {
          if (insertErr) {
            console.error("Register insert user error:", insertErr);
            return res.status(500).json({ message: "Registration failed" });
          }

          db.query(
            "INSERT INTO cvs (user_id, keyprogramming, profile, education, urllinks) VALUES (?, '', '', '', '')",
            [result.insertId],
            (cvErr) => {
              if (cvErr) {
                console.error("Register create CV error:", cvErr);
                return res.status(500).json({ message: "Registered, but CV creation failed" });
              }
              res.status(201).json({ message: "User registered" });
            }
          );
        }
      );
    });
  } catch (error) {
    console.error("Register unexpected error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

// Login
const login = (req, res) => {
  const email = sanitizeText(req.body.email || "").toLowerCase();
  const password = req.body.password || "";

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, results) => {
    if (err) {
      console.error("Login query error:", err);
      return res.status(500).json({ message: "Login failed" });
    }
    if (results.length === 0) return res.status(400).json({ message: "User not found" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = issueToken(user.id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
};

module.exports = { register, login };