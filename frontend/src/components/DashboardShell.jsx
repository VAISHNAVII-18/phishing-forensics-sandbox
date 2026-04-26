import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  ChevronRight,
  CircleGauge,
  CloudAlert,
  Eye,
  FolderSearch,
  Gauge,
  HelpCircle,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MonitorSmartphone,
  Radar,
  Shield,
  ShieldAlert,
  Sparkles,
  SquareActivity,
  Upload,
  Users,
} from "lucide-react";
import InputPanel from "./InputPanel";
import AnalysisSteps from "./AnalysisSteps";
import ThreatScore from "./ThreatScore";
import EmailAnalysis from "./EmailAnalysis";
import UrlAnalysis from "./UrlAnalysis";
import AiForensics from "./AiForensics";
import ExplainableAI from "./ExplainableAI";
import SandboxPreview from "./SandboxPreview";
import Recommendations from "./Recommendations";
import RiskReport from "./RiskReport";
import AttackTimeline from "./AttackTimeline";
import AuditLog from "./AuditLog";
import { analyzeThreat } from "../services/api";

const STORAGE_KEY = "pfs-history";
const SIMULATION_STEPS = ["Scanning input…", "Detecting patterns…", "Evaluating risk…", "Generating report…"];

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, target: "dashboard", active: true },
  { label: "New Analysis", icon: SquareActivity, target: "new-analysis" },
  { label: "History", icon: FolderSearch, target: "history" },
  { label: "Sandbox", icon: MonitorSmartphone, target: "sandbox" },
  { label: "Reports", icon: CloudAlert, target: "reports" },
  { label: "Settings", icon: Gauge, target: "settings" },
  { label: "Help", icon: HelpCircle, target: "help" },
];

const guideCards = [
  {
    title: "How to Use",
    items: ["Paste suspicious email content or URL", "Click 'Analyze Threat'", "Review AI-powered analysis and risk score", "Follow recommended actions"],
  },
  { title: "Key Features", items: ["Email analysis", "URL checking", "Sandbox simulation", "Risk report", "Attack timeline"] },
  {
    title: "Detection Capabilities",
    items: ["Phishing pattern recognition", "Suspicious keyword detection", "Domain reputation checks", "URL expansion & verification", "Sender authenticity analysis", "Behavioral pattern matching"],
  },
  { title: "Risk Level Guide", items: ["High Risk (70-100%) - Immediate threat", "Medium Risk (40-69%) - Potential threat", "Low Risk (0-39%) - Likely safe"] },
  { title: "Technology", items: ["AI-Powered Analysis Engine", "Real-time Threat Intelligence", "Behavioral Pattern Detection", "Sandbox Environment", "Advanced Heuristics"] },
  { title: "About", items: ["Phishing Forensics Sandbox uses advanced AI and machine learning to detect and analyze phishing threats in real-time."] },
];

const defaultResult = {
  riskScore: 0,
  riskLevel: "Safe",
  summary: "No analysis yet. Submit suspicious content for scanning.",
  detectedReasons: [],
  emailAnalysis: {
    senderCheck: "Awaiting scan",
    senderStatus: "suspicious",
    returnPathCheck: "Awaiting scan",
    returnPathStatus: "suspicious",
    trustStatus: "Unknown",
    trustTag: "suspicious",
  },
  urlAnalysis: {},
  forensics: [
    { title: "Language Analysis", status: "Pending", explanation: "Awaiting scan input.", riskColor: "low" },
    { title: "URL Intelligence", status: "Pending", explanation: "Awaiting scan input.", riskColor: "low" },
    { title: "Sender Trust Score", status: "Pending", explanation: "Awaiting scan input.", riskColor: "low" },
    { title: "Behavioral Pattern Detection", status: "Pending", explanation: "Awaiting scan input.", riskColor: "low" },
  ],
  recommendations: ["Do not click the link", "Report the email", "Verify sender manually", "Delete the message", "Use official website only"],
  timeline: [],
  timestamp: "--:--",
};

function getActionTaken(riskLevel) {
  if (riskLevel === "High Risk") return "Blocked";
  if (riskLevel === "Medium Risk") return "Reported";
  return "Allowed";
}

function getRiskLabel(score) {
  if (score <= 35) return "Safe";
  if (score <= 70) return "Medium Risk";
  return "High Risk";
}

function getRiskTone(score) {
  if (score <= 35) return "green";
  if (score <= 70) return "yellow";
  return "red";
}

export default function DashboardShell() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const [analysis, setAnalysis] = useState(defaultResult);
  const [history, setHistory] = useState([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const textAreaRef = useRef(null);
  const sectionRefs = {
    dashboard: useRef(null),
    newAnalysis: useRef(null),
    threatIntel: useRef(null),
    sandbox: useRef(null),
    reports: useRef(null),
    history: useRef(null),
    settings: useRef(null),
    help: useRef(null),
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const nowLabel = useMemo(
    () =>
      new Date().toLocaleString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  const runSimulation = () =>
    new Promise((resolve) => {
      let index = 0;
      setCurrentStep(-1);
      setProgress(0);

      const interval = setInterval(() => {
        setCurrentStep(index);
        setProgress(Math.min(100, Math.round(((index + 1) / SIMULATION_STEPS.length) * 100)));
        index += 1;

        if (index >= SIMULATION_STEPS.length) {
          clearInterval(interval);
          resolve(true);
        }
      }, 450);
    });

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError("Please paste suspicious email or URL text before analyzing.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await runSimulation();
      const result = await analyzeThreat(input.trim());
      setAnalysis(result);

      const entry = {
        time: result.timestamp,
        riskLevel: result.riskLevel,
        actionTaken: getActionTaken(result.riskLevel),
      };
      const nextHistory = [entry, ...history].slice(0, 20);
      setHistory(nextHistory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
    } catch {
      setError("Backend connection failed. Please make sure Express server is running on port 6000.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setError("");
    setProgress(0);
    setCurrentStep(-1);
  };

  const loadSampleAttack = () => {
    setInput(sampleAttack);
    setError("");
    setMobileNavOpen(false);
    setActiveSection("new-analysis");
    window.setTimeout(() => textAreaRef.current?.focus(), 100);
  };

  const navigateTo = useCallback(
    (target) => {
      setMobileNavOpen(false);
      setActiveSection(target);

      const normalizedTarget =
        target === "new-analysis"
          ? "dashboard"
          : target === "threat-intel"
          ? "threatIntel"
          : target;

      const targetRef = sectionRefs[normalizedTarget];
      if (targetRef?.current) {
        targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (target === "new-analysis") {
        window.setTimeout(() => textAreaRef.current?.focus(), 350);
      }
    },
    [sectionRefs]
  );

  const sampleAttack = "URGENT: Your account has been suspended. Verify now by clicking here: http://secure-paypa1-login.xyz/verify";
  const feedItems = [
    { title: "Malicious URL blocked", time: "12:29:45 PM", color: "red" },
    { title: "Phishing email detected", time: "12:28:11 PM", color: "yellow" },
    { title: "Suspicious domain flagged", time: "12:27:02 PM", color: "green" },
    { title: "New phishing kit detected", time: "12:26:19 PM", color: "yellow" },
  ];

  const riskTone = getRiskTone(analysis.riskScore);
  const titleLabel = getRiskLabel(analysis.riskScore);

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      <div className="cyber-grid" />

      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] gap-4 p-3 md:p-4">
        <aside className="hidden w-[280px] shrink-0 flex-col rounded-[28px] border border-cyan-400/15 bg-[#07111f]/90 p-4 shadow-[0_0_50px_rgba(5,17,31,0.8)] backdrop-blur-xl xl:flex">
          <div className="flex items-start gap-3 border-b border-white/5 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/40 bg-red-500/10 text-red-400 shadow-[0_0_30px_rgba(255,59,89,0.25)]">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-[19px] font-extrabold uppercase tracking-[0.12em] text-red-400">Phishing Forensics Sandbox</h1>
              <p className="text-xs text-slate-400">AI-Powered Threat Analysis & Detection</p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => navigateTo(item.target)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    activeSection === item.target
                      ? "border-red-400/35 bg-red-500/10 text-red-100 shadow-[0_0_18px_rgba(255,59,89,0.16)]"
                      : "border-white/5 bg-white/[0.02] text-slate-300 hover:border-cyan-400/30 hover:bg-cyan-500/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-2 text-red-300">
                <ShieldAlert className="h-4 w-4" /> Threat Feed
              </span>
              <span>LIVE</span>
            </div>
            <div className="space-y-3">
              {feedItems.map((item) => (
                <div key={item.title} className="flex items-start gap-3 text-xs">
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      item.color === "red"
                        ? "bg-red-400 shadow-[0_0_10px_rgba(255,59,89,0.8)]"
                        : item.color === "yellow"
                        ? "bg-yellow-400 shadow-[0_0_10px_rgba(255,209,102,0.8)]"
                        : "bg-emerald-400 shadow-[0_0_10px_rgba(43,255,136,0.8)]"
                    }`}
                  />
                  <div>
                    <p className="text-slate-200">{item.title}</p>
                    <p className="text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-100">
              View All Feed <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 flex flex-col">
          <header className="rounded-[28px] border border-cyan-400/15 bg-[#07111f]/90 px-4 py-4 shadow-[0_0_50px_rgba(5,17,31,0.8)] backdrop-blur-xl md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button onClick={() => setMobileNavOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-slate-200 xl:hidden">
                <Menu className="h-4 w-4" /> Menu
              </button>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-400/40 bg-red-500/10 text-red-400 xl:hidden">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-extrabold uppercase tracking-[0.12em] text-red-400 md:text-2xl">Phishing Forensics Sandbox</h1>
                  <p className="text-xs text-slate-400">AI-Powered Threat Analysis & Detection</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigateTo("history")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-200 transition hover:border-cyan-400/30"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(43,255,136,0.8)]" />
                  System Online
                </button>
                <div className="hidden rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-slate-300 md:block">{nowLabel}</div>
                <button
                  onClick={() => navigateTo("history")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-100"
                  title="Open history"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <button
                  onClick={loadSampleAttack}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-100"
                  title="Load sample attack"
                >
                  <Sparkles className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigateTo("settings")}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-100"
                  title="Open settings"
                >
                  PF
                </button>
              </div>
            </div>
          </header>

          {mobileNavOpen ? (
            <div className="grid gap-2 rounded-[28px] border border-cyan-400/15 bg-[#07111f]/95 p-4 xl:hidden">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigateTo(item.target)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm text-left ${activeSection === item.target ? "border-red-400/35 bg-red-500/10 text-red-100" : "border-white/5 bg-white/[0.02] text-slate-300"}`}
                  >
                    <Icon className="h-4 w-4" /> {item.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Tab Bar */}
          <div className="flex gap-2 overflow-x-auto rounded-[24px] border border-cyan-400/12 bg-[#07111f]/60 p-2 backdrop-blur-sm">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.target;
              return (
                <button
                  key={item.target}
                  onClick={() => navigateTo(item.target)}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2 text-sm transition whitespace-nowrap ${
                    isActive
                      ? "border-red-400/40 bg-red-500/15 text-red-200 shadow-[0_0_20px_rgba(255,59,89,0.3)]"
                      : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-cyan-400/20 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content - Fills remaining space */}
          <div className="flex-1 overflow-auto rounded-[28px] border border-cyan-400/15 bg-[#07111f]/90 p-4 shadow-[0_0_35px_rgba(5,17,31,0.55)] md:p-6">
            {/* Dashboard Tab */}
            {activeSection === "dashboard" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-cyan-300">Dashboard</h2>
                
                {/* Top Row - Input and Threat Feed */}
                <div className="grid gap-4 xl:grid-cols-[1.35fr_1.6fr]">
                  <InputPanel textAreaRef={textAreaRef} input={input} setInput={setInput} onAnalyze={handleAnalyze} onLoadSample={setInput} onClear={handleClear} loading={loading} error={error} />
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-300">Live Threat Feed</h3>
                    <div className="space-y-2">
                      {feedItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 transition hover:border-cyan-400/20">
                          <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${item.color === "red" ? "bg-red-400 shadow-[0_0_12px_rgba(255,59,89,0.8)]" : item.color === "yellow" ? "bg-yellow-400 shadow-[0_0_12px_rgba(255,209,102,0.8)]" : "bg-emerald-400 shadow-[0_0_12px_rgba(43,255,136,0.8)]"}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-slate-200 truncate">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-100">
                      View All Feed <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Second Row - Score and Forensics */}
                <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                  <ThreatScore score={analysis.riskScore} riskLevel={analysis.riskLevel} />
                  <AiForensics forensics={analysis.forensics} />
                </div>

                {/* Third Row - Report and Recommendations */}
                <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
                  <RiskReport riskLevel={analysis.riskLevel} summary={analysis.summary} timestamp={analysis.timestamp} />
                  <Recommendations recommendations={analysis.recommendations} />
                </div>

                {/* Fourth Row - Email and URL Analysis */}
                <div className="grid gap-4 xl:grid-cols-2">
                  <EmailAnalysis data={analysis.emailAnalysis} />
                  <UrlAnalysis data={analysis.urlAnalysis} />
                </div>

                {/* Quick Stats Row */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border border-cyan-400/12 bg-[#07111f]/60 p-4">
                    <div className="mb-2 text-xs text-slate-400">Total Scans</div>
                    <div className="text-2xl font-bold text-cyan-300">{history.length}</div>
                  </div>
                  <div className="rounded-2xl border border-cyan-400/12 bg-[#07111f]/60 p-4">
                    <div className="mb-2 text-xs text-slate-400">High Risk</div>
                    <div className="text-2xl font-bold text-red-400">{history.filter(h => h.riskLevel === "High Risk").length}</div>
                  </div>
                  <div className="rounded-2xl border border-cyan-400/12 bg-[#07111f]/60 p-4">
                    <div className="mb-2 text-xs text-slate-400">System Status</div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-sm font-semibold text-emerald-300">Secure</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-cyan-400/12 bg-[#07111f]/60 p-4">
                    <div className="mb-2 text-xs text-slate-400">Current Status</div>
                    <div className="text-sm font-semibold text-slate-200">{loading ? "Analyzing..." : "Ready"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* New Analysis Tab */}
            {activeSection === "new-analysis" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-cyan-300">New Analysis</h2>
                <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                  <ThreatScore score={analysis.riskScore} riskLevel={analysis.riskLevel} />
                  <AiForensics forensics={analysis.forensics} />
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeSection === "history" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-cyan-300">Analysis History</h2>
                <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
                  <AttackTimeline timeline={analysis.timeline} />
                  <AuditLog history={history} />
                </div>
              </div>
            )}

            {/* Sandbox Tab */}
            {activeSection === "sandbox" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-cyan-300">Sandbox</h2>
                <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
                  <SandboxPreview />
                  <div className="grid gap-4">
                    <EmailAnalysis data={analysis.emailAnalysis} />
                    <UrlAnalysis data={analysis.urlAnalysis} />
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeSection === "reports" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-cyan-300">Risk Report</h2>
                <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
                  <ExplainableAI input={input || sampleAttack} />
                  <div className="space-y-4">
                    <RiskReport riskLevel={analysis.riskLevel} summary={analysis.summary} timestamp={analysis.timestamp} />
                    <Recommendations recommendations={analysis.recommendations} />
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeSection === "settings" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-cyan-300">Settings & Status</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-2xl border border-white/5 bg-black/15 p-4 text-sm text-slate-300">
                    <div className="mb-3 flex items-center gap-2 text-cyan-300"><Users className="h-4 w-4" /> Threat Feed</div>
                    <div className="space-y-2 text-xs">
                      {feedItems.map((item) => (
                        <div key={item.title} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
                          <span className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${item.color === "red" ? "bg-red-400" : item.color === "yellow" ? "bg-yellow-400" : "bg-emerald-400"}`} />
                            {item.title}
                          </span>
                          <span className="text-slate-500">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-black/15 p-4 text-sm text-slate-300">
                    <div className="mb-3 flex items-center gap-2 text-cyan-300"><Upload className="h-4 w-4" /> Action Center</div>
                    <p className="text-xs leading-relaxed text-slate-400">{analysis.summary}</p>
                    <div className="mt-3 inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs text-red-200">{titleLabel}</div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-black/15 p-4 text-sm text-slate-300">
                    <div className="mb-3 flex items-center gap-2 text-cyan-300"><LockKeyhole className="h-4 w-4" /> Security Notes</div>
                    <p className="text-xs leading-relaxed text-slate-400">This sandbox never opens real links, redirects traffic, or calls external APIs.</p>
                    <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs text-emerald-200">Local storage enabled for scan history.</div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-black/15 p-4 text-sm text-slate-300">
                    <div className="mb-3 flex items-center gap-2 text-cyan-300"><Eye className="h-4 w-4" /> Risk Signal</div>
                    <div className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold text-slate-200" style={{ borderColor: riskTone === "red" ? "rgba(255,59,89,.35)" : riskTone === "yellow" ? "rgba(255,209,102,.35)" : "rgba(43,255,136,.35)", background: riskTone === "red" ? "rgba(255,59,89,.1)" : riskTone === "yellow" ? "rgba(255,209,102,.1)" : "rgba(43,255,136,.1)" }}>{analysis.riskLevel}</div>
                    <div className="mt-3 text-xs text-slate-400">Current score: {analysis.riskScore}%</div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-black/15 p-4 text-sm text-slate-300">
                    <div className="mb-3 flex items-center gap-2 text-cyan-300"><CircleGauge className="h-4 w-4" /> Analysis Status</div>
                    <p className="text-xs text-slate-400">{loading ? "Analysis running…" : "Ready for next scan"}</p>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-black/15 p-4 text-sm text-slate-300">
                    <div className="mb-3 flex items-center gap-2 text-cyan-300"><ShieldAlert className="h-4 w-4" /> System Status</div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Secure</div>
                  </div>
                </div>
              </div>
            )}

            {/* Help Tab */}
            {activeSection === "help" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-cyan-300">Help & Documentation</h2>
                <div className="grid gap-4 xl:grid-cols-3">
                  {guideCards.map((card) => (
                    <div key={card.title} className="rounded-[24px] border border-cyan-400/12 bg-[#07111f]/90 p-4 shadow-[0_0_35px_rgba(5,17,31,0.55)]">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">{card.title}</h3>
                      <div className="space-y-2 text-sm text-slate-300">
                        {card.items.map((item) => (
                          <div key={item} className="flex gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                            <p className="leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
