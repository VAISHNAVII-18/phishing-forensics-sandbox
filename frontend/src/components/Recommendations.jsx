import { ShieldCheck } from "lucide-react";

export default function Recommendations({ recommendations = [] }) {
  return (
    <div className="glass-card p-5 md:p-6">
      <h2 className="section-title">Recommendations</h2>
      <ul className="space-y-2">
        {recommendations.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100"
          >
            <ShieldCheck className="mr-2 mt-0.5 h-4 w-4 shrink-0" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
