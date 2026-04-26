const URGENCY_KEYWORDS = [
  "urgent",
  "verify now",
  "click here",
  "account suspended",
  "password",
  "login",
  "bank",
  "limited time",
  "confirm identity",
];

const SUSPICIOUS_TLDS = [".xyz", ".ru", ".tk", ".top", ".click"];
const FAKE_DOMAINS = ["g00gle.com", "paypa1.com", "faceb00k.com", "micros0ft.com"];
const SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "is.gd"];
const SUSPICIOUS_ATTACHMENTS = [".exe", ".scr", ".bat", ".zip"];
const TRUSTED_BRANDS = ["paypal", "google", "facebook", "microsoft", "bank"];

function nowHHMM() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getRiskLevel(score) {
  if (score <= 35) return "Safe";
  if (score <= 70) return "Medium Risk";
  return "High Risk";
}

function extractUrls(input) {
  return input.match(/https?:\/\/[^\s"'<>]+/gi) || [];
}

function extractEmails(input) {
  return input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
}

function getDomain(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function hasIpAddressDomain(url) {
  const domain = getDomain(url);
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
}

function hasExcessiveSubdomains(url) {
  const domain = getDomain(url);
  if (!domain) return false;
  return domain.split(".").length > 4;
}

function isVeryLongUrl(url) {
  return url.length > 75;
}

function hasSuspiciousTld(url) {
  const domain = getDomain(url);
  return SUSPICIOUS_TLDS.some((tld) => domain.endsWith(tld));
}

function isShortenedUrl(url) {
  const domain = getDomain(url);
  return SHORTENERS.some((shortener) => domain === shortener || domain.endsWith(`.${shortener}`));
}

function isFakeDomain(url) {
  const domain = getDomain(url);
  return FAKE_DOMAINS.some((fake) => {
    const fakeRoot = fake.replace(/\.(com|net|org)$/i, "");
    return domain.includes(fake) || domain.includes(fakeRoot);
  });
}

function hasDomainMismatch(text, urls) {
  const lower = text.toLowerCase();
  const domainString = urls.map(getDomain).join(" ");

  return TRUSTED_BRANDS.some((brand) => {
    if (!lower.includes(brand)) return false;
    return !domainString.includes(brand);
  });
}

function senderMismatchSimulation(emails, urls) {
  if (!emails.length || !urls.length) return false;

  const senderDomain = emails[0].split("@")[1]?.toLowerCase() || "";
  return urls.some((url) => {
    const linkDomain = getDomain(url);
    return linkDomain && senderDomain && !linkDomain.includes(senderDomain) && !senderDomain.includes(linkDomain);
  });
}

function spoofedSenderSimulation(text, emails) {
  if (!emails.length) return false;
  const lower = text.toLowerCase();
  return /from\s*:\s*(security|support|admin)/i.test(text) && (lower.includes("verify") || lower.includes("login"));
}

function hasSuspiciousAttachment(text) {
  const lower = text.toLowerCase();
  return SUSPICIOUS_ATTACHMENTS.some((ext) => lower.includes(ext));
}

function runPhishingRules(input) {
  const text = input || "";
  const lower = text.toLowerCase();
  const urls = extractUrls(text);
  const emails = extractEmails(text);

  const detectedReasons = [];
  let score = 0;

  const matchedUrgency = URGENCY_KEYWORDS.filter((kw) => lower.includes(kw));
  if (matchedUrgency.length) {
    detectedReasons.push(`Urgency language detected: ${matchedUrgency.join(", ")}.`);
    score += Math.min(30, matchedUrgency.length * 6 + 8);
  }

  const fakeDomain = urls.some(isFakeDomain);
  if (fakeDomain) {
    detectedReasons.push("Known fake domain pattern detected.");
    score += 24;
  }

  const suspiciousTld = urls.some(hasSuspiciousTld);
  if (suspiciousTld) {
    detectedReasons.push("Suspicious top-level domain identified.");
    score += 14;
  }

  const shortenedUrl = urls.some(isShortenedUrl);
  if (shortenedUrl) {
    detectedReasons.push("URL shortener detected; destination obscured.");
    score += 10;
  }

  const ipUrl = urls.some(hasIpAddressDomain);
  if (ipUrl) {
    detectedReasons.push("IP-based URL detected.");
    score += 14;
  }

  const missingHttps = urls.some((url) => url.startsWith("http://"));
  if (missingHttps) {
    detectedReasons.push("URL uses HTTP without encryption.");
    score += 12;
  }

  const excessiveSubdomains = urls.some(hasExcessiveSubdomains);
  if (excessiveSubdomains) {
    detectedReasons.push("Excessive subdomains used to mimic trusted services.");
    score += 8;
  }

  const longUrl = urls.some(isVeryLongUrl);
  if (longUrl) {
    detectedReasons.push("Very long URL identified, often used for obfuscation.");
    score += 8;
  }

  const domainMismatch = hasDomainMismatch(text, urls);
  if (domainMismatch) {
    detectedReasons.push("Brand mention does not match linked domain.");
    score += 12;
  }

  const senderMismatch = senderMismatchSimulation(emails, urls);
  if (senderMismatch) {
    detectedReasons.push("Sender domain and URL domain mismatch detected.");
    score += 12;
  }

  const spoofedSender = spoofedSenderSimulation(text, emails);
  if (spoofedSender) {
    detectedReasons.push("Potential spoofed sender identity pattern detected.");
    score += 10;
  }

  const suspiciousAttachment = hasSuspiciousAttachment(text);
  if (suspiciousAttachment) {
    detectedReasons.push("Suspicious attachment extension detected.");
    score += 14;
  }

  const suspiciousDomain = urls.some((url) => /[-]{2,}|[0-9]{2,}/.test(getDomain(url)));
  if (suspiciousDomain) {
    detectedReasons.push("Domain contains suspicious character patterns.");
    score += 8;
  }

  if (!detectedReasons.length) {
    detectedReasons.push("No strong phishing indicators found in the provided text.");
    score = 12;
  }

  score = Math.max(0, Math.min(100, score));
  const riskLevel = getRiskLevel(score);

  const emailAnalysis = {
    senderCheck: emails.length ? `Sender identified: ${emails[0]}` : "No sender email found",
    senderStatus: spoofedSender ? "fake" : senderMismatch ? "suspicious" : "trusted",
    returnPathCheck: senderMismatch
      ? "Return-path differs from sender domain"
      : "No return-path mismatch pattern",
    returnPathStatus: senderMismatch ? "suspicious" : "trusted",
    trustStatus: spoofedSender ? "Fake" : riskLevel === "High Risk" ? "Suspicious" : "Trusted",
    trustTag: spoofedSender ? "fake" : riskLevel === "High Risk" ? "suspicious" : "trusted",
  };

  const urlAnalysis = {
    suspiciousDomain,
    domainMismatch,
    fakeDomain,
    shortenedUrl,
    missingHttps,
    ipUrl,
    suspiciousTld,
    longUrl,
    excessiveSubdomains,
  };

  const forensics = [
    {
      title: "Language Analysis",
      status: matchedUrgency.length ? "Flagged" : "Normal",
      explanation: matchedUrgency.length
        ? `Urgency phrasing found: ${matchedUrgency.join(", ")}`
        : "No coercive urgency phrases detected.",
      riskColor: matchedUrgency.length ? "high" : "low",
    },
    {
      title: "URL Intelligence",
      status: urls.length ? (riskLevel === "High Risk" ? "Suspicious" : "Review") : "No URL",
      explanation: urls.length
        ? `Detected ${urls.length} URL(s) with ${[fakeDomain, suspiciousTld, missingHttps, domainMismatch].filter(Boolean).length} high-signal flags.`
        : "No URL artifacts found in text.",
      riskColor: riskLevel === "High Risk" ? "high" : riskLevel === "Medium Risk" ? "medium" : "low",
    },
    {
      title: "Sender Trust Score",
      status: spoofedSender ? "Compromised" : senderMismatch ? "Anomalous" : "Trusted",
      explanation: spoofedSender
        ? "Sender pattern resembles spoofing behavior."
        : senderMismatch
        ? "Sender and linked domains do not align."
        : "No sender spoofing mismatch observed.",
      riskColor: spoofedSender ? "high" : senderMismatch ? "medium" : "low",
    },
    {
      title: "Behavioral Pattern Detection",
      status: riskLevel,
      explanation:
        riskLevel === "High Risk"
          ? "Pattern cluster aligns with credential-harvest phishing campaigns."
          : riskLevel === "Medium Risk"
          ? "Some indicators match social engineering templates."
          : "Behavioral pattern appears low risk.",
      riskColor: riskLevel === "High Risk" ? "high" : riskLevel === "Medium Risk" ? "medium" : "low",
    },
  ];

  const recommendations = [
    "Do not click the link",
    "Report the email",
    "Verify sender manually",
    "Delete the message",
    "Use official website only",
  ];

  const timestamp = nowHHMM();
  const timeline = [
    { event: "Input received", time: timestamp },
    { event: "Analysis started", time: timestamp },
    { event: riskLevel === "Safe" ? "No major threat detected" : "Threat detected", time: timestamp },
    { event: "Recommendation generated", time: timestamp },
  ];

  const summary =
    riskLevel === "Safe"
      ? "Input appears mostly safe, with no strong phishing signatures detected."
      : riskLevel === "Medium Risk"
      ? "Potential phishing indicators found. Review sender and link trust before taking action."
      : "This input is suspicious due to multiple phishing indicators including domain and social engineering anomalies.";

  return {
    riskScore: score,
    riskLevel,
    summary,
    detectedReasons,
    emailAnalysis,
    urlAnalysis,
    forensics,
    recommendations,
    timeline,
    timestamp,
  };
}

module.exports = {
  runPhishingRules,
};
