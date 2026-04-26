import { History } from "lucide-react";

export default function AuditLog({ history = [] }) {
  return (
    <div className="glass-card p-5 md:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-200">
            <span>8</span>
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
            Analysis History
          </h2>
        </div>
        <span className="text-xs text-slate-400">View All</span>
      </div>
      <div className="space-y-2">
        {history.length ? (
          history.map((item, index) => (
            <div key={`${item.time}-${index}`} className="rounded-xl border border-slate-700/60 bg-slate-900/40 px-3 py-2 text-sm text-slate-200">
              <span className="inline-flex items-center">
                <History className="mr-2 h-4 w-4 text-cyan-300" />
                [{item.time}] → {item.riskLevel} → {item.actionTaken}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No scans yet.</p>
        )}
      </div>
    </div>
  );
}
