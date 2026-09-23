import { useEffect, useRef, useState } from "react";

const MAX_WARNINGS = 3;
const AWAY_MS = 1400;
const COOLDOWN_MS = 4500;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";

/**
 * Head-pose / gaze proxy from face landmarks.
 * Warns when looking left/right/up/down instead of at the screen.
 */
export default function GazeGuard({ stream, enabled = true, onWarning, onFail }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(0);
  const awaySinceRef = useRef(null);
  const lastWarnAtRef = useRef(0);
  const warningsRef = useRef(0);
  const failedRef = useRef(false);
  const onWarningRef = useRef(onWarning);
  const onFailRef = useRef(onFail);
  onWarningRef.current = onWarning;
  onFailRef.current = onFail;

  const [status, setStatus] = useState("booting");
  const [warnings, setWarnings] = useState(0);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
    video.play().catch(() => {});
  }, [stream]);

  useEffect(() => {
    if (!enabled || !stream) return;
    let cancelled = false;

    (async () => {
      try {
        setStatus("loading face model…");
        const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        if (cancelled) return;
        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });
        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;
        setStatus("watching eyes");
        loop();
      } catch (e) {
        console.warn("GazeGuard init failed", e);
        setStatus("gaze unavailable");
      }
    })();

    function estimateDirection(landmarks) {
      // MediaPipe face mesh indices
      const nose = landmarks[1];
      const leftEye = landmarks[33];
      const rightEye = landmarks[263];
      const brow = landmarks[10];
      const chin = landmarks[152];
      if (!nose || !leftEye || !rightEye || !brow || !chin) return "center";

      const midX = (leftEye.x + rightEye.x) / 2;
      const eyeDist = Math.abs(rightEye.x - leftEye.x) || 0.01;
      // Mirrored selfie cam: positive yaw ≈ user looking to their left (screen right)
      const yaw = (nose.x - midX) / eyeDist;

      const midY = (brow.y + chin.y) / 2;
      const faceH = Math.abs(chin.y - brow.y) || 0.01;
      const pitch = (nose.y - midY) / faceH;

      if (yaw > 0.32) return "left";
      if (yaw < -0.32) return "right";
      if (pitch < -0.22) return "up";
      if (pitch > 0.3) return "down";
      return "center";
    }

    function issueWarning(dir) {
      const now = performance.now();
      if (now - lastWarnAtRef.current < COOLDOWN_MS) return;
      if (failedRef.current) return;
      lastWarnAtRef.current = now;
      awaySinceRef.current = null;
      warningsRef.current += 1;
      const n = warningsRef.current;
      setWarnings(n);
      const msg = `Warning ${n}/${MAX_WARNINGS}: looking ${dir} — face the screen/camera.`;
      setBanner(msg);
      window.setTimeout(() => {
        if (!failedRef.current) setBanner(null);
      }, 3500);
      onWarningRef.current?.(n, dir, msg);
      if (n >= MAX_WARNINGS) {
        failedRef.current = true;
        setBanner("Session ended — 3 gaze warnings. Integrity penalty −100.");
        onFailRef.current?.({ warnings: n, reason: "gaze" });
      }
    }

    function loop() {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (cancelled || !video || !landmarker) return;

      if (video.readyState >= 2) {
        try {
          const result = landmarker.detectForVideo(video, performance.now());
          const face = result?.faceLandmarks?.[0];
          if (!face) {
            // No face — treat as looking away after longer threshold
            if (!awaySinceRef.current) awaySinceRef.current = performance.now();
            else if (performance.now() - awaySinceRef.current > AWAY_MS * 1.4) {
              issueWarning("away from camera");
            }
          } else {
            const dir = estimateDirection(face);
            if (dir === "center") {
              awaySinceRef.current = null;
            } else {
              if (!awaySinceRef.current) awaySinceRef.current = performance.now();
              else if (performance.now() - awaySinceRef.current > AWAY_MS) {
                issueWarning(dir);
              }
            }
          }
        } catch {
          /* skip frame */
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      try {
        landmarkerRef.current?.close();
      } catch {
        /* ignore */
      }
      landmarkerRef.current = null;
    };
  }, [stream, enabled]);

  if (!enabled) return null;

  return (
    <>
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none", left: -9999 }}
      />
      <div
        style={{
          position: "fixed",
          top: 58,
          right: 12,
          zIndex: 90,
          background: warnings >= 2 ? "rgba(226,102,74,0.95)" : "rgba(17,19,23,0.9)",
          color: "#fff",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 11,
          fontFamily: "IBM Plex Mono, monospace",
          maxWidth: 280,
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        }}
      >
        <div>Gaze monitor · {status}</div>
        <div style={{ marginTop: 4, color: warnings ? "#ffb4a8" : "#3FB68B" }}>
          Warnings {warnings}/{MAX_WARNINGS}
        </div>
      </div>
      {banner && (
        <div
          style={{
            position: "fixed",
            top: 100,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 95,
            background: "#E2664A",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            maxWidth: "90vw",
            textAlign: "center",
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          }}
        >
          {banner}
        </div>
      )}
    </>
  );
}

export { MAX_WARNINGS };
