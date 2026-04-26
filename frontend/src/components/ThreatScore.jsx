import { ShieldAlert } from "lucide-react";

function scoreColor(score) {
  if (score <= 35) return "#2bff88";
  if (score <= 70) return "#ffd166";
  return "#ff3b59";
}

export default function ThreatScore({ score = 0, riskLevel = "Safe" }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const normalized = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (normalized / 100) * circumference;
  const color = scoreColor(normalized);

  return (
    <div className="glass-card p-5 md:p-6 shadow-[0_0_40px_rgba(255,59,89,0.08)]">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-200">
        <span>3</span>
      </div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
        Threat Confidence Score
      </h2>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="relative h-36 w-36">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={radius} stroke="#1f2937" strokeWidth="12" fill="none" />
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke={color}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold" style={{ color }}>
              {normalized}%
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400">Threat Confidence</span>
          </div>
        </div>

        <p className="badge badge-red inline-flex px-4 py-2" style={{ borderColor: `${color}90`, color }}>
          <ShieldAlert className="mr-1 h-3.5 w-3.5" /> {riskLevel}
        </p>
      </div>
    </div>
  );
}
