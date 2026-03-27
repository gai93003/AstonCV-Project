require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");

if (!process.env.JWT_SECRET) {
	console.error("Missing JWT_SECRET environment variable. Set it in your host environment settings.");
	process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGINS || "")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
			callback(null, true);
			return;
		}

		callback(new Error("Not allowed by CORS"));
	},
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cv", require("./routes/cvRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));