import { Component, memo, useCallback, useEffect, useRef, useState } from "react";

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

function ExcalidrawInner({ onStatsChange }) {
  const [Comp, setComp] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const statsRef = useRef(onStatsChange);
  statsRef.current = onStatsChange;

  // Stable handler — parent timer must NOT recreate this or Excalidraw loops
  const onChange = useCallback((elements) => {
    const visible = (elements || []).filter((el) => !el.isDeleted);
    statsRef.current?.({
      strokeCount: visible.filter((el) => el.type === "freedraw").length,
      shapeCount: visible.filter((el) => el.type !== "freedraw").length,
      elementCount: visible.length,
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("@excalidraw/excalidraw");
        await import("@excalidraw/excalidraw/index.css");
        if (!cancelled) setComp(() => mod.Excalidraw);
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

  if (!Comp) {
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
    <div style={{ width: "100%", height: "100%", background: "#fff" }}>
      <Comp
        onChange={onChange}
        theme="light"
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
        initialData={{
          appState: {
            viewBackgroundColor: "#ffffff",
            currentItemStrokeColor: "#1e1e1e",
            currentItemBackgroundColor: "transparent",
            gridSize: null,
            gridModeEnabled: false,
            zenModeEnabled: false,
            zoom: { value: 1 },
          },
        }}
      />
    </div>
  );
}

function ExcalidrawBoard({ onStatsChange }) {
  return (
    <BoardBoundary>
      <ExcalidrawInner onStatsChange={onStatsChange} />
    </BoardBoundary>
  );
}

export default memo(ExcalidrawBoard);
