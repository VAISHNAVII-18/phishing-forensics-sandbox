import { Clock3 } from "lucide-react";

export default function AttackTimeline({ timeline = [] }) {
  return (
    <div className="glass-card p-5 md:p-6">
      <h2 className="section-title">Attack Timeline</h2>
      <div className="space-y-2">
        {timeline.map((entry, index) => (
          <div key={`${entry.event}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-900/45 p-2.5 text-sm">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/15 text-cyan-200">
              <Clock3 className="h-4 w-4" />
            </span>
            <div>
              <p className="font-medium text-slate-100">{entry.event}</p>
              <p className="text-xs text-slate-400">{entry.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
