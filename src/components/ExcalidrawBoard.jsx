import { Component, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatProblemStatement } from "../lib/problemStatement.js";

class BoardBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    console.error("Excalidraw board error:", error);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, color: "#c92a2a", fontFamily: "system-ui", background: "#fff", height: "100%" }}>
          <h2 style={{ marginTop: 0 }}>Whiteboard failed to load</h2>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{String(this.state.error?.message || this.state.error)}</pre>
          <button type="button" onClick={() => this.setState({ error: null })} style={{ marginTop: 12, padding: "8px 14px" }}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ExcalidrawInner({ onStatsChange, problem }) {
  const [Comp, setComp] = useState(null);
  const [convert, setConvert] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [boardTheme, setBoardTheme] = useState(() =>
    document.documentElement.closest("[data-theme]")?.getAttribute("data-theme") === "dark" ||
    document.querySelector(".app-root")?.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light"
  );
  const statsRef = useRef(onStatsChange);
  statsRef.current = onStatsChange;

  useEffect(() => {
    const root = document.querySelector(".app-root");
    if (!root) return;
    const sync = () => setBoardTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const onChange = useCallback((elements) => {
    const visible = (elements || []).filter((el) => !el.isDeleted);
    statsRef.current?.({
      strokeCount: visible.filter((el) => el.type === "freedraw").length,
      shapeCount: visible.filter((el) => el.type !== "freedraw").length,
      elementCount: visible.length,
    });
  }, []);

  const initialData = useMemo(() => {
    const statement = formatProblemStatement(problem);
    let elements = [];
    if (convert && statement) {
      try {
        elements = convert([
          {
            type: "text",
            x: 48,
            y: 36,
            text: statement,
            fontSize: 18,
            strokeColor: "#1e1e1e",
          },
        ]);
      } catch (e) {
        console.warn("Could not seed Excalidraw text", e);
      }
    }
    return {
      elements,
      appState: {
        viewBackgroundColor: "#ffffff",
        currentItemStrokeColor: "#1e1e1e",
        currentItemBackgroundColor: "transparent",
        gridSize: null,
        gridModeEnabled: false,
        zenModeEnabled: false,
        zoom: { value: 1 },
        scrollX: 0,
        scrollY: 0,
      },
    };
  }, [problem, convert]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("@excalidraw/excalidraw");
        await import("@excalidraw/excalidraw/index.css");
        if (!cancelled) {
          if (typeof mod.convertToExcalidrawElements === "function") {
            setConvert(() => mod.convertToExcalidrawElements);
          } else {
            setConvert(() => (skeleton) =>
              (skeleton || []).map((s, i) => ({
                id: `seed-${i}`,
                type: "text",
                x: s.x ?? 48,
                y: s.y ?? 36,
                width: 720,
                height: 400,
                angle: 0,
                strokeColor: s.strokeColor || "#1e1e1e",
                backgroundColor: "transparent",
                fillStyle: "solid",
                strokeWidth: 1,
                strokeStyle: "solid",
                roughness: 0,
                opacity: 100,
                groupIds: [],
                frameId: null,
                roundness: null,
                seed: 1 + i,
                version: 1,
                versionNonce: 1 + i,
                isDeleted: false,
                boundElements: null,
                updated: Date.now(),
                link: null,
                locked: false,
                text: s.text || "",
                fontSize: s.fontSize || 18,
                fontFamily: 1,
                textAlign: "left",
                verticalAlign: "top",
                containerId: null,
                originalText: s.text || "",
                lineHeight: 1.25,
                autoResize: true,
              }))
            );
          }
          setComp(() => mod.Excalidraw);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setLoadError(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loadError) {
    return (
      <div style={{ padding: 24, color: "#c92a2a", background: "#fff", height: "100%", fontFamily: "system-ui" }}>
        <h2 style={{ marginTop: 0 }}>Could not load Excalidraw</h2>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{String(loadError.message || loadError)}</pre>
      </div>
    );
  }

  if (!Comp || !convert) {
    return (
      <div
        style={{
          height: "100%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#868e96",
        }}
      >
        Loading Excalidraw…
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", background: boardTheme === "dark" ? "#1e1e1e" : "#fff" }}>
      <Comp
        key={`${problem?.id || "board"}-${boardTheme}`}
        onChange={onChange}
        theme={boardTheme}
        UIOptions={{
          canvasActions: {
            changeViewBackgroundColor: true,
            clearCanvas: true,
            export: { saveFileToDisk: false },
            loadScene: false,
            saveToActiveFile: false,
            toggleTheme: false,
            saveAsImage: true,
          },
        }}
        initialData={initialData}
      />
    </div>
  );
}

function ExcalidrawBoard({ onStatsChange, problem }) {
  return (
    <BoardBoundary>
      <ExcalidrawInner onStatsChange={onStatsChange} problem={problem} />
    </BoardBoundary>
  );
}

export default memo(ExcalidrawBoard);
