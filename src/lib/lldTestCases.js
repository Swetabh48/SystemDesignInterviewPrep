/** Hidden Jest tests per LLD problem (interviewer-style checks). */

export const LLD_TEST_CASES = {
  "lru-cache-oop": `import { LRUCache } from "./solution";

describe("LRUCache", () => {
  it("returns value for existing key", () => {
    const c = new LRUCache(2);
    c.put("a", 1);
    expect(c.get("a")).toBe(1);
  });

  it("evicts least recently used key", () => {
    const c = new LRUCache(2);
    c.put("a", 1);
    c.put("b", 2);
    c.get("a");
    c.put("c", 3);
    expect(c.get("b")).toBeUndefined();
    expect(c.get("a")).toBe(1);
    expect(c.get("c")).toBe(3);
  });
});
`,
  "rate-limiter-code": `import { TokenBucketLimiter } from "./solution";

describe("TokenBucketLimiter", () => {
  it("allows requests under burst", () => {
    const lim = new TokenBucketLimiter(2, 1);
    expect(lim.allow("user1")).toBe(true);
    expect(lim.allow("user1")).toBe(true);
  });

  it("denies when bucket empty", () => {
    const lim = new TokenBucketLimiter(1, 0);
    expect(lim.allow("u")).toBe(true);
    expect(lim.allow("u")).toBe(false);
  });
});
`,
  "tic-tac-toe": `import { TicTacToe } from "./solution";

describe("TicTacToe", () => {
  it("detects row win", () => {
    const g = new TicTacToe();
    g.makeMove(0, 0);
    g.makeMove(1, 0);
    g.makeMove(0, 1);
    g.makeMove(1, 1);
    g.makeMove(0, 2);
    expect(g.getWinner()).toBeTruthy();
  });
});
`,
  "parking-lot": `import { ParkingLot, VehicleType } from "./solution";

describe("ParkingLot", () => {
  it("issues ticket when spot available", () => {
    const lot = new ParkingLot({ compact: 1, large: 1, motorcycle: 1 });
    const ticket = lot.park(VehicleType.Motorcycle, "M1");
    expect(ticket).toBeDefined();
    expect(ticket.id).toBeTruthy();
  });

  it("returns null when full", () => {
    const lot = new ParkingLot({ compact: 0, large: 0, motorcycle: 0 });
    expect(lot.park(VehicleType.Car, "C1")).toBeNull();
  });
});
`,
  "vending-machine": `import { VendingMachine } from "./solution";

describe("VendingMachine", () => {
  it("accepts coins and selects product", () => {
    const vm = new VendingMachine([{ id: "A1", price: 50, stock: 1 }]);
    vm.insertCoin(50);
    expect(vm.selectProduct("A1")).toBe(true);
  });
});
`,
  "logger": `import { Logger, LogLevel, ConsoleAppender } from "./solution";

describe("Logger", () => {
  it("filters below minimum level", () => {
    const logs = [];
    const app = new ConsoleAppender((msg) => logs.push(msg));
    const log = new Logger(LogLevel.WARN, [app]);
    log.debug("skip");
    log.warn("keep");
    expect(logs.length).toBe(1);
  });
});
`,
  "meeting-scheduler": `import { MeetingScheduler } from "./solution";

describe("MeetingScheduler", () => {
  it("rejects overlapping bookings", () => {
    const s = new MeetingScheduler(["R1"]);
    expect(s.book("R1", 10, 11)).toBe(true);
    expect(s.book("R1", 10, 30)).toBe(false);
  });
});
`,
  "deck-of-cards": `import { Deck } from "./solution";

describe("Deck", () => {
  it("starts with 52 cards", () => {
    const d = new Deck();
    expect(d.remaining()).toBe(52);
  });

  it("deal reduces count", () => {
    const d = new Deck();
    d.deal(5);
    expect(d.remaining()).toBe(47);
  });
});
`,
  "cache-eviction": `import { Cache, LRUPolicy } from "./solution";

describe("Cache with LRU policy", () => {
  it("evicts LRU entry", () => {
    const c = new Cache(2, new LRUPolicy());
    c.put("a", 1);
    c.put("b", 2);
    c.get("a");
    c.put("c", 3);
    expect(c.get("b")).toBeUndefined();
  });
});
`,
};

export function genericTestCase(problemTitle) {
  return `import "./solution";

describe("${problemTitle}", () => {
  it("solution module loads (implement exports to pass custom tests)", () => {
    expect(true).toBe(true);
  });

  it("placeholder — export classes from solution.ts", () => {
    // Replace with domain tests as you implement APIs
    expect(typeof Object).toBe("function");
  });
});
`;
}

export function getTestCode(problem) {
  return LLD_TEST_CASES[problem.id] || genericTestCase(problem.title);
}
