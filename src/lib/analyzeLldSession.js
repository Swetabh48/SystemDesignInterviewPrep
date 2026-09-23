import { LLD_FRAMEWORK_STEPS } from "../data/lldFramework.js";

function normalize(text) {
  return (text || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function countMatches(haystack, needles) {
  const hits = [];
  for (const needle of needles) {
    const n = needle.toLowerCase();
    if (n && haystack.includes(n)) hits.push(needle);
  }
  return hits;
}

function scoreBand(score) {
  if (score >= 85) return { label: "Strong hire signal", color: "var(--bid)" };
  if (score >= 70) return { label: "Hire / lean hire", color: "var(--bid)" };
  if (score >= 55) return { label: "Mixed — needs polish", color: "var(--amber)" };
  if (score >= 40) return { label: "Below bar", color: "var(--ask)" };
  return { label: "Needs major work", color: "var(--ask)" };
}

function analyzeCode(code = "") {
  const classCount = (code.match(/\bclass\s+\w+/g) || []).length;
  const interfaceCount = (code.match(/\binterface\s+\w+/g) || []).length;
  const enumCount = (code.match(/\benum\s+\w+/g) || []).length;
  const methodCount = (code.match(/\b(public|private|protected)?\s*\w+\s*\([^)]*\)\s*[:{]/g) || []).length;
  const lineCount = code.split("\n").filter((l) => l.trim() && !l.trim().startsWith("//")).length;
  return { classCount, interfaceCount, enumCount, methodCount, lineCount };
}

/** LLD session grader — code structure + speech + rubric + Jest tests. */
export function analyzeLldSession({
  problem,
  transcript = "",
  notes = "",
  code = "",
  elapsedSec = 0,
  rubricChecks = [],
  testPassed = 0,
  testTotal = 0,
}) {
  const spokenOnly = normalize(transcript);
  const spoken = normalize(`${transcript}\n${notes}`);
  const wordCount = spokenOnly.split(/\s+/).filter(Boolean).length;
  const codeStats = analyzeCode(code);

  if (wordCount < 5 && codeStats.lineCount < 8) {
    return {
      overall: 0,
      band: scoreBand(0),
      dimensions: {
        framework: 0,
        oop: 0,
        rubric: 0,
        communication: 0,
        code: 0,
        depth: 0,
        time: elapsedSec < 60 ? 0 : 5,
      },
      stats: { wordCount, elapsedSec, ...codeStats },
      strengths: [],
      improvements: [
        "Talk through clarify → entities → APIs while coding.",
        "Define at least 3 domain classes and one service/orchestrator.",
        "Run the demo in the sandbox console before ending.",
      ],
    };
  }

  const phaseHits = LLD_FRAMEWORK_STEPS.map((step) => {
    const hits = countMatches(spoken, step.speechHints);
    return { num: step.num, title: step.title, covered: hits.length >= 1, hits };
  });
  const frameworkScore = Math.round((phaseHits.filter((p) => p.covered).length / LLD_FRAMEWORK_STEPS.length) * 100);

  const keywordHits = countMatches(spoken + " " + normalize(code), problem.keywords || []);
  const keywordTarget = Math.max(4, Math.ceil((problem.keywords || []).length * 0.3));
  const problemFit = Math.min(100, Math.round((keywordHits.length / keywordTarget) * 100));

  const oopScore = Math.min(
    100,
    codeStats.classCount * 18 + codeStats.interfaceCount * 12 + codeStats.enumCount * 8 + Math.min(30, codeStats.methodCount * 3)
  );

  const codeScore = Math.min(100, Math.round(codeStats.lineCount * 1.2 + codeStats.classCount * 10));

  const rubric = (problem.rubric || []).map((item, i) => {
    const checked = !!rubricChecks[i];
    const itemWords = normalize(item).split(/[^a-z0-9]+/).filter((w) => w.length > 4).slice(0, 6);
    const inferred = wordCount >= 15 && itemWords.filter((w) => spoken.includes(w)).length >= 2;
    return { item, checked, inferred, pass: checked || inferred };
  });
  const rubricScore = Math.round((rubric.filter((r) => r.pass).length / Math.max(1, rubric.length)) * 100);

  const talkRate = wordCount / Math.max(1, elapsedSec / 60);
  const communicationScore = Math.min(100, Math.round(Math.min(talkRate / 80, 1) * 70 + (wordCount > 80 ? 30 : wordCount > 30 ? 15 : 0)));

  const depthScore = Math.min(100, countMatches(spoken, ["solid", "pattern", "strategy", "factory", "thread", "lock", "edge case", "test"]).length * 14);

  const testScore =
    testTotal > 0 ? Math.round((testPassed / testTotal) * 100) : codeStats.lineCount > 20 ? 35 : 0;

  const minutes = elapsedSec / 60;
  let timeScore = 50;
  if (minutes >= 15 && minutes <= 65) timeScore = 85;
  else if (minutes >= 8) timeScore = 65;
  else timeScore = 30;

  const overall = Math.round(
    frameworkScore * 0.16 +
      problemFit * 0.12 +
      oopScore * 0.18 +
      rubricScore * 0.14 +
      communicationScore * 0.12 +
      codeScore * 0.08 +
      depthScore * 0.05 +
      testScore * 0.1 +
      timeScore * 0.05
  );

  const strengths = [];
  if (oopScore >= 60) strengths.push("Solid OOP structure — classes/interfaces present in code.");
  if (frameworkScore >= 55) strengths.push("Walked through multiple LLD framework phases verbally.");
  if (codeScore >= 50) strengths.push("Meaningful amount of implementation on the sandbox.");
  if (communicationScore >= 55) strengths.push("Kept talking — important for LLD interviews.");

  const improvements = [];
  if (oopScore < 50) improvements.push("Add clearer domain classes (nouns from the prompt) and a service orchestrator.");
  if (frameworkScore < 50) improvements.push("Verbalize clarify → entities → APIs → patterns explicitly.");
  if (codeScore < 40) improvements.push("Write more implementation — interviewers expect live coding, not just diagrams.");
  if (testScore >= 80) strengths.push(`Tests passing (${testPassed}/${testTotal}).`);
  if (testTotal > 0 && testScore < 50) improvements.push(`Fix failing tests in the sandbox panel (${testPassed}/${testTotal} passed).`);
  if (communicationScore < 45) improvements.push("Explain each method as you type it.");
  if (rubricScore < 50) improvements.push("Hit rubric items: " + rubric.filter((r) => !r.pass).slice(0, 2).map((r) => r.item).join("; "));
  if (!improvements.length) improvements.push("Next: add edge-case handling and one unit-test example.");

  return {
    overall,
    band: scoreBand(overall),
    dimensions: {
      framework: frameworkScore,
      oop: oopScore,
      problemFit,
      rubric: rubricScore,
      communication: communicationScore,
      code: codeScore,
      depth: depthScore,
      tests: testScore,
      time: timeScore,
    },
    phaseHits,
    keywordHits,
    rubric,
    stats: { wordCount, elapsedSec, talkRate: Math.round(talkRate), testPassed, testTotal, ...codeStats },
    strengths,
    improvements,
  };
}
