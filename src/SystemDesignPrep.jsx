import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Terminal } from "lucide-react";
import { FRAMEWORK_STEPS, CONCEPTS } from "./data/framework.js";
import { PROBLEMS, CATEGORIES } from "./data/problems.js";
import { getSolutions } from "./data/solutions.js";
import MockStudio from "./components/MockStudio.jsx";
import SolutionsList from "./components/SolutionsList.jsx";

const STATUS = {
  "not-started": { label: "Not Started", color: "var(--text-dim)", fill: 0 },
  attempted: { label: "Attempted", color: "var(--amber)", fill: 33 },
  reviewed: { label: "Reviewed", color: "var(--amber)", fill: 66 },
  confident: { label: "Confident", color: "var(--bid)", fill: 100 },
};

const STORAGE_KEY = "sdprep-state-v2";

function defaultState() {
  const problems = {};
  PROBLEMS.forEach((p) => {
    problems[p.id] = { status: "not-started", notes: "", rubric: p.rubric.map(() => false), lastScore: null };
  });
  return { problems, mockCount: 0 };
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
  base.mockCount = parsed.mockCount || 0;
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
        eyebrow="00 / THE FRAMEWORK"
        title="Run every problem through this"
        sub="Eight phases, sixty minutes. This is the structure an interviewer is silently checking you against."
      />
      <div>
        {FRAMEWORK_STEPS.map((s, i) => (
          <div key={s.num} style={{ display: "flex", gap: 16, paddingBottom: i < FRAMEWORK_STEPS.length - 1 ? 18 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--panel)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--amber)",
                }}
              >
                {s.num}
              </div>
              {i < FRAMEWORK_STEPS.length - 1 && <div style={{ width: 1, flex: 1, background: "var(--border)", marginTop: 4 }} />}
            </div>
            <div style={{ paddingBottom: 4, flex: 1 }}>
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
        sub="Cold knowledge before you walk in — caching, replication, messaging, reliability, and AI infra patterns. Skim before every mock."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
        {CONCEPTS.map((c) => (
          <div key={c.title} style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>{c.title}</h3>
            <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {c.points.map((pt, i) => (
                <li key={i} style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.5 }}>
                  {pt}
                </li>
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

function ProblemFilters({ query, setQuery, tag, setTag, category, setCategory, count }) {
  const selectStyle = {
    background: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    color: "var(--text)",
    padding: "7px 10px",
    fontSize: 12,
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14, alignItems: "center" }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search problems…"
        style={{ ...selectStyle, minWidth: 180, flex: "1 1 160px" }}
      />
      <select value={tag} onChange={(e) => setTag(e.target.value)} style={selectStyle}>
        <option value="">All levels</option>
        <option value="Warm-up">Warm-up</option>
        <option value="Core">Core</option>
        <option value="Advanced">Advanced</option>
        <option value="Expert">Expert</option>
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>{count} shown</span>
    </div>
  );
}

function ProblemListView({ data, onOpen, filtered }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {filtered.map((p) => {
        const st = data.problems[p.id];
        const meta = STATUS[st.status];
        return (
          <div
            key={p.id}
            className="depth-row nav-btn"
            onClick={() => onOpen(p.id)}
            style={{
              cursor: "pointer",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div className="depth-fill" style={{ width: meta.fill + "%" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1, minWidth: 0 }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1, flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: meta.color }}>{meta.label}</span>
              <ChevronRight size={14} color="var(--text-dim)" />
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

function ProgressView({ data, onOpen }) {
  const total = PROBLEMS.length;
  const doneCount = Object.values(data.problems).filter((p) => p.status === "confident").length;
  const scored = PROBLEMS.filter((p) => data.problems[p.id]?.lastScore != null);
  const avg =
    scored.length > 0
      ? Math.round(scored.reduce((a, p) => a + data.problems[p.id].lastScore, 0) / scored.length)
      : null;

  return (
    <div>
      <SectionHeader
        eyebrow="04 / PROGRESS"
        title="Where you stand"
        sub={
          doneCount +
          " of " +
          total +
          " problems at confident. " +
          data.mockCount +
          " mock sessions logged." +
          (avg != null ? ` Avg mock score ${avg}.` : "")
        }
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {PROBLEMS.map((p) => {
          const st = data.problems[p.id];
          const meta = STATUS[st.status];
          const checkedCount = st.rubric.filter(Boolean).length;
          return (
            <div
              key={p.id}
              onClick={() => onOpen(p.id)}
              className="depth-row nav-btn"
              style={{
                cursor: "pointer",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="depth-fill" style={{ width: meta.fill + "%" }} />
              <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)" }}>{p.num}</span>
                <span style={{ fontSize: 13.5 }}>{p.title}</span>
              </div>
              <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
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
          );
        })}
      </div>
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("sdprep-state-v1");
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

  function setProblemStatus(id, status) {
    persist({ ...data, problems: { ...data.problems, [id]: { ...data.problems[id], status } } });
  }

  function setProblemNotes(id, notes) {
    persist({ ...data, problems: { ...data.problems, [id]: { ...data.problems[id], notes } } });
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

  const navItems = [
    { id: "framework", label: "Framework", num: "00" },
    { id: "concepts", label: "Concepts", num: "01" },
    { id: "problems", label: "Problem Set", num: "02" },
    { id: "mock", label: "Mock Studio", num: "03" },
    { id: "progress", label: "Progress", num: "04" },
  ];

  const cssVars = {
    "--bg": "#0A0D10",
    "--panel": "#12161B",
    "--panel-alt": "#171C22",
    "--border": "#232A32",
    "--text": "#E7EAEE",
    "--text-dim": "#8B96A3",
    "--bid": "#3FB68B",
    "--ask": "#E2664A",
    "--amber": "#E8A33D",
    "--font-display": "'Space Grotesk', sans-serif",
    "--font-body": "'Inter', sans-serif",
    "--font-mono": "'IBM Plex Mono', monospace",
  };

  const globalStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
    * { box-sizing: border-box; }
    .sdp-scroll::-webkit-scrollbar { width: 6px; }
    .sdp-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
    .depth-row { position: relative; overflow: hidden; }
    .depth-fill { position: absolute; left: 0; top: 0; bottom: 0; background: linear-gradient(90deg, rgba(63,182,139,0.14), rgba(63,182,139,0.02)); transition: width 0.4s ease; }
    .nav-btn { transition: background 0.15s ease, color 0.15s ease; }
    .nav-btn:hover { background: var(--panel-alt); }
    textarea:focus, button:focus-visible, input:focus, select:focus { outline: 2px solid var(--amber); outline-offset: 1px; }
    @media (max-width: 800px) {
      .sdp-shell { flex-direction: column !important; }
      .sdp-nav { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--border); display: flex; overflow-x: auto; padding: 0 !important; }
      .sdp-nav button { width: auto !important; white-space: nowrap; border-left: none !important; border-bottom: 2px solid transparent; }
    }
  `;

  // Full-page mock experience (outside sidebar shell)
  if (view === "mock") {
    return (
      <div style={{ ...cssVars, background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", minHeight: "100vh" }}>
        <style>{globalStyle}</style>
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

  return (
    <div
      style={{
        ...cssVars,
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-body)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <style>{globalStyle}</style>

      <div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Terminal size={16} color="var(--amber)" />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, letterSpacing: "0.04em" }}>
            SYSTEM DESIGN PREP
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>{total} problems</span>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)", display: "flex", gap: 18 }}>
          <span>
            ATTEMPTED <span style={{ color: "var(--text)" }}>{attemptedCount}/{total}</span>
          </span>
          <span>
            CONFIDENT <span style={{ color: "var(--bid)" }}>{doneCount}/{total}</span>
          </span>
          <span>
            SESSIONS <span style={{ color: "var(--amber)" }}>{data.mockCount}</span>
          </span>
        </div>
      </div>

      <div className="sdp-shell" style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div className="sdp-nav" style={{ width: 180, borderRight: "1px solid var(--border)", padding: "14px 0", flexShrink: 0 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="nav-btn"
              onClick={() => {
                setView(item.id);
                setActiveProblemId(null);
                if (item.id !== "mock") setMockProblemId(null);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 18px",
                background: view === item.id ? "var(--panel-alt)" : "transparent",
                border: "none",
                borderLeft: view === item.id ? "2px solid var(--amber)" : "2px solid transparent",
                color: view === item.id ? "var(--text)" : "var(--text-dim)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "var(--font-body)",
                fontSize: 13,
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber)" }}>{item.num}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="sdp-scroll" style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
          {view === "framework" && <FrameworkView />}
          {view === "concepts" && <ConceptsView />}
          {view === "problems" && !activeProblemId && (
            <div>
              <SectionHeader
                eyebrow="02 / PROBLEM SET"
                title={`${total} interview problems`}
                sub="Classic product designs, infra primitives, marketplaces, media, payments, and AI systems reported across FAANG and startup interviews."
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
              <ProblemListView data={data} onOpen={setActiveProblemId} filtered={filtered} />
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
          {view === "progress" && (
            <ProgressView
              data={data}
              onOpen={(id) => {
                setView("problems");
                setActiveProblemId(id);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
