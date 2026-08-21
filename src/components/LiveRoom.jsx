import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Mic, Square, VideoOff, X } from "lucide-react";
import { FRAMEWORK_STEPS } from "../data/framework.js";
import ExcalidrawBoard from "./ExcalidrawBoard.jsx";

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

export default function LiveRoom({ problem, onEnd, onLeave }) {
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
    const t = window.setTimeout(() => {
      startCamera();
      startSpeech();
    }, 150);

    const releaseOnHide = () => {
      if (document.hidden) stopCamera();
    };
    document.addEventListener("visibilitychange", releaseOnHide);
    window.addEventListener("pagehide", stopCamera);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("visibilitychange", releaseOnHide);
      window.removeEventListener("pagehide", stopCamera);
      if (timerRef.current) clearInterval(timerRef.current);
      stopCamera();
      stopSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function finish() {
    onEnd({
      transcript,
      notes,
      strokeCount: boardStats.strokeCount,
      shapeCount: boardStats.shapeCount,
      elapsedSec,
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        color: "#111",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          height: 52,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 14px",
          background: "#111317",
          color: "#fff",
          borderBottom: "1px solid #2a2f36",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {problem.title}
          </div>
          <div style={{ fontSize: 11, color: "#9aa3ad" }}>
            {currentPhase.num} · {currentPhase.title}
            {camLabel ? ` · ${camLabel}` : ""}
          </div>
        </div>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 22, fontWeight: 600, color: "#E8A33D" }}>
          {mm}:{ss}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: 8,
            background: listening ? "rgba(63,182,139,0.15)" : "#2a1f1a",
            color: listening ? "#3FB68B" : "#ffb4a8",
            fontSize: 12,
          }}
        >
          <Mic size={14} /> {listening ? "Mic live" : "Mic off"}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: 8,
            background: stream ? "rgba(63,182,139,0.15)" : "#2a1f1a",
            color: stream ? "#3FB68B" : "#ffb4a8",
            fontSize: 12,
          }}
        >
          Cam {stream ? "live" : "off"}
        </div>
        {camDevices.length > 0 && (
          <select
            value={camDeviceId}
            onChange={(e) => switchCamera(e.target.value)}
            title="Pick HP True Vision — not Virtual Camera"
            style={{
              maxWidth: 220,
              background: "#1a1d21",
              color: "#e7eaee",
              border: "1px solid #2a2f36",
              borderRadius: 8,
              padding: "7px 8px",
              fontSize: 12,
            }}
          >
            {camDevices.map((d, i) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Camera ${i + 1}`}
                {/virtual/i.test(d.label || "") ? " (avoid)" : ""}
              </option>
            ))}
          </select>
        )}
        <button type="button" onClick={() => setPanel(panel === "docs" ? "board" : "docs")} style={btn(panel === "docs")}>
          <FileText size={16} /> Docs
        </button>
        {!showPip && (
          <button type="button" onClick={() => setShowPip(true)} style={btn(false)}>
            Show cam
          </button>
        )}
        <button
          type="button"
          onClick={finish}
          style={{ ...btn(false), background: "#E2664A", color: "#fff", border: "none" }}
        >
          <Square size={14} /> End & score
        </button>
        <button type="button" onClick={onLeave} style={btn(false)} title="Leave">
          <X size={16} />
        </button>
      </div>

      {(camError || micError) && (
        <div
          style={{
            padding: "10px 14px",
            background: "#3a1f1a",
            color: "#ffb4a8",
            fontSize: 13,
            lineHeight: 1.45,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span style={{ flex: 1 }}>{camError || micError}</span>
          {camError && (
            <button
              type="button"
              onClick={() => openCamera(camDeviceId || null)}
              style={{
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

      <div style={{ flex: 1, minHeight: 0, position: "relative", background: "#fff" }}>
        <div style={{ position: "absolute", inset: 0, display: panel === "board" ? "block" : "none" }}>
          <ExcalidrawBoard onStatsChange={onBoardStats} />
        </div>
        {panel === "docs" && (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Requirements · API · data model · deep-dive notes…"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              padding: "24px 28px",
              fontSize: 15,
              lineHeight: 1.6,
              fontFamily: "IBM Plex Mono, ui-monospace, monospace",
              color: "#212529",
              background: "#fff",
            }}
          />
        )}

        {/* Transcript always on */}
        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            width: 340,
            maxHeight: 200,
            overflow: "auto",
            background: "rgba(17,19,23,0.94)",
            color: "#d0d5db",
            borderRadius: 10,
            padding: 12,
            fontSize: 12,
            lineHeight: 1.45,
            zIndex: 40,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: "0.06em", color: "#E8A33D", marginBottom: 6 }}>
            LIVE TRANSCRIPT {listening ? "· listening" : ""}
          </div>
          {transcript || interim ? (
            <>
              {transcript}
              {interim ? <span style={{ opacity: 0.6 }}> {interim}</span> : null}
            </>
          ) : (
            <span style={{ color: "#8B96A3" }}>Speak out loud — words appear here as you talk.</span>
          )}
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: "8px 14px",
          background: "#111317",
          borderTop: "1px solid #2a2f36",
          fontSize: 12,
          color: "#9aa3ad",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <span style={{ color: "#E8A33D", fontFamily: "IBM Plex Mono, monospace" }}>TIP</span>
        <span style={{ flex: 1 }}>{currentPhase.tip}</span>
        <div style={{ display: "flex", gap: 2, width: 160 }}>
          {FRAMEWORK_STEPS.map((s) => (
            <div
              key={s.num}
              title={s.title}
              style={{
                flex: s.minutes,
                height: 4,
                borderRadius: 2,
                background:
                  currentPhase.num === s.num
                    ? "#E8A33D"
                    : elapsedSec / 60 >= s.cumulative
                      ? "#3FB68B"
                      : "#2a2f36",
              }}
            />
          ))}
        </div>
      </div>

      {showPip && (
        <PipCamera
          stream={stream}
          camError={camError}
          onClose={() => setShowPip(false)}
          onRetry={() => openCamera(camDeviceId || null)}
        />
      )}
    </div>
  );
}

function btn(active) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 12px",
    borderRadius: 8,
    border: "1px solid #2a2f36",
    background: active ? "#2a3340" : "#1a1d21",
    color: active ? "#E8A33D" : "#c5ccd4",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  };
}
