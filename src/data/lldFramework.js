/** 60-minute LLD interview loop (common FAANG / product-company format). */
export const LLD_FRAMEWORK_STEPS = [
  {
    num: 1,
    title: "Clarify & scope",
    minutes: 8,
    cumulative: 8,
    detail: "Actors, use cases, constraints, out-of-scope. Confirm single-user vs multi-user, sync vs async.",
    tip: "Ask about scale of objects (floors, users, concurrent requests) before writing code.",
    speechHints: ["clarify", "requirement", "scope", "actor", "use case", "constraint", "assumption"],
  },
  {
    num: 2,
    title: "Core entities & relationships",
    minutes: 12,
    cumulative: 20,
    detail: "Identify nouns → classes. Define enums, value objects, aggregates. Sketch HAS-A / IS-A.",
    tip: "Name classes after domain language — ParkingLot, not Manager.",
    speechHints: ["class", "entity", "interface", "enum", "relationship", "composition", "inheritance"],
  },
  {
    num: 3,
    title: "Public API / main flows",
    minutes: 15,
    cumulative: 35,
    detail: "Walk through 2–3 critical methods end-to-end: happy path + one failure path.",
    tip: "Start with the method the interviewer will ask you to implement live.",
    speechHints: ["method", "api", "flow", "happy path", "edge case", "sequence"],
  },
  {
    num: 4,
    title: "Patterns & extensibility",
    minutes: 12,
    cumulative: 47,
    detail: "Strategy, Factory, Observer, Singleton (when justified). How to add a new vehicle type / payment mode.",
    tip: "Prefer composition over inheritance; mention Open/Closed principle.",
    speechHints: ["pattern", "strategy", "factory", "observer", "singleton", "extensible", "solid"],
  },
  {
    num: 5,
    title: "Concurrency & edge cases",
    minutes: 8,
    cumulative: 55,
    detail: "Thread safety, locking, race conditions, idempotency, validation, null checks.",
    tip: "Even if you skip full impl, name what you'd lock and why.",
    speechHints: ["thread", "lock", "concurrent", "race", "mutex", "synchronized", "validation"],
  },
  {
    num: 6,
    title: "Tests & wrap-up",
    minutes: 5,
    cumulative: 60,
    detail: "Unit-test strategy, mocks, what you'd refactor with more time.",
    tip: "Mention one test case for the trickiest branch.",
    speechHints: ["test", "unit test", "mock", "refactor", "summary"],
  },
];

export const LLD_CONCEPTS = [
  {
    title: "SOLID in 60 seconds",
    points: [
      "Single responsibility — one reason to change per class",
      "Open/closed — extend via interfaces, not edits",
      "Liskov — subtypes must honor base contracts",
      "Interface segregation — small focused interfaces",
      "Dependency inversion — depend on abstractions",
    ],
  },
  {
    title: "Go-to patterns",
    points: [
      "Strategy — interchangeable algorithms (pricing, eviction)",
      "Factory — create objects without exposing logic",
      "Observer — pub/sub for notifications",
      "State — object behavior changes with state",
      "Command — encapsulate requests (undo, queue)",
    ],
  },
  {
    title: "Class design checklist",
    points: [
      "Enums for fixed domains (VehicleType, SpotSize)",
      "Value objects for money, coordinates",
      "Repository interface if persistence mentioned",
      "Service layer for orchestration vs domain logic",
      "DTOs separate from domain entities",
    ],
  },
];
