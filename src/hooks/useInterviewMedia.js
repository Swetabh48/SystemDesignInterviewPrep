import { useEffect, useRef, useState } from "react";

function scoreDeviceLabel(label = "") {
  const l = label.toLowerCase();
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
  const nonVirtual = ranked.filter((d) => scoreDeviceLabel(d.label) > -500);
  return nonVirtual[0] || ranked[0];
}

/** Shared camera, mic/transcript, and 60-min timer for mock rooms. */
export function useInterviewMedia({ maxSeconds = 3600, autoStart = true } = {}) {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [stream, setStream] = useState(null);
  const [camError, setCamError] = useState("");
  const [micError, setMicError] = useState("");
  const [camLabel, setCamLabel] = useState("");
  const [camDevices, setCamDevices] = useState([]);
  const [camDeviceId, setCamDeviceId] = useState("");
  const [timeUp, setTimeUp] = useState(false);

  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const listeningRef = useRef(false);

  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
  const ss = String(elapsedSec % 60).padStart(2, "0");
  const remainingSec = Math.max(0, maxSeconds - elapsedSec);
  const rmm = String(Math.floor(remainingSec / 60)).padStart(2, "0");
  const rss = String(remainingSec % 60).padStart(2, "0");

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
          video: { deviceId: { exact: best.deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch (e1) {
        if (e1.name === "NotReadableError" || e1.name === "TrackStartError") throw e1;
        media = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { ideal: best.deviceId } }, audio: false });
      }
      streamRef.current = media;
      setStream(media);
      setCamDeviceId(best.deviceId);
      setCamLabel(best.label || "Camera");
      const trackLabel = media.getVideoTracks()[0]?.label || best.label;
      if (/virtual/i.test(trackLabel)) {
        setCamError(`Wrong camera: "${trackLabel}". Pick HP True Vision in the dropdown, then Retry.`);
      }
    } catch (e) {
      const name = e.name || "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setCamError("Camera blocked — allow in browser bar → Retry camera.");
      } else if (name === "NotReadableError" || name === "TrackStartError") {
        setCamError("Camera in use elsewhere — close Zoom/Teams/other tabs → Retry.");
      } else {
        setCamError(e.message || "Camera failed");
      }
      setStream(null);
    }
  }

  function startSpeech() {
    setMicError("");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicError("Speech recognition needs Chrome/Edge.");
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

  useEffect(() => {
    if (!autoStart) return;
    timerRef.current = setInterval(() => {
      setElapsedSec((s) => {
        const next = s + 1;
        if (next >= maxSeconds) setTimeUp(true);
        return next;
      });
    }, 1000);
    const t = window.setTimeout(() => {
      openCamera(null);
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
  }, [autoStart, maxSeconds]);

  return {
    elapsedSec,
    mm,
    ss,
    remainingSec,
    rmm,
    rss,
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
  };
}

export { pickBestCamera, scoreDeviceLabel };
