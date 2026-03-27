require("dotenv").config();
const express = require("express");
const cors = require("cors");

if (!process.env.JWT_SECRET) {
	console.error("Missing JWT_SECRET in backend/.env");
	process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cv", require("./routes/cvRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));