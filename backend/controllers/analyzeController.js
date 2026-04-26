const { runPhishingRules } = require("../utils/phishingRules");

function analyzeThreatInput(req, res) {
  const { input } = req.body || {};

  if (!input || typeof input !== "string" || !input.trim()) {
    return res.status(400).json({
      message: "Input text is required for analysis.",
    });
  }

  const result = runPhishingRules(input.trim());
  return res.status(200).json(result);
}

module.exports = {
  analyzeThreatInput,
};
