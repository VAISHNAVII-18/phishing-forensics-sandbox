const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const analyzeRoutes = require("./routes/analyzeRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy: origin not allowed"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Phishing Forensics Sandbox API online" });
});

app.use("/api", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
