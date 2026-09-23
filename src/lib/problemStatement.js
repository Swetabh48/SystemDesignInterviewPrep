/**
 * Build the full interview-style problem writeup shown on the board.
 */
export function formatProblemStatement(problem) {
  if (!problem) return "";
  const lines = [
    `DESIGN QUESTION`,
    ``,
    `Design a ${problem.title}`,
    ``,
    `Prompt`,
    problem.prompt,
    ``,
  ];
  if (problem.requirements?.length) {
    lines.push(`Clarify before you design`);
    problem.requirements.forEach((r, i) => lines.push(`${i + 1}. ${r}`));
    lines.push(``);
  }
  if (problem.scale?.length) {
    lines.push(`Scale to estimate`);
    problem.scale.forEach((r, i) => lines.push(`${i + 1}. ${r}`));
    lines.push(``);
  }
  if (problem.focus?.length) {
    lines.push(`Where you'll be probed`);
    problem.focus.forEach((r, i) => lines.push(`${i + 1}. ${r}`));
    lines.push(``);
  }
  lines.push(`Draw your design below. Talk out loud through the framework.`);
  return lines.join("\n");
}

export function problemBriefLines(problem) {
  return {
    title: `Design a ${problem.title}`,
    prompt: problem.prompt,
    clarify: problem.requirements || [],
    scale: problem.scale || [],
    focus: problem.focus || [],
  };
}
