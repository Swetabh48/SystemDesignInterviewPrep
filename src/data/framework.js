export const FRAMEWORK_STEPS = [
  {
    num: "01",
    title: "Clarify Requirements",
    minutes: 5,
    cumulative: 5,
    detail:
      "Separate functional (what it must do) from non-functional (scale, latency, consistency, availability). Ask about read/write ratio, expected users or QPS, data retention, and geographic spread before assuming anything.",
    tip: "Never assume scale. Ask.",
    speechHints: ["requirement", "functional", "non-functional", "latency", "availability", "consistency", "scale", "clarify", "scope", "assume"],
  },
  {
    num: "02",
    title: "Estimate Scale",
    minutes: 5,
    cumulative: 10,
    detail:
      "Back-of-envelope math, out loud: QPS (read and write, separately), storage growth per year, peak-to-average ratio, bandwidth. Round aggressively — the interviewer is grading your process, not your arithmetic precision.",
    tip: "Show the math. A wrong estimate with visible reasoning beats a right one with none.",
    speechHints: ["qps", "rps", "storage", "bandwidth", "estimate", "million", "billion", "peak", "average", "gb", "tb", "per second", "per day"],
  },
  {
    num: "03",
    title: "Define the API",
    minutes: 5,
    cumulative: 15,
    detail:
      "3–5 core endpoints or method signatures with parameters and return shape. This anchors every decision after it — if the API is wrong, the rest of the design drifts.",
    tip: "Write the signatures down. Don't just describe them.",
    speechHints: ["api", "endpoint", "request", "response", "post", "get", "grpc", "websocket", "payload", "schema"],
  },
  {
    num: "04",
    title: "High-Level Design",
    minutes: 10,
    cumulative: 25,
    detail:
      "Draw the boxes: client, load balancer, app servers, cache, database, queue, CDN. Walk one request end-to-end through the diagram before adding any complexity.",
    tip: "One request, start to finish, before you optimize anything.",
    speechHints: ["load balancer", "cache", "database", "queue", "cdn", "service", "client", "architecture", "component", "diagram"],
  },
  {
    num: "05",
    title: "Data Model",
    minutes: 5,
    cumulative: 30,
    detail:
      "Core entities and their relationships. Choose SQL vs NoSQL and justify it against the access patterns from step 1 — not by default.",
    tip: "Justify the database choice against your own requirements, not habit.",
    speechHints: ["table", "schema", "entity", "sql", "nosql", "shard", "partition", "index", "primary key", "foreign key", "document"],
  },
  {
    num: "06",
    title: "Deep Dive",
    minutes: 15,
    cumulative: 45,
    detail:
      "The interviewer picks (or you propose) the 1–2 hardest parts — a hot key, a fan-out problem, a consistency conflict, a uniqueness constraint. This is where you're actually being evaluated.",
    tip: "This section decides the grade. Don't rush earlier steps at its expense.",
    speechHints: ["deep dive", "bottleneck", "hot key", "fan-out", "consistency", "replication", "failure", "race", "idempotent", "trade-off", "tradeoff"],
  },
  {
    num: "07",
    title: "Bottlenecks & Scale",
    minutes: 10,
    cumulative: 55,
    detail:
      "Find the single points of failure, hot partitions, and cache stampede risks in your own design. Apply sharding, replication, caching, or queueing to fix each one specifically.",
    tip: "Point at your own diagram and say what breaks first under load.",
    speechHints: ["spof", "single point", "shard", "replica", "scale", "stampede", "backpressure", "horizontal", "failover", "partition"],
  },
  {
    num: "08",
    title: "Wrap-Up",
    minutes: 5,
    cumulative: 60,
    detail:
      "Summarize the trade-offs you made and why. State what you'd do differently with more time or budget. Mention monitoring and alerting if you haven't already.",
    tip: "End on trade-offs, not a feature recap.",
    speechHints: ["trade-off", "tradeoff", "monitor", "alert", "observability", "summary", "next step", "future", "cost"],
  },
];

export const CONCEPTS = [
  {
    title: "Load Balancing",
    points: [
      "L4 (transport-level, fast, blind to content) vs L7 (application-level, can route on path/header)",
      "Algorithms: round robin, least-connections, consistent hashing (for cache/session affinity)",
      "Health checks pull unhealthy nodes out of rotation automatically",
    ],
  },
  {
    title: "Caching",
    points: [
      "Cache-aside vs write-through vs write-back — pick from write/read pattern",
      "Eviction: LRU, LFU, TTL — match access pattern",
      "CDN = edge caching for static/semi-static content",
      "Cache stampede: locking, request coalescing, or early refresh",
    ],
  },
  {
    title: "Databases (DDIA)",
    points: [
      "SQL: strong consistency, joins, transactions — when relationships and correctness matter",
      "NoSQL: horizontal scale, flexible schema — huge simple-access datasets",
      "LSM-trees favor write-heavy; B-trees favor read-heavy + point lookups",
      "Replication copies data (availability); partitioning splits data (write scale)",
    ],
  },
  {
    title: "Replication (DDIA)",
    points: [
      "Single-leader: simple, strong reads from leader; follower lag on replicas",
      "Multi-leader: write locally in each region; conflict resolution required",
      "Leaderless (Dynamo-style): quorum W+R>N; hinted handoff; anti-entropy",
      "Read-your-writes, monotonic reads, consistent prefix — client-visible guarantees",
    ],
  },
  {
    title: "Consistency & Availability",
    points: [
      "CAP: under partition, pick consistency or availability — not both",
      "Quorum: W + R > N guarantees a read overlaps the latest write",
      "Idempotency required wherever retries exist",
      "Vector clocks / CRDTs for concurrent write conflicts",
    ],
  },
  {
    title: "Async & Messaging",
    points: [
      "Queues (Kafka, SQS) decouple producers and absorb bursts",
      "At-least-once is the norm — design idempotent consumers",
      "Dead-letter queues for repeatedly failing messages",
      "Log-structured streams: offset, consumer groups, replay",
    ],
  },
  {
    title: "Rate Limiting",
    points: [
      "Token bucket: bursts up to bucket size, fixed refill",
      "Leaky bucket: smooths to constant output",
      "Sliding window counter: accuracy vs memory trade-off",
      "Enforce at edge for cheap global protection; per-service for fine grain",
    ],
  },
  {
    title: "Communication Protocols",
    points: [
      "REST: simple, cacheable, request-response",
      "gRPC: fast, typed, internal service-to-service",
      "WebSockets: full-duplex real-time",
      "SSE / long polling: one-direction push with less complexity",
    ],
  },
  {
    title: "Reliability Patterns",
    points: [
      "Retries with exponential backoff + jitter",
      "Circuit breakers stop calling a failing dependency",
      "Timeouts on every network call",
      "Heartbeats / failure detection for failover",
    ],
  },
  {
    title: "Scaling",
    points: [
      "Vertical hits a ceiling; horizontal needs statelessness",
      "Push state to cache/DB so any instance can serve any request",
      "Connection pooling prevents DB connection exhaustion",
      "Back-pressure: slow consumers signal producers to slow down",
    ],
  },
  {
    title: "Transactions & Sagas",
    points: [
      "ACID within a single DB; sagas across services",
      "Orchestration vs choreography; compensating transactions",
      "Outbox pattern for reliable event publish after commit",
      "Exactly-once is usually at-least-once + idempotent sink",
    ],
  },
  {
    title: "AI / LLM Systems (2026)",
    points: [
      "RAG: chunk → embed → vector search → rerank → generate with citations",
      "Inference: batching, KV-cache, streaming tokens (SSE)",
      "Semantic cache for repeated prompts; cost-latency coupling",
      "Safety filters, rate limits, and model routing by task difficulty",
    ],
  },
];
