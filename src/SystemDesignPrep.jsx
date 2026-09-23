import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  Code2,
  Layers,
  LineChart,
  Play,
  Terminal,
} from "lucide-react";
import { FRAMEWORK_STEPS, CONCEPTS } from "./data/framework.js";
import { PROBLEMS, CATEGORIES } from "./data/problems.js";
import { LLD_PROBLEMS, LLD_CATEGORIES } from "./data/lldProblems.js";
import { LLD_FRAMEWORK_STEPS, LLD_CONCEPTS } from "./data/lldFramework.js";
import { getSolutions } from "./data/solutions.js";
import MockStudio from "./components/MockStudio.jsx";
import LldMockStudio from "./components/LldMockStudio.jsx";
import SolutionsList from "./components/SolutionsList.jsx";

const STATUS = {
  "not-started": { label: "Not Started", color: "var(--text-dim)", fill: 0 },
  attempted: { label: "Attempted", color: "var(--amber)", fill: 33 },
  reviewed: { label: "Reviewed", color: "var(--amber)", fill: 66 },
  confident: { label: "Confident", color: "var(--bid)", fill: 100 },
};

const STORAGE_KEY = "sdprep-state-v3";

function defaultState() {
  const problems = {};
  PROBLEMS.forEach((p) => {
    problems[p.id] = { status: "not-started", notes: "", rubric: p.rubric.map(() => false), lastScore: null };
  });
  const lldProblems = {};
  LLD_PROBLEMS.forEach((p) => {
    lldProblems[p.id] = { status: "not-started", notes: "", rubric: p.rubric.map(() => false), lastScore: null };
  });
  return { problems, lldProblems, mockCount: 0, lldMockCount: 0 };
}

function migrateState(parsed) {
  const base = defaultState();
  if (!parsed?.problems) return base;
  for (const p of PROBLEMS) {
    if (parsed.problems[p.id]) {
      base.problems[p.id] = {
        status: parsed.problems[p.id].status || "not-started",
        notes: parsed.problems[p.id].notes || "",
        rubric: Array.isArray(parsed.problems[p.id].rubric)
          ? p.rubric.map((_, i) => !!parsed.problems[p.id].rubric[i])
          : p.rubric.map(() => false),
        lastScore: parsed.problems[p.id].lastScore ?? null,
      };
    }
  }
  if (parsed.lldProblems) {
    for (const p of LLD_PROBLEMS) {
      if (parsed.lldProblems[p.id]) {
        base.lldProblems[p.id] = {
          status: parsed.lldProblems[p.id].status || "not-started",
          notes: parsed.lldProblems[p.id].notes || "",
          rubric: Array.isArray(parsed.lldProblems[p.id].rubric)
            ? p.rubric.map((_, i) => !!parsed.lldProblems[p.id].rubric[i])
            : p.rubric.map(() => false),
          lastScore: parsed.lldProblems[p.id].lastScore ?? null,
        };
      }
    }
  }
  base.mockCount = parsed.mockCount || 0;
  base.lldMockCount = parsed.lldMockCount || 0;
  return base;
}

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber)", letterSpacing: "0.08em", marginBottom: 4 }}>
        {eyebrow}
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, margin: 0 }}>{title}</h1>
      {sub && (
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>{sub}</p>
      )}
    </div>
  );
}

function FrameworkView() {
  return (
    <div>
      <SectionHeader
        eyebrow="00 / HLD FRAMEWORK"
        title="Run every problem through this"
        sub="Eight phases, sixty minutes. This is the structure an interviewer is silently checking you against."
      />
      <div>
        {FRAMEWORK_STEPS.map((s, i) => (
          <div
            key={s.num}
            className="framework-step"
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="framework-step-num">{s.num}</div>
              {i < FRAMEWORK_STEPS.length - 1 && <div className="framework-step-line" />}
            </div>
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, margin: 0 }}>{s.title}</h3>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>
                  {s.minutes} min · ends at {s.cumulative}:00
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 6, lineHeight: 1.6, maxWidth: 620 }}>{s.detail}</p>
              <div style={{ marginTop: 6, fontSize: 12, color: "var(--amber)" }}>→ {s.tip}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConceptsView() {
  return (
    <div>
      <SectionHeader
        eyebrow="01 / CONCEPTS"
        title="Cheat sheet"
        sub="Cold knowledge before you walk in — caching, replication, messaging, reliability, and AI infra patterns."
      />
      <div className="concept-grid">
        {CONCEPTS.map((c, i) => (
          <div
            key={c.title}
            className="concept-card glass-card"
          >
            <h3>{c.title}</h3>
            <ul>
              {c.points.map((pt, j) => (
                <li key={j}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function LldGuideView() {
  return (
    <div>
      <SectionHeader
        eyebrow="04 / LLD FRAMEWORK"
        title="Code-first low-level design"
        sub="Six phases, sixty minutes. Clarify, model entities, implement APIs, apply patterns, discuss concurrency, wrap with tests."
      />
      <div>
        {LLD_FRAMEWORK_STEPS.map((s, i) => (
          <div
            key={s.num}
            className="framework-step"
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="framework-step-num">{s.num}</div>
              {i < LLD_FRAMEWORK_STEPS.length - 1 && <div className="framework-step-line" />}
            </div>
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, margin: 0 }}>{s.title}</h3>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>
                  {s.minutes} min · ends at {s.cumulative}:00
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 6, lineHeight: 1.6, maxWidth: 620 }}>{s.detail}</p>
              <div style={{ marginTop: 6, fontSize: 12, color: "var(--cyan)" }}>→ {s.tip}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="concept-grid" style={{ marginTop: 24 }}>
        {LLD_CONCEPTS.map((c, i) => (
          <div
            key={c.title}
            className="concept-card glass-card"
          >
            <h3>{c.title}</h3>
            <ul>
              {c.points.map((pt, j) => (
                <li key={j}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Block({ title, items }) {
  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px" }}>
      <div style={{ fontSize: 11, color: "var(--amber)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: 14, display: "flex", flexDirection: "column", gap: 5 }}>
        {items.map((c, i) => (
          <li key={i} style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProblemFilters({ query, setQuery, tag, setTag, category, setCategory, count, categories = CATEGORIES }) {
  return (
    <div className="filter-bar">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search problems…" style={{ minWidth: 180, flex: "1 1 160px" }} />
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        <option value="">All levels</option>
        <option value="Warm-up">Warm-up</option>
        <option value="Core">Core</option>
        <option value="Advanced">Advanced</option>
        <option value="Expert">Expert</option>
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>{count} shown</span>
    </div>
  );
}

function ProblemListView({ problemsState, onOpen, filtered }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {filtered.map((p, i) => {
        const st = problemsState[p.id];
        const meta = STATUS[st.status];
        return (
          <div
            key={p.id}
            className="depth-row"
            onClick={() => onOpen(p.id)}
          >
            <div className="depth-fill" style={{ width: meta.fill + "%" }} />
            <div className="problem-row-inner">
              <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)" }}>{p.num}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span>{p.tag}</span>
                    <span>·</span>
                    <span>{p.category}</span>
                    {st.lastScore != null && (
                      <>
                        <span>·</span>
                        <span style={{ color: "var(--amber)" }}>score {st.lastScore}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: meta.color }}>{meta.label}</span>
                <ChevronRight size={14} color="var(--text-dim)" />
              </div>
            </div>
          </div>
        );
      })}
      {!filtered.length && (
        <div style={{ color: "var(--text-dim)", fontSize: 13, padding: 20, textAlign: "center" }}>No problems match these filters.</div>
      )}
    </div>
  );
}

function LldProblemDetailView({ problem, state, onBack, onStatus, onNotes, onStartMock }) {
  const [notes, setNotesLocal] = useState(state.notes);
  return (
    <div>
      <button type="button" onClick={onBack} className="back-link" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
        <ChevronLeft size={14} /> Back to LLD questions
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--cyan)" }}>{problem.num}</span>
        <h1 className="section-title" style={{ fontSize: 22, margin: 0 }}>{problem.title}</h1>
        <span className="tag">{problem.tag}</span>
        <span className="tag">{problem.category}</span>
      </div>
      <p className="section-sub">{problem.prompt}</p>
      <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: -4 }}>Inspired by: {problem.source}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 14, marginTop: 20 }}>
        <Block title="Clarify before you code" items={problem.requirements} />
        <Block title="Where you'll be probed" items={problem.focus} />
      </div>

      <div style={{ marginTop: 22 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Self-check rubric</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {problem.rubric.map((r, i) => (
            <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text-dim)" }}>
              <input type="checkbox" checked={!!state.rubric[i]} readOnly disabled style={{ accentColor: "var(--bid)" }} />
              {r}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotesLocal(e.target.value)}
          onBlur={() => onNotes(notes)}
          placeholder="Patterns to use, edge cases, test ideas…"
          style={{
            width: "100%",
            minHeight: 80,
            background: "var(--panel-solid)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--text)",
            padding: "10px 12px",
            fontSize: 13,
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" className="btn-accent-lg" onClick={onStartMock}>
          <Code2 size={14} /> Start LLD code room
        </button>
        <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Status:</span>
        {Object.keys(STATUS).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onStatus(key)}
            className="tag"
            style={{
              cursor: "pointer",
              color: state.status === key ? STATUS[key].color : "var(--text-dim)",
              background: state.status === key ? "var(--panel-alt)" : "transparent",
            }}
          >
            {STATUS[key].label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProblemDetailView({ problem, state, onBack, onStatus, onNotes, onStartMock }) {
  const [notes, setNotesLocal] = useState(state.notes);
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="nav-btn"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-dim)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
          fontSize: 12,
          padding: "4px 0",
          marginBottom: 14,
        }}
      >
        <ChevronLeft size={14} /> Back to problem set
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--amber)" }}>{problem.num}</span>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, margin: 0 }}>{problem.title}</h1>
        <span style={{ fontSize: 11, color: "var(--text-dim)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 8px" }}>
          {problem.tag}
        </span>
        <span style={{ fontSize: 11, color: "var(--text-dim)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 8px" }}>
          {problem.category}
        </span>
      </div>
      <p style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 10, maxWidth: 620, lineHeight: 1.6 }}>{problem.prompt}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 14, marginTop: 20 }}>
        <Block title="Clarify before you design" items={problem.requirements} />
        <Block title="Scale to estimate" items={problem.scale} />
        <Block title="Where you'll be probed" items={problem.focus} />
      </div>

      <div style={{ marginTop: 22 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Self-check rubric</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {problem.rubric.map((r, i) => (
            <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text-dim)" }}>
              <input type="checkbox" checked={!!state.rubric[i]} readOnly disabled style={{ accentColor: "var(--bid)" }} />
              {r}
            </label>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 6, fontStyle: "italic" }}>Checked during a scored mock session.</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotesLocal(e.target.value)}
          onBlur={() => onNotes(notes)}
          placeholder="Weak spots, things you fumbled, what to revisit…"
          style={{
            width: "100%",
            minHeight: 80,
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            color: "var(--text)",
            padding: "10px 12px",
            fontSize: 13,
            fontFamily: "var(--font-body)",
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <SolutionsList
          solutions={getSolutions(problem)}
          title="REFERENCE SOLUTIONS (BEST AFTER A MOCK)"
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button
          type="button"
          onClick={onStartMock}
          style={{
            background: "var(--amber)",
            color: "#0A0D10",
            border: "none",
            borderRadius: 6,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Play size={14} /> Start live mock (cam + mic)
        </button>
        <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Status:</span>
        {Object.keys(STATUS).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onStatus(key)}
            style={{
              background: state.status === key ? "var(--panel-alt)" : "transparent",
              border: "1px solid var(--border)",
              borderRadius: 5,
              padding: "5px 10px",
              fontSize: 11,
              color: state.status === key ? STATUS[key].color : "var(--text-dim)",
              cursor: "pointer",
            }}
          >
            {STATUS[key].label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgressView({ data, onOpenHld, onOpenLld }) {
  const hldTotal = PROBLEMS.length;
  const lldTotal = LLD_PROBLEMS.length;
  const hldDone = Object.values(data.problems).filter((p) => p.status === "confident").length;
  const lldDone = Object.values(data.lldProblems).filter((p) => p.status === "confident").length;

  function renderRows(problems, stateMap, onOpen, accent) {
    return problems.map((p) => {
      const st = stateMap[p.id];
      const meta = STATUS[st.status];
      const checkedCount = st.rubric.filter(Boolean).length;
      return (
        <div key={p.id} onClick={() => onOpen(p.id)} className="depth-row" style={{ cursor: "pointer", marginBottom: 8 }}>
          <div className="depth-fill" style={{ width: meta.fill + "%" }} />
          <div className="problem-row-inner">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: accent }}>{p.num}</span>
              <span style={{ fontSize: 13.5 }}>{p.title}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {st.lastScore != null && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber)" }}>{st.lastScore}</span>
              )}
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>
                {checkedCount}/{p.rubric.length}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: meta.color, minWidth: 80, textAlign: "right" }}>
                {meta.label}
              </span>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div>
      <SectionHeader
        eyebrow="07 / PROGRESS"
        title="Where you stand"
        sub={`HLD: ${hldDone}/${hldTotal} confident · LLD: ${lldDone}/${lldTotal} confident · ${data.mockCount + data.lldMockCount} total mock sessions.`}
      />
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--amber)", marginBottom: 10 }}>System design (HLD)</h3>
      {renderRows(PROBLEMS, data.problems, onOpenHld, "var(--amber)")}
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--cyan)", margin: "24px 0 10px" }}>Low-level design (LLD)</h3>
      {renderRows(LLD_PROBLEMS, data.lldProblems, onOpenLld, "var(--cyan)")}
    </div>
  );
}

export default function SystemDesignPrep() {
  const [view, setView] = useState("framework");
  const [data, setData] = useState(null);
  const [activeProblemId, setActiveProblemId] = useState(null);
  const [mockProblemId, setMockProblemId] = useState(null);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");
  const [lldActiveProblemId, setLldActiveProblemId] = useState(null);
  const [lldMockProblemId, setLldMockProblemId] = useState(null);
  const [lldQuery, setLldQuery] = useState("");
  const [lldTag, setLldTag] = useState("");
  const [lldCategory, setLldCategory] = useState("");

  useEffect(() => {
    try {
      const raw =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem("sdprep-state-v2") ||
        localStorage.getItem("sdprep-state-v1");
      setData(raw ? migrateState(JSON.parse(raw)) : defaultState());
    } catch {
      setData(defaultState());
    }
  }, []);

  const persist = (next) => {
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* best effort */
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROBLEMS.filter((p) => {
      if (tag && p.tag !== tag) return false;
      if (category && p.category !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q) ||
        p.id.includes(q) ||
        p.category.includes(q)
      );
    });
  }, [query, tag, category]);

  const lldFiltered = useMemo(() => {
    const q = lldQuery.trim().toLowerCase();
    return LLD_PROBLEMS.filter((p) => {
      if (lldTag && p.tag !== lldTag) return false;
      if (lldCategory && p.category !== lldCategory) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q) ||
        p.id.includes(q) ||
        p.category.includes(q)
      );
    });
  }, [lldQuery, lldTag, lldCategory]);

  if (!data) {
    return (
      <div
        style={{
          background: "#0A0D10",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8B96A3",
          fontFamily: "monospace",
        }}
      >
        LOADING...
      </div>
    );
  }

  const total = PROBLEMS.length;
  const doneCount = Object.values(data.problems).filter((p) => p.status === "confident").length;
  const attemptedCount = Object.values(data.problems).filter((p) => p.status !== "not-started").length;

  const lldDoneCount = Object.values(data.lldProblems).filter((p) => p.status === "confident").length;
  const lldAttemptedCount = Object.values(data.lldProblems).filter((p) => p.status !== "not-started").length;

  function setProblemStatus(id, status) {
    persist({ ...data, problems: { ...data.problems, [id]: { ...data.problems[id], status } } });
  }

  function setProblemNotes(id, notes) {
    persist({ ...data, problems: { ...data.problems, [id]: { ...data.problems[id], notes } } });
  }

  function setLldProblemStatus(id, status) {
    persist({ ...data, lldProblems: { ...data.lldProblems, [id]: { ...data.lldProblems[id], status } } });
  }

  function setLldProblemNotes(id, notes) {
    persist({ ...data, lldProblems: { ...data.lldProblems, [id]: { ...data.lldProblems[id], notes } } });
  }

  function saveMockResult({ problemId, status, notes, rubric, score }) {
    const next = {
      ...data,
      mockCount: data.mockCount + 1,
      problems: {
        ...data.problems,
        [problemId]: {
          status,
          notes,
          rubric,
          lastScore: score,
        },
      },
    };
    persist(next);
    setView("progress");
    setMockProblemId(null);
  }

  function saveLldMockResult({ problemId, status, notes, rubric, score }) {
    const next = {
      ...data,
      lldMockCount: data.lldMockCount + 1,
      lldProblems: {
        ...data.lldProblems,
        [problemId]: { status, notes, rubric, lastScore: score },
      },
    };
    persist(next);
    setView("progress");
    setLldMockProblemId(null);
  }

  const navSections = [
    {
      label: "System design",
      items: [
        { id: "framework", label: "HLD Framework", num: "00", icon: Layers },
        { id: "concepts", label: "Concepts", num: "01", icon: Brain },
        { id: "problems", label: "HLD Problems", num: "02", icon: BookOpen },
        { id: "mock", label: "HLD Mock", num: "03", icon: Terminal },
      ],
    },
    {
      label: "Low-level design",
      items: [
        { id: "lld-guide", label: "LLD Framework", num: "04", icon: Code2 },
        { id: "lld-problems", label: "LLD Questions", num: "05", icon: Terminal },
        { id: "lld-mock", label: "LLD Code Room", num: "06", icon: Code2 },
      ],
    },
    {
      label: "Track",
      items: [{ id: "progress", label: "Progress", num: "07", icon: LineChart }],
    },
  ];

  // Full-page mock experiences
  if (view === "mock") {
    return (
      <div className="app-root">
        <MockStudio
          fullPage
          problems={PROBLEMS}
          mockProblemId={mockProblemId}
          onPickProblem={setMockProblemId}
          onExit={() => {
            setMockProblemId(null);
            setView("problems");
          }}
          onSaveResult={saveMockResult}
        />
      </div>
    );
  }

  if (view === "lld-mock") {
    return (
      <div className="app-root">
        <LldMockStudio
          fullPage
          problems={LLD_PROBLEMS}
          mockProblemId={lldMockProblemId}
          onPickProblem={setLldMockProblemId}
          onExit={() => {
            setLldMockProblemId(null);
            setView("lld-problems");
          }}
          onSaveResult={saveLldMockResult}
        />
      </div>
    );
  }

  function handleNav(id) {
    setView(id);
    setActiveProblemId(null);
    setLldActiveProblemId(null);
    if (id !== "mock") setMockProblemId(null);
    if (id !== "lld-mock") setLldMockProblemId(null);
  }

  return (
    <div className="app-root">
      <div className="app-bg">
        <div className="app-bg-grid" />
      </div>
      <div className="app-shell">
        <header className="app-topbar">
          <div className="app-brand">
            <div className="app-brand-icon">
              <Terminal size={18} />
            </div>
            <div>
              <div className="app-brand-title">System Design Prep</div>
              <div className="app-brand-sub">
                {total} HLD · {LLD_PROBLEMS.length} LLD questions
              </div>
            </div>
          </div>
          <div className="app-stats">
            <span>
              HLD <strong>{attemptedCount}/{total}</strong>
            </span>
            <span>
              LLD <strong>{lldAttemptedCount}/{LLD_PROBLEMS.length}</strong>
            </span>
            <span className="good">
              CONF <strong>{doneCount + lldDoneCount}</strong>
            </span>
            <span className="accent">
              MOCKS <strong>{data.mockCount + data.lldMockCount}</strong>
            </span>
          </div>
        </header>

        <div className="app-body">
          <nav className="app-nav">
            {navSections.map((section) => (
              <div key={section.label}>
                <div className="nav-section-label">{section.label}</div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`nav-btn ${view === item.id ? "active" : ""}`}
                      onClick={() => handleNav(item.id)}
                    >
                      <span className="nav-btn-num">{item.num}</span>
                      <Icon size={14} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <main className="app-main">
            <div
                key={view + (activeProblemId || "") + (lldActiveProblemId || "")}
              >
                {view === "framework" && <FrameworkView />}
                {view === "concepts" && <ConceptsView />}
                {view === "lld-guide" && <LldGuideView />}
                {view === "problems" && !activeProblemId && (
                  <div>
                    <SectionHeader
                      eyebrow="02 / HLD PROBLEM SET"
                      title={`${total} system design problems`}
                      sub="Product designs, infra primitives, marketplaces, and AI systems from FAANG and startup interviews."
                    />
                    <ProblemFilters
                      query={query}
                      setQuery={setQuery}
                      tag={tag}
                      setTag={setTag}
                      category={category}
                      setCategory={setCategory}
                      count={filtered.length}
                    />
                    <ProblemListView problemsState={data.problems} onOpen={setActiveProblemId} filtered={filtered} />
                  </div>
                )}
                {view === "problems" && activeProblemId && (
                  <ProblemDetailView
                    problem={PROBLEMS.find((p) => p.id === activeProblemId)}
                    state={data.problems[activeProblemId]}
                    onBack={() => setActiveProblemId(null)}
                    onStatus={(s) => setProblemStatus(activeProblemId, s)}
                    onNotes={(n) => setProblemNotes(activeProblemId, n)}
                    onStartMock={() => {
                      setView("mock");
                      setMockProblemId(activeProblemId);
                    }}
                  />
                )}
                {view === "lld-problems" && !lldActiveProblemId && (
                  <div>
                    <SectionHeader
                      eyebrow="05 / LLD QUESTIONS"
                      title={`${LLD_PROBLEMS.length} low-level design questions`}
                      sub="Parking lot, Splitwise, patterns, concurrency — each opens a CodeSandbox-style workspace with file tree, editor, console, and hidden Jest tests."
                    />
                    <ProblemFilters
                      query={lldQuery}
                      setQuery={setLldQuery}
                      tag={lldTag}
                      setTag={setLldTag}
                      category={lldCategory}
                      setCategory={setLldCategory}
                      count={lldFiltered.length}
                      categories={LLD_CATEGORIES}
                    />
                    <ProblemListView problemsState={data.lldProblems} onOpen={setLldActiveProblemId} filtered={lldFiltered} />
                  </div>
                )}
                {view === "lld-problems" && lldActiveProblemId && (
                  <LldProblemDetailView
                    problem={LLD_PROBLEMS.find((p) => p.id === lldActiveProblemId)}
                    state={data.lldProblems[lldActiveProblemId]}
                    onBack={() => setLldActiveProblemId(null)}
                    onStatus={(s) => setLldProblemStatus(lldActiveProblemId, s)}
                    onNotes={(n) => setLldProblemNotes(lldActiveProblemId, n)}
                    onStartMock={() => {
                      setView("lld-mock");
                      setLldMockProblemId(lldActiveProblemId);
                    }}
                  />
                )}
                {view === "progress" && (
                  <ProgressView
                    data={data}
                    onOpenHld={(id) => {
                      setView("problems");
                      setActiveProblemId(id);
                    }}
                    onOpenLld={(id) => {
                      setView("lld-problems");
                      setLldActiveProblemId(id);
                    }}
                  />
                )}
                {(view === "mock" || view === "lld-mock") && (
                  <SectionHeader
                    eyebrow="MOCK"
                    title="Open from the sidebar or a problem detail page"
                    sub="Pick HLD Mock or LLD Code Room, then choose a question."
                  />
                )}
              </div>
          </main>
        </div>
      </div>
    </div>
  );
}
