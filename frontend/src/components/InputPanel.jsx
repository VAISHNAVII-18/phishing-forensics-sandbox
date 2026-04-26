import { AlertTriangle, Eraser, FlaskConical, ShieldAlert } from "lucide-react";

const SAMPLE_ATTACK =
  "URGENT: Your account has been suspended. Verify now by clicking here: http://secure-paypa1-login.xyz/verify";

export default function InputPanel({
  input,
  setInput,
  onAnalyze,
  onLoadSample,
  onClear,
  loading,
  error,
  textAreaRef,
}) {
  return (
    <div className="glass-card p-5 md:p-6 shadow-[0_0_40px_rgba(255,59,89,0.06)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-200">
            <span>1</span>
          </div>
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
            Input Panel
          </h2>
          <p className="text-xs text-slate-400">Paste suspicious email content or URL to analyze</p>
        </div>
        <span className="badge badge-yellow shrink-0">
          <ShieldAlert className="mr-1 h-3.5 w-3.5" /> Rule Engine Active
        </span>
      </div>

      <textarea
        ref={textAreaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste suspicious email or URL here…"
        className="h-44 w-full rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-red-400/60 focus:shadow-neonRed"
      />

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>Safety mode enabled</span>
        <span>{input.length} / 5000</span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl border border-red-400/60 bg-red-500/20 px-4 py-3 text-sm font-semibold text-red-100 transition hover:shadow-neonRed disabled:cursor-not-allowed disabled:opacity-50"
        >
          <AlertTriangle className="mr-2 h-4 w-4" /> Analyze Threat
        </button>

        <button
          onClick={() => {
            onLoadSample(SAMPLE_ATTACK);
          }}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl border border-blue-400/40 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:shadow-neonBlue disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FlaskConical className="mr-2 h-4 w-4" /> Load Sample Attack
        </button>

        <button
          onClick={onClear}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl border border-slate-500/50 bg-slate-500/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Eraser className="mr-2 h-4 w-4" /> Clear Input
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
      <p className="mt-3 text-xs text-slate-400">
        Safety mode enabled: text-only analysis. No link opening, scraping, or redirects.
      </p>
    </div>
  );
}
