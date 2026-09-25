import { Component, memo, useCallback, useEffect, useRef, useState } from "react";
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
import { buildStarter, getLanguage, LLD_LANGUAGES } from "../lib/lldLanguages.js";
import { formatSampleTestsForDisplay, getHiddenCount, getVisibleCases } from "../lib/lldTestCases.js";

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

class SandboxBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    console.error("LLD sandbox error:", error);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="code-board-empty" style={{ padding: 24, textAlign: "left" }}>
          <strong>Sandbox hit an error</strong>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, marginTop: 8 }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button type="button" className="btn-primary" style={{ marginTop: 12 }} onClick={() => this.setState({ error: null })}>
            Retry sandbox
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Collect Jest-style tests whether Sandpack returns arrays or nested records. */
function collectTests(block, out = []) {
  if (!block || typeof block !== "object") return out;
  const tests = block.tests;
  if (Array.isArray(tests)) {
    out.push(...tests);
  } else if (tests && typeof tests === "object") {
    out.push(...Object.values(tests));
  }
  const describes = block.describes;
  if (describes && typeof describes === "object") {
    const list = Array.isArray(describes) ? describes : Object.values(describes);
    for (const d of list) collectTests(d, out);
  }
  return out;
}

function summarizeSpecs(specs) {
  try {
    const roots = specs && typeof specs === "object" ? Object.values(specs) : [];
    const all = [];
    for (const root of roots) collectTests(root, all);
    const total = all.length;
    const passed = all.filter((t) => t && t.status === "pass").length;
    return { total, passed };
  } catch (e) {
    console.warn("Failed to summarize test specs", e);
    return { total: 0, passed: 0 };
  }
}

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
      style={{ flex: 1, height: "100%", minHeight: 0 }}
      onComplete={(specs) => {
        try {
          ref.current?.(summarizeSpecs(specs));
        } catch (e) {
          console.warn("onComplete handler failed", e);
        }
      }}
    />
  );
}

function SampleTestsPanel({ problem }) {
  const visible = getVisibleCases(problem);
  const hidden = getHiddenCount(problem);
  return (
    <div className="sample-tests-panel">
      <div className="sample-tests-head">
        Sample tests <span className="dim">(2 shown · {hidden} hidden)</span>
      </div>
      <ol className="sample-tests-list">
        {visible.map((c) => (
          <li key={c.name}>
            <div className="sample-test-name">{c.name}</div>
            <pre className="sample-test-body">{c.body.trim()}</pre>
          </li>
        ))}
      </ol>
      <div className="sample-tests-foot">+ {hidden} hidden tests also run (TypeScript / JavaScript).</div>
    </div>
  );
}

function RunBar({ languageId, onLanguageChange }) {
  const { sandpack } = useSandpack();
  const lang = getLanguage(languageId);
  return (
    <div className="sandbox-runbar">
      <span className="sandbox-runbar-label">Sandbox</span>
      <label className="sandbox-lang">
        Language
        <select value={languageId} onChange={(e) => onLanguageChange(e.target.value)}>
          {LLD_LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
              {l.runnable ? "" : " (edit only)"}
            </option>
          ))}
        </select>
      </label>
      {lang.runnable ? (
        <>
          <button type="button" onClick={() => sandpack.runSandpack()}>
            Run tests
          </button>
          <button type="button" className="ghost" onClick={() => sandpack.dispatch({ type: "refresh" })}>
            Refresh
          </button>
        </>
      ) : (
        <span className="sandbox-runbar-note">Automated tests run in TypeScript / JavaScript only.</span>
      )}
    </div>
  );
}

function SandpackWorkspace({ problem, languageId, onLanguageChange, onCodeChange, onTestComplete }) {
  const files = buildSandpackFiles(problem, languageId);
  const options = getSandpackOptions(problem, languageId);
  const lang = getLanguage(languageId);

  return (
    <SandpackProvider
      key={`${problem.id}-${languageId}`}
      template={lang.sandpackTemplate || "test-ts"}
      theme={sandpackTheme}
      files={files}
      options={options}
      style={{ height: "100%" }}
    >
      <CodeSync onCodeChange={onCodeChange} />
      <div className="sandbox-root" style={{ height: "100%", minHeight: 0 }}>
        <RunBar languageId={languageId} onLanguageChange={onLanguageChange} />
        <SampleTestsPanel problem={problem} />
        <div className="sandbox-workarea" style={{ flex: 1, minHeight: 0, height: "100%" }}>
          <SandpackLayout className="sandbox-layout" style={{ height: "100%", flex: 1, border: "none", borderRadius: 0 }}>
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

function StaticLanguageEditor({ problem, languageId, onLanguageChange, onCodeChange }) {
  const lang = getLanguage(languageId);
  const [code, setCode] = useState(() => buildStarter(problem, languageId));

  useEffect(() => {
    const next = buildStarter(problem, languageId);
    setCode(next);
    onCodeChange?.({ code: next });
  }, [problem.id, languageId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="sandbox-root" style={{ height: "100%", minHeight: 0 }}>
      <div className="sandbox-runbar">
        <span className="sandbox-runbar-label">Sandbox · {lang.label}</span>
        <label className="sandbox-lang">
          Language
          <select value={languageId} onChange={(e) => onLanguageChange(e.target.value)}>
            {LLD_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
                {l.runnable ? "" : " (edit only)"}
              </option>
            ))}
          </select>
        </label>
        <span className="sandbox-runbar-note">Switch to TypeScript or JavaScript to run automated tests.</span>
      </div>
      <SampleTestsPanel problem={problem} />
      <div className="static-editor-wrap">
        <div className="static-editor-meta">
          solution.{lang.ext} · sample tests below for reference
        </div>
        <textarea
          className="static-code-editor"
          value={code}
          spellCheck={false}
          onChange={(e) => {
            setCode(e.target.value);
            onCodeChange?.({ code: e.target.value });
          }}
        />
        <pre className="static-sample-block">{formatSampleTestsForDisplay(problem)}</pre>
      </div>
    </div>
  );
}

function CodeEditorBoard({ problem, onCodeChange, onTestComplete }) {
  const [languageId, setLanguageId] = useState("typescript");
  const onChangeRef = useRef(onCodeChange);
  onChangeRef.current = onCodeChange;
  const stableOnChange = useCallback((payload) => onChangeRef.current?.(payload), []);
  const onTestRef = useRef(onTestComplete);
  onTestRef.current = onTestComplete;
  const stableOnTest = useCallback((stats) => onTestRef.current?.(stats), []);

  if (!problem) {
    return (
      <div className="code-board-empty">
        <span>Select an LLD question to open the sandbox.</span>
      </div>
    );
  }

  const lang = getLanguage(languageId);

  return (
    <div className="code-board">
      <SandboxBoundary>
        {lang.runnable ? (
          <SandpackWorkspace
            problem={problem}
            languageId={languageId}
            onLanguageChange={setLanguageId}
            onCodeChange={stableOnChange}
            onTestComplete={stableOnTest}
          />
        ) : (
          <StaticLanguageEditor
            problem={problem}
            languageId={languageId}
            onLanguageChange={setLanguageId}
            onCodeChange={stableOnChange}
          />
        )}
      </SandboxBoundary>
    </div>
  );
}

export default memo(CodeEditorBoard);
