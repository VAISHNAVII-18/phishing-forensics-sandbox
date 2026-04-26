import { FileWarning } from "lucide-react";

export default function RiskReport({ riskLevel = "Safe", summary = "", timestamp = "--:--" }) {
  const classes =
    riskLevel === "High Risk"
      ? "border-red-400/40 bg-red-500/10 text-red-100"
      : riskLevel === "Medium Risk"
      ? "border-yellow-400/40 bg-yellow-500/10 text-yellow-100"
      : "border-emerald-400/40 bg-emerald-500/10 text-emerald-100";

  return (
    <div className="glass-card p-5 md:p-6">
      <h2 className="section-title">Risk Report</h2>
      <div className={`rounded-xl border p-3 ${classes}`}>
        <p className="inline-flex items-center text-sm font-semibold">
          <FileWarning className="mr-2 h-4 w-4" /> {riskLevel}
        </p>
        <p className="mt-2 text-sm opacity-95">{summary}</p>
        <p className="mt-2 text-xs opacity-80">Generated at: {timestamp}</p>
      </div>
    </div>
  );
}
