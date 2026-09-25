/** Languages available in the LLD sandbox. Only TS/JS run Jest in-browser. */

export const LLD_LANGUAGES = [
  { id: "typescript", label: "TypeScript", ext: "ts", runnable: true, sandpackTemplate: "test-ts" },
  { id: "javascript", label: "JavaScript", ext: "js", runnable: true, sandpackTemplate: "test-ts" },
  { id: "java", label: "Java", ext: "java", runnable: false },
  { id: "cpp", label: "C++", ext: "cpp", runnable: false },
  { id: "python", label: "Python", ext: "py", runnable: false },
];

export function getLanguage(id) {
  return LLD_LANGUAGES.find((l) => l.id === id) || LLD_LANGUAGES[0];
}

export function buildStarter(problem, languageId) {
  const title = problem.title || "Solution";
  const prompt = problem.prompt || "";
  const hintLines = (problem.starterHints || []).map((h) => ` * - ${h}`).join("\n");
  const exportHint = problem.exportHint || "export class YourService {}";

  if (languageId === "typescript") {
    return (
      problem.starterCode ||
      `/**
 * ${title}
 * ${prompt}
 *
 * Implement here:${hintLines ? `\n${hintLines}` : ""}
 */

${exportHint}
`
    );
  }

  if (languageId === "javascript") {
    return `/**
 * ${title}
 * ${prompt}
 *
 * Implement here:${hintLines ? `\n${hintLines}` : ""}
 */

${exportHint.replace(/:\s*[A-Za-z0-9_<>,\s|[\].]+(?=\s*[=;{),])/g, "")}
`;
  }

  if (languageId === "java") {
    return `/**
 * ${title}
 * ${prompt}
 *
 * Implement domain classes below.${hintLines ? `\n${hintLines}` : ""}
 */
public class Solution {
    // TODO: implement
}
`;
  }

  if (languageId === "cpp") {
    return `/**
 * ${title}
 * ${prompt}
 *
 * Implement domain classes below.${hintLines ? `\n${hintLines}` : ""}
 */
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // TODO: implement
};
`;
  }

  if (languageId === "python") {
    const pyHints = (problem.starterHints || []).map((h) => `- ${h}`).join("\n") || "- Define your classes";
    return `"""
${title}
${prompt}

Implement domain classes below.
${pyHints}
"""

class Solution:
    pass
`;
  }

  return buildStarter(problem, "typescript");
}
