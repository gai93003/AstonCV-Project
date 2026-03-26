const db = require("../config/db");

const baseCvSelect = `
  SELECT
    cvs.id,
    users.name,
    users.email,
    cvs.keyprogramming,
    cvs.profile,
    cvs.education,
    cvs.urllinks
  FROM cvs
  INNER JOIN users ON users.id = cvs.user_id
`;

const sanitizeText = (value = "") => value.trim().replace(/<[^>]*>?/gm, "");

// Get all CVs
exports.getAllCVs = (req, res) => {
  db.query(`${baseCvSelect} ORDER BY cvs.id DESC`, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch CVs" });
    res.json(results);
  });
};

// Get one CV details
exports.getCVById = (req, res) => {
  const cvId = Number(req.params.id);
  if (!Number.isInteger(cvId) || cvId <= 0) {
    return res.status(400).json({ message: "Invalid CV id" });
  }

  db.query(`${baseCvSelect} WHERE cvs.id = ?`, [cvId], (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch CV details" });
    if (results.length === 0) return res.status(404).json({ message: "CV not found" });
    res.json(results[0]);
  });
};

// Update CV
exports.updateCV = (req, res) => {
  const userId = req.user.id;
  const keyprogramming = sanitizeText(req.body.keyprogramming || req.body.skills || "");
  const education = sanitizeText(req.body.education || "");
  const profile = sanitizeText(req.body.profile || "");
  const urllinks = sanitizeText(req.body.urllinks || "");

  db.query(
    "UPDATE cvs SET keyprogramming=?, education=?, profile=?, urllinks=? WHERE user_id=?",
    [keyprogramming, education, profile, urllinks, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to update CV" });
      if (result.affectedRows === 0) {
        return db.query(
          "INSERT INTO cvs (user_id, keyprogramming, profile, education, urllinks) VALUES (?, ?, ?, ?, ?)",
          [userId, keyprogramming, profile, education, urllinks],
          (insertErr) => {
            if (insertErr) return res.status(500).json({ message: "Failed to create CV" });
            return res.json({ message: "CV created" });
          }
        );
      }

      res.json({ message: "CV updated" });
    }
  );
};

// Search CVs
exports.searchCVs = (req, res) => {
  const keyword = sanitizeText(req.query.keyword || "");

  if (!keyword) {
    return db.query(`${baseCvSelect} ORDER BY cvs.id DESC`, (err, results) => {
      if (err) return res.status(500).json({ message: "Failed to search CVs" });
      res.json(results);
    });
  }

  db.query(
    `${baseCvSelect} WHERE users.name LIKE ? OR cvs.keyprogramming LIKE ? ORDER BY cvs.id DESC`,
    [`%${keyword}%`, `%${keyword}%`],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Failed to search CVs" });
      res.json(results);
    }
  );
};