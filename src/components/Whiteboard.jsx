import { useCallback, useEffect, useRef, useState } from "react";

/**
 * White Excalidraw-style board — no grid, simple tools, pointer-friendly.
 */
export default function Whiteboard({ onStatsChange, className }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#1e1e1e");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const drawing = useRef(false);
  const start = useRef(null);
  const elements = useRef([]); // {type, ...}
  const current = useRef(null);
  const dprRef = useRef(1);

  const report = useCallback(() => {
    const strokes = elements.current.filter((e) => e.type === "path").length;
    const shapes = elements.current.filter((e) => e.type !== "path").length;
    onStatsChange?.({ strokeCount: strokes, shapeCount: shapes });
  }, [onStatsChange]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = dprRef.current;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    for (const el of elements.current) {
      drawElement(ctx, el);
    }
    if (current.current) drawElement(ctx, current.current);
  }, []);

  function drawElement(ctx, el) {
    ctx.save();
    ctx.strokeStyle = el.color;
    ctx.fillStyle = el.color;
    ctx.lineWidth = el.width || 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (el.type === "path" && el.points?.length > 1) {
      ctx.beginPath();
      ctx.moveTo(el.points[0].x, el.points[0].y);
      for (let i = 1; i < el.points.length; i++) {
        ctx.lineTo(el.points[i].x, el.points[i].y);
      }
      ctx.stroke();
    } else if (el.type === "rect") {
      const x = Math.min(el.x1, el.x2);
      const y = Math.min(el.y1, el.y2);
      const rw = Math.abs(el.x2 - el.x1);
      const rh = Math.abs(el.y2 - el.y1);
      ctx.strokeRect(x, y, rw, rh);
    } else if (el.type === "ellipse") {
      const cx = (el.x1 + el.x2) / 2;
      const cy = (el.y1 + el.y2) / 2;
      const rx = Math.abs(el.x2 - el.x1) / 2;
      const ry = Math.abs(el.y2 - el.y1) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (el.type === "arrow") {
      const { x1, y1, x2, y2 } = el;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const head = 14;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - head * Math.cos(angle - 0.35), y2 - head * Math.sin(angle - 0.35));
      ctx.lineTo(x2 - head * Math.cos(angle + 0.35), y2 - head * Math.sin(angle + 0.35));
      ctx.closePath();
      ctx.fill();
    } else if (el.type === "line") {
      ctx.beginPath();
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.stroke();
    } else if (el.type === "text") {
      ctx.font = "600 16px Inter, system-ui, sans-serif";
      ctx.fillText(el.text, el.x, el.y);
    }
    ctx.restore();
  }

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    redraw();
  }, [redraw]);

  useEffect(() => {
    resize();
    const ro = new ResizeObserver(resize);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const onDown = (e) => {
    e.preventDefault();
    const p = pos(e);
    drawing.current = true;
    start.current = p;

    if (tool === "text") {
      const text = window.prompt("Text label:");
      if (text?.trim()) {
        elements.current.push({ type: "text", x: p.x, y: p.y, text: text.trim(), color, width: strokeWidth });
        redraw();
        report();
      }
      drawing.current = false;
      return;
    }

    if (tool === "pen" || tool === "eraser") {
      current.current = {
        type: "path",
        color: tool === "eraser" ? "#ffffff" : color,
        width: tool === "eraser" ? 28 : strokeWidth,
        points: [p],
      };
    } else {
      current.current = {
        type: tool,
        x1: p.x,
        y1: p.y,
        x2: p.x,
        y2: p.y,
        color,
        width: strokeWidth,
      };
    }
  };

  const onMove = (e) => {
    if (!drawing.current || !current.current) return;
    e.preventDefault();
    const p = pos(e);
    if (current.current.type === "path") {
      current.current.points.push(p);
    } else {
      current.current.x2 = p.x;
      current.current.y2 = p.y;
    }
    redraw();
  };

  const onUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (current.current) {
      elements.current.push(current.current);
      current.current = null;
      report();
    }
    redraw();
  };

  const undo = () => {
    elements.current.pop();
    redraw();
    report();
  };

  const clear = () => {
    elements.current = [];
    current.current = null;
    redraw();
    report();
  };

  const tools = [
    { id: "pen", label: "Draw" },
    { id: "rect", label: "Box" },
    { id: "ellipse", label: "Circle" },
    { id: "arrow", label: "Arrow" },
    { id: "line", label: "Line" },
    { id: "text", label: "Text" },
    { id: "eraser", label: "Eraser" },
  ];

  const colors = ["#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00", "#9c36b5"];

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", background: "#fff" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
          padding: "8px 12px",
          borderBottom: "1px solid #e9ecef",
          background: "#f8f9fa",
        }}
      >
        {tools.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTool(t.id)}
            style={{
              border: tool === t.id ? "2px solid #1971c2" : "1px solid #dee2e6",
              background: tool === t.id ? "#e7f5ff" : "#fff",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 500,
              color: "#212529",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
        <div style={{ width: 1, height: 24, background: "#dee2e6", margin: "0 4px" }} />
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: c,
              border: color === c ? "3px solid #1971c2" : "2px solid #fff",
              boxShadow: "0 0 0 1px #ced4da",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#495057", marginLeft: 4 }}>
          Size
          <input
            type="range"
            min={1}
            max={12}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            style={{ width: 80 }}
          />
        </label>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={undo}
            style={{
              border: "1px solid #dee2e6",
              background: "#fff",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 13,
              cursor: "pointer",
              color: "#212529",
            }}
          >
            Undo
          </button>
          <button
            type="button"
            onClick={clear}
            style={{
              border: "1px solid #dee2e6",
              background: "#fff",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 13,
              cursor: "pointer",
              color: "#212529",
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <div ref={wrapRef} style={{ flex: 1, minHeight: 0, position: "relative", background: "#fff" }}>
        <canvas
          ref={canvasRef}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
          style={{ display: "block", width: "100%", height: "100%", touchAction: "none", cursor: tool === "text" ? "text" : "crosshair" }}
        />
      </div>
    </div>
  );
}
