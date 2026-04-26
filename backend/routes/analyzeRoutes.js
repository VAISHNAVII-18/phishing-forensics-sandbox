const express = require("express");
const { analyzeThreatInput } = require("../controllers/analyzeController");

const router = express.Router();

router.post("/analyze", analyzeThreatInput);

module.exports = router;
