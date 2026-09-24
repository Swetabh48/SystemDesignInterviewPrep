import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, FileText, Mic, Square, VideoOff, X } from "lucide-react";
import { FRAMEWORK_STEPS } from "../data/framework.js";
import { problemBriefLines } from "../lib/problemStatement.js";
import ExcalidrawBoard from "./ExcalidrawBoard.jsx";
import GazeGuard from "./GazeGuard.jsx";

function scoreDeviceLabel(label = "") {
  const l = label.toLowerCase();
  // Hard-reject virtual cams (your "Swetabh's F36 Windows Virtual Camera" is black)
  if (/virtual|obs|ndi|snap camera|manycam|droidcam|iriun|continuity|nvidia broadcast|xsplit|mmhmm/.test(l)) {
    return -1000;
  }
  let score = 0;
  if (/true vision|hp true|integrated|built-?in|laptop|usb.?camera|logitech|realtek|hd webcam|hd camera/.test(l)) score += 50;
  if (/webcam|camera/.test(l)) score += 5;
  return score;
}

function pickBestCamera(devices) {
  if (!devices?.length) return null;
  const ranked = [...devices].sort((a, b) => scoreDeviceLabel(b.label) - scoreDeviceLabel(a.label));
  // Prefer any non-virtual device even if labels are empty
  const nonVirtual = ranked.filter((d) => scoreDeviceLabel(d.label) > -500);
  return nonVirtual[0] || ranked[0];
}

/** Always-visible draggable camera preview. */
function PipCamera({ stream, camError, onClose, onRetry }) {
  const videoRef = useRef(null);
  const [pos, setPos] = useState(() => ({
    x: typeof window !== "undefined" ? Math.max(16, window.innerWidth - 300) : 40,
    y: typeof window !== "undefined" ? Math.max(60, window.innerHeight - 230) : 40,
  }));
  const [size, setSize] = useState({ w: 260, h: 190 });
  const drag = useRef(null);
  const resize = useRef(null);

  const bindVideo = useCallback(
    (node) => {
      videoRef.current = node;
      if (!node) return;
      if (stream) {
        if (node.srcObject !== stream) node.srcObject = stream;
        node.muted = true;
        node.playsInline = true;
        const play = () => node.play().catch(() => {});
        if (node.readyState >= 2) play();
        else node.onloadedmetadata = play;
      } else {
        node.srcObject = null;
      }
    },
    [stream]
  );

  useEffect(() => {
    const node = videoRef.current;
    if (!node || !stream) return;
    if (node.srcObject !== stream) node.srcObject = stream;
    node.play().catch(() => {});
  }, [stream]);

  useEffect(() => {
    const onMove = (e) => {
      if (drag.current) {
        setPos({
          x: Math.max(8, Math.min(window.innerWidth - size.w - 8, e.clientX - drag.current.ox)),
          y: Math.max(48, Math.min(window.innerHeight - size.h - 8, e.clientY - drag.current.oy)),
        });
      }
      if (resize.current) {
        const nw = Math.max(160, Math.min(420, e.clientX - pos.x));
        setSize({ w: nw, h: Math.max(120, Math.round(nw * 0.75)) });
      }
    };
    const onUp = () => {
      drag.current = null;
      resize.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [pos.x, size.w, size.h]);

  const live = !!(stream && stream.getVideoTracks().some((t) => t.readyState === "live"));

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: 80,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        border: "2px solid #fff",
        background: "#111",
        cursor: "grab",
        userSelect: "none",
      }}
      onPointerDown={(e) => {
        if (e.target.closest("[data-pip-btn]") || e.target.closest("[data-pip-resize]")) return;
        drag.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
      }}
    >
      <video
        ref={bindVideo}
        muted
        playsInline
        autoPlay
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
          background: "#000",
          display: live ? "block" : "none",
        }}
      />
      {!live && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 12,
            textAlign: "center",
            color: "#ccc",
            fontSize: 11,
            lineHeight: 1.4,
          }}
        >
          <VideoOff size={20} />
          {camError || "Starting camera…"}
          {onRetry && (
            <button
              type="button"
              data-pip-btn
              onClick={onRetry}
              style={{
                marginTop: 4,
                background: "#E8A33D",
                color: "#111",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Retry camera
            </button>
          )}
        </div>
      )}
      <button
        type="button"
        data-pip-btn
        title="Hide preview"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 26,
          height: 26,
          borderRadius: 6,
          border: "none",
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <X size={12} />
      </button>
      <div
        data-pip-resize
        onPointerDown={(e) => {
          e.stopPropagation();
          resize.current = true;
        }}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 18,
          height: 18,
          cursor: "nwse-resize",
          background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.85) 50%)",
        }}
      />
    </div>
  );
}

export default function LiveRoom({ problem, onEnd, onLeave, interviewMode = false }) {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [notes, setNotes] = useState("");
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [stream, setStream] = useState(null);
  const [camError, setCamError] = useState("");
  const [micError, setMicError] = useState("");
  const [boardStats, setBoardStats] = useState({ strokeCount: 0, shapeCount: 0 });
  const onBoardStats = useCallback((s) => {
    setBoardStats((prev) => {
      if (
        prev.strokeCount === s.strokeCount &&
        prev.shapeCount === s.shapeCount &&
        prev.elementCount === s.elementCount
      ) {
        return prev;
      }
      return s;
    });
  }, []);
  const [panel, setPanel] = useState("board");
  const [showPip, setShowPip] = useState(true);
  const [camLabel, setCamLabel] = useState("");
  const [camDevices, setCamDevices] = useState([]);
  const [camDeviceId, setCamDeviceId] = useState("");
  const [briefOpen, setBriefOpen] = useState(true);
  const endedRef = useRef(false);

  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const listeningRef = useRef(false);

  const elapsedMin = elapsedSec / 60;
  const currentPhase =
    FRAMEWORK_STEPS.find((s) => elapsedMin < s.cumulative) || FRAMEWORK_STEPS[FRAMEWORK_STEPS.length - 1];
  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
  const ss = String(elapsedSec % 60).padStart(2, "0");

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    let t;
    if (interviewMode) {
      t = window.setTimeout(() => {
        startCamera();
        startSpeech();
      }, 150);
    }

    const releaseOnHide = () => {
      if (document.hidden) stopCamera();
    };
    if (interviewMode) {
      document.addEventListener("visibilitychange", releaseOnHide);
      window.addEventListener("pagehide", stopCamera);
    }

    return () => {
      if (t) window.clearTimeout(t);
      document.removeEventListener("visibilitychange", releaseOnHide);
      window.removeEventListener("pagehide", stopCamera);
      if (timerRef.current) clearInterval(timerRef.current);
      stopCamera();
      stopSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewMode]);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStream(null);
  }

  function stopSpeech() {
    listeningRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    recognitionRef.current = null;
    setListening(false);
  }

  async function openCamera(deviceId) {
    setCamError("");
    stopCamera();
    try {
      // Ask permission with a throwaway stream, then open the preferred device
      {
        const boot = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        boot.getTracks().forEach((t) => t.stop());
      }

      const devices = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "videoinput");
      setCamDevices(devices);

      const hp = devices.find((d) => /true vision|hp true/i.test(d.label || ""));
      const best = deviceId
        ? devices.find((d) => d.deviceId === deviceId) || hp || pickBestCamera(devices)
        : hp || pickBestCamera(devices);

      if (!best) {
        setCamError("No camera found.");
        return;
      }

      let media;
      try {
        media = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: best.deviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (e1) {
        if (e1.name === "NotReadableError" || e1.name === "TrackStartError") throw e1;
        media = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { ideal: best.deviceId } },
          audio: false,
        });
      }

      streamRef.current = media;
      setStream(media);
      setCamDeviceId(best.deviceId);
      setCamLabel(best.label || "Camera");
      setShowPip(true);

      const trackLabel = media.getVideoTracks()[0]?.label || best.label;
      if (/virtual/i.test(trackLabel)) {
        setCamError(`Wrong camera: "${trackLabel}". Pick HP True Vision in the dropdown, then Retry.`);
      } else {
        setCamError("");
      }
    } catch (e) {
      const name = e.name || "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setCamError("Camera blocked — click the camera icon next to the URL → Allow → Retry camera.");
      } else if (name === "NotReadableError" || name === "TrackStartError") {
        setCamError(
          "Camera is in use by another tab/app (Zoom, Teams, Cursor browser, or another localhost tab). Close those, then click Retry camera."
        );
      } else {
        setCamError(e.message || "Camera failed");
      }
      setStream(null);
      setShowPip(true);
    }
  }

  async function startCamera() {
    await openCamera(null);
  }

  async function switchCamera(id) {
    await openCamera(id);
  }

  function startSpeech() {
    setMicError("");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicError("Speech recognition needs Chrome/Edge. Type in Docs if needed.");
      return;
    }
    const rec = new SR();
    recognitionRef.current = rec;
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (event) => {
      let finalChunk = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalChunk += text + " ";
        else interimText += text;
      }
      if (finalChunk) setTranscript((t) => (t + " " + finalChunk).trim());
      setInterim(interimText);
    };
    rec.onerror = (e) => {
      if (e.error !== "aborted" && e.error !== "no-speech") setMicError(`Mic: ${e.error}`);
    };
    rec.onend = () => {
      if (listeningRef.current && recognitionRef.current) {
        try {
          rec.start();
        } catch {
          /* ignore */
        }
      }
    };
    try {
      listeningRef.current = true;
      rec.start();
      setListening(true);
    } catch (e) {
      setMicError(e.message || "Mic failed");
    }
  }

  function finish(extra = {}) {
    if (endedRef.current) return;
    endedRef.current = true;
    onEnd({
      transcript,
      notes,
      strokeCount: boardStats.strokeCount,
      shapeCount: boardStats.shapeCount,
      elapsedSec,
      ...extra,
    });
  }

  function handleGazeFail({ warnings }) {
    if (!interviewMode) return;
    finish({
      integrityFail: true,
      gazeWarnings: warnings,
      integrityPenalty: 100,
    });
  }

  const brief = problemBriefLines(problem);

  return (
    <div className="live-room">
      <div className="live-room-header">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {problem.title}
          </div>
          <div style={{ fontSize: 11, color: "#9aa3ad" }}>
            HLD · {interviewMode ? "Interview" : "Practice"} · {currentPhase.title}
            {interviewMode && camLabel ? ` · ${camLabel}` : ""}
          </div>
        </div>
        <div className="live-room-timer">
          {mm}:{ss}
        </div>
        {interviewMode && (
          <>
            <div className={`code-room-pill ${listening ? "live" : "off"}`}>
              <Mic size={14} /> {listening ? "Mic live" : "Mic off"}
            </div>
            <div className={`code-room-pill ${stream ? "live" : "off"}`}>Cam {stream ? "live" : "off"}</div>
            {camDevices.length > 0 && (
              <select value={camDeviceId} onChange={(e) => switchCamera(e.target.value)} className="code-room-select">
                {camDevices.map((d, i) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            )}
            {!showPip && (
              <button type="button" onClick={() => setShowPip(true)} style={btn(false)}>
                Show cam
              </button>
            )}
          </>
        )}
        <button type="button" onClick={() => setPanel(panel === "docs" ? "board" : "docs")} style={btn(panel === "docs")}>
          <FileText size={16} /> Docs
        </button>
        <button type="button" onClick={finish} className="code-room-end">
          <Square size={14} /> End & score
        </button>
        <button type="button" onClick={onLeave} style={btn(false)} title="Leave">
          <X size={16} />
        </button>
      </div>

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

      <div className="live-room-body">
        {panel === "board" && (
          <div className="code-room-brief">
            <button type="button" className="code-room-brief-toggle" onClick={() => setBriefOpen((o) => !o)}>
              <span className="code-room-brief-title">{brief.title}</span>
              <span className="code-room-brief-meta">Problem statement</span>
              {briefOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {briefOpen && (
              <div className="code-room-brief-body">
                <p style={{ margin: "0 0 10px", fontWeight: 500 }}>{brief.prompt}</p>
                {brief.clarify.length > 0 && (
                  <>
                    <div className="code-room-brief-label">CLARIFY</div>
                    <ul style={{ margin: "0 0 10px", paddingLeft: 18 }}>
                      {brief.clarify.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </>
                )}
                {brief.scale.length > 0 && (
                  <>
                    <div className="code-room-brief-label">SCALE</div>
                    <ul style={{ margin: "0 0 10px", paddingLeft: 18 }}>
                      {brief.scale.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </>
                )}
                {brief.focus.length > 0 && (
                  <>
                    <div className="code-room-brief-label">FOCUS</div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {brief.focus.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, display: panel === "board" ? "block" : "none" }}>
          <ExcalidrawBoard onStatsChange={onBoardStats} problem={problem} />
        </div>
        {panel === "docs" && (
          <textarea
            className="code-room-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Requirements · API · data model · deep-dive notes…"
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
              <span className="dim">Speak out loud — words appear here as you talk.</span>
            )}
          </div>
        )}
      </div>

      <div className="code-room-footer">
        <span className="code-room-tip-label">TIP</span>
        <span className="code-room-tip">{currentPhase.tip}</span>
        <div className="code-room-phases">
          {FRAMEWORK_STEPS.map((s) => (
            <div
              key={s.num}
              title={s.title}
              className={`code-room-phase ${currentPhase.num === s.num ? "active" : elapsedSec / 60 >= s.cumulative ? "done" : ""}`}
              style={{ flex: s.minutes }}
            />
          ))}
        </div>
      </div>

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

function btn(active) {
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
