import { Link2, ShieldX } from "lucide-react";

const labels = {
  suspiciousDomain: "Suspicious domains",
  domainMismatch: "Domain mismatch",
  fakeDomain: "Fake domains",
  shortenedUrl: "Shortened URL expansion simulation",
  missingHttps: "Missing HTTPS",
  ipUrl: "IP-based URLs",
  suspiciousTld: "Suspicious TLDs",
  longUrl: "Long URL",
  excessiveSubdomains: "Excessive subdomains",
};

export default function UrlAnalysis({ data }) {
  const entries = Object.entries(labels).map(([key, label]) => ({
    key,
    label,
    value: Boolean(data?.[key]),
  }));

  return (
    <div className="glass-card p-5 md:p-6">
      <h2 className="section-title">URL Checking Module</h2>
      <div className="grid gap-2">
        {entries.map((item) => (
          <div
            key={item.key}
            className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
              item.value
                ? "border-red-400/35 bg-red-500/10 text-red-100"
                : "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
            }`}
          >
            <span>{item.label}</span>
            <span className="inline-flex items-center font-semibold">
              {item.value ? (
                <>
                  <ShieldX className="mr-1 h-4 w-4" /> Flagged
                </>
              ) : (
                <>
                  <Link2 className="mr-1 h-4 w-4" /> Clear
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
