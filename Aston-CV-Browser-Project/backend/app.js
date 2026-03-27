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

const defaultAllowedOrigins = [
	"https://eskg30gftpkxp11t6bom2j9b.hosting.codeyourfuture.io",
];

const isAllowedOrigin = (origin) => {
	if (!origin) {
		return true;
	}

	if (allowedOrigins.includes(origin) || defaultAllowedOrigins.includes(origin)) {
		return true;
	}

	try {
		const { hostname, protocol } = new URL(origin);
		return protocol === "https:" && hostname.endsWith(".hosting.codeyourfuture.io");
	} catch {
		return false;
	}
};

const corsOptions = {
	origin: (origin, callback) => {
		if (isAllowedOrigin(origin)) {
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

app.get("/health", (_req, res) => {
	res.status(200).json({ ok: true, service: "astoncv-backend" });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cv", require("./routes/cvRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));