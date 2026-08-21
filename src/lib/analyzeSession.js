import { FRAMEWORK_STEPS } from "../data/framework.js";

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

/**
 * Honest grader: no free baseline points. Silence / empty sessions score near zero.
 */
export function analyzeSession({
  problem,
  transcript = "",
  notes = "",
  strokeCount = 0,
  shapeCount = 0,
  elapsedSec = 0,
  rubricChecks = [],
}) {
  const spokenOnly = normalize(transcript);
  const notesOnly = normalize(notes);
  const spoken = normalize(`${transcript}\n${notes}`);
  const wordCount = spokenOnly.split(/\s+/).filter(Boolean).length;
  const noteWords = notesOnly.split(/\s+/).filter(Boolean).length;
  const minutesSpoken = Math.max(1, Math.round(elapsedSec / 60));

  // Empty session short-circuit — do not invent points
  if (wordCount < 5 && noteWords < 8 && strokeCount + shapeCount === 0) {
    return {
      overall: 0,
      band: scoreBand(0),
      dimensions: {
        framework: 0,
        problemFit: 0,
        rubric: 0,
        communication: 0,
        diagram: 0,
        depth: 0,
        time: elapsedSec < 60 ? 0 : 5,
      },
      phaseHits: FRAMEWORK_STEPS.map((s) => ({ num: s.num, title: s.title, covered: false, hits: [], weight: s.minutes })),
      keywordHits: [],
      rubric: (problem.rubric || []).map((item, i) => ({
        item,
        checked: !!rubricChecks[i],
        inferred: false,
        pass: !!rubricChecks[i],
      })),
      stats: { wordCount, elapsedSec, strokeCount, shapeCount, talkRate: 0 },
      strengths: [],
      improvements: [
        "No speech was captured. Talk out loud through clarify → estimate → API → design.",
        "Draw the architecture on the whiteboard while you explain.",
        "Write requirements / API notes in Docs if the mic misses words.",
      ],
    };
  }

  const phaseHits = FRAMEWORK_STEPS.map((step) => {
    const hits = countMatches(spoken, step.speechHints);
    return {
      num: step.num,
      title: step.title,
      covered: hits.length >= 1,
      hits,
      weight: step.minutes,
    };
  });
  const phasesCovered = phaseHits.filter((p) => p.covered).length;
  const frameworkScore = Math.round((phasesCovered / FRAMEWORK_STEPS.length) * 100);

  const keywordHits = countMatches(spoken, problem.keywords || []);
  const keywordTarget = Math.max(4, Math.ceil((problem.keywords || []).length * 0.35));
  const keywordScore = Math.min(100, Math.round((keywordHits.length / keywordTarget) * 100));

  const rubric = (problem.rubric || []).map((item, i) => {
    const checked = !!rubricChecks[i];
    const itemWords = normalize(item)
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 4)
      .slice(0, 6);
    const inferred = wordCount >= 20 && itemWords.filter((w) => spoken.includes(w)).length >= 2;
    return { item, checked, inferred, pass: checked || inferred };
  });
  const rubricPassed = rubric.filter((r) => r.pass).length;
  const rubricScore = Math.round((rubricPassed / Math.max(1, rubric.length)) * 100);

  // Communication — start at 0, earn points only from real speech
  let communicationScore = 0;
  const communicationNotes = [];
  if (wordCount < 5) {
    communicationNotes.push("Mic captured almost no speech — speak the design out loud.");
  } else if (wordCount < 40) {
    communicationScore = 15;
    communicationNotes.push("Too little spoken content for an interview signal.");
  } else if (wordCount < 120) {
    communicationScore = 40;
    communicationNotes.push("Thin transcript. Aim for continuous narration through each phase.");
  } else if (wordCount < 250) {
    communicationScore = 65;
  } else {
    communicationScore = 80;
  }

  const talkRate = wordCount / minutesSpoken;
  if (wordCount >= 40 && talkRate >= 80 && talkRate <= 170) communicationScore += 10;
  if (talkRate > 200 && wordCount >= 40) {
    communicationScore -= 10;
    communicationNotes.push("Speaking very fast — slow down and use signposts.");
  }

  const structureWords = countMatches(spokenOnly, [
    "first",
    "second",
    "next",
    "then",
    "trade-off",
    "tradeoff",
    "because",
    "for example",
    "on the other hand",
  ]);
  if (structureWords.length >= 4) communicationScore += 10;
  else if (structureWords.length >= 2) communicationScore += 5;
  else if (wordCount >= 40) communicationNotes.push('Add structure: "First clarify… Then estimate… Deep dive on…"');
  communicationScore = Math.max(0, Math.min(100, communicationScore));

  // Diagram — 0 if empty; notes alone don't count as drawing
  let diagramScore = 0;
  const diagramNotes = [];
  const marks = strokeCount + shapeCount;
  if (marks === 0) {
    diagramNotes.push("No whiteboard activity — draw boxes and a request path while you talk.");
  } else if (marks < 4) {
    diagramScore = 25;
    diagramNotes.push("Very sparse diagram. Sketch client → services → cache/DB at minimum.");
  } else if (marks < 10) {
    diagramScore = 50;
  } else if (marks < 25) {
    diagramScore = 75;
  } else {
    diagramScore = 90;
  }

  const depthTerms = countMatches(spoken, [
    "trade-off",
    "tradeoff",
    "consistency",
    "availability",
    "partition",
    "replication",
    "quorum",
    "idempotent",
    "idempotency",
    "failure",
    "failover",
    "hot key",
    "shard",
    "bottleneck",
    "monitoring",
    "observability",
    "backpressure",
    "exactly once",
    "at least once",
    "saga",
    "outbox",
  ]);
  const depthScore = wordCount < 20 ? 0 : Math.min(100, Math.round((depthTerms.length / 8) * 100));

  let timeScore = 0;
  const timeNotes = [];
  if (elapsedSec < 3 * 60) {
    timeScore = 5;
    timeNotes.push("Session far too short for a full design loop.");
  } else if (elapsedSec < 15 * 60) {
    timeScore = 25;
    timeNotes.push("Stopped early. Aim for ~45–60 minutes.");
  } else if (elapsedSec < 35 * 60) {
    timeScore = 55;
  } else if (elapsedSec <= 70 * 60) {
    timeScore = 90;
  } else {
    timeScore = 60;
    timeNotes.push("Ran long — tighten earlier phases so deep dive gets time.");
  }

  // If they barely spoke, cap overall hard — drawing alone isn't an interview
  let overall = Math.round(
    frameworkScore * 0.22 +
      keywordScore * 0.2 +
      rubricScore * 0.22 +
      communicationScore * 0.18 +
      diagramScore * 0.08 +
      depthScore * 0.06 +
      timeScore * 0.04
  );
  if (wordCount < 5) {
    overall = Math.min(overall, Math.round(diagramScore * 0.15 + timeScore * 0.05));
  }

  const improvements = [];
  if (wordCount < 40) improvements.push("Speak continuously — scoring is driven by what the transcript hears.");
  phaseHits
    .filter((p) => !p.covered)
    .slice(0, 3)
    .forEach((p) => improvements.push(`Cover framework step ${p.num} (${p.title}) out loud.`));
  rubric
    .filter((r) => !r.pass)
    .slice(0, 3)
    .forEach((r) => improvements.push(`Rubric gap: ${r.item}`));
  if (keywordHits.length < 3 && wordCount >= 5) {
    improvements.push(
      `Name problem concepts for "${problem.title}" (e.g. ${(problem.keywords || []).slice(0, 4).join(", ")}).`
    );
  }
  if (depthScore < 40 && wordCount >= 40) {
    improvements.push("Name failure modes, consistency, and at least one explicit trade-off.");
  }
  diagramNotes.forEach((n) => improvements.push(n));
  communicationNotes.forEach((n) => improvements.push(n));
  timeNotes.forEach((n) => improvements.push(n));

  const strengths = [];
  if (frameworkScore >= 75) strengths.push("Strong coverage of the interview framework phases.");
  if (keywordScore >= 70) strengths.push("Used problem-relevant technical vocabulary.");
  if (rubricScore >= 75) strengths.push("Hit most self-check / interviewer probe points.");
  if (diagramScore >= 70) strengths.push("Whiteboard used to support the explanation.");
  if (depthScore >= 70) strengths.push("Discussed distributed-systems depth (trade-offs / failures).");
  if (communicationScore >= 70) strengths.push("Clear verbal structure and adequate talk time.");
  if (!strengths.length && overall > 0) strengths.push("Some signal captured — keep iterating with the rubric.");

  return {
    overall,
    band: scoreBand(overall),
    dimensions: {
      framework: frameworkScore,
      problemFit: keywordScore,
      rubric: rubricScore,
      communication: communicationScore,
      diagram: diagramScore,
      depth: depthScore,
      time: timeScore,
    },
    phaseHits,
    keywordHits,
    rubric,
    stats: {
      wordCount,
      elapsedSec,
      strokeCount,
      shapeCount,
      talkRate: Math.round(talkRate),
    },
    strengths: strengths.slice(0, 5),
    improvements: [...new Set(improvements)].slice(0, 8),
  };
}
