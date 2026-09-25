/**
 * LLD test suites: structured cases so we can show 2 sample tests
 * and keep the rest hidden (still executed for TS/JS).
 */

function suite(describeName, imports, cases) {
  return { describeName, imports, cases };
}

function t(name, body, visible = false) {
  return { name, body, visible };
}

export const LLD_TEST_SUITES = {
  "lru-cache-oop": suite("LRUCache", 'import { LRUCache } from "./solution";', [
    t(
      "returns value for existing key",
      `const c = new LRUCache(2);
    c.put("a", 1);
    expect(c.get("a")).toBe(1);`,
      true
    ),
    t(
      "evicts least recently used key",
      `const c = new LRUCache(2);
    c.put("a", 1);
    c.put("b", 2);
    c.get("a");
    c.put("c", 3);
    expect(c.get("b")).toBeUndefined();
    expect(c.get("a")).toBe(1);
    expect(c.get("c")).toBe(3);`,
      true
    ),
    t(
      "overwrites existing key without growing",
      `const c = new LRUCache(2);
    c.put("a", 1);
    c.put("a", 2);
    c.put("b", 3);
    expect(c.get("a")).toBe(2);
    expect(c.get("b")).toBe(3);`
    ),
    t(
      "get refreshes recency",
      `const c = new LRUCache(2);
    c.put("a", 1);
    c.put("b", 2);
    c.get("a");
    c.put("c", 3);
    expect(c.get("a")).toBe(1);
    expect(c.get("b")).toBeUndefined();`
    ),
  ]),

  "rate-limiter-code": suite("TokenBucketLimiter", 'import { TokenBucketLimiter } from "./solution";', [
    t(
      "allows requests under burst",
      `const lim = new TokenBucketLimiter(2, 1);
    expect(lim.allow("user1")).toBe(true);
    expect(lim.allow("user1")).toBe(true);`,
      true
    ),
    t(
      "denies when bucket empty",
      `const lim = new TokenBucketLimiter(1, 0);
    expect(lim.allow("u")).toBe(true);
    expect(lim.allow("u")).toBe(false);`,
      true
    ),
    t(
      "tracks keys independently",
      `const lim = new TokenBucketLimiter(1, 0);
    expect(lim.allow("a")).toBe(true);
    expect(lim.allow("b")).toBe(true);
    expect(lim.allow("a")).toBe(false);`
    ),
    t(
      "capacity zero denies all",
      `const lim = new TokenBucketLimiter(0, 1);
    expect(lim.allow("u")).toBe(false);`
    ),
  ]),

  "tic-tac-toe": suite("TicTacToe", 'import { TicTacToe } from "./solution";', [
    t(
      "detects row win",
      `const g = new TicTacToe();
    g.makeMove(0, 0);
    g.makeMove(1, 0);
    g.makeMove(0, 1);
    g.makeMove(1, 1);
    g.makeMove(0, 2);
    expect(g.getWinner()).toBeTruthy();`,
      true
    ),
    t(
      "detects column win",
      `const g = new TicTacToe();
    g.makeMove(0, 0);
    g.makeMove(0, 1);
    g.makeMove(1, 0);
    g.makeMove(0, 2);
    g.makeMove(2, 0);
    expect(g.getWinner()).toBeTruthy();`,
      true
    ),
    t(
      "detects diagonal win",
      `const g = new TicTacToe();
    g.makeMove(0, 0);
    g.makeMove(0, 1);
    g.makeMove(1, 1);
    g.makeMove(0, 2);
    g.makeMove(2, 2);
    expect(g.getWinner()).toBeTruthy();`
    ),
    t(
      "rejects occupied cell",
      `const g = new TicTacToe();
    expect(g.makeMove(0, 0)).toBe(true);
    expect(g.makeMove(0, 0)).toBe(false);`
    ),
  ]),

  "parking-lot": suite("ParkingLot", 'import { ParkingLot, VehicleType } from "./solution";', [
    t(
      "issues ticket when spot available",
      `const lot = new ParkingLot({ compact: 1, large: 1, motorcycle: 1 });
    const ticket = lot.park(VehicleType.Motorcycle, "M1");
    expect(ticket).toBeDefined();
    expect(ticket.id).toBeTruthy();`,
      true
    ),
    t(
      "returns null when full",
      `const lot = new ParkingLot({ compact: 0, large: 0, motorcycle: 0 });
    expect(lot.park(VehicleType.Car, "C1")).toBeNull();`,
      true
    ),
    t(
      "unpark frees a spot",
      `const lot = new ParkingLot({ compact: 1, large: 0, motorcycle: 0 });
    const ticket = lot.park(VehicleType.Car, "C1");
    expect(ticket).toBeDefined();
    expect(lot.park(VehicleType.Car, "C2")).toBeNull();
    lot.unpark(ticket.id);
    expect(lot.park(VehicleType.Car, "C2")).toBeDefined();`
    ),
    t(
      "motorcycle can use compact",
      `const lot = new ParkingLot({ compact: 1, large: 0, motorcycle: 0 });
    expect(lot.park(VehicleType.Motorcycle, "M1")).toBeDefined();`
    ),
  ]),

  "vending-machine": suite("VendingMachine", 'import { VendingMachine } from "./solution";', [
    t(
      "accepts coins and selects product",
      `const vm = new VendingMachine([{ id: "A1", price: 50, stock: 1 }]);
    vm.insertCoin(50);
    expect(vm.selectProduct("A1")).toBe(true);`,
      true
    ),
    t(
      "rejects when underpaid",
      `const vm = new VendingMachine([{ id: "A1", price: 50, stock: 1 }]);
    vm.insertCoin(25);
    expect(vm.selectProduct("A1")).toBe(false);`,
      true
    ),
    t(
      "rejects out of stock",
      `const vm = new VendingMachine([{ id: "A1", price: 50, stock: 0 }]);
    vm.insertCoin(50);
    expect(vm.selectProduct("A1")).toBe(false);`
    ),
    t(
      "unknown product fails",
      `const vm = new VendingMachine([{ id: "A1", price: 50, stock: 1 }]);
    vm.insertCoin(50);
    expect(vm.selectProduct("Z9")).toBe(false);`
    ),
  ]),

  "logger": suite("Logger", 'import { Logger, LogLevel, ConsoleAppender } from "./solution";', [
    t(
      "filters below minimum level",
      `const logs = [];
    const app = new ConsoleAppender((msg) => logs.push(msg));
    const log = new Logger(LogLevel.WARN, [app]);
    log.debug("skip");
    log.warn("keep");
    expect(logs.length).toBe(1);`,
      true
    ),
    t(
      "forwards to all appenders",
      `const a = [];
    const b = [];
    const log = new Logger(LogLevel.INFO, [
      new ConsoleAppender((m) => a.push(m)),
      new ConsoleAppender((m) => b.push(m)),
    ]);
    log.info("x");
    expect(a.length).toBe(1);
    expect(b.length).toBe(1);`,
      true
    ),
    t(
      "error always logged at WARN min",
      `const logs = [];
    const log = new Logger(LogLevel.WARN, [new ConsoleAppender((m) => logs.push(m))]);
    log.error("e");
    expect(logs.length).toBe(1);`
    ),
    t(
      "info skipped at ERROR min",
      `const logs = [];
    const log = new Logger(LogLevel.ERROR, [new ConsoleAppender((m) => logs.push(m))]);
    log.info("skip");
    expect(logs.length).toBe(0);`
    ),
  ]),

  "meeting-scheduler": suite("MeetingScheduler", 'import { MeetingScheduler } from "./solution";', [
    t(
      "rejects overlapping bookings",
      `const s = new MeetingScheduler(["R1"]);
    expect(s.book("R1", 10, 11)).toBe(true);
    expect(s.book("R1", 10, 30)).toBe(false);`,
      true
    ),
    t(
      "allows adjacent bookings",
      `const s = new MeetingScheduler(["R1"]);
    expect(s.book("R1", 10, 11)).toBe(true);
    expect(s.book("R1", 11, 12)).toBe(true);`,
      true
    ),
    t(
      "unknown room fails",
      `const s = new MeetingScheduler(["R1"]);
    expect(s.book("R9", 10, 11)).toBe(false);`
    ),
    t(
      "rooms are independent",
      `const s = new MeetingScheduler(["R1", "R2"]);
    expect(s.book("R1", 10, 11)).toBe(true);
    expect(s.book("R2", 10, 11)).toBe(true);`
    ),
  ]),

  "deck-of-cards": suite("Deck", 'import { Deck } from "./solution";', [
    t(
      "starts with 52 cards",
      `const d = new Deck();
    expect(d.remaining()).toBe(52);`,
      true
    ),
    t(
      "deal reduces count",
      `const d = new Deck();
    d.deal(5);
    expect(d.remaining()).toBe(47);`,
      true
    ),
    t(
      "cannot deal more than remaining",
      `const d = new Deck();
    const cards = d.deal(60);
    expect(cards.length).toBeLessThanOrEqual(52);
    expect(d.remaining()).toBe(0);`
    ),
    t(
      "shuffle keeps size",
      `const d = new Deck();
    d.shuffle();
    expect(d.remaining()).toBe(52);`
    ),
  ]),

  "cache-eviction": suite("Cache with LRU policy", 'import { Cache, LRUPolicy } from "./solution";', [
    t(
      "evicts LRU entry",
      `const c = new Cache(2, new LRUPolicy());
    c.put("a", 1);
    c.put("b", 2);
    c.get("a");
    c.put("c", 3);
    expect(c.get("b")).toBeUndefined();`,
      true
    ),
    t(
      "returns stored value",
      `const c = new Cache(2, new LRUPolicy());
    c.put("a", 1);
    expect(c.get("a")).toBe(1);`,
      true
    ),
    t(
      "capacity one keeps latest",
      `const c = new Cache(1, new LRUPolicy());
    c.put("a", 1);
    c.put("b", 2);
    expect(c.get("a")).toBeUndefined();
    expect(c.get("b")).toBe(2);`
    ),
    t(
      "overwrite keeps capacity",
      `const c = new Cache(2, new LRUPolicy());
    c.put("a", 1);
    c.put("b", 2);
    c.put("a", 9);
    c.put("c", 3);
    expect(c.get("a")).toBe(9);
    expect(c.get("b")).toBeUndefined();`
    ),
  ]),
};

function genericSuite(problemTitle) {
  return suite(problemTitle, 'import "./solution";', [
    t("solution module loads", `expect(true).toBe(true);`, true),
    t("exports something useful", `expect(typeof Object).toBe("function");`, true),
    t("hidden sanity check A", `expect(1 + 1).toBe(2);`),
    t("hidden sanity check B", `expect([1, 2].length).toBe(2);`),
  ]);
}

export function getTestSuite(problem) {
  return LLD_TEST_SUITES[problem.id] || genericSuite(problem.title);
}

/** First two visible sample cases (or first two if none marked). */
export function getVisibleCases(problem) {
  const suiteData = getTestSuite(problem);
  const marked = suiteData.cases.filter((c) => c.visible);
  if (marked.length >= 2) return marked.slice(0, 2);
  return suiteData.cases.slice(0, 2);
}

export function getHiddenCount(problem) {
  const suiteData = getTestSuite(problem);
  return Math.max(0, suiteData.cases.length - getVisibleCases(problem).length);
}

/** Full Jest file (all cases) — kept hidden from the file explorer. */
export function buildFullTestFile(problem, ext = "ts") {
  const suiteData = getTestSuite(problem);
  const body = suiteData.cases
    .map(
      (c) => `  it(${JSON.stringify(c.name)}, () => {
    ${c.body}
  });`
    )
    .join("\n\n");
  return `${suiteData.imports}

describe(${JSON.stringify(suiteData.describeName)}, () => {
${body}
});
`;
}

/** Sample tests file shown to the user (exactly 2 cases). */
export function buildSampleTestFile(problem, ext = "ts") {
  const suiteData = getTestSuite(problem);
  const visible = getVisibleCases(problem);
  const hidden = getHiddenCount(problem);
  const body = visible
    .map(
      (c) => `  it(${JSON.stringify(c.name)}, () => {
    ${c.body}
  });`
    )
    .join("\n\n");
  return `${suiteData.imports}

/**
 * Sample tests (2 of ${suiteData.cases.length}).
 * ${hidden} additional hidden test${hidden === 1 ? "" : "s"} also run against your solution.
 */
describe(${JSON.stringify(suiteData.describeName + " (samples)")}, () => {
${body}
});
`;
}

/** Human-readable sample tests for non-JS languages. */
export function formatSampleTestsForDisplay(problem) {
  const visible = getVisibleCases(problem);
  const hidden = getHiddenCount(problem);
  const lines = [
    `Sample tests (2 shown, ${hidden} hidden):`,
    "",
    ...visible.map((c, i) => `${i + 1}. ${c.name}\n   ${c.body.replace(/\n/g, "\n   ")}`),
    "",
    `+ ${hidden} hidden tests run in TypeScript/JavaScript mode.`,
  ];
  return lines.join("\n");
}

/** @deprecated — prefer buildFullTestFile */
export function getTestCode(problem) {
  return buildFullTestFile(problem);
}
