import { motion } from "framer-motion";
import { Cpu, Radar, ShieldCheck, FileSearch } from "lucide-react";

const iconMap = [Cpu, Radar, ShieldCheck, FileSearch];

export default function AnalysisSteps({ steps, currentStep, progress, loading }) {
  if (!loading) return null;

  return (
    <div className="glass-card p-5 md:p-6 shadow-[0_0_40px_rgba(70,167,255,0.07)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-200">
            <span>2</span>
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">Live Analysis Simulation</h2>
          <p className="mt-1 text-xs text-slate-400">Scanning input, detecting patterns, and generating the report</p>
        </div>
        <span className="badge badge-green">{progress}%</span>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = iconMap[index] || Cpu;
          const active = index <= currentStep;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0.35, x: -10 }}
              animate={{ opacity: active ? 1 : 0.35, x: 0 }}
              className={`rounded-xl border p-3 text-sm ${
                active
                  ? "border-red-400/40 bg-red-500/10 text-red-100 shadow-[0_0_20px_rgba(255,59,89,0.12)]"
                  : "border-slate-700/80 bg-slate-900/40 text-slate-400"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/25 text-xs font-semibold">
                  {index + 1}
                </span>
                <Icon className="h-4 w-4" />
              </div>
              <p className="font-medium">{step}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-400">Progress: {progress}%</p>
    </div>
  );
}
