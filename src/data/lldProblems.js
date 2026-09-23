import { lldSolutionStarter } from "../lib/lldTemplates.js";
import { LLD_CATALOG_PROBLEMS } from "./lldProblemsCatalog.js";

export { LLD_CATEGORIES } from "./lldProblemsCatalog.js";

function q(
  id,
  num,
  title,
  tag,
  category,
  source,
  prompt,
  requirements,
  focus,
  rubric,
  keywords,
  starterHints,
  exportHint
) {
  const problem = {
    id,
    num,
    title,
    tag,
    category,
    source,
    prompt,
    requirements,
    focus,
    rubric,
    keywords,
    sandpackTemplate: "test-ts",
    starterHints,
    exportHint:
      exportHint ||
      `export class ${title.replace(/[^a-zA-Z0-9]/g, "")}Service {\n  // TODO: implement\n}\n`,
  };
  problem.starterCode = lldSolutionStarter(problem);
  return problem;
}

const CORE_LLD = [
  q(
    "parking-lot",
    "01",
    "Parking Lot",
    "Warm-up",
    "OOP Classics",
    "Grokking LLD · Medium · LinkedIn",
    "Design an object-oriented parking lot that supports multiple vehicle types, spot sizes, ticketing, and hourly pricing.",
    [
      "Which vehicle types (motorcycle, car, bus)?",
      "Single floor or multi-floor? Handicap / electric spots?",
      "Entry/exit gates — same gate or separate?",
      "Payment at exit or pre-paid?",
    ],
    ["Spot allocation strategy", "Full lot behavior", "Ticket / receipt object"],
    [
      "Models Vehicle, ParkingSpot, Ticket, ParkingLot",
      "Handles motorcycle in compact or large spot logic",
      "park() and unpark() with fee calculation",
      "Discusses extensibility for new vehicle types",
    ],
    ["vehicle", "spot", "ticket", "hourly", "compact", "large", "motorcycle", "fee", "gate"],
    ["VehicleType enum", "ParkingSpot sizes", "ParkingLot.park() / unpark()"],
    `export enum VehicleType { Motorcycle, Car, Bus }
export class Ticket { constructor(public id: string) {} }
export class ParkingLot {
  constructor(private spots: { compact: number; large: number; motorcycle: number }) {}
  park(type: VehicleType, plate: string): Ticket | null { return null; }
}
`
  ),
  q(
    "elevator",
    "02",
    "Elevator System",
    "Core",
    "OOP Classics",
    "Grokking LLD · Notion · Quora",
    "Design a building elevator system with multiple cars, floors, and a scheduling algorithm.",
    [
      "How many elevators and floors?",
      "Up/down buttons on each floor — central controller?",
      "Weight limit and door open/close states?",
    ],
    ["Scheduling (SCAN vs nearest car)", "Thread safety if concurrent requests", "State machine per elevator"],
    [
      "Elevator states (Idle, Moving, DoorOpen)",
      "Request queue / dispatch strategy",
      "Building orchestrates multiple elevators",
      "Handles invalid floor requests",
    ],
    ["elevator", "floor", "request", "dispatch", "state", "door", "direction", "queue"],
    ["ElevatorState enum", "ElevatorController", "addRequest() scheduling"]
  ),
  q(
    "lru-cache-oop",
    "03",
    "LRU Cache (OOP)",
    "Warm-up",
    "Utilities",
    "LeetCode · Stack Overflow · Hello Interview",
    "Design an in-memory LRU cache with get/put in O(1) using object-oriented classes (not just a function).",
    [
      "Fixed capacity — eviction policy strictly LRU?",
      "Thread-safe version needed?",
      "TTL on keys or pure LRU?",
    ],
    ["Hash map + doubly linked list", "Node abstraction", "Capacity edge cases"],
    [
      "get and put are O(1) amortized",
      "Evicts least-recently-used on overflow",
      "Clean Node / DLL abstraction",
      "Mentions concurrency extension",
    ],
    ["lru", "cache", "doubly linked", "hash map", "evict", "capacity", "node"],
    ["Node class", "DoublyLinkedList", "LRUCache.get/put"],
    `export class LRUCache {
  constructor(public capacity: number) {}
  get(key: string): number | undefined { return undefined; }
  put(key: string, value: number): void {}
}
`
  ),
  q(
    "bookmyshow",
    "04",
    "Movie Ticket Booking",
    "Core",
    "Product / App",
    "Medium · LinkedIn · FAANG reports",
    "Design BookMyShow-style cinema booking: shows, seats, concurrent booking, and payment handoff.",
    [
      "Seat map per show — static or dynamic pricing?",
      "Hold seats during checkout — timeout?",
      "Multiple theatres / cities?",
    ],
    ["Seat locking / optimistic concurrency", "Show, Screen, Seat entities", "Booking state machine"],
    [
      "Prevents double booking of same seat",
      "Models Show, Seat, Booking, User",
      "Temporary hold with expiry",
      "Search shows by city/date",
    ],
    ["seat", "show", "booking", "lock", "hold", "concurrency", "payment", "screen"],
    ["SeatStatus enum", "BookingService", "lockSeat() / confirmBooking()"]
  ),
  q(
    "splitwise",
    "05",
    "Splitwise",
    "Core",
    "Product / App",
    "Medium · Notion · Blind",
    "Design expense sharing: groups, unequal splits, simplify debts, and balance sheet.",
    [
      "Equal vs exact vs percentage split?",
      "Multi-currency or single?",
      "Simplify debts to minimum transactions?",
    ],
    ["Balance sheet per user", "Debt simplification graph", "Group vs 1:1 expenses"],
    [
      "addExpense with split strategies",
      "getBalances per user",
      "Optional debt simplification",
      "Immutable expense records",
    ],
    ["expense", "split", "balance", "group", "debt", "simplify", "transaction"],
    ["SplitStrategy interface", "Expense, User, Group", "BalanceSheet"]
  ),
  q(
    "chess",
    "06",
    "Chess Game",
    "Advanced",
    "Games",
    "Grokking LLD · Stack Overflow",
    "Design a two-player chess game with board, pieces, legal moves, check/checkmate detection.",
    [
      "Full rules or simplified (no castling)?",
      "Human vs human only?",
      "Undo moves allowed?",
    ],
    ["Piece hierarchy / polymorphism", "Move validation", "Check detection"],
    [
      "Board 8x8 with Piece subclasses",
      "isValidMove per piece type",
      "Turn alternation and game state",
      "Detects check (mate optional bonus)",
    ],
    ["board", "piece", "move", "check", "knight", "pawn", "castling"],
    ["Piece abstract class", "King, Queen, Rook…", "Game.makeMove()"]
  ),
  q(
    "atm",
    "07",
    "ATM Machine",
    "Warm-up",
    "OOP Classics",
    "Grokking LLD · Quora",
    "Design ATM software: card session, PIN, withdraw/deposit, cassette cash inventory.",
    [
      "Single ATM or network?",
      "Supported operations — transfer?",
      "Dispense optimal bill combination?",
    ],
    ["ATM states (Idle, HasCard, Authenticated)", "Cash dispenser strategy", "Bank gateway interface"],
    [
      "Card insert → PIN → transaction flow",
      "Withdraw validates balance + cash on hand",
      "Dispense bills with greedy algorithm",
      "Session timeout / eject card",
    ],
    ["atm", "pin", "withdraw", "deposit", "cassette", "dispense", "card", "session"],
    ["ATMState enum", "CashDispenser", "BankService interface"]
  ),
  q(
    "vending-machine",
    "08",
    "Vending Machine",
    "Warm-up",
    "OOP Classics",
    "Grokking LLD · Medium",
    "Design a vending machine accepting coins/cash, selecting products, dispensing change.",
    [
      "Coin vs note vs card?",
      "Inventory restock by operator?",
      "Multiple product slots?",
    ],
    ["State pattern for machine states", "Inventory per slot", "Change making"],
    [
      "States: Idle, HasMoney, Dispensing",
      "selectProduct checks stock and credit",
      "Returns correct change",
      "Admin restock mode",
    ],
    ["vending", "coin", "change", "slot", "inventory", "state", "dispense"],
    ["VendingMachineState", "ProductSlot", "acceptCoin()"],
    `export class VendingMachine {
  constructor(private products: { id: string; price: number; stock: number }[]) {}
  insertCoin(cents: number): void {}
  selectProduct(id: string): boolean { return false; }
}
`
  ),
  q(
    "library",
    "09",
    "Library Management",
    "Core",
    "Product / App",
    "LinkedIn · Medium",
    "Design a library system: catalog, members, lend/return, fines, reservations.",
    [
      "Multiple copies of same ISBN?",
      "Fine per day — grace period?",
      "Reservation queue when all copies out?",
    ],
    ["Book vs BookItem (copy)", "Member borrowing limits", "Fine calculation"],
    [
      "Lend and return with due dates",
      "Reservation when unavailable",
      "Search catalog by author/title",
      "Fine on overdue return",
    ],
    ["book", "member", "lend", "return", "fine", "reservation", "isbn"],
    ["BookItem", "Member", "LibraryService.lend/return"]
  ),
  q(
    "hotel-booking",
    "10",
    "Hotel Booking",
    "Core",
    "Product / App",
    "Medium · Notion",
    "Design hotel room booking with room types, date-range search, and overbooking policy.",
    [
      "Room types and amenities?",
      "Cancel/refund rules?",
      "Housekeeping status affects availability?",
    ],
    ["Date-range overlap query", "RoomType pricing", "Booking confirmation"],
    [
      "searchAvailability(checkIn, checkOut, type)",
      "Prevents overlapping confirmed bookings",
      "RoomType enum and pricing",
      "Cancellation frees inventory",
    ],
    ["hotel", "room", "booking", "check-in", "availability", "overlap", "reservation"],
    ["Room, RoomType", "Booking", "HotelService.search/book"]
  ),
  q(
    "food-delivery",
    "11",
    "Food Delivery Order",
    "Core",
    "Product / App",
    "LinkedIn · Swiggy/Zomato style",
    "Design order flow: menu, cart, restaurant, delivery agent assignment, status tracking.",
    [
      "Real-time agent assignment or batch?",
      "Order states — who can cancel?",
      "Multiple items / modifiers?",
    ],
    ["Order state machine", "RestaurantMenu", "DeliveryAgent assignment"],
    [
      "Order lifecycle Placed → Preparing → Delivered",
      "Cart and checkout",
      "Assign nearest available agent",
      "Customer tracks status",
    ],
    ["order", "cart", "restaurant", "delivery", "status", "agent", "menu"],
    ["OrderStatus enum", "Cart, Order", "DeliveryService.assign"]
  ),
  q(
    "stack-overflow-lite",
    "12",
    "Q&A Forum (Stack Overflow Lite)",
    "Advanced",
    "Product / App",
    "Stack Overflow · Medium",
    "Design classes for questions, answers, votes, tags, and reputation.",
    [
      "Can authors edit after votes?",
      "Accepted answer — one per question?",
      "Reputation thresholds for privileges?",
    ],
    ["Vote integrity (one per user)", "Reputation recalculation", "Tag on questions"],
    [
      "Post Question/Answer with author",
      "Upvote/downvote updates reputation",
      "acceptAnswer on question",
      "Search by tag",
    ],
    ["question", "answer", "vote", "reputation", "tag", "accept", "user"],
    ["Question, Answer, User", "VotingService", "Reputation"]
  ),
  q(
    "rate-limiter-code",
    "13",
    "Rate Limiter (Code)",
    "Core",
    "Utilities",
    "Hello Interview · LeetCode · Medium",
    "Implement a token-bucket or sliding-window rate limiter as clean OOP (allow/deny per client key).",
    [
      "Per-user or per-IP keys?",
      "Distributed or single-process?",
      "Burst allowance?",
    ],
    ["Token bucket refill rate", "Thread-safe map of buckets", "allow(key) API"],
    [
      "allow(key) returns boolean",
      "Configurable rate and burst",
      "Evicts stale buckets (optional)",
      "Names tradeoffs vs sliding window",
    ],
    ["token bucket", "rate limit", "allow", "burst", "refill", "sliding window"],
    ["RateLimiter interface", "TokenBucket", "allow(key): boolean"],
    `export class TokenBucketLimiter {
  constructor(private burst: number, private refillPerSec: number) {}
  allow(key: string): boolean { return true; }
}
`
  ),
  q(
    "logger",
    "14",
    "Logger / Log Aggregator",
    "Core",
    "Utilities",
    "Medium · Notion",
    "Design a leveled logger (DEBUG–ERROR) with multiple appenders (console, file) and formatting.",
    [
      "Sync vs async append?",
      "Structured JSON vs plain text?",
      "Per-class log levels?",
    ],
    ["Appender interface", "LogLevel enum", "Formatter chain"],
    [
      "Logger.debug/info/warn/error",
      "Multiple appenders per logger",
      "Level filtering",
      "Extensible formatter",
    ],
    ["logger", "appender", "log level", "format", "debug", "handler"],
    ["LogLevel enum", "Appender interface", "ConsoleAppender, Logger"],
    `export enum LogLevel { DEBUG, INFO, WARN, ERROR }
export class ConsoleAppender {
  constructor(private sink: (msg: string) => void) {}
  write(msg: string) { this.sink(msg); }
}
export class Logger {
  constructor(private level: LogLevel, private appenders: ConsoleAppender[]) {}
  debug(msg: string) {}
  warn(msg: string) {}
}
`
  ),
  q(
    "task-scheduler",
    "15",
    "Task Scheduler",
    "Advanced",
    "Concurrency",
    "LeetCode · LinkedIn",
    "Design a scheduler that runs tasks at fixed time, cron-like, or after delay with a worker pool.",
    [
      "Priority tasks?",
      "Persistent queue or in-memory?",
      "Max concurrent workers?",
    ],
    ["Min-heap by run time", "Worker pool", "Task interface"],
    [
      "schedule(task, runAt)",
      "Worker picks due tasks",
      "Handles cancellation",
      "Thread-safe task queue",
    ],
    ["scheduler", "task", "worker", "queue", "cron", "delay", "priority"],
    ["Task interface", "Scheduler", "WorkerPool", "PriorityQueue"]
  ),
  q(
    "snake-ladder",
    "16",
    "Snake and Ladder",
    "Warm-up",
    "Games",
    "Grokking LLD · GeeksforGeeks",
    "Design board game with dice, snakes/ladders, multiple players, win detection.",
    [
      "Standard 1–100 board?",
      "Multiple dice or single?",
      "Exact finish required?",
    ],
    ["Board as graph jumps", "Player turn rotation", "Dice abstraction"],
    [
      "Board stores snake/ladder mappings",
      "move() applies jump",
      "Rotates turns",
      "Detects winner",
    ],
    ["dice", "snake", "ladder", "board", "player", "turn", "win"],
    ["Board", "Player", "Dice", "Game.playTurn()"]
  ),
  q(
    "tic-tac-toe",
    "17",
    "Tic Tac Toe",
    "Warm-up",
    "Games",
    "Grokking LLD · Medium",
    "Design tic-tac-toe with N×N board option, two players, win/draw detection.",
    [
      "Fixed 3×3 or configurable N?",
      "Human vs human only?",
    ],
    ["Board representation", "Win check rows/cols/diagonals", "Player symbol enum"],
    [
      "makeMove(row,col) validates cell",
      "Detects win and draw",
      "Switch players",
      "Print/display board",
    ],
    ["board", "move", "win", "draw", "player", "symbol"],
    ["Board", "Player", "Game.makeMove()"],
    `export class TicTacToe {
  makeMove(row: number, col: number): boolean { return true; }
  getWinner(): string | null { return null; }
}
`
  ),
  q(
    "deck-of-cards",
    "18",
    "Deck of Cards",
    "Warm-up",
    "Games",
    "Grokking LLD · Amazon",
    "Design a standard 52-card deck, shuffle, deal, and base for blackjack/poker.",
    [
      "Multiple decks for blackjack?",
      "Jokers included?",
    ],
    ["Card, Suit, Rank enums", "Shuffle strategy", "Deal from top"],
    [
      "Full deck generation",
      "shuffle() randomizes",
      "dealHand(n) removes from deck",
      "Extensible for game rules",
    ],
    ["card", "deck", "shuffle", "deal", "suit", "rank", "hand"],
    ["Suit, Rank enums", "Card", "Deck.shuffle/deal"],
    `export class Deck {
  remaining() { return 52; }
  deal(n: number) {}
}
`
  ),
  q(
    "meeting-scheduler",
    "19",
    "Meeting Room Scheduler",
    "Core",
    "Product / App",
    "LeetCode · LinkedIn · Google",
    "Design calendar with meeting rooms, conflict detection, and recurring meetings.",
    [
      "Recurring meetings supported?",
      "Timezone handling?",
      "Find free slot for N attendees?",
    ],
    ["Interval overlap", "Room resource", "Calendar per user"],
    [
      "book(room, start, end) rejects conflicts",
      "listAvailableRooms(timeRange)",
      "Meeting object with attendees",
      "Optional recurrence rule",
    ],
    ["meeting", "calendar", "room", "conflict", "interval", "recurring"],
    ["Meeting", "Room", "Calendar.book()", "findFreeSlot()"],
    `export class MeetingScheduler {
  constructor(private rooms: string[]) {}
  book(room: string, start: number, end: number): boolean { return false; }
}
`
  ),
  q(
    "in-memory-filesystem",
    "20",
    "In-Memory File System",
    "Advanced",
    "Utilities",
    "LeetCode · Notion",
    "Design ls, mkdir, addContentToFile, readContent with path strings (e.g. /a/b/c.txt).",
    [
      "Path separator / only?",
      "File vs directory — same tree?",
      "Concurrent access?",
    ],
    ["Trie / tree of FileNode", "Path parsing", "File vs Dir node type"],
    [
      "mkdir creates nested paths",
      "addContentToFile creates intermediate dirs",
      "readContent returns file body",
      "ls lists directory or file name",
    ],
    ["file", "directory", "path", "mkdir", "ls", "trie", "node"],
    ["FileNode", "Directory", "FileSystem.ls/mkdir/read"]
  ),
  q(
    "car-rental",
    "21",
    "Car Rental System",
    "Core",
    "Product / App",
    "Grokking LLD · Medium",
    "Design rental: vehicle inventory, reservations, pricing by day, pickup/return.",
    [
      "Different vehicle categories?",
      "Late return fees?",
      "Multiple locations?",
    ],
    ["Reservation date overlap", "Vehicle availability", "Pricing strategy"],
    [
      "searchCars(location, dates)",
      "Reservation confirms availability",
      "Return updates vehicle status",
      "Invoice by rental duration",
    ],
    ["rental", "vehicle", "reservation", "pickup", "return", "invoice"],
    ["Vehicle, Reservation", "RentalService.search/book/return"]
  ),
  q(
    "amazon-locker",
    "22",
    "Amazon Locker",
    "Core",
    "Product / App",
    "Amazon · LinkedIn",
    "Design parcel locker: deposit package, notify user, pickup with OTP, size-matched compartments.",
    [
      "Compartment sizes S/M/L?",
      "OTP expiry?",
      "Locker at multiple locations?",
    ],
    ["Compartment size matching", "OTP generation", "Occupied/free state"],
    [
      "allocateCompartment(packageSize)",
      "pickup(code) validates OTP",
      "Release compartment after pickup",
      "Notify user on deposit",
    ],
    ["locker", "compartment", "otp", "pickup", "deposit", "parcel"],
    ["CompartmentSize", "Locker", "OTPService", "deposit/pickup"]
  ),
  q(
    "ride-sharing",
    "23",
    "Ride Sharing (Uber Lite)",
    "Advanced",
    "Product / App",
    "Uber · Medium · Blind",
    "Design rider request, driver matching, trip states, fare estimate.",
    [
      "Nearest driver vs surge pricing?",
      "Shared rides?",
      "Cancel policy?",
    ],
    ["Trip state machine", "Location / distance", "Driver availability"],
    [
      "requestRide(pickup, drop)",
      "matchDriver() by proximity",
      "Trip states Requested → Completed",
      "Fare estimate by distance",
    ],
    ["ride", "driver", "rider", "trip", "fare", "match", "location"],
    ["TripStatus", "RideService.request/match/complete"]
  ),
  q(
    "pubsub",
    "24",
    "Pub/Sub (In-Process)",
    "Advanced",
    "Concurrency",
    "Medium · System design LLD",
    "Design topic-based publish/subscribe with multiple subscribers and async delivery.",
    [
      "At-least-once vs exactly-once?",
      "Backpressure if subscriber slow?",
      "Filter by topic only?",
    ],
    ["Topic → subscribers map", "Message object", "Async dispatch"],
    [
      "subscribe(topic, handler)",
      "publish(topic, payload) notifies all",
      "Unsubscribe support",
      "Thread-safe subscriber list",
    ],
    ["pubsub", "topic", "subscriber", "publish", "message", "observer"],
    ["MessageBroker", "Subscription", "publish/subscribe"]
  ),
  q(
    "cache-eviction",
    "25",
    "Cache with Eviction Policies",
    "Core",
    "Utilities",
    "Hello Interview · Medium",
    "Design a cache interface with pluggable eviction: LRU, LFU, FIFO via Strategy pattern.",
    [
      "Fixed max entries?",
      "TTL combined with eviction?",
      "Statistics / hit rate?",
    ],
    ["EvictionPolicy interface", "get/put contract", "Policy swap at runtime"],
    [
      "Cache delegates eviction to strategy",
      "LRU and one other policy implemented",
      "get/put update policy metadata",
      "Open for new policies without changing cache",
    ],
    ["cache", "lru", "lfu", "fifo", "eviction", "strategy", "policy"],
    ["EvictionPolicy interface", "LRUPolicy", "Cache.get/put"],
    `export interface EvictionPolicy { onGet(key: string): void; onPut(key: string): void; evictKey(): string | undefined; }
export class LRUPolicy implements EvictionPolicy {
  onGet() {}
  onPut() {}
  evictKey() { return undefined; }
}
export class Cache {
  constructor(private cap: number, private policy: EvictionPolicy) {}
  get(key: string) { return undefined; }
  put(key: string, val: unknown) {}
}
`
  ),
];

export const LLD_PROBLEMS = [...CORE_LLD, ...LLD_CATALOG_PROBLEMS];
