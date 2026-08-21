import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, Play, Square, Terminal } from "lucide-react";

const FRAMEWORK_STEPS = [
  { num: "01", title: "Clarify Requirements", minutes: 5, cumulative: 5,
    detail: "Separate functional (what it must do) from non-functional (scale, latency, consistency, availability). Ask about read/write ratio, expected users or QPS, data retention, and geographic spread before assuming anything.",
    tip: "Never assume scale. Ask." },
  { num: "02", title: "Estimate Scale", minutes: 5, cumulative: 10,
    detail: "Back-of-envelope math, out loud: QPS (read and write, separately), storage growth per year, peak-to-average ratio, bandwidth. Round aggressively - the interviewer is grading your process, not your arithmetic precision.",
    tip: "Show the math. A wrong estimate with visible reasoning beats a right one with none." },
  { num: "03", title: "Define the API", minutes: 5, cumulative: 15,
    detail: "3-5 core endpoints or method signatures with parameters and return shape. This anchors every decision after it - if the API is wrong, the rest of the design drifts.",
    tip: "Write the signatures down. Don't just describe them." },
  { num: "04", title: "High-Level Design", minutes: 10, cumulative: 25,
    detail: "Draw the boxes: client, load balancer, app servers, cache, database, queue, CDN. Walk one request end-to-end through the diagram before adding any complexity.",
    tip: "One request, start to finish, before you optimize anything." },
  { num: "05", title: "Data Model", minutes: 5, cumulative: 30,
    detail: "Core entities and their relationships. Choose SQL vs NoSQL and justify it against the access patterns from step 1 - not by default.",
    tip: "Justify the database choice against your own requirements, not habit." },
  { num: "06", title: "Deep Dive", minutes: 15, cumulative: 45,
    detail: "The interviewer picks (or you propose) the 1-2 hardest parts - a hot key, a fan-out problem, a consistency conflict, a uniqueness constraint. This is where you're actually being evaluated.",
    tip: "This section decides the grade. Don't rush earlier steps at its expense." },
  { num: "07", title: "Bottlenecks & Scale", minutes: 10, cumulative: 55,
    detail: "Find the single points of failure, hot partitions, and cache stampede risks in your own design. Apply sharding, replication, caching, or queueing to fix each one specifically.",
    tip: "Point at your own diagram and say what breaks first under load." },
  { num: "08", title: "Wrap-Up", minutes: 5, cumulative: 60,
    detail: "Summarize the trade-offs you made and why. State what you'd do differently with more time or budget. Mention monitoring and alerting if you haven't already.",
    tip: "End on trade-offs, not a feature recap." },
];

const CONCEPTS = [
  { title: "Load Balancing", points: [
    "L4 (transport-level, fast, blind to content) vs L7 (application-level, can route on path/header)",
    "Algorithms: round robin, least-connections, consistent hashing (for cache/session affinity)",
    "Health checks pull unhealthy nodes out of rotation automatically",
  ]},
  { title: "Caching", points: [
    "Cache-aside (app manages it) vs write-through (write hits cache+DB together) vs write-back (write hits cache, DB catches up async)",
    "Eviction: LRU, LFU, TTL - pick based on access pattern, not default",
    "CDN = caching at the edge for static/semi-static content, closest to the user",
    "Cache stampede: many requests miss the same key at once - fix with locking, request coalescing, or early refresh",
  ]},
  { title: "Databases", points: [
    "SQL: strong consistency, joins, transactions - good when relationships and correctness matter",
    "NoSQL: horizontal scale, flexible schema - good for huge, simple-access-pattern datasets",
    "Replication: leader-follower for read scaling and failover",
    "Sharding: hash-based (even distribution, hard to range-query), range-based (easy range-query, hot-shard risk), consistent hashing (minimizes reshuffling on node add/remove)",
  ]},
  { title: "Consistency & Availability", points: [
    "CAP theorem: under a network partition, pick consistency or availability - you cannot have both",
    "Strong consistency: read always sees latest write. Eventual: reads may lag, but converge",
    "Quorum: W + R > N guarantees a read overlaps the latest write",
    "Idempotency: a retried operation shouldn't double-apply - required wherever you have retries",
  ]},
  { title: "Async & Messaging", points: [
    "Queues (Kafka, SQS) decouple producer from consumer and absorb bursts",
    "Go async when the caller doesn't need the result immediately, or when fan-out is large",
    "At-least-once delivery is the norm - design consumers to be idempotent",
    "Dead-letter queues catch messages that repeatedly fail processing",
  ]},
  { title: "Rate Limiting", points: [
    "Token bucket: allows bursts up to bucket size, refills at a fixed rate",
    "Leaky bucket: smooths bursts into a constant output rate",
    "Sliding window counter: balances accuracy and memory better than fixed window",
    "Enforce at the edge (gateway) for cheap global protection, or per-service for fine-grained limits",
  ]},
  { title: "Communication Protocols", points: [
    "REST: simple, cacheable, request-response",
    "gRPC: fast, typed, good for internal service-to-service calls",
    "WebSockets: full-duplex, for real-time bidirectional (chat, live updates)",
    "Long polling / SSE: server-push without full duplex, simpler than WebSockets when you only need one direction",
  ]},
  { title: "Reliability Patterns", points: [
    "Retries with exponential backoff + jitter - never retry immediately in a tight loop",
    "Circuit breakers stop calling a failing dependency so it can recover",
    "Timeouts on every network call - no call waits forever",
    "Heartbeats / failure detection decide when to fail over",
  ]},
  { title: "Scaling", points: [
    "Vertical (bigger machine) is simple but hits a ceiling; horizontal (more machines) needs statelessness",
    "Stateless services let any instance handle any request - push state to cache/DB",
    "Connection pooling avoids exhausting DB connections under load",
    "Back-pressure: slow consumers should be able to signal producers to slow down",
  ]},
];

const PROBLEMS = [
  { id: "url-shortener", num: "01", title: "URL Shortener", tag: "Warm-up",
    prompt: "Design a service like bit.ly that shortens long URLs and redirects visitors to the original.",
    requirements: ["Custom aliases allowed?", "Do links expire?", "Is click analytics in scope?", "What's the read:write ratio? (expect heavily read-skewed)"],
    scale: ["~100M new URLs/month", "Read:write around 100:1", "Base62, 7 chars is about 3.5 trillion codes"],
    focus: ["ID-generation scheme: hash vs auto-increment counter vs pre-generated pool", "Redirect is the hot path - cache in front of the DB", "Custom alias collision handling"],
    rubric: ["Chose and justified an ID-generation scheme", "Addressed redirect latency with caching", "Handled custom-alias collisions", "Estimated storage and QPS out loud"] },
  { id: "rate-limiter", num: "02", title: "Rate Limiter", tag: "Core",
    prompt: "Design a rate limiter that throttles requests per user or IP for an API gateway.",
    requirements: ["Per-user, per-IP, or per-endpoint?", "Global limit or tiered by plan?", "Reject or queue on limit exceeded?", "Must it work across many gateway instances?"],
    scale: ["e.g. 100 req/min/user", "Millions of distinct users", "State shared across N stateless gateway nodes"],
    focus: ["Algorithm: token bucket vs sliding window log vs sliding window counter", "Where state lives: local memory vs Redis", "Race conditions on concurrent requests at the boundary"],
    rubric: ["Picked an algorithm and justified it against alternatives", "Addressed distributed state (e.g. Redis)", "Discussed race conditions under concurrency", "Handled window-boundary edge effects"] },
  { id: "kv-store", num: "03", title: "Distributed Key-Value Store", tag: "Core",
    prompt: "Design a distributed cache or key-value store (Redis/Memcached-like) that scales horizontally.",
    requirements: ["Consistency requirements?", "Single-key ops only, or ranges too?", "Eviction policy?", "Does data need to survive a node restart?"],
    scale: ["Terabytes of data", "Sharded across many nodes", "Sub-millisecond reads expected"],
    focus: ["Consistent hashing for partitioning (not mod-N)", "Hot-key problem and mitigation", "Replication and failover per shard"],
    rubric: ["Used consistent hashing and explained why over mod-N", "Addressed the hot-key problem", "Covered replication and failover", "Discussed eviction policy trade-offs"] },
  { id: "notifications", num: "04", title: "Notification System", tag: "Core",
    prompt: "Design a system that fans out push, email, and SMS notifications to millions of users.",
    requirements: ["Which channels are in scope?", "Priority/urgency tiers?", "User preferences and opt-out?", "Delivery guarantee - at-least-once?"],
    scale: ["A single trigger can fan out to millions", "Third-party providers (APNs, SMS gateways) have their own rate limits"],
    focus: ["Async processing through a queue, never synchronous", "Per-channel workers with independent scaling", "Retries, dead-letter handling, and idempotency to avoid duplicate sends"],
    rubric: ["Made the send path async via a queue", "Separated by channel/worker type", "Addressed retries and duplicate-delivery prevention", "Handled third-party rate limits / backpressure"] },
  { id: "chat", num: "05", title: "Chat System", tag: "Advanced",
    prompt: "Design a real-time one-to-one and group messaging system (WhatsApp/Slack-like).",
    requirements: ["Delivery guarantees?", "Online vs offline handling?", "Message ordering requirements?", "Media attachments in scope?"],
    scale: ["Millions of concurrent WebSocket connections", "Message history grows unbounded per conversation"],
    focus: ["Routing a message to the connection server holding the recipient", "Store-and-forward for offline users", "Ordering guarantees within a conversation"],
    rubric: ["Addressed routing to the correct connection server", "Handled offline delivery (store-and-forward)", "Discussed ordering guarantees", "Considered group fan-out at scale"] },
  { id: "news-feed", num: "06", title: "News Feed", tag: "Advanced",
    prompt: "Design a news feed showing a user's timeline of posts from people they follow (Twitter/Instagram-like).",
    requirements: ["Chronological or ranked?", "How are celebrity accounts (10M+ followers) handled?", "Read-heavy or write-heavy overall?"],
    scale: ["Some accounts have 10M+ followers", "Feed reads vastly outnumber posts written"],
    focus: ["Push (fan-out-on-write) vs pull (fan-out-on-read) vs hybrid", "The celebrity-account fan-out problem specifically", "Feed caching and pagination"],
    rubric: ["Compared push vs pull fan-out explicitly", "Proposed a hybrid for celebrity accounts", "Addressed feed caching and pagination", "Discussed staleness tolerance"] },
  { id: "web-crawler", num: "07", title: "Web Crawler", tag: "Advanced",
    prompt: "Design a distributed web crawler that indexes billions of pages.",
    requirements: ["Politeness constraints (robots.txt, per-domain rate)?", "Recrawl / freshness policy?", "Full web or a targeted scope?"],
    scale: ["Billions of URLs", "The URL frontier itself becomes a distributed-systems problem"],
    focus: ["Frontier design: priority queue with per-domain politeness", "Dedup via bloom filter or hash set, and its memory trade-off", "Coordinating many crawler workers without duplicate work"],
    rubric: ["Addressed per-domain politeness, not just a global rate", "Used a dedup structure and explained the memory trade-off", "Discussed frontier prioritization / freshness", "Considered coordination across distributed workers"] },
  { id: "ride-share", num: "08", title: "Ride-Sharing Matching", tag: "Advanced",
    prompt: "Design the system that matches riders with nearby available drivers (Uber-like).",
    requirements: ["Matching latency target?", "How often do drivers report location?", "Is pricing/surge in scope?"],
    scale: ["Millions of active drivers reporting location every few seconds"],
    focus: ["Geospatial indexing: geohash, quadtree, or S2 cells", "Ingesting a very high-frequency location update stream", "Preventing two riders from being matched to the same driver"],
    rubric: ["Chose a geospatial indexing approach and justified it", "Addressed high-frequency location ingestion", "Discussed the matching algorithm's failure modes", "Handled the double-match race condition"] },
  { id: "video-streaming", num: "09", title: "Video Upload & Streaming", tag: "Advanced",
    prompt: "Design a system for uploading, processing, and streaming video at scale (YouTube-like).",
    requirements: ["Upload size limits?", "Multiple resolutions/transcoding needed?", "Live streaming in scope, or VOD only?"],
    scale: ["Large file uploads", "Massive, ever-growing storage", "Globally distributed viewers"],
    focus: ["Chunked, resumable upload for large files", "Async transcoding pipeline (queue + worker fleet)", "CDN for playback - never serve video from origin directly"],
    rubric: ["Used chunked/resumable upload", "Made transcoding async via a pipeline", "Used a CDN for playback delivery", "Considered storage tiering for old content"] },
];

const STATUS = {
  "not-started": { label: "Not Started", color: "var(--text-dim)", fill: 0 },
  "attempted": { label: "Attempted", color: "var(--amber)", fill: 33 },
  "reviewed": { label: "Reviewed", color: "var(--amber)", fill: 66 },
  "confident": { label: "Confident", color: "var(--bid)", fill: 100 },
};

const STORAGE_KEY = "sdprep-state-v1";

function defaultState() {
  const problems = {};
  PROBLEMS.forEach((p) => { problems[p.id] = { status: "not-started", notes: "", rubric: p.rubric.map(() => false) }; });
  return { problems, mockCount: 0 };
}

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--amber)", letterSpacing: "0.08em", marginBottom: "4px" }}>{eyebrow}</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700, margin: 0 }}>{title}</h1>
      {sub && <p style={{ color: "var(--text-dim)", fontSize: "13px", marginTop: "6px", maxWidth: "600px", lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

function FrameworkView() {
  return (
    <div>
      <SectionHeader eyebrow="00 / THE FRAMEWORK" title="Run every problem through this" sub="Eight phases, sixty minutes. This is the structure an interviewer is silently checking you against, whether they say so or not." />
      <div>
        {FRAMEWORK_STEPS.map((s, i) => (
          <div key={s.num} style={{ display: "flex", gap: "16px", paddingBottom: i < FRAMEWORK_STEPS.length - 1 ? "18px" : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--panel)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--amber)" }}>{s.num}</div>
              {i < FRAMEWORK_STEPS.length - 1 && <div style={{ width: "1px", flex: 1, background: "var(--border)", marginTop: "4px" }} />}
            </div>
            <div style={{ paddingBottom: "4px", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, margin: 0 }}>{s.title}</h3>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-dim)" }}>{s.minutes} min &middot; ends at {s.cumulative}:00</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "6px", lineHeight: 1.6, maxWidth: "620px" }}>{s.detail}</p>
              <div style={{ marginTop: "6px", fontSize: "12px", color: "var(--amber)" }}>&rarr; {s.tip}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConceptsView() {
  return (
    <div>
      <SectionHeader eyebrow="01 / CONCEPTS" title="Cheat sheet" sub="What you need cold before you walk in. Skim before every mock session." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "14px" }}>
        {CONCEPTS.map((c) => (
          <div key={c.title} style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "8px", padding: "14px 16px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 600, margin: "0 0 8px 0" }}>{c.title}</h3>
            <ul style={{ margin: 0, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {c.points.map((pt, i) => <li key={i} style={{ fontSize: "12.5px", color: "var(--text-dim)", lineHeight: 1.5 }}>{pt}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Block({ title, items }) {
  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px 14px" }}>
      <div style={{ fontSize: "11px", color: "var(--amber)", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: "14px", display: "flex", flexDirection: "column", gap: "5px" }}>
        {items.map((c, i) => <li key={i} style={{ fontSize: "12px", color: "var(--text-dim)", lineHeight: 1.5 }}>{c}</li>)}
      </ul>
    </div>
  );
}

function ProblemListView({ data, onOpen }) {
  return (
    <div>
      <SectionHeader eyebrow="02 / PROBLEM SET" title="Nine problems" sub="Work top to bottom. Click a row to see the breakdown, or jump straight into a mock session." />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {PROBLEMS.map((p) => {
          const st = data.problems[p.id];
          const meta = STATUS[st.status];
          return (
            <div key={p.id} className="depth-row nav-btn" onClick={() => onOpen(p.id)}
              style={{ cursor: "pointer", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div className="depth-fill" style={{ width: meta.fill + "%" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "14px", position: "relative", zIndex: 1 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-dim)" }}>{p.num}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>{p.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>{p.tag}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 1 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: meta.color }}>{meta.label}</span>
                <ChevronRight size={14} color="var(--text-dim)" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProblemDetailView({ problem, state, onBack, onStatus, onNotes, onStartMock }) {
  const [notes, setNotesLocal] = useState(state.notes);
  return (
    <div>
      <button onClick={onBack} className="nav-btn" style={{ background: "transparent", border: "none", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", padding: "4px 0", marginBottom: "14px" }}>
        <ChevronLeft size={14} /> Back to problem set
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--amber)" }}>{problem.num}</span>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, margin: 0 }}>{problem.title}</h1>
        <span style={{ fontSize: "11px", color: "var(--text-dim)", border: "1px solid var(--border)", borderRadius: "4px", padding: "2px 8px" }}>{problem.tag}</span>
      </div>
      <p style={{ color: "var(--text-dim)", fontSize: "13.5px", marginTop: "10px", maxWidth: "620px", lineHeight: 1.6 }}>{problem.prompt}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: "14px", marginTop: "20px" }}>
        <Block title="Clarify before you design" items={problem.requirements} />
        <Block title="Scale to estimate" items={problem.scale} />
        <Block title="Where you'll be probed" items={problem.focus} />
      </div>

      <div style={{ marginTop: "22px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Self-check rubric</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {problem.rubric.map((r, i) => (
            <label key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "var(--text-dim)" }}>
              <input type="checkbox" checked={!!state.rubric[i]} readOnly disabled style={{ accentColor: "var(--bid)" }} />
              {r}
            </label>
          ))}
        </div>
        <p style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "6px", fontStyle: "italic" }}>Checked off during a mock session, not here.</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Notes</h3>
        <textarea value={notes} onChange={(e) => setNotesLocal(e.target.value)} onBlur={() => onNotes(notes)}
          placeholder="Weak spots, things you fumbled, what to revisit..."
          style={{ width: "100%", minHeight: "80px", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text)", padding: "10px 12px", fontSize: "13px", fontFamily: "var(--font-body)", resize: "vertical" }} />
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={onStartMock} style={{ background: "var(--amber)", color: "#0A0D10", border: "none", borderRadius: "6px", padding: "9px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <Play size={14} /> Start mock interview
        </button>
        <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>Status:</span>
        {Object.keys(STATUS).map((key) => (
          <button key={key} onClick={() => onStatus(key)}
            style={{ background: state.status === key ? "var(--panel-alt)" : "transparent", border: "1px solid var(--border)", borderRadius: "5px", padding: "5px 10px", fontSize: "11px", color: state.status === key ? STATUS[key].color : "var(--text-dim)", cursor: "pointer" }}>
            {STATUS[key].label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MockView({ mockProblemId, mockEnded, mm, ss, elapsedSec, currentPhase, mockNotes, setMockNotes, mockRubricChecks, setMockRubricChecks, onStart, onEnd, onSave }) {
  if (!mockProblemId) {
    return (
      <div>
        <SectionHeader eyebrow="03 / MOCK INTERVIEW" title="Pick a problem" sub="A 60-minute timer runs through all eight framework phases. Talk out loud the whole time - silent thinking doesn't train the skill." />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {PROBLEMS.map((p) => (
            <button key={p.id} onClick={() => onStart(p.id)} className="nav-btn"
              style={{ textAlign: "left", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", color: "var(--text)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--amber)" }}>{p.num}</span>
              <span style={{ fontSize: "13.5px" }}>{p.title}</span>
              <span style={{ fontSize: "11px", color: "var(--text-dim)", marginLeft: "auto" }}>{p.tag}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const problem = PROBLEMS.find((p) => p.id === mockProblemId);

  if (mockEnded) {
    return (
      <div>
        <SectionHeader eyebrow="03 / MOCK INTERVIEW - SELF-GRADE" title={problem.title} sub="Check off what you actually covered, honestly. This sets your status." />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
          {problem.rubric.map((r, i) => (
            <label key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", cursor: "pointer", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 12px" }}>
              <input type="checkbox" checked={mockRubricChecks[i]} onChange={(e) => {
                const next = [...mockRubricChecks]; next[i] = e.target.checked; setMockRubricChecks(next);
              }} style={{ accentColor: "var(--bid)" }} />
              {r}
            </label>
          ))}
        </div>
        <button onClick={onSave} style={{ background: "var(--bid)", color: "#0A0D10", border: "none", borderRadius: "6px", padding: "10px 18px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          Save & finish
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "18px" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--amber)" }}>03 / MOCK INTERVIEW</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, margin: "2px 0 0 0" }}>{problem.title}</h1>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "32px", color: "var(--amber)", fontWeight: 600 }}>{mm}:{ss}</div>
      </div>

      <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "8px", padding: "14px 16px", marginBottom: "16px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>CURRENT PHASE</div>
        <div style={{ fontSize: "15px", fontWeight: 600, marginTop: "4px" }}>{currentPhase.num} &middot; {currentPhase.title}</div>
        <div style={{ fontSize: "12.5px", color: "var(--text-dim)", marginTop: "6px", lineHeight: 1.5 }}>{currentPhase.detail}</div>
        <div style={{ fontSize: "12px", color: "var(--amber)", marginTop: "6px" }}>&rarr; {currentPhase.tip}</div>
      </div>

      <div style={{ display: "flex", gap: "2px", marginBottom: "18px" }}>
        {FRAMEWORK_STEPS.map((s) => (
          <div key={s.num} title={s.title} style={{ flex: s.minutes, height: "5px", borderRadius: "2px", background: currentPhase.num === s.num ? "var(--amber)" : (elapsedSec / 60 >= s.cumulative ? "var(--bid)" : "var(--border)") }} />
        ))}
      </div>

      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-dim)", marginBottom: "4px", fontFamily: "var(--font-mono)" }}>PROBLEM</div>
        <p style={{ fontSize: "13px", color: "var(--text-dim)", margin: 0, lineHeight: 1.6 }}>{problem.prompt}</p>
      </div>

      <textarea value={mockNotes} onChange={(e) => setMockNotes(e.target.value)} placeholder="Scratch space: requirements, API, diagram description, deep-dive notes..."
        style={{ width: "100%", minHeight: "160px", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text)", padding: "12px 14px", fontSize: "13px", fontFamily: "var(--font-mono)", resize: "vertical", marginBottom: "16px" }} />

      <button onClick={onEnd} style={{ background: "var(--ask)", color: "#0A0D10", border: "none", borderRadius: "6px", padding: "10px 18px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
        <Square size={14} /> End session
      </button>
    </div>
  );
}

function ProgressView({ data, onOpen }) {
  const total = PROBLEMS.length;
  const doneCount = Object.values(data.problems).filter((p) => p.status === "confident").length;
  return (
    <div>
      <SectionHeader eyebrow="04 / PROGRESS" title="Where you stand" sub={doneCount + " of " + total + " problems at confident. " + data.mockCount + " mock sessions logged."} />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {PROBLEMS.map((p) => {
          const st = data.problems[p.id];
          const meta = STATUS[st.status];
          const checkedCount = st.rubric.filter(Boolean).length;
          return (
            <div key={p.id} onClick={() => onOpen(p.id)} className="depth-row nav-btn" style={{ cursor: "pointer", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="depth-fill" style={{ width: meta.fill + "%" }} />
              <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-dim)" }}>{p.num}</span>
                <span style={{ fontSize: "13.5px" }}>{p.title}</span>
              </div>
              <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-dim)" }}>{checkedCount}/{p.rubric.length} checks</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: meta.color, minWidth: "80px", textAlign: "right" }}>{meta.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SystemDesignPrep() {
  const [view, setView] = useState("framework");
  const [data, setData] = useState(null);
  const [activeProblemId, setActiveProblemId] = useState(null);
  const [mockProblemId, setMockProblemId] = useState(null);
  const [mockRunning, setMockRunning] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [mockNotes, setMockNotes] = useState("");
  const [mockEnded, setMockEnded] = useState(false);
  const [mockRubricChecks, setMockRubricChecks] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        setData(res ? JSON.parse(res.value) : defaultState());
      } catch (e) {
        setData(defaultState());
      }
    })();
  }, []);

  const persist = async (next) => {
    setData(next);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(next), false); } catch (e) { /* best effort */ }
  };

  useEffect(() => {
    if (mockRunning) {
      timerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mockRunning]);

  if (!data) {
    return (
      <div style={{ background: "#0A0D10", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B96A3", fontFamily: "monospace" }}>
        LOADING...
      </div>
    );
  }

  const total = PROBLEMS.length;
  const doneCount = Object.values(data.problems).filter((p) => p.status === "confident").length;
  const attemptedCount = Object.values(data.problems).filter((p) => p.status !== "not-started").length;

  const elapsedMin = elapsedSec / 60;
  const currentPhase = FRAMEWORK_STEPS.find((s) => elapsedMin < s.cumulative) || FRAMEWORK_STEPS[FRAMEWORK_STEPS.length - 1];
  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
  const ss = String(elapsedSec % 60).padStart(2, "0");

  function startMock(problemId) {
    setMockProblemId(problemId);
    setElapsedSec(0);
    setMockRunning(true);
    setMockEnded(false);
    setMockNotes("");
    const prob = PROBLEMS.find((p) => p.id === problemId);
    setMockRubricChecks(prob.rubric.map(() => false));
  }

  function endMock() {
    setMockRunning(false);
    setMockEnded(true);
  }

  async function saveMockResult() {
    const checkedCount = mockRubricChecks.filter(Boolean).length;
    const ratio = checkedCount / mockRubricChecks.length;
    let status = "attempted";
    if (ratio === 1) status = "confident";
    else if (ratio > 0) status = "reviewed";
    const next = {
      ...data,
      mockCount: data.mockCount + 1,
      problems: {
        ...data.problems,
        [mockProblemId]: { status, notes: mockNotes, rubric: mockRubricChecks },
      },
    };
    await persist(next);
    setView("progress");
    setMockProblemId(null);
    setMockEnded(false);
  }

  async function setProblemStatus(id, status) {
    const next = { ...data, problems: { ...data.problems, [id]: { ...data.problems[id], status } } };
    await persist(next);
  }

  async function setProblemNotes(id, notes) {
    const next = { ...data, problems: { ...data.problems, [id]: { ...data.problems[id], notes } } };
    await persist(next);
  }

  const navItems = [
    { id: "framework", label: "Framework", num: "00" },
    { id: "concepts", label: "Concepts", num: "01" },
    { id: "problems", label: "Problem Set", num: "02" },
    { id: "mock", label: "Mock Interview", num: "03" },
    { id: "progress", label: "Progress", num: "04" },
  ];

  return (
    <div style={{
      "--bg": "#0A0D10", "--panel": "#12161B", "--panel-alt": "#171C22", "--border": "#232A32",
      "--text": "#E7EAEE", "--text-dim": "#8B96A3", "--bid": "#3FB68B", "--ask": "#E2664A", "--amber": "#E8A33D",
      "--font-display": "'Space Grotesk', sans-serif", "--font-body": "'Inter', sans-serif", "--font-mono": "'IBM Plex Mono', monospace",
      background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", minHeight: "640px", display: "flex", flexDirection: "column",
      borderRadius: "10px", overflow: "hidden", border: "1px solid #232A32",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .sdp-scroll::-webkit-scrollbar { width: 6px; }
        .sdp-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        .depth-row { position: relative; overflow: hidden; }
        .depth-fill { position: absolute; left: 0; top: 0; bottom: 0; background: linear-gradient(90deg, rgba(63,182,139,0.14), rgba(63,182,139,0.02)); transition: width 0.4s ease; }
        .nav-btn { transition: background 0.15s ease, color 0.15s ease; }
        .nav-btn:hover { background: var(--panel-alt); }
        textarea:focus, button:focus-visible { outline: 2px solid var(--amber); outline-offset: 1px; }
      `}</style>

      <div style={{ borderBottom: "1px solid var(--border)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Terminal size={16} color="var(--amber)" />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", letterSpacing: "0.04em" }}>SYSTEM DESIGN PREP</span>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-dim)", display: "flex", gap: "18px" }}>
          <span>ATTEMPTED <span style={{ color: "var(--text)" }}>{attemptedCount}/{total}</span></span>
          <span>CONFIDENT <span style={{ color: "var(--bid)" }}>{doneCount}/{total}</span></span>
          <span>SESSIONS <span style={{ color: "var(--amber)" }}>{data.mockCount}</span></span>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: "560px" }}>
        <div style={{ width: "180px", borderRight: "1px solid var(--border)", padding: "14px 0", flexShrink: 0 }}>
          {navItems.map((item) => (
            <button key={item.id} className="nav-btn" onClick={() => { setView(item.id); setActiveProblemId(null); }}
              style={{ width: "100%", textAlign: "left", padding: "10px 18px", background: view === item.id ? "var(--panel-alt)" : "transparent", border: "none", borderLeft: view === item.id ? "2px solid var(--amber)" : "2px solid transparent", color: view === item.id ? "var(--text)" : "var(--text-dim)", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-body)", fontSize: "13px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--amber)" }}>{item.num}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="sdp-scroll" style={{ flex: 1, padding: "24px 28px", overflowY: "auto", maxHeight: "640px" }}>
          {view === "framework" && <FrameworkView />}
          {view === "concepts" && <ConceptsView />}
          {view === "problems" && !activeProblemId && <ProblemListView data={data} onOpen={setActiveProblemId} />}
          {view === "problems" && activeProblemId && (
            <ProblemDetailView
              problem={PROBLEMS.find((p) => p.id === activeProblemId)}
              state={data.problems[activeProblemId]}
              onBack={() => setActiveProblemId(null)}
              onStatus={(s) => setProblemStatus(activeProblemId, s)}
              onNotes={(n) => setProblemNotes(activeProblemId, n)}
              onStartMock={() => { setView("mock"); startMock(activeProblemId); }}
            />
          )}
          {view === "mock" && (
            <MockView
              mockProblemId={mockProblemId} mockEnded={mockEnded}
              elapsedSec={elapsedSec} mm={mm} ss={ss} currentPhase={currentPhase}
              mockNotes={mockNotes} setMockNotes={setMockNotes}
              mockRubricChecks={mockRubricChecks} setMockRubricChecks={setMockRubricChecks}
              onStart={startMock} onEnd={endMock} onSave={saveMockResult}
            />
          )}
          {view === "progress" && <ProgressView data={data} onOpen={(id) => { setView("problems"); setActiveProblemId(id); }} />}
        </div>
      </div>
    </div>
  );
}
