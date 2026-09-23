import { useCallback, useEffect, useRef, useState } from "react";
import { VideoOff, X } from "lucide-react";

/** Draggable PiP camera preview shared by HLD and LLD rooms. */
export default function PipCamera({ stream, camError, onClose, onRetry }) {
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
      className="pip-camera"
      style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}
      onPointerDown={(e) => {
        if (e.target.closest("[data-pip-btn]") || e.target.closest("[data-pip-resize]")) return;
        drag.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
      }}
    >
      <video ref={bindVideo} muted playsInline autoPlay style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
      {!live && (
        <div className="pip-camera-off">
          <VideoOff size={28} />
          <span>{camError ? "Camera error" : "Starting…"}</span>
        </div>
      )}
      <div className="pip-camera-bar">
        <span>{live ? "LIVE" : "CAM"}</span>
        {camError && onRetry && (
          <button type="button" data-pip-btn onClick={onRetry}>
            Retry
          </button>
        )}
        <button type="button" data-pip-btn onClick={onClose} aria-label="Hide camera">
          <X size={14} />
        </button>
      </div>
      <div
        data-pip-resize
        onPointerDown={(e) => {
          e.stopPropagation();
          resize.current = true;
        }}
      />
    </div>
  );
}
