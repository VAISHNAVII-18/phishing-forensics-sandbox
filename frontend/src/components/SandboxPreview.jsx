import { AlertTriangle, Monitor } from "lucide-react";

export default function SandboxPreview() {
  return (
    <div className="glass-card p-5 md:p-6">
      <h2 className="section-title">Sandbox Simulation Window</h2>
      <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-slate-950/80">
        <div className="flex items-center justify-between border-b border-slate-700/70 px-3 py-2 text-xs text-slate-400">
          <span className="inline-flex items-center">
            <Monitor className="mr-1.5 h-3.5 w-3.5" /> Browser Sandbox Preview
          </span>
          <span>offline-mode.local/preview</span>
        </div>

        <div className="relative h-44 bg-[radial-gradient(circle_at_center,rgba(255,59,89,0.14),transparent_55%)] p-4">
          <div className="h-full w-full rounded-xl border border-red-400/40 bg-slate-900/50 blur-[1.1px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-xl border border-red-400/70 bg-red-500/20 px-4 py-3 text-center shadow-neonRed">
              <p className="inline-flex items-center text-sm font-semibold text-red-100">
                <AlertTriangle className="mr-2 h-4 w-4" /> ⚠ Unsafe environment – potential phishing site
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
