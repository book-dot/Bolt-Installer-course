import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Download, FileCheck2, GraduationCap, Home, Lock, ShieldCheck, Sparkles, Star, Trophy } from "lucide-react";

/**
 * Bolt Installer Course – Drop-in React component (ASCII-only, safe for TSX)
 * - Tailwind utility classes for styling
 * - localStorage persistence
 * - Modules, lessons, quizzes, printable certificate
 * - No smart quotes or non-ASCII punctuation
 */

type Lesson = {
  id: string;
  title: string;
  durationMin: number;
  content: string; // plain text or simple HTML (handled)
};

type Question = {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
};

type Module = {
  id: string;
  title: string;
  blurb: string;
  estMinutes: number;
  lessons: Lesson[];
  quiz: Question[];
};

type CourseData = {
  version: string;
  courseTitle: string;
  modules: Module[];
};

type Progress = {
  completedLessons: Record<string, boolean>;
  quizScores: Record<string, { correct: number; total: number }>;
  certificateIssued: boolean;
  fullName?: string;
  company?: string;
  dateIssued?: string;
};

const COURSE_DATA: CourseData = {
  version: "1.0.1",
  courseTitle: "Bolt Accredited Installer Course",
  modules: [
    {
      id: "m1",
      title: "Electrical & Safety Fundamentals",
      blurb:
        "Core electrical principles, safe isolation, and UK compliance for electric boiler installs.",
      estMinutes: 45,
      lessons: [
        {
          id: "m1l1",
          title: "Safe Isolation - Step by Step",
          durationMin: 8,
          content: `Safe isolation prevents electric shock and equipment damage. Before touching any conductors:

1) Prove your tester on a known live source.
2) Identify the correct circuit at the consumer unit.
3) Isolate using the appropriate device (MCB/isolator).
4) Lock off and tag the device with your details.
5) Verify dead at the point of work on all conductors.
6) Re-prove your tester after the test.

Record each step on your job sheet and ensure no other trades can re-energise the circuit.`,
        },
        {
          id: "m1l2",
          title: "Supply Characteristics & Protective Devices",
          durationMin: 10,
          content: `Bolt requires a suitably rated supply with correct earthing and protection. Key checks:

- Earthing system: confirm TN-C-S/TN-S/TT and that main bonding is in place.
- Protective device: select MCB/RCBO to the manufacturer's spec and cable size.
- RCD: address nuisance trips with the correct type and circuit segregation.
- Discrimination: upstream device must not trip before the final circuit device.

Document Zs/Ze, R1+R2 and polarity before commissioning.`,
        },
        {
          id: "m1l3",
          title: "Regs & Standards Snapshot",
          durationMin: 12,
          content: `When instructions conflict, follow: law and building regs -> standards -> manufacturer instructions.

For electric boilers you will reference BS 7671 (notably Parts 4, 5, 6), Building Regulations Part P, and any notification requirements. Capture photos of isolation, protective device, terminations, and labelling.`,
        },
      ],
      quiz: [
        {
          id: "m1q1",
          prompt: "Which option BEST describes the correct order for safe isolation?",
          options: [
            "Isolate, test on circuit, lock-off, prove your tester",
            "Prove your tester, isolate, lock-off and tag, re-test on the circuit",
            "Lock-off, isolate, prove tester, re-test",
            "Isolate, remove bonding, test",
          ],
          answerIndex: 1,
          explanation:
            "Always prove your tester first, then isolate, lock-off and tag, then re-test to confirm dead.",
        },
      ],
    },
    {
      id: "m2",
      title: "Plumbing Installation",
      blurb:
        "Hydraulic design, pipe sizing, system prep, flushing/inhibitors, and expansion control.",
      estMinutes: 50,
      lessons: [
        {
          id: "m2l1",
          title: "System Types & Sizing",
          durationMin: 12,
          content: `Correct sizing ensures comfort and efficiency.

- System type: open vent, sealed, or system with external components.
- Emitters: radiators/UFH sized for chosen flow temperature (for example, 55-60 C).
- Delta-T: aim for a stable temperature drop across emitters to avoid short cycling.

Survey pipework, valves, and existing controls to plan the install.`,
        },
        {
          id: "m2l2",
          title: "Water Quality & Protection",
          durationMin: 10,
          content: `Treat water like a component.

Procedure: pre-clean -> flush -> dose inhibitor -> add magnetic filtration.
Why: sludge and scale reduce heat transfer and can damage pumps and heat exchangers.
Tip: record TDS/clarity; label the system with chemical used and date.`,
        },
        {
          id: "m2l3",
          title: "Expansion & Safety",
          durationMin: 10,
          content: `Size vessels for system volume and temperature. Check PRV rating and discharge termination. Pre-charge vessels to cold fill pressure and verify annually.`,
        },
      ],
      quiz: [
        {
          id: "m2q1",
          prompt: "Why is system flushing before commissioning essential?",
          options: [
            "It increases pump speed",
            "It prevents sludge/scale damage and ensures performance",
            "It reduces electrical load",
            "It is optional if water looks clear",
          ],
          answerIndex: 1,
          explanation:
            "Clean systems reduce faults, protect the boiler, and maintain efficiency.",
        },
      ],
    },
    {
      id: "m3",
      title: "Battery & Solar Integration",
      blurb:
        "Best practice for integrating Bolt with PV, batteries, and smart controls for low-carbon heating.",
      estMinutes: 55,
      lessons: [
        {
          id: "m3l1",
          title: "PV & Battery Basics",
          durationMin: 10,
          content: `Goal: use surplus PV and off-peak tariffs to reduce running cost.

Know the inverter type (AC or DC coupling), export limit, and where to connect priority loads. Maintain correct protective devices and isolation boundaries between systems.`,
        },
        {
          id: "m3l2",
          title: "Control Strategies",
          durationMin: 12,
          content: `Combine smart thermostats with tariff schedules.

Common pattern: pre-heat/charge on cheap rate, trim on surplus PV, and avoid peak periods. Brief the homeowner on schedules and overrides.`,
        },
        {
          id: "m3l3",
          title: "Commissioning & Documentation",
          durationMin: 8,
          content: `Commission like MCS:

- Electrical tests recorded (IR, polarity, CPC).
- Hydraulic checks (pressure, venting).
- Parameter photos and serials.
- Homeowner pack including warranty registration and maintenance advice.`,
        },
      ],
      quiz: [
        {
          id: "m3q1",
          prompt: "What is a typical goal of PV/battery integration for Bolt?",
          options: [
            "Increase grid import during peak",
            "Prioritise surplus PV to heating loads to cut running cost",
            "Disable export limiting",
            "Bypass protective devices",
          ],
          answerIndex: 1,
          explanation:
            "Using surplus PV and off-peak energy reduces cost while staying compliant.",
        },
      ],
    },
    {
      id: "m4",
      title: "Bolt Installation & Commissioning (Hands-On)",
      blurb:
        "Site prep, mounting, connections, first power-up, diagnostics, and homeowner handover.",
      estMinutes: 60,
      lessons: [
        {
          id: "m4l1",
          title: "Pre-Install Checklist",
          durationMin: 8,
          content: `Confirm wall construction and fixings, clearances, discharge route, supply capacity, and isolation point. Complete a risk assessment and brief the customer on downtime.`,
        },
        {
          id: "m4l2",
          title: "Mount & Connect",
          durationMin: 12,
          content: `Use the template and level; tighten bracket fixings to spec. Terminate L/N/CPC with correct ferrules/glands and strain relief. Verify torque and CPC continuity meets spec before energising.`,
        },
        {
          id: "m4l3",
          title: "Commission & Handover",
          durationMin: 12,
          content: `Fill, vent, and leak-check. Perform dead tests, then live tests as required. First heat at moderate temperature while checking parameters and any fault codes. Walk the homeowner through controls, maintenance, and warranty registration.`,
        },
      ],
      quiz: [
        {
          id: "m4q1",
          prompt: "Before first power-up, which is MOST critical?",
          options: [
            "Skipping electrical tests to save time",
            "Confirming correct terminations, torque, and CPC continuity",
            "Running at max temperature immediately",
            "Leaving bracket bolts loose for adjustment",
          ],
          answerIndex: 1,
          explanation:
            "Safety and compliance first: verify wiring, torque, and CPC/earth continuity.",
        },
      ],
    },
  ],
};

const STORAGE_KEY = "boltInstallerCourse:v1";

function useLocalProgress(): [Progress, (u: Partial<Progress>) => void, () => void] {
  const [state, setState] = useState<Progress>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { completedLessons: {}, quizScores: {}, certificateIssued: false };
    } catch {
      return { completedLessons: {}, quizScores: {}, certificateIssued: false };
    }
  });

  const update = (u: Partial<Progress>) =>
    setState((prev) => {
      const next = { ...prev, ...u };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

  const reset = () => {
    const base = { completedLessons: {}, quizScores: {}, certificateIssued: false };
    setState(base);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
  };

  return [state, update, reset];
}

function pct(num: number, den: number) {
  if (!den) return 0;
  return Math.round((num / den) * 100);
}

function useProgressMetrics(data: CourseData, progress: Progress) {
  return useMemo(() => {
    const totalLessons = data.modules.reduce((a, m) => a + m.lessons.length, 0);
    const doneLessons = Object.values(progress.completedLessons).filter(Boolean).length;
    const totalQuizzes = data.modules.length;
    const passedQuizzes = Object.values(progress.quizScores).filter(
      (s) => s && s.correct / s.total >= 0.7
    ).length;
    const overallPct = Math.min(
      100,
      Math.round(((doneLessons + passedQuizzes) / (totalLessons + totalQuizzes)) * 100)
    );
    return { totalLessons, doneLessons, totalQuizzes, passedQuizzes, overallPct };
  }, [data, progress]);
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">{children}</span>;
}
function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium">{children}</span>;
}
function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline"; full?: boolean }
) {
  const { variant = "primary", full, className = "", ...rest } = props;
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants: Record<string, string> = {
    primary: "bg-black text-white hover:opacity-90 focus:ring-black",
    ghost: "bg-transparent text-black hover:bg-gray-100 focus:ring-gray-300",
    outline: "border border-gray-300 text-black hover:bg-gray-50 focus:ring-gray-300",
  };
  return <button className={`${base} ${variants[variant]} ${full ? "w-full" : ""} ${className}`} {...rest} />;
}
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}
function ProgressBar({ value, brandColor }: { value: number; brandColor: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-200" aria-label="Course progress">
      <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: brandColor }} />
    </div>
  );
}

// Lesson renderer
function LessonContent({ content }: { content: string }) {
  const isHTML = /<\\w+/.test(content);
  if (isHTML) {
    return (
      <div
        className="text-[15px] leading-7 text-gray-800 space-y-3"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  const paras = content.split(/\\n\\n+/);
  return (
    <div className="text-[15px] leading-7 text-gray-800 space-y-3">
      {paras.map((p, i) => <p key={i}>{p}</p>)}
    </div>
  );
}

function ModuleCard({
  mod,
  completedCount,
  totalLessons,
  quizPassed,
  onOpen,
}: {
  mod: Module;
  completedCount: number;
  totalLessons: number;
  quizPassed: boolean;
  onOpen: () => void;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{mod.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{mod.blurb}</p>
        </div>
        <div className="flex items-center gap-2">
          <Pill>{mod.estMinutes} min</Pill>
          {quizPassed ? <Badge><Check className="mr-1 h-3 w-3" />Quiz passed</Badge> : <Badge>Quiz pending</Badge>}
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">{completedCount}/{totalLessons} lessons completed</div>
        <Button variant="outline" onClick={onOpen} aria-label={`Open ${mod.title}`}>
          Open module <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

function Quiz({
  quiz,
  moduleId,
  onSubmit,
}: {
  quiz: Question[];
  moduleId: string;
  onSubmit: (score: { correct: number; total: number }) => void;
}) {
  const [answers, setAnswers] = useState<number[]>(Array(quiz.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);

  const handleChange = (qi: number, opt: number) => {
    if (submitted) return;
    setAnswers((a) => {
      const copy = [...a];
      copy[qi] = opt;
      return copy;
    });
  };

  const handleSubmit = () => {
    const correct = quiz.reduce((acc, q, i) => (answers[i] === q.answerIndex ? acc + 1 : acc), 0);
    const res = { correct, total: quiz.length };
    setScore(res);
    setSubmitted(true);
    onSubmit(res);
  };

  const pass = score ? score.correct / score.total >= 0.7 : false;

  return (
    <div className="mt-6">
      {quiz.map((q, i) => (
        <Card key={q.id} className="mb-4">
          <div className="mb-3 flex items-start gap-2">
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold">{i + 1}</span>
            <p className="text-sm font-medium">{q.prompt}</p>
          </div>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const isSelected = answers[i] === oi;
              const isCorrect = submitted && oi === q.answerIndex;
              const isWrong = submitted && isSelected && oi !== q.answerIndex;
              return (
                <label
                  key={oi}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
                    isSelected ? "border-gray-900" : "border-gray-200"
                  } ${submitted ? (isCorrect ? "bg-green-50" : isWrong ? "bg-red-50" : "") : "hover:bg-gray-50"}`}
                >
                  <input
                    type="radio"
                    name={`q_${moduleId}_${i}`}
                    className="mt-1"
                    checked={isSelected}
                    onChange={() => handleChange(i, oi)}
                    aria-label={`Answer ${oi + 1}`}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
          {submitted && q.explanation && (
            <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-700">
              <strong>Why:</strong> {q.explanation}
            </div>
          )}
        </Card>
      ))}

      {!submitted ? (
        <Button onClick={handleSubmit} className="mt-2" aria-label="Submit quiz">
          Submit quiz <ShieldCheck className="h-4 w-4" />
        </Button>
      ) : (
        <div className="mt-2 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>
              Score: <strong>{score?.correct}</strong> / {score?.total} ({pct(score?.correct || 0, score?.total || 0)}%)
            </span>
          </div>
          <span className={`font-semibold ${pass ? "text-green-700" : "text-red-700"}`}>{pass ? "Pass" : "Retake available"}</span>
        </div>
      )}
    </div>
  );
}

function Certificate({
  visible,
  onClose,
  fullName,
  company,
  date,
  logoUrl,
  brandColor,
}: {
  visible: boolean;
  onClose: () => void;
  fullName: string;
  company?: string;
  date: string;
  logoUrl?: string;
  brandColor: string;
}) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logoUrl ? <img src={logoUrl} alt="Bolt logo" className="h-10" /> : <Sparkles className="h-8 w-8" />}
            <h3 className="text-xl font-bold">Bolt Accredited Installer</h3>
          </div>
          <Badge>Certificate</Badge>
        </div>
        <div className="rounded-2xl border-2 p-8 text-center" style={{ borderColor: brandColor }}>
          <p className="text-sm tracking-widest text-gray-500">CERTIFICATE OF COMPLETION</p>
          <h1 className="mt-2 text-3xl font-black">{fullName}</h1>
          {company && <p className="mt-1 text-sm text-gray-600">{company}</p>}
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-700">
            has successfully completed the Bolt Accredited Installer Course including modules on electrical and safety
            fundamentals, plumbing installation, battery and solar integration, and Bolt commissioning.
          </p>
          <div className="mx-auto my-6 h-px w-32 bg-gray-200" />
          <p className="text-sm text-gray-600">Issued on {date}</p>
          <div className="mt-6 flex items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Verified by Bolt</div>
            <div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4" /> Reference: BAI-{Date.now().toString().slice(-6)}</div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}><ChevronLeft className="h-4 w-4" />Close</Button>
          <Button onClick={() => window.print()}><Download className="h-4 w-4" />Print / Save PDF</Button>
        </div>
      </div>
    </div>
  );
}

export default function BoltInstallerCourse({
  logoUrl,
  brandColor = "#0b1e3a",
  onComplete,
}: {
  logoUrl?: string;
  brandColor?: string;
  onComplete?: (payload: { fullName?: string; company?: string; issuedAt: string; version: string; progress: Progress }) => void;
}) {
  const [progress, updateProgress, resetProgress] = useLocalProgress();
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showCert, setShowCert] = useState(false);
  const [name, setName] = useState(progress.fullName || "");
  const [company, setCompany] = useState(progress.company || "");

  const metrics = useProgressMetrics(COURSE_DATA, progress);

  const allLessons = useMemo(() => COURSE_DATA.modules.flatMap((m) => m.lessons.map((l) => l.id)), []);
  const allDone = allLessons.every((id) => progress.completedLessons[id]);
  const allQuizzesPassed = COURSE_DATA.modules.every((m) => {
    const s = progress.quizScores[m.id];
    return s && s.correct / s.total >= 0.7;
  });
  const canIssueCertificate = allDone && allQuizzesPassed;

  useEffect(() => {
    if (progress.certificateIssued && !progress.dateIssued) {
      updateProgress({ dateIssued: new Date().toISOString().slice(0, 10) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkLessonDone = (lessonId: string) => {
    updateProgress({ completedLessons: { ...progress.completedLessons, [lessonId]: true } });
  };

  const handleQuizSubmit = (m: Module) => (score: { correct: number; total: number }) => {
    updateProgress({ quizScores: { ...progress.quizScores, [m.id]: score } });
  };

  const handleIssueCertificate = () => {
    const issuedAt = new Date().toISOString();
    updateProgress({ certificateIssued: true, fullName: name, company, dateIssued: issuedAt.slice(0, 10) });
    setShowCert(true);
    onComplete?.({ fullName: name, company, issuedAt, version: COURSE_DATA.version, progress });
  };

  const resetAll = () => {
    if (confirm("This will clear your course progress on this device. Proceed?")) {
      resetProgress();
      setActiveLesson(null);
      setActiveModule(null);
      setShowCert(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl ? <img src={logoUrl} alt="Bolt" className="h-8" /> : <Sparkles className="h-6 w-6" />}
          <div>
            <h1 className="text-xl font-bold">{COURSE_DATA.courseTitle}</h1>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
              <Badge><GraduationCap className="mr-1 h-3 w-3" /> v{COURSE_DATA.version}</Badge>
              <Badge><Star className="mr-1 h-3 w-3" /> Pass mark 70%</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={resetAll} aria-label="Reset progress">Reset</Button>
        </div>
      </header>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Overall progress</p>
            <div className="mt-2 w-full sm:w-96"><ProgressBar value={metrics.overallPct} brandColor={brandColor} /></div>
          </div>
          <div className="text-xs text-gray-600">
            Lessons: {metrics.doneLessons}/{metrics.totalLessons} · Quizzes passed: {metrics.passedQuizzes}/{metrics.totalQuizzes}
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <h2 className="mb-3 text-base font-semibold">Your details (for certificate)</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-gray-700">Full name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Jane Smith" className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-gray-700">Company (optional)</span>
              <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g., JS Heating Ltd" className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button
              onClick={handleIssueCertificate}
              variant={canIssueCertificate ? "primary" : "outline"}
              aria-label="Generate certificate"
              disabled={!canIssueCertificate || !name.trim()}
            >
              {canIssueCertificate ? (<>Issue certificate <Check className="h-4 w-4" /></>) : (<>Complete all lessons & quizzes <Lock className="h-4 w-4" /></>)}
            </Button>
            {!name.trim() && <span className="text-xs text-red-600">Enter your full name to enable certificate</span>}
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 text-base font-semibold">At a glance</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2"><Home className="h-4 w-4" /> Self-study online</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Compliance-minded</li>
            <li className="flex items-center gap-2"><Trophy className="h-4 w-4" /> 70% pass mark</li>
            <li className="flex items-center gap-2"><FileCheck2 className="h-4 w-4" /> Printable certificate</li>
          </ul>
        </Card>
      </div>

      {!activeModule ? (
        <div className="mt-6 grid gap-4">
          {COURSE_DATA.modules.map((m) => {
            const completedCount = m.lessons.filter((l) => progress.completedLessons[l.id]).length;
            const total = m.lessons.length;
            const passed = !!(progress.quizScores[m.id] && progress.quizScores[m.id].correct / progress.quizScores[m.id].total >= 0.7);
            return (
              <ModuleCard
                key={m.id}
                mod={m}
                completedCount={completedCount}
                totalLessons={total}
                quizPassed={passed}
                onOpen={() => setActiveModule(m)}
              />
            );
          })}
        </div>
      ) : (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <button className="mb-2 inline-flex items-center gap-1 text-sm text-gray-600 hover:underline" onClick={() => { setActiveModule(null); setActiveLesson(null); }}>
                <ChevronLeft className="h-4 w-4" /> Back to modules
              </button>
              <h2 className="text-lg font-bold">{activeModule.title}</h2>
              <p className="text-sm text-gray-600">{activeModule.blurb}</p>
            </div>
            <Pill>{activeModule.estMinutes} min</Pill>
          </div>

          {!activeLesson ? (
            <div className="grid gap-3">
              {activeModule.lessons.map((l, idx) => {
                const done = !!progress.completedLessons[l.id];
                return (
                  <Card key={l.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold">{idx + 1}</span>
                        <div>
                          <div className="text-sm font-semibold">{l.title}</div>
                          <div className="text-xs text-gray-600">~{l.durationMin} min</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {done ? <Badge><Check className="mr-1 h-3 w-3" />Done</Badge> : <Badge>Not started</Badge>}
                        <Button variant="outline" onClick={() => setActiveLesson(l)} aria-label={`Open ${l.title}`}>
                          Open <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold">Q</span>
                    <div>
                      <div className="text-sm font-semibold">Module quiz</div>
                      <div className="text-xs text-gray-600">Pass mark 70%</div>
                    </div>
                  </div>
                  <Button variant="primary" onClick={() => setActiveLesson({ id: `${activeModule.id}-quiz`, title: "Module quiz", durationMin: 10, content: "" })}>
                    Start quiz
                  </Button>
                </div>
              </Card>
            </div>
          ) : activeLesson.id.endsWith("-quiz") ? (
            <div>
              <h3 className="mb-3 text-base font-semibold">{activeModule.title} - Quiz</h3>
              <Quiz quiz={activeModule.quiz} moduleId={activeModule.id} onSubmit={handleQuizSubmit(activeModule)} />
            </div>
          ) : (
            <div>
              <Card>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 text-sm text-gray-600 hover:underline" onClick={() => setActiveLesson(null)}>
                      <ChevronLeft className="h-4 w-4" /> Lessons
                    </button>
                    <span className="text-sm font-semibold">{activeLesson.title}</span>
                  </div>
                  <Pill>~{activeLesson.durationMin} min</Pill>
                </div>
                <LessonContent content={activeLesson.content} />
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button variant="ghost" onClick={() => setActiveLesson(null)}><ChevronLeft className="h-4 w-4" />Back</Button>
                  <Button onClick={() => { handleMarkLessonDone(activeLesson.id); setActiveLesson(null); }}>
                    Mark done <Check className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      <Certificate
        visible={showCert}
        onClose={() => setShowCert(false)}
        fullName={name}
        company={company}
        date={progress.dateIssued || new Date().toISOString().slice(0, 10)}
        logoUrl={logoUrl}
        brandColor={brandColor}
      />

      <div className="mt-10 text-center text-xs text-gray-500">
        <p>Need this embedded in a specific CMS block or with SCORM/LTI? Use the onComplete hook to call your backend/LMS.</p>
      </div>
    </div>
  );
}
