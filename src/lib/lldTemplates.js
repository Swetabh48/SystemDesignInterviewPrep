import { getTestCode } from "./lldTestCases.js";

export function lldSolutionStarter(problem) {
  const hints = problem.starterHints || [];
  const hintLines = hints.length ? hints.map((h) => ` * - ${h}`).join("\n") : " * - Export domain classes from this file";
  const exportsHint = problem.exportHint || "export class YourService {}";

  return `/**
 * ${problem.title}
 * ${problem.prompt}
 *
 * Implement here:${hintLines ? `\n${hintLines}` : ""}
 */

${exportsHint}
`;
}

export function buildReadme(problem) {
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
    "Hidden Jest tests run in the **Tests** panel → implement \`solution.ts\` until green.",
    "",
    `_Source: ${problem.source || "Interview prep catalog"}_`,
  ];
  return lines.join("\n");
}

/** CodeSandbox-style file tree: README + solution + hidden tests. */
export function buildSandpackFiles(problem) {
  const solution = problem.starterCode || lldSolutionStarter(problem);
  const tests = getTestCode(problem);

  return {
    "/README.md": {
      code: buildReadme(problem),
      readOnly: true,
    },
    "/solution.ts": {
      code: solution,
      active: true,
    },
    "/solution.test.ts": {
      code: tests,
      hidden: true,
    },
    ...(problem.extraFiles || {}),
  };
}

export function getSandpackOptions(problem) {
  const visible = ["/README.md", "/solution.ts"];
  if (problem.extraVisible) visible.push(...problem.extraVisible);
  return {
    activeFile: "/solution.ts",
    visibleFiles: visible,
    recompileMode: "delayed",
    recompileDelay: 700,
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
