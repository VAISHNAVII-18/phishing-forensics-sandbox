const PHISHING_TERMS = [
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text) {
  if (!text) return [];
  const sorted = [...PHISHING_TERMS].sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${sorted.map(escapeRegExp).join("|")})`, "gi");
  return text.split(regex);
}

export default function ExplainableAI({ input = "" }) {
  const chunks = highlightText(input);
  const found = PHISHING_TERMS.filter((term) => input.toLowerCase().includes(term));

  return (
    <div className="glass-card p-5 md:p-6">
      <h2 className="section-title">Why is this phishing?</h2>
      <div className="mb-3 flex flex-wrap gap-2">
        {found.length ? (
          found.map((word) => (
            <span
              key={word}
              className="rounded-full border border-red-400/70 bg-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-100 shadow-neonRed"
            >
              {word}
            </span>
          ))
        ) : (
          <span className="badge badge-green">No strong phishing keyword hit</span>
        )}
      </div>

      <p className="rounded-xl border border-slate-700/70 bg-slate-950/55 p-3 text-sm leading-relaxed text-slate-200">
        {chunks.length
          ? chunks.map((chunk, index) => {
              const isMatch = PHISHING_TERMS.some((term) => term.toLowerCase() === chunk.toLowerCase());
              return isMatch ? (
                <span
                  key={`${chunk}-${index}`}
                  className="rounded bg-red-500/25 px-1 text-red-200 shadow-[0_0_12px_rgba(255,59,89,0.55)]"
                >
                  {chunk}
                </span>
              ) : (
                <span key={`${chunk}-${index}`}>{chunk}</span>
              );
            })
          : "No content submitted yet."}
      </p>
    </div>
  );
}
