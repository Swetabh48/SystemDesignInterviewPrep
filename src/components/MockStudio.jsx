import { useState } from "react";
import { Camera } from "lucide-react";
import { analyzeSession } from "../lib/analyzeSession.js";
import { getSolutions } from "../data/solutions.js";
import LiveRoom from "./LiveRoom.jsx";
import SolutionsList from "./SolutionsList.jsx";

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber)", letterSpacing: "0.08em", marginBottom: 4 }}>
        {eyebrow}
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h1>
      {sub && (
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>{sub}</p>
      )}
    </div>
  );
}

function ScoreBar({ label, value }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "var(--font-mono)", marginBottom: 3 }}>
        <span style={{ color: "var(--text-dim)" }}>{label}</span>
        <span>{value}</span>
      </div>
      <div style={{ height: 5, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: value >= 70 ? "var(--bid)" : value >= 50 ? "var(--amber)" : "var(--ask)",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function MockStudio({
  problems,
  mockProblemId,
  onPickProblem,
  onSaveResult,
  onExit,
  fullPage,
}) {
  const [live, setLive] = useState(false);
  const [ended, setEnded] = useState(false);
  const [rubricChecks, setRubricChecks] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [sessionMeta, setSessionMeta] = useState(null);

  const problem = problems.find((p) => p.id === mockProblemId);

  function beginLive() {
    setRubricChecks(problem.rubric.map(() => false));
    setAnalysis(null);
    setEnded(false);
    setLive(true);
  }

  function handleEnd(meta) {
    setLive(false);
    setSessionMeta(meta);
    const result = analyzeSession({
      problem,
      transcript: meta.transcript,
      notes: meta.notes,
      strokeCount: meta.strokeCount,
      shapeCount: meta.shapeCount,
      elapsedSec: meta.elapsedSec,
      rubricChecks,
    });
    setAnalysis(result);
    setEnded(true);
  }

  function finishSave() {
    const checkedCount = rubricChecks.filter(Boolean).length;
    let status = "attempted";
    if (analysis) {
      if (analysis.overall >= 85) status = "confident";
      else if (analysis.overall >= 55) status = "reviewed";
    } else if (checkedCount === rubricChecks.length && checkedCount > 0) status = "confident";
    else if (checkedCount > 0) status = "reviewed";

    onSaveResult({
      problemId: mockProblemId,
      status,
      notes: [sessionMeta?.notes || "", sessionMeta?.transcript ? `\n--- transcript ---\n${sessionMeta.transcript}` : ""].join(""),
      rubric: rubricChecks,
      score: analysis?.overall ?? null,
      analysis,
    });
  }

  if (live && problem) {
    return (
      <LiveRoom
        problem={problem}
        onEnd={handleEnd}
        onLeave={() => {
          setLive(false);
          onExit();
        }}
      />
    );
  }

  const shell = fullPage
    ? {
        position: "fixed",
        inset: 0,
        zIndex: 40,
        background: "var(--bg, #0A0D10)",
        color: "var(--text, #E7EAEE)",
        overflow: "auto",
        padding: "28px 32px",
      }
    : {};

  if (!mockProblemId) {
    return (
      <div style={shell}>
        <button type="button" onClick={onExit} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", marginBottom: 12, fontSize: 12 }}>
          ← Back to app
        </button>
        <SectionHeader
          eyebrow="03 / MOCK INTERVIEW"
          title="Open a live room"
          sub="Camera, mic, and transcript start automatically. Whiteboard fills the screen; your camera floats bottom-right (drag to move)."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          {problems.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPickProblem(p.id)}
              className="nav-btn"
              style={{
                textAlign: "left",
                background: "var(--panel)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                color: "var(--text)",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--amber)" }}>{p.num}</span>
              <span style={{ fontSize: 13.5, flex: 1 }}>{p.title}</span>
              <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{p.tag}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (ended && analysis) {
    return (
      <div style={shell}>
        <SectionHeader
          eyebrow="03 / SESSION SCORECARD"
          title={problem.title}
          sub={`Graded from what you said (${analysis.stats.wordCount} words), drew, and wrote — not random. Silence scores near zero.`}
        />
        <div style={{ display: "grid", gridTemplateColumns: "minmax(160px, 200px) 1fr", gap: 20, marginBottom: 22 }}>
          <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 10, padding: 18, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>OVERALL</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 700, color: analysis.band.color, lineHeight: 1.1 }}>
              {analysis.overall}
            </div>
            <div style={{ fontSize: 12, color: analysis.band.color, marginTop: 6 }}>{analysis.band.label}</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 10, fontFamily: "var(--font-mono)" }}>
              {analysis.stats.wordCount} words · {Math.floor(analysis.stats.elapsedSec / 60)}m
            </div>
          </div>
          <div>
            <ScoreBar label="Framework coverage" value={analysis.dimensions.framework} />
            <ScoreBar label="Problem-fit keywords" value={analysis.dimensions.problemFit} />
            <ScoreBar label="Rubric / probes" value={analysis.dimensions.rubric} />
            <ScoreBar label="Communication (speech)" value={analysis.dimensions.communication} />
            <ScoreBar label="Whiteboard" value={analysis.dimensions.diagram} />
            <ScoreBar label="Depth signals" value={analysis.dimensions.depth} />
            <ScoreBar label="Time management" value={analysis.dimensions.time} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
          <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--bid)", marginBottom: 8 }}>STRENGTHS</div>
            {analysis.strengths.length ? (
              <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                {analysis.strengths.map((s, i) => (
                  <li key={i} style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.45 }}>
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: 12.5, color: "var(--text-dim)" }}>None yet — speak and draw next time.</p>
            )}
          </div>
          <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ask)", marginBottom: 8 }}>IMPROVE NEXT</div>
            <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {analysis.improvements.map((s, i) => (
                <li key={i} style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.45 }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber)", marginBottom: 8 }}>SELF-CHECK RUBRIC</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {problem.rubric.map((r, i) => (
              <label
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  cursor: "pointer",
                  background: "var(--panel)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "10px 12px",
                }}
              >
                <input
                  type="checkbox"
                  checked={rubricChecks[i]}
                  onChange={(e) => {
                    const next = [...rubricChecks];
                    next[i] = e.target.checked;
                    setRubricChecks(next);
                  }}
                  style={{ accentColor: "var(--bid)" }}
                />
                {r}
              </label>
            ))}
          </div>
        </div>

        <SolutionsList solutions={getSolutions(problem)} />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={finishSave}
            style={{
              background: "var(--bid)",
              color: "#0A0D10",
              border: "none",
              borderRadius: 6,
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save score & finish
          </button>
          <button
            type="button"
            onClick={onExit}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "10px 18px",
              fontSize: 13,
              color: "var(--text-dim)",
              cursor: "pointer",
            }}
          >
            Back without saving
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={shell}>
      <button type="button" onClick={onExit} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", marginBottom: 12, fontSize: 12 }}>
        ← Pick another problem
      </button>
      <SectionHeader eyebrow="03 / READY TO GO LIVE" title={problem.title} sub={problem.prompt} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <span style={{ fontSize: 11, border: "1px solid var(--border)", borderRadius: 4, padding: "2px 8px", color: "var(--text-dim)" }}>{problem.tag}</span>
        <span style={{ fontSize: 11, border: "1px solid var(--border)", borderRadius: 4, padding: "2px 8px", color: "var(--text-dim)" }}>{problem.category}</span>
      </div>
      <ul style={{ margin: "0 0 20px", paddingLeft: 18, color: "var(--text-dim)", fontSize: 13, lineHeight: 1.6 }}>
        <li>Camera + mic + transcript start automatically when you enter.</li>
        <li>Allow camera if the browser asks. Your face floats bottom-right (drag/resize).</li>
        <li>Score is based on transcript + whiteboard + notes — silence = near zero.</li>
      </ul>
      <button
        type="button"
        onClick={beginLive}
        style={{
          background: "var(--amber)",
          color: "#0A0D10",
          border: "none",
          borderRadius: 8,
          padding: "12px 20px",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Camera size={16} /> Enter live mock room
      </button>
    </div>
  );
}
