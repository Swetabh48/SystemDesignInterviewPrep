import {
  buildFullTestFile,
  getHiddenCount,
  getVisibleCases,
} from "./lldTestCases.js";
import { buildStarter, getLanguage } from "./lldLanguages.js";

export function lldSolutionStarter(problem) {
  return buildStarter(problem, "typescript");
}

export function buildReadme(problem) {
  const visible = getVisibleCases(problem);
  const hidden = getHiddenCount(problem);
  const lines = [
    `# ${problem.title}`,
    "",
    problem.prompt,
    "",
    "## Clarify",
    ...(problem.requirements || []).map((r) => `- ${r}`),
    "",
    "## Focus",
    ...(problem.focus || []).map((r) => `- ${r}`),
    "",
    "## Tests",
    `You can see **2 sample tests**. **${hidden} more are hidden** and still run in TypeScript/JavaScript.`,
    "",
    ...visible.map((c, i) => `${i + 1}. ${c.name}`),
    "",
    `_Source: ${problem.source || "Interview prep catalog"}_`,
  ];
  return lines.join("\n");
}

/**
 * @param {object} problem
 * @param {string} [languageId]
 */
export function buildSandpackFiles(problem, languageId = "typescript") {
  const lang = getLanguage(languageId);
  const ext = lang.ext === "js" ? "js" : "ts";
  const solutionPath = `/solution.${ext}`;
  const solution = buildStarter(problem, languageId);
  const tests = buildFullTestFile(problem, ext);

  return {
    "/README.md": {
      code: buildReadme(problem),
      readOnly: true,
    },
    [solutionPath]: {
      code: solution,
      active: true,
    },
    [`/solution.test.${ext}`]: {
      code: tests,
      hidden: true,
    },
    ...(problem.extraFiles || {}),
  };
}

export function getSandpackOptions(problem, languageId = "typescript") {
  const lang = getLanguage(languageId);
  const ext = lang.ext === "js" ? "js" : "ts";
  const solutionPath = `/solution.${ext}`;
  const visible = ["/README.md", solutionPath];
  if (problem.extraVisible) visible.push(...problem.extraVisible);
  return {
    activeFile: solutionPath,
    visibleFiles: visible,
    recompileMode: "delayed",
    recompileDelay: 900,
    autorun: true,
    autoReload: true,
  };
}

/** @deprecated use lldSolutionStarter */
export function lldStarter(title, hints = []) {
  return lldSolutionStarter({ title, prompt: "", starterHints: hints });
}

export function buildSandpackFilesLegacy(problem) {
  return buildSandpackFiles(problem);
}
