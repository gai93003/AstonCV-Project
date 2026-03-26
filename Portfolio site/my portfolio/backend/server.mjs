import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.resolve("./messages.json");

// Auto-create file if it doesn’t exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// ===== Contact Form Route =====
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const timestamp = new Date().toISOString();
  const newMessage = { timestamp, name, email, message };

  try {
    // Read existing messages
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    // Add new message
    data.push(newMessage);
    // Save back to JSON
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    res.status(200).json({ success: true, message: "Message saved!" });
  } catch (err) {
    console.error("Failed to save message:", err);
    res.status(500).json({ success: false, error: "Failed to save message." });
  }
});

// ===== Start Server =====
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
