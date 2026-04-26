const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const analyzeRoutes = require("./routes/analyzeRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Phishing Forensics Sandbox API online" });
});

app.use("/api", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
