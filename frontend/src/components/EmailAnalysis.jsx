import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const statusStyles = {
  trusted: {
    label: "Trusted",
    icon: CheckCircle2,
    classes: "text-emerald-300",
  },
  suspicious: {
    label: "Suspicious",
    icon: AlertTriangle,
    classes: "text-yellow-300",
  },
  fake: {
    label: "Fake",
    icon: XCircle,
    classes: "text-red-300",
  },
};

function Row({ label, value, status }) {
  const style = statusStyles[status] || statusStyles.suspicious;
  const Icon = style.icon;

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-sm">
      <span className="text-slate-300">{label}</span>
      <span className={`inline-flex items-center font-semibold ${style.classes}`}>
        <Icon className="mr-1.5 h-4 w-4" /> {value || style.label}
      </span>
    </div>
  );
}

export default function EmailAnalysis({ data }) {
  return (
    <div className="glass-card p-5 md:p-6">
      <h2 className="section-title">Email Analysis Module</h2>
      <div className="space-y-2.5">
        <Row label="Sender email check" value={data?.senderCheck} status={data?.senderStatus} />
        <Row label="Sender vs return-path" value={data?.returnPathCheck} status={data?.returnPathStatus} />
        <Row label="Sender authenticity" value={data?.trustStatus} status={data?.trustTag} />
      </div>
    </div>
  );
}
