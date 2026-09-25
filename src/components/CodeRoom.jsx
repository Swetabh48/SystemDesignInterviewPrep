import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, FileText, Mic, Square, X } from "lucide-react";
import { LLD_FRAMEWORK_STEPS } from "../data/lldFramework.js";
import { useInterviewMedia } from "../hooks/useInterviewMedia.js";
import CodeEditorBoard from "./CodeEditorBoard.jsx";
import GazeGuard from "./GazeGuard.jsx";
import PipCamera from "./PipCamera.jsx";

function roomBtn(active) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    borderRadius: 0,
    border: "1px solid #666",
    background: active ? "#444" : "#333",
    color: "#eee",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "Arial, Helvetica, sans-serif",
  };
}

/** @param {{ problem: object, onEnd: Function, onLeave: Function, interviewMode?: boolean }} props */
export default function CodeRoom({ problem, onEnd, onLeave, interviewMode = false }) {
  const [notes, setNotes] = useState("");
  const [panel, setPanel] = useState("code");
  const [showPip, setShowPip] = useState(true);
  const [briefOpen, setBriefOpen] = useState(true);
  const [testStats, setTestStats] = useState({ total: 0, passed: 0 });
  const endedRef = useRef(false);
  const codeRef = useRef(problem.starterCode || "");

  const media = useInterviewMedia({ maxSeconds: 3600, autoStart: interviewMode });
  const {
    elapsedSec,
    rmm,
    rss,
    remainingSec,
    timeUp,
    transcript,
    interim,
    listening,
    stream,
    camError,
    micError,
    camLabel,
    camDevices,
    camDeviceId,
    openCamera,
    stopCamera,
    stopSpeech,
  } = media;

  const elapsedMin = elapsedSec / 60;
  const currentPhase =
    LLD_FRAMEWORK_STEPS.find((s) => elapsedMin < s.cumulative) || LLD_FRAMEWORK_STEPS[LLD_FRAMEWORK_STEPS.length - 1];

  const onCodeChange = useCallback(({ code: next }) => {
    if (next) codeRef.current = next;
  }, []);

  const onTestComplete = useCallback((stats) => {
    setTestStats((prev) => {
      if (prev.total === stats.total && prev.passed === stats.passed) return prev;
      return { total: stats.total || 0, passed: stats.passed || 0 };
    });
  }, []);

  function finish(extra = {}) {
    if (endedRef.current) return;
    endedRef.current = true;
    stopCamera();
    stopSpeech();
    onEnd({
      transcript: interviewMode ? transcript : "",
      notes,
      code: codeRef.current,
      elapsedSec,
      testTotal: testStats.total,
      testPassed: testStats.passed,
      interviewMode,
      ...extra,
    });
  }

  function handleGazeFail({ warnings }) {
    if (!interviewMode) return;
    finish({ integrityFail: true, gazeWarnings: warnings, integrityPenalty: 100 });
  }

  useEffect(() => {
    if (timeUp && !endedRef.current) finish({ timeUp: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);

  return (
    <div className={`code-room ${interviewMode ? "interview" : "practice"}`}>
      <header className="code-room-header">
        <div className="code-room-title">
          <div className="code-room-title-main">{problem.title}</div>
          <div className="code-room-title-sub">
            LLD · {interviewMode ? "Interview" : "Practice"} · {currentPhase.title}
            {interviewMode && camLabel ? ` · ${camLabel}` : ""}
          </div>
        </div>
        <div className={`code-room-timer ${remainingSec < 600 ? "urgent" : ""}`}>
          <span className="code-room-timer-label">left</span>
          {rmm}:{rss}
        </div>
        {interviewMode && (
          <>
            <div className={`code-room-pill ${listening ? "live" : "off"}`}>
              <Mic size={14} /> {listening ? "Mic live" : "Mic off"}
            </div>
            <div className={`code-room-pill ${stream ? "live" : "off"}`}>Cam {stream ? "live" : "off"}</div>
            {camDevices.length > 0 && (
              <select
                value={camDeviceId}
                onChange={(e) => openCamera(e.target.value)}
                className="code-room-select"
                title="Camera device"
              >
                {camDevices.map((d, i) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            )}
            {!showPip && (
              <button type="button" onClick={() => setShowPip(true)} style={roomBtn(false)}>
                Show cam
              </button>
            )}
          </>
        )}
        <button type="button" onClick={() => setPanel(panel === "notes" ? "code" : "notes")} style={roomBtn(panel === "notes")}>
          <FileText size={16} /> Notes
        </button>
        <button type="button" onClick={() => finish()} className="code-room-end">
          <Square size={14} /> End & score
        </button>
        <button type="button" onClick={onLeave} style={roomBtn(false)} title="Leave">
          <X size={16} />
        </button>
      </header>

      {interviewMode && (camError || micError) && (
        <div className="code-room-alert">
          <span>{camError || micError}</span>
          {camError && (
            <button type="button" onClick={() => openCamera(camDeviceId || null)}>
              Retry camera
            </button>
          )}
        </div>
      )}

      <div className="code-room-body">
        {panel === "code" && (
          <div className="code-room-brief">
            <button type="button" className="code-room-brief-toggle" onClick={() => setBriefOpen((o) => !o)}>
              <span className="code-room-brief-title">Design {problem.title}</span>
              <span className="code-room-brief-meta">Problem statement</span>
              {briefOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {briefOpen && (
              <div className="code-room-brief-body">
                <p>{problem.prompt}</p>
                {problem.requirements?.length > 0 && (
                  <>
                    <div className="code-room-brief-label">CLARIFY</div>
                    <ul>{problem.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
                  </>
                )}
                {problem.focus?.length > 0 && (
                  <>
                    <div className="code-room-brief-label">FOCUS</div>
                    <ul>{problem.focus.map((r) => <li key={r}>{r}</li>)}</ul>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div
          className="code-room-main"
          style={{ display: panel === "code" ? "flex" : "none", flex: 1, minHeight: 0, height: "100%" }}
        >
          <div className="code-room-test-hud">
            Tests {testStats.passed}/{testStats.total || "…"}
          </div>
          <CodeEditorBoard problem={problem} onCodeChange={onCodeChange} onTestComplete={onTestComplete} />
        </div>
        {panel === "notes" && (
          <textarea
            className="code-room-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Class diagram notes, API sketch, edge cases…"
          />
        )}

        {interviewMode && (
          <div className="code-room-transcript">
            <div className="code-room-transcript-label">LIVE TRANSCRIPT {listening ? "· listening" : ""}</div>
            {transcript || interim ? (
              <>
                {transcript}
                {interim ? <span className="dim"> {interim}</span> : null}
              </>
            ) : (
              <span className="dim">Speak out loud — explain classes and methods as you code.</span>
            )}
          </div>
        )}
      </div>

      <footer className="code-room-footer">
        <span className="code-room-tip-label">TIP</span>
        <span className="code-room-tip">{currentPhase.tip}</span>
        <div className="code-room-phases">
          {LLD_FRAMEWORK_STEPS.map((s) => (
            <div
              key={s.num}
              title={s.title}
              className={`code-room-phase ${currentPhase.num === s.num ? "active" : elapsedSec / 60 >= s.cumulative ? "done" : ""}`}
              style={{ flex: s.minutes }}
            />
          ))}
        </div>
      </footer>

      {interviewMode && showPip && (
        <PipCamera
          stream={stream}
          camError={camError}
          onClose={() => setShowPip(false)}
          onRetry={() => openCamera(camDeviceId || null)}
        />
      )}
      {interviewMode && stream && <GazeGuard stream={stream} enabled={!endedRef.current} onFail={handleGazeFail} />}
    </div>
  );
}
