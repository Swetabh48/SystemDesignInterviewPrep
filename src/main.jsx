import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import SystemDesignPrep from "./SystemDesignPrep.jsx";
import "./index.css";

class RootBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: "system-ui", background: "#fff", minHeight: "100vh", color: "#111" }}>
          <h1>App error</h1>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(this.state.error?.stack || this.state.error)}</pre>
          <button type="button" onClick={() => location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootBoundary>
      <SystemDesignPrep />
    </RootBoundary>
  </StrictMode>
);
