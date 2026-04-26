import { BrainCog, Globe2, UserRoundCheck, Fingerprint } from "lucide-react";

const iconMap = {
  "Language Analysis": BrainCog,
  "URL Intelligence": Globe2,
  "Sender Trust Score": UserRoundCheck,
  "Behavioral Pattern Detection": Fingerprint,
};

const colorMap = {
  low: "border-emerald-400/35 bg-emerald-500/10 text-emerald-200",
  medium: "border-yellow-400/35 bg-yellow-500/10 text-yellow-200",
  high: "border-red-400/35 bg-red-500/10 text-red-200",
};

export default function AiForensics({ forensics = [] }) {
  return (
    <div className="glass-card p-5 md:p-6">
      <h2 className="section-title">AI Forensics Breakdown</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {forensics.map((item) => {
          const Icon = iconMap[item.title] || BrainCog;
          return (
            <div
              key={item.title}
              className={`rounded-xl border p-3 ${colorMap[item.riskColor] || colorMap.medium}`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="inline-flex items-center text-sm font-semibold">
                  <Icon className="mr-2 h-4 w-4" /> {item.title}
                </span>
                <span className="text-xs uppercase tracking-wider">{item.status}</span>
              </div>
              <p className="text-xs opacity-90">{item.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
