import { useState } from "react";
import { Code2 } from "lucide-react";
import { analyzeLldSession } from "../lib/analyzeLldSession.js";
import CodeRoom from "./CodeRoom.jsx";

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div className="section-header">
      <div className="section-eyebrow">{eyebrow}</div>
      <h1 className="section-title">{title}</h1>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}

function ScoreBar({ label, value }) {
  const clamped = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div className="score-bar">
      <div className="score-bar-head">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="score-bar-track">
        <div className={`score-bar-fill ${clamped >= 70 ? "good" : clamped >= 50 ? "mid" : "low"}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

export default function LldMockStudio({ problems, problemsState = {}, mockProblemId, onPickProblem, onSaveResult, onExit, fullPage }) {
  const [live, setLive] = useState(false);
  const [interviewMode, setInterviewMode] = useState(false);
  const [ended, setEnded] = useState(false);
  const [rubricChecks, setRubricChecks] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [sessionMeta, setSessionMeta] = useState(null);

  const problem = problems.find((p) => p.id === mockProblemId);

  function beginSession(asInterview) {
    setInterviewMode(asInterview);
    setRubricChecks(problem.rubric.map(() => false));
    setAnalysis(null);
    setEnded(false);
    setLive(true);
  }

  function handleEnd(meta) {
    setLive(false);
    setSessionMeta(meta);
    const result = analyzeLldSession({
      problem,
      transcript: meta.transcript,
      notes: meta.notes,
      code: meta.code,
      elapsedSec: meta.elapsedSec,
      rubricChecks,
      testPassed: meta.testPassed ?? 0,
      testTotal: meta.testTotal ?? 0,
    });

    if (meta.integrityFail) {
      const penalty = meta.integrityPenalty ?? 100;
      result.rawOverall = result.overall;
      result.overall = result.overall - penalty;
      result.integrityFail = true;
      result.integrityPenalty = penalty;
      result.gazeWarnings = meta.gazeWarnings ?? 3;
      result.band = { label: "Integrity fail", color: "var(--ask)" };
      result.improvements = [
        `Gaze integrity: ${meta.gazeWarnings ?? 3} look-away warnings (−${penalty}).`,
        ...(result.improvements || []).slice(0, 4),
      ];
    }

    setAnalysis(result);
    setEnded(true);
  }

  function finishSave() {
    const checkedCount = rubricChecks.filter(Boolean).length;
    const testsAllPass =
      (sessionMeta?.testTotal || 0) > 0 && sessionMeta.testPassed === sessionMeta.testTotal;
    let status = "attempted";
    if (analysis) {
      if (analysis.overall >= 85 || testsAllPass) status = "confident";
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
      <CodeRoom
        problem={problem}
        interviewMode={interviewMode}
        onEnd={handleEnd}
        onLeave={() => {
          setLive(false);
          onExit();
        }}
      />
    );
  }

  const shell = fullPage ? "mock-shell full-page" : "mock-shell";

  if (!mockProblemId) {
    return (
      <div className={shell}>
        <button type="button" className="back-link" onClick={onExit}>← Back to app</button>
        <SectionHeader
          eyebrow="06 / LLD CODE ROOM"
          title="Pick a low-level design question"
          sub="Practice with the sandbox only, or use Interview mode for camera, mic, and gaze checks."
        />
        <div className="problem-pick-list">
          {problems.map((p) => {
            const st = problemsState[p.id];
            const solved = st && (st.status === "confident" || (st.lastScore != null && st.lastScore >= 70));
            return (
              <button
                key={p.id}
                type="button"
                className={`problem-pick-row ${solved ? "solved" : ""}`}
                onClick={() => onPickProblem(p.id)}
              >
                <span className="problem-num">{p.num}</span>
                <span className="problem-name">{p.title}</span>
                <span className="problem-tag">{solved ? "Solved" : p.tag}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (ended && analysis) {
    return (
      <div className={shell}>
        <SectionHeader
          eyebrow="06 / LLD SCORECARD"
          title={problem.title}
          sub={
            analysis.integrityFail
              ? `Ended after ${analysis.gazeWarnings} gaze warnings. Raw ${analysis.rawOverall} − ${analysis.integrityPenalty}.`
              : `Graded from speech (${analysis.stats.wordCount} words), code, tests (${analysis.stats.testPassed}/${analysis.stats.testTotal}).`
          }
        />
        {analysis.integrityFail && (
          <div className="integrity-banner">Integrity penalty −{analysis.integrityPenalty} (3 gaze warnings).</div>
        )}
        <div className="scorecard-grid">
          <div className="scorecard-overall">
            <div className="scorecard-overall-label">OVERALL</div>
            <div className="scorecard-overall-value" style={{ color: analysis.band.color }}>{analysis.overall}</div>
            <div style={{ color: analysis.band.color, fontSize: 12 }}>{analysis.band.label}</div>
            <div className="scorecard-meta">
              {analysis.stats.wordCount} words · {analysis.stats.classCount} classes · {Math.floor(analysis.stats.elapsedSec / 60)}m
            </div>
          </div>
          <div>
            <ScoreBar label="LLD framework" value={analysis.dimensions.framework} />
            <ScoreBar label="OOP structure" value={analysis.dimensions.oop} />
            <ScoreBar label="Problem-fit" value={analysis.dimensions.problemFit} />
            <ScoreBar label="Rubric" value={analysis.dimensions.rubric} />
            <ScoreBar label="Communication" value={analysis.dimensions.communication} />
            <ScoreBar label="Code volume" value={analysis.dimensions.code} />
            <ScoreBar label="Automated tests" value={analysis.dimensions.tests} />
          </div>
        </div>
        <div className="scorecard-columns">
          <div className="panel-card">
            <div className="panel-label good">STRENGTHS</div>
            <ul>{analysis.strengths.length ? analysis.strengths.map((s, i) => <li key={i}>{s}</li>) : <li>Keep coding and talking next time.</li>}</ul>
          </div>
          <div className="panel-card">
            <div className="panel-label warn">IMPROVE NEXT</div>
            <ul>{analysis.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        </div>
        <div className="rubric-block">
          <div className="panel-label accent">SELF-CHECK RUBRIC</div>
          {problem.rubric.map((r, i) => (
            <label key={i} className="rubric-row">
              <input
                type="checkbox"
                checked={rubricChecks[i]}
                onChange={(e) => {
                  const next = [...rubricChecks];
                  next[i] = e.target.checked;
                  setRubricChecks(next);
                }}
              />
              {r}
            </label>
          ))}
        </div>
        <div className="action-row">
          <button type="button" className="btn-primary" onClick={finishSave}>Save score & finish</button>
          <button type="button" className="btn-ghost" onClick={onExit}>Back without saving</button>
        </div>
      </div>
    );
  }

  return (
    <div className={shell}>
      <button type="button" className="back-link" onClick={() => onPickProblem(null)}>← Pick another question</button>
      <SectionHeader eyebrow="06 / READY TO CODE" title={problem.title} sub={problem.prompt} />
      <div className="tag-row">
        <span className="tag">{problem.tag}</span>
        <span className="tag">{problem.category}</span>
        <span className="tag">{problem.source}</span>
      </div>
      <ul className="ready-list">
        <li><strong>Practice</strong> — sandbox + timer only. No camera, mic, or gaze.</li>
        <li><strong>Interview</strong> — camera, mic, transcript, and gaze (3 warnings → −100).</li>
        <li>Hidden Jest tests run against solution.ts.</li>
      </ul>
      <div className="action-row">
        <button type="button" className="btn-accent-lg" onClick={() => beginSession(false)}>
          <Code2 size={16} /> Practice (no camera)
        </button>
        <button type="button" className="btn-primary" onClick={() => beginSession(true)}>
          Interview mode
        </button>
      </div>
    </div>
  );
}
