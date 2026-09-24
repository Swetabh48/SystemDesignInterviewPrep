import { memo, useCallback, useEffect, useRef } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackTests,
  SandpackFileExplorer,
  useActiveCode,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { buildSandpackFiles, getSandpackOptions } from "../lib/lldTemplates.js";

const sandpackTheme = {
  colors: {
    surface1: "#1e1e1e",
    surface2: "#252526",
    surface3: "#2d2d2d",
    clickable: "#cccccc",
    base: "#ffffff",
    disabled: "#6e7681",
    hover: "#f0f6fc",
    accent: "#cc8800",
  },
  syntax: {
    plain: "#d4d4d4",
    comment: { color: "#6a9955", fontStyle: "italic" },
    keyword: { color: "#569cd6" },
    definition: { color: "#4ec9b0" },
    punctuation: { color: "#d4d4d4" },
    property: { color: "#9cdcfe" },
    tag: { color: "#569cd6" },
    static: { color: "#b5cea8" },
    string: { color: "#ce9178" },
  },
  font: {
    body: "Consolas, 'Courier New', monospace",
    mono: "Consolas, 'Courier New', monospace",
    size: "13px",
    lineHeight: "20px",
  },
};

function CodeSync({ onCodeChange }) {
  const { code } = useActiveCode();
  useEffect(() => {
    onCodeChange?.({ code });
  }, [code, onCodeChange]);
  return null;
}

function TestSync({ onTestComplete }) {
  const ref = useRef(onTestComplete);
  ref.current = onTestComplete;
  return (
    <SandpackTests
      hideTestsAndSupressLogs
      watchMode
      style={{ flex: 1, height: "100%" }}
      onComplete={(specs) => {
        const entries = Object.values(specs || {});
        const total = entries.reduce((n, s) => n + (s.tests?.length || 0), 0);
        const passed = entries.reduce(
          (n, s) => n + (s.tests?.filter((t) => t.status === "pass").length || 0),
          0
        );
        ref.current?.({ total, passed, specs });
      }}
    />
  );
}

function RunBar() {
  const { sandpack } = useSandpack();
  return (
    <div className="sandbox-runbar">
      <span className="sandbox-runbar-label">Sandbox</span>
      <button type="button" onClick={() => sandpack.runSandpack()}>
        Run tests
      </button>
      <button type="button" className="ghost" onClick={() => sandpack.dispatch({ type: "refresh" })}>
        Refresh
      </button>
    </div>
  );
}

function SandpackWorkspace({ problem, onCodeChange, onTestComplete }) {
  const files = buildSandpackFiles(problem);
  const options = getSandpackOptions(problem);

  return (
    <SandpackProvider
      key={problem.id}
      template="test-ts"
      theme={sandpackTheme}
      files={files}
      options={options}
      style={{ height: "100%" }}
    >
      <CodeSync onCodeChange={onCodeChange} />
      <div className="sandbox-root" style={{ height: "100%", minHeight: 0 }}>
        <RunBar />
        <div className="sandbox-workarea" style={{ flex: 1, minHeight: 0, height: "100%" }}>
          <SandpackLayout
            className="sandbox-layout"
            style={{ height: "100%", flex: 1, border: "none", borderRadius: 0 }}
          >
            <SandpackFileExplorer style={{ minWidth: 160, maxWidth: 200, height: "100%" }} autoHiddenFiles />
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              showInlineErrors
              wrapContent
              closableTabs
              style={{ flex: 1, height: "100%", minHeight: 0 }}
            />
            <div className="sandbox-side">
              <TestSync onTestComplete={onTestComplete} />
              <SandpackConsole style={{ height: "40%", minHeight: 120 }} showHeader />
            </div>
          </SandpackLayout>
        </div>
      </div>
    </SandpackProvider>
  );
}

function CodeEditorBoard({ problem, onCodeChange, onTestComplete }) {
  const onChangeRef = useRef(onCodeChange);
  onChangeRef.current = onCodeChange;
  const stableOnChange = useCallback((payload) => onChangeRef.current?.(payload), []);

  if (!problem) {
    return (
      <div className="code-board-empty">
        <span>Select an LLD question to open the sandbox.</span>
      </div>
    );
  }

  return (
    <div className="code-board">
      <SandpackWorkspace problem={problem} onCodeChange={stableOnChange} onTestComplete={onTestComplete} />
    </div>
  );
}

export default memo(CodeEditorBoard);
