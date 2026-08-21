// Solutions are publicly linked walkthroughs; paid book chapters may differ; user should attempt first.

/** @typedef {{ title: string, url: string, kind: "article"|"video"|"course"|"search", note?: string }} SolutionLink */

/** @type {Record<string, SolutionLink[]>} */
export const SOLUTIONS_BY_ID = {
  "rate-limiter": [
    { title: "ByteByteGo: Design a Rate Limiter", url: "https://bytebytego.com/courses/system-design-interview/design-a-rate-limiter", kind: "course" },
    { title: "Hello Interview: Rate Limiter", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-rate-limiter", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Rate%20Limiter", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Rate%20Limiter%20interview%20solution", kind: "search" },
  ],
  "consistent-hashing": [
    { title: "ByteByteGo: Design Consistent Hashing", url: "https://bytebytego.com/courses/system-design-interview/design-consistent-hashing", kind: "course" },
    { title: "Gaurav Sen: Consistent Hashing", url: "https://www.youtube.com/watch?v=UF9Iqmg94tk", kind: "video" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Consistent%20Hashing", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Consistent%20Hashing%20interview%20solution", kind: "search" },
  ],
  "key-value-store": [
    { title: "ByteByteGo: Design a Key-Value Store", url: "https://bytebytego.com/courses/system-design-interview/design-a-key-value-store", kind: "course" },
    { title: "Hello Interview: Key-Value Store", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-key-value-store", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Key-Value%20Store", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Key-Value%20Store%20interview%20solution", kind: "search" },
  ],
  "unique-id-generator": [
    { title: "ByteByteGo: Unique ID Generator", url: "https://bytebytego.com/courses/system-design-interview/design-a-unique-id-generator-in-distributed-systems", kind: "course" },
    { title: "Hello Interview: Unique ID Generator", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-unique-id-generator", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Unique%20ID%20Generator", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Unique%20ID%20Generator%20interview%20solution", kind: "search" },
  ],
  "url-shortener": [
    { title: "ByteByteGo: Design a URL Shortener", url: "https://bytebytego.com/courses/system-design-interview/design-a-url-shortener", kind: "course" },
    { title: "Hello Interview: URL Shortener", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-url-shortener", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20URL%20Shortener", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20URL%20Shortener%20interview%20solution", kind: "search" },
  ],
  "web-crawler": [
    { title: "ByteByteGo: Design a Web Crawler", url: "https://bytebytego.com/courses/system-design-interview/design-a-web-crawler", kind: "course" },
    { title: "Hello Interview: Web Crawler", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-web-crawler", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Web%20Crawler", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Web%20Crawler%20interview%20solution", kind: "search" },
  ],
  "notification-system": [
    { title: "ByteByteGo: Notification System", url: "https://bytebytego.com/courses/system-design-interview/design-a-notification-system", kind: "course" },
    { title: "Hello Interview: Notification System", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-notification-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Notification%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Notification%20System%20interview%20solution", kind: "search" },
  ],
  "news-feed": [
    { title: "ByteByteGo: News Feed System", url: "https://bytebytego.com/courses/system-design-interview/design-a-news-feed-system", kind: "course" },
    { title: "Hello Interview: News Feed", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-news-feed", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20News%20Feed", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20News%20Feed%20interview%20solution", kind: "search" },
  ],
  "chat-system": [
    { title: "ByteByteGo: Chat System", url: "https://bytebytego.com/courses/system-design-interview/design-a-chat-system", kind: "course" },
    { title: "Hello Interview: Chat System", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-chat-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Chat%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Chat%20System%20interview%20solution", kind: "search" },
  ],
  "search-autocomplete": [
    { title: "ByteByteGo: Search Autocomplete", url: "https://bytebytego.com/courses/system-design-interview/design-a-search-autocomplete-system", kind: "course" },
    { title: "Hello Interview: Search Autocomplete", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-search-autocomplete", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Search%20Autocomplete", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Search%20Autocomplete%20interview%20solution", kind: "search" },
  ],
  "youtube": [
    { title: "ByteByteGo: Design YouTube", url: "https://bytebytego.com/courses/system-design-interview/design-youtube", kind: "course" },
    { title: "Hello Interview: YouTube", url: "https://www.hellointerview.com/learn/system-design/problem/design-youtube", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20YouTube", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20YouTube%20interview%20solution", kind: "search" },
  ],
  "google-drive": [
    { title: "ByteByteGo: Design Google Drive", url: "https://bytebytego.com/courses/system-design-interview/design-google-drive", kind: "course" },
    { title: "Hello Interview: Dropbox / Drive", url: "https://www.hellointerview.com/learn/system-design/problem/design-dropbox", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Google%20Drive", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Google%20Drive%20interview%20solution", kind: "search" },
  ],
  "proximity-service": [
    { title: "ByteByteGo: Proximity Service", url: "https://bytebytego.com/courses/system-design-interview/proximity-service", kind: "course" },
    { title: "Hello Interview: Proximity Service", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-proximity-service", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Proximity%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Proximity%20Service%20interview%20solution", kind: "search" },
  ],
  "nearby-friends": [
    { title: "ByteByteGo: Nearby Friends", url: "https://bytebytego.com/courses/system-design-interview/nearby-friends", kind: "course" },
    { title: "Hello Interview: Nearby Friends", url: "https://www.hellointerview.com/learn/system-design/problem/design-nearby-friends", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Nearby%20Friends", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Nearby%20Friends%20interview%20solution", kind: "search" },
  ],
  "google-maps": [
    { title: "ByteByteGo: Google Maps", url: "https://bytebytego.com/courses/system-design-interview/google-maps", kind: "course" },
    { title: "Hello Interview: Google Maps", url: "https://www.hellointerview.com/learn/system-design/problem/design-google-maps", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Google%20Maps", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Google%20Maps%20interview%20solution", kind: "search" },
  ],
  "distributed-message-queue": [
    { title: "ByteByteGo: Distributed Message Queue", url: "https://bytebytego.com/courses/system-design-interview/distributed-message-queue", kind: "course" },
    { title: "Hello Interview: Message Queue", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-message-queue", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Distributed%20Message%20Queue", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Distributed%20Message%20Queue%20interview%20solution", kind: "search" },
  ],
  "metrics-monitoring": [
    { title: "ByteByteGo: Metrics Monitoring", url: "https://bytebytego.com/courses/system-design-interview/metrics-monitoring-and-alerting-system", kind: "course" },
    { title: "Hello Interview: Metrics Monitoring", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-metrics-monitoring-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Metrics%20Monitoring", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Metrics%20Monitoring%20interview%20solution", kind: "search" },
  ],
  "ad-click-aggregation": [
    { title: "ByteByteGo: Ad Click Aggregation", url: "https://bytebytego.com/courses/system-design-interview/ad-click-event-aggregation", kind: "course" },
    { title: "Hello Interview: Ad Click Aggregation", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-ad-click-aggregator", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Ad%20Click%20Aggregation", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Ad%20Click%20Aggregation%20interview%20solution", kind: "search" },
  ],
  "hotel-reservation": [
    { title: "ByteByteGo: Hotel Reservation", url: "https://bytebytego.com/courses/system-design-interview/hotel-reservation", kind: "course" },
    { title: "Hello Interview: Hotel Reservation", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-hotel-reservation-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Hotel%20Reservation", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Hotel%20Reservation%20interview%20solution", kind: "search" },
  ],
  "distributed-email": [
    { title: "ByteByteGo: Distributed Email", url: "https://bytebytego.com/courses/system-design-interview/distributed-email-service", kind: "course" },
    { title: "Hello Interview: Gmail / Email", url: "https://www.hellointerview.com/learn/system-design/problem/design-gmail", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Distributed%20Email%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Distributed%20Email%20Service%20interview%20solution", kind: "search" },
  ],
  "s3-object-storage": [
    { title: "ByteByteGo: S3-like Object Storage", url: "https://bytebytego.com/courses/system-design-interview/s3-like-object-storage", kind: "course" },
    { title: "Hello Interview: S3", url: "https://www.hellointerview.com/learn/system-design/problem/design-s3", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20S3-like%20Object%20Storage", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20S3-like%20Object%20Storage%20interview%20solution", kind: "search" },
  ],
  "gaming-leaderboard": [
    { title: "ByteByteGo: Gaming Leaderboard", url: "https://bytebytego.com/courses/system-design-interview/real-time-gaming-leaderboard", kind: "course" },
    { title: "Hello Interview: Leaderboard", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-leaderboard", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Gaming%20Leaderboard", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Gaming%20Leaderboard%20interview%20solution", kind: "search" },
  ],
  "payment-system": [
    { title: "ByteByteGo: Payment System", url: "https://bytebytego.com/courses/system-design-interview/payment-system", kind: "course" },
    { title: "Hello Interview: Payment System", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-payment-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Payment%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Payment%20System%20interview%20solution", kind: "search" },
  ],
  "digital-wallet": [
    { title: "ByteByteGo: Digital Wallet", url: "https://bytebytego.com/courses/system-design-interview/digital-wallet", kind: "course" },
    { title: "Hello Interview: Digital Wallet", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-digital-wallet", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Digital%20Wallet", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Digital%20Wallet%20interview%20solution", kind: "search" },
  ],
  "stock-exchange": [
    { title: "ByteByteGo: Stock Exchange", url: "https://bytebytego.com/courses/system-design-interview/stock-exchange", kind: "course" },
    { title: "Hello Interview: Stock Exchange", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-stock-exchange", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Stock%20Exchange", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Stock%20Exchange%20interview%20solution", kind: "search" },
  ],
  "distributed-log-wal": [
    { title: "Hello Interview: Distributed Log", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-distributed-log", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Distributed%20Log%20%2F%20WAL%20Storage", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Distributed%20Log%20%2F%20WAL%20Storage%20interview%20solution", kind: "search" },
  ],
  "leaderless-replication-store": [
    { title: "Hello Interview: Dynamo / Leaderless Store", url: "https://www.hellointerview.com/learn/system-design/problem/design-dynamo", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Leaderless%20Replication%20Store", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Leaderless%20Replication%20Store%20interview%20solution", kind: "search" },
  ],
  "partitioned-db-secondary-indexes": [
    { title: "Hello Interview: Secondary Indexes", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-distributed-database", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Partitioned%20DB%20with%20Secondary%20Indexes", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Partitioned%20DB%20with%20Secondary%20Indexes%20interview%20solution", kind: "search" },
  ],
  "consensus-raft-coordination": [
    { title: "Hello Interview: Consensus", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-consensus-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Consensus%20%2F%20Raft%20Coordination%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Consensus%20%2F%20Raft%20Coordination%20Service%20interview%20solution", kind: "search" },
  ],
  "stream-processing-pipeline": [
    { title: "Hello Interview: Stream Processing", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-stream-processing-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Stream%20Processing%20Pipeline", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Stream%20Processing%20Pipeline%20interview%20solution", kind: "search" },
  ],
  "change-data-capture": [
    { title: "Hello Interview: CDC", url: "https://www.hellointerview.com/learn/system-design/problem/design-change-data-capture", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Change%20Data%20Capture", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Change%20Data%20Capture%20interview%20solution", kind: "search" },
  ],
  "transaction-saga-orchestrator": [
    { title: "Hello Interview: Saga Orchestrator", url: "https://www.hellointerview.com/learn/system-design/problem/design-saga-pattern", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Transaction%20Saga%20Orchestrator", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Transaction%20Saga%20Orchestrator%20interview%20solution", kind: "search" },
  ],
  "bloom-filter-dedup-service": [
    { title: "Hello Interview: Dedup / Bloom Filter", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-deduplication-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Bloom%20Filter%20Dedup%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Bloom%20Filter%20Dedup%20Service%20interview%20solution", kind: "search" },
  ],
  "pastebin": [
    { title: "Hello Interview: Pastebin", url: "https://www.hellointerview.com/learn/system-design/problem/design-pastebin", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Pastebin", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Pastebin%20interview%20solution", kind: "search" },
  ],
  "parking-lot": [
    { title: "Hello Interview: Parking Lot", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-parking-lot", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Parking%20Lot%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Parking%20Lot%20System%20interview%20solution", kind: "search" },
  ],
  "job-scheduler": [
    { title: "Hello Interview: Job Scheduler", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-job-scheduler", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Distributed%20Job%20Scheduler", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Distributed%20Job%20Scheduler%20interview%20solution", kind: "search" },
  ],
  "text-search": [
    { title: "Hello Interview: Search Engine", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-search-engine", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Full-Text%20Search", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Full-Text%20Search%20interview%20solution", kind: "search" },
  ],
  "auth-session": [
    { title: "Hello Interview: Authentication", url: "https://www.hellointerview.com/learn/system-design/problem/design-authentication", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Auth%20and%20Session%20Management", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Auth%20and%20Session%20Management%20interview%20solution", kind: "search" },
  ],
  "recommendation-system": [
    { title: "Hello Interview: Recommendation System", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-recommendation-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Recommendation%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Recommendation%20System%20interview%20solution", kind: "search" },
  ],
  "fraud-detection": [
    { title: "Hello Interview: Fraud Detection", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-fraud-detection-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Fraud%20Detection", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Fraud%20Detection%20interview%20solution", kind: "search" },
  ],
  "live-video-twitch": [
    { title: "Hello Interview: Twitch / Live Video", url: "https://www.hellointerview.com/learn/system-design/problem/design-twitch", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Live%20Video%20Streaming%20(Twitch)", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Live%20Video%20Streaming%20(Twitch)%20interview%20solution", kind: "search" },
  ],
  "api-gateway": [
    { title: "Hello Interview: API Gateway", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-api-gateway", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20API%20Gateway", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20API%20Gateway%20interview%20solution", kind: "search" },
  ],
  "collaborative-docs": [
    { title: "Hello Interview: Google Docs", url: "https://www.hellointerview.com/learn/system-design/problem/design-google-docs", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Collaborative%20Docs%20(Google%20Docs)", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Collaborative%20Docs%20(Google%20Docs)%20interview%20solution", kind: "search" },
  ],
  "flight-booking": [
    { title: "Hello Interview: Flight Booking", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-flight-booking-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Flight%20Booking", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Flight%20Booking%20interview%20solution", kind: "search" },
  ],
  "ad-serving": [
    { title: "Hello Interview: Ad Serving", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-ad-server", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Ad%20Serving", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Ad%20Serving%20interview%20solution", kind: "search" },
  ],
  "cdn": [
    { title: "Hello Interview: CDN", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-cdn", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Content%20Delivery%20Network", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Content%20Delivery%20Network%20interview%20solution", kind: "search" },
  ],
  "order-management": [
    { title: "Hello Interview: E-commerce / Orders", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-e-commerce-website", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Order%20Management%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Order%20Management%20System%20interview%20solution", kind: "search" },
  ],
  "distributed-sql-spanner": [
    { title: "Hello Interview: Distributed Database", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-distributed-database", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Distributed%20SQL%20(Spanner-like)", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Distributed%20SQL%20(Spanner-like)%20interview%20solution", kind: "search" },
  ],
  "social-graph": [
    { title: "Hello Interview: Social Graph", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-social-network", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Social%20Graph", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Social%20Graph%20interview%20solution", kind: "search" },
  ],
  "distributed-tracing": [
    { title: "Hello Interview: Distributed Tracing", url: "https://www.hellointerview.com/learn/system-design/problem/design-distributed-tracing", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Distributed%20Tracing", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Distributed%20Tracing%20interview%20solution", kind: "search" },
  ],
  "multiplayer-game-backend": [
    { title: "Hello Interview: Multiplayer Game", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-multiplayer-game", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Multiplayer%20Game%20Backend", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Multiplayer%20Game%20Backend%20interview%20solution", kind: "search" },
  ],
  "surge-pricing": [
    { title: "Hello Interview: Uber / Surge Pricing", url: "https://www.hellointerview.com/learn/system-design/problem/design-uber", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Surge%20Pricing", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Surge%20Pricing%20interview%20solution", kind: "search" },
  ],
  "global-payments": [
    { title: "Hello Interview: Payments", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-payment-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Global%20Payments", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Global%20Payments%20interview%20solution", kind: "search" },
  ],
  "ad-auction": [
    { title: "Hello Interview: Ad Auction", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-ad-auction", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Ad%20Auction", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Ad%20Auction%20interview%20solution", kind: "search" },
  ],
  "cross-platform-identity": [
    { title: "Hello Interview: Identity", url: "https://www.hellointerview.com/learn/system-design/problem/design-authentication", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Cross-Platform%20Identity", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Cross-Platform%20Identity%20interview%20solution", kind: "search" },
  ],
  "cloud-provisioning": [
    { title: "Hello Interview: Cloud Provisioning", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-cloud-orchestration-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Cloud%20Provisioning", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Cloud%20Provisioning%20interview%20solution", kind: "search" },
  ],
  "global-event-streaming": [
    { title: "Hello Interview: Event Streaming", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-message-queue", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Global%20Event%20Streaming", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Global%20Event%20Streaming%20interview%20solution", kind: "search" },
  ],
  "stripe-idempotent-payments-api": [
    { title: "Hello Interview: Payments API", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-payment-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Stripe%20Idempotent%20Payments%20API", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Stripe%20Idempotent%20Payments%20API%20interview%20solution", kind: "search" },
  ],
  "airbnb-listing-search-booking": [
    { title: "Hello Interview: Airbnb", url: "https://www.hellointerview.com/learn/system-design/problem/design-airbnb", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Airbnb%20Listing%20Search%20and%20Booking", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Airbnb%20Listing%20Search%20and%20Booking%20interview%20solution", kind: "search" },
  ],
  "openai-llm-inference-platform": [
    { title: "Hello Interview: LLM Inference", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-llm-inference-platform", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20OpenAI-like%20LLM%20Inference%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20OpenAI-like%20LLM%20Inference%20Platform%20interview%20solution", kind: "search" },
  ],
  "notion-collaborative-workspace": [
    { title: "Hello Interview: Notion", url: "https://www.hellointerview.com/learn/system-design/problem/design-notion", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Notion%20Collaborative%20Workspace", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Notion%20Collaborative%20Workspace%20interview%20solution", kind: "search" },
  ],
  "discord-voice-channels": [
    { title: "Hello Interview: Discord", url: "https://www.hellointerview.com/learn/system-design/problem/design-discord", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Discord%20Voice%20Channels", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Discord%20Voice%20Channels%20interview%20solution", kind: "search" },
  ],
  "linear-issue-tracker-realtime": [
    { title: "Hello Interview: Issue Tracker", url: "https://www.hellointerview.com/learn/system-design/problem/design-jira", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Linear%20Realtime%20Issue%20Tracker", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Linear%20Realtime%20Issue%20Tracker%20interview%20solution", kind: "search" },
  ],
  "figma-multiplayer-canvas": [
    { title: "Hello Interview: Figma", url: "https://www.hellointerview.com/learn/system-design/problem/design-figma", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Figma%20Multiplayer%20Canvas%20Sync", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Figma%20Multiplayer%20Canvas%20Sync%20interview%20solution", kind: "search" },
  ],
  "uber-eats-food-delivery": [
    { title: "Hello Interview: Uber (related)", url: "https://www.hellointerview.com/learn/system-design/problem/design-uber", kind: "article" },
    { title: "Gaurav Sen: Uber System Design", url: "https://www.youtube.com/watch?v=um3NJpaFmrU", kind: "video" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Uber%20Eats%20Food%20Delivery%20Matching", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Uber%20Eats%20Food%20Delivery%20Matching%20interview%20solution", kind: "search" },
  ],
  "ticketmaster-ticket-booking": [
    { title: "Hello Interview: Ticketmaster", url: "https://www.hellointerview.com/learn/system-design/problem/design-ticketmaster", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Ticketmaster%20Ticket%20Booking", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Ticketmaster%20Ticket%20Booking%20interview%20solution", kind: "search" },
  ],
  "instagram-stories": [
    { title: "Hello Interview: Instagram", url: "https://www.hellointerview.com/learn/system-design/problem/design-instagram", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Instagram%20Stories", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Instagram%20Stories%20interview%20solution", kind: "search" },
  ],
  "slack-workspace-messaging": [
    { title: "Hello Interview: Slack", url: "https://www.hellointerview.com/learn/system-design/problem/design-slack", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Slack%20Workspace%20Messaging", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Slack%20Workspace%20Messaging%20interview%20solution", kind: "search" },
  ],
  "zoom-video-conferencing": [
    { title: "Hello Interview: Zoom", url: "https://www.hellointerview.com/learn/system-design/problem/design-zoom", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Zoom%20Video%20Conferencing", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Zoom%20Video%20Conferencing%20interview%20solution", kind: "search" },
  ],
  "spotify-music-streaming": [
    { title: "Hello Interview: Spotify", url: "https://www.hellointerview.com/learn/system-design/problem/design-spotify", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Spotify%20Music%20Streaming", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Spotify%20Music%20Streaming%20interview%20solution", kind: "search" },
  ],
  "cloudflare-waf-ddos": [
    { title: "Hello Interview: WAF / DDoS", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-waf", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Cloudflare-like%20WAF%20and%20DDoS%20Protection", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Cloudflare-like%20WAF%20and%20DDoS%20Protection%20interview%20solution", kind: "search" },
  ],
  "rag-search-platform": [
    { title: "Hello Interview: Search / RAG", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-search-engine", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20RAG%20Search%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20RAG%20Search%20Platform%20interview%20solution", kind: "search" },
  ],
  "semantic-cache-llms": [
    { title: "Hello Interview: Semantic Cache", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-cache", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Semantic%20Cache%20for%20LLMs", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Semantic%20Cache%20for%20LLMs%20interview%20solution", kind: "search" },
  ],
  "twitter-spaces": [
    { title: "Hello Interview: Audio Rooms", url: "https://www.hellointerview.com/learn/system-design/problem/design-clubhouse", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Twitter%20Spaces%20Live%20Audio", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Twitter%20Spaces%20Live%20Audio%20interview%20solution", kind: "search" },
  ],
  "clubhouse-audio-rooms": [
    { title: "Hello Interview: Clubhouse", url: "https://www.hellointerview.com/learn/system-design/problem/design-clubhouse", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Clubhouse-like%20Audio%20Rooms", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Clubhouse-like%20Audio%20Rooms%20interview%20solution", kind: "search" },
  ],
  "pinterest-pin-board": [
    { title: "Hello Interview: Pinterest", url: "https://www.hellointerview.com/learn/system-design/problem/design-pinterest", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Pinterest%20Pin%20and%20Board%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Pinterest%20Pin%20and%20Board%20System%20interview%20solution", kind: "search" },
  ],
  "snapchat-streaks-stories": [
    { title: "Hello Interview: Snapchat", url: "https://www.hellointerview.com/learn/system-design/problem/design-snapchat", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Snapchat%20Streaks%20and%20Stories", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Snapchat%20Streaks%20and%20Stories%20interview%20solution", kind: "search" },
  ],
  "linkedin-feed": [
    { title: "Hello Interview: LinkedIn Feed", url: "https://www.hellointerview.com/learn/system-design/problem/design-linkedin", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20LinkedIn%20Professional%20Feed", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20LinkedIn%20Professional%20Feed%20interview%20solution", kind: "search" },
  ],
  "linkedin-messaging": [
    { title: "Hello Interview: Messaging", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-chat-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20LinkedIn%20Messaging", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20LinkedIn%20Messaging%20interview%20solution", kind: "search" },
  ],
  "reddit-communities": [
    { title: "Hello Interview: Reddit", url: "https://www.hellointerview.com/learn/system-design/problem/design-reddit", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Reddit%20Communities%20and%20Threads", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Reddit%20Communities%20and%20Threads%20interview%20solution", kind: "search" },
  ],
  "quora-qa-platform": [
    { title: "Hello Interview: Quora", url: "https://www.hellointerview.com/learn/system-design/problem/design-quora", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Quora%20Q%26A%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Quora%20Q%26A%20Platform%20interview%20solution", kind: "search" },
  ],
  "stack-overflow-qa": [
    { title: "Hello Interview: Stack Overflow", url: "https://www.hellointerview.com/learn/system-design/problem/design-stack-overflow", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Stack%20Overflow%20Q%26A", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Stack%20Overflow%20Q%26A%20interview%20solution", kind: "search" },
  ],
  "dropbox-paper": [
    { title: "Hello Interview: Dropbox", url: "https://www.hellointerview.com/learn/system-design/problem/design-dropbox", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Dropbox%20Paper%20Collaborative%20Docs", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Dropbox%20Paper%20Collaborative%20Docs%20interview%20solution", kind: "search" },
  ],
  "confluence-wiki": [
    { title: "Hello Interview: Wiki", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-wiki", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Confluence%20Wiki%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Confluence%20Wiki%20Platform%20interview%20solution", kind: "search" },
  ],
  "jira-issue-tracker": [
    { title: "Hello Interview: Jira", url: "https://www.hellointerview.com/learn/system-design/problem/design-jira", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Jira%20Issue%20Tracking%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Jira%20Issue%20Tracking%20Platform%20interview%20solution", kind: "search" },
  ],
  "calendly-scheduling": [
    { title: "Hello Interview: Scheduling", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-scheduling-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Calendly%20Scheduling%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Calendly%20Scheduling%20Platform%20interview%20solution", kind: "search" },
  ],
  "meeting-room-booking": [
    { title: "Hello Interview: Meeting Rooms", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-meeting-room-booking-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Meeting%20Room%20Booking%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Meeting%20Room%20Booking%20System%20interview%20solution", kind: "search" },
  ],
  "gmail-email-sync": [
    { title: "Hello Interview: Gmail", url: "https://www.hellointerview.com/learn/system-design/problem/design-gmail", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Gmail-like%20Email%20Client%20Sync", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Gmail-like%20Email%20Client%20Sync%20interview%20solution", kind: "search" },
  ],
  "password-manager": [
    { title: "Hello Interview: Password Manager", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-password-manager", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Password%20Manager", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Password%20Manager%20interview%20solution", kind: "search" },
  ],
  "feature-flags-launchdarkly": [
    { title: "Hello Interview: Feature Flags", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-feature-flag-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Feature%20Flags%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Feature%20Flags%20Platform%20interview%20solution", kind: "search" },
  ],
  "ab-testing-platform": [
    { title: "Hello Interview: A/B Testing", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-ab-testing-platform", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20A%2FB%20Testing%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20A%2FB%20Testing%20Platform%20interview%20solution", kind: "search" },
  ],
  "experimentation-platform": [
    { title: "Hello Interview: Experimentation", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-ab-testing-platform", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Experimentation%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Experimentation%20Platform%20interview%20solution", kind: "search" },
  ],
  "tiktok-for-you": [
    { title: "Hello Interview: TikTok", url: "https://www.hellointerview.com/learn/system-design/problem/design-tiktok", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20TikTok%20For%20You%20Feed", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20TikTok%20For%20You%20Feed%20interview%20solution", kind: "search" },
  ],
  "podcast-hosting": [
    { title: "Hello Interview: Podcast / Audio", url: "https://www.hellointerview.com/learn/system-design/problem/design-spotify", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Podcast%20Hosting%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Podcast%20Hosting%20Platform%20interview%20solution", kind: "search" },
  ],
  "audiobook-streaming": [
    { title: "Hello Interview: Audiobook Streaming", url: "https://www.hellointerview.com/learn/system-design/problem/design-spotify", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Audiobook%20Streaming%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Audiobook%20Streaming%20Service%20interview%20solution", kind: "search" },
  ],
  "miro-whiteboard": [
    { title: "Hello Interview: Whiteboard", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-whiteboard", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Miro%20Multiplayer%20Whiteboard", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Miro%20Multiplayer%20Whiteboard%20interview%20solution", kind: "search" },
  ],
  "replit-code-collaboration": [
    { title: "Hello Interview: Code Collaboration", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-online-code-editor", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Replit%20Code%20Collaboration", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Replit%20Code%20Collaboration%20interview%20solution", kind: "search" },
  ],
  "online-ide": [
    { title: "Hello Interview: Online IDE", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-online-code-editor", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Online%20IDE%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Online%20IDE%20Platform%20interview%20solution", kind: "search" },
  ],
  "leetcode-judge": [
    { title: "Hello Interview: Online Judge", url: "https://www.hellointerview.com/learn/system-design/problem/design-leetcode", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20LeetCode-like%20Judge%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20LeetCode-like%20Judge%20Platform%20interview%20solution", kind: "search" },
  ],
  "npm-package-registry": [
    { title: "Hello Interview: Package Registry", url: "https://www.hellointerview.com/learn/system-design/problem/design-npm", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20npm%20Package%20Registry", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20npm%20Package%20Registry%20interview%20solution", kind: "search" },
  ],
  "dns-system": [
    { title: "Hello Interview: DNS", url: "https://www.hellointerview.com/learn/system-design/problem/design-dns", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20DNS%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20DNS%20System%20interview%20solution", kind: "search" },
  ],
  "certificate-authority-acme": [
    { title: "Hello Interview: CA / ACME", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-certificate-authority", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Certificate%20Authority%20and%20ACME", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Certificate%20Authority%20and%20ACME%20interview%20solution", kind: "search" },
  ],
  "load-balancer-internals": [
    { title: "Hello Interview: Load Balancer", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-load-balancer", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Load%20Balancer%20Internals", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Load%20Balancer%20Internals%20interview%20solution", kind: "search" },
  ],
  "service-mesh": [
    { title: "Hello Interview: Service Mesh", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-service-mesh", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Service%20Mesh", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Service%20Mesh%20interview%20solution", kind: "search" },
  ],
  "kubernetes-control-plane": [
    { title: "Hello Interview: Kubernetes", url: "https://www.hellointerview.com/learn/system-design/problem/design-kubernetes", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Kubernetes%20Control%20Plane", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Kubernetes%20Control%20Plane%20interview%20solution", kind: "search" },
  ],
  "time-series-database": [
    { title: "Hello Interview: Time-Series DB", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-time-series-database", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Time-Series%20Database", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Time-Series%20Database%20interview%20solution", kind: "search" },
  ],
  "graph-database": [
    { title: "Hello Interview: Graph Database", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-graph-database", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Graph%20Database", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Graph%20Database%20interview%20solution", kind: "search" },
  ],
  "photo-sharing-service": [
    { title: "Hello Interview: Photo Sharing", url: "https://www.hellointerview.com/learn/system-design/problem/design-instagram", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Photo%20Sharing%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Photo%20Sharing%20Service%20interview%20solution", kind: "search" },
  ],
  "image-moderation-pipeline": [
    { title: "Hello Interview: Image Moderation", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-content-moderation-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Image%20Moderation%20Pipeline", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Image%20Moderation%20Pipeline%20interview%20solution", kind: "search" },
  ],
  "content-moderation-scale": [
    { title: "Hello Interview: Moderation", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-content-moderation-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Content%20Moderation%20at%20Scale", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Content%20Moderation%20at%20Scale%20interview%20solution", kind: "search" },
  ],
  "spam-detection": [
    { title: "Hello Interview: Spam Detection", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-spam-detection-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Spam%20Detection%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Spam%20Detection%20System%20interview%20solution", kind: "search" },
  ],
  "abuse-reporting": [
    { title: "Hello Interview: Abuse Reporting", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-content-moderation-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Abuse%20Reporting%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Abuse%20Reporting%20Platform%20interview%20solution", kind: "search" },
  ],
  "foursquare-checkin": [
    { title: "Hello Interview: Check-in / Location", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-proximity-service", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Foursquare%20Location%20Check-in", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Foursquare%20Location%20Check-in%20interview%20solution", kind: "search" },
  ],
  "weather-data-platform": [
    { title: "Hello Interview: Weather Data", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-weather-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Weather%20Data%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Weather%20Data%20Platform%20interview%20solution", kind: "search" },
  ],
  "iot-telemetry-ingest": [
    { title: "Hello Interview: IoT Ingest", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-iot-platform", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20IoT%20Telemetry%20Ingest", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20IoT%20Telemetry%20Ingest%20interview%20solution", kind: "search" },
  ],
  "smart-home-command-routing": [
    { title: "Hello Interview: Smart Home", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-iot-platform", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Smart%20Home%20Command%20Routing", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Smart%20Home%20Command%20Routing%20interview%20solution", kind: "search" },
  ],
  "crypto-exchange-matching": [
    { title: "Hello Interview: Matching Engine", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-stock-exchange", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Cryptocurrency%20Exchange%20Matching%20Engine", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Cryptocurrency%20Exchange%20Matching%20Engine%20interview%20solution", kind: "search" },
  ],
  "crypto-wallet-custody": [
    { title: "Hello Interview: Crypto Custody", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-digital-wallet", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Cryptocurrency%20Wallet%20Custody", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Cryptocurrency%20Wallet%20Custody%20interview%20solution", kind: "search" },
  ],
  "p2p-file-sharing": [
    { title: "Hello Interview: P2P Sharing", url: "https://www.hellointerview.com/learn/system-design/problem/design-bittorrent", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20P2P%20File%20Sharing%20Network", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20P2P%20File%20Sharing%20Network%20interview%20solution", kind: "search" },
  ],
  "bittorrent-tracker": [
    { title: "Hello Interview: BitTorrent", url: "https://www.hellointerview.com/learn/system-design/problem/design-bittorrent", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20BitTorrent%20Tracker", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20BitTorrent%20Tracker%20interview%20solution", kind: "search" },
  ],
  "multiplayer-chess": [
    { title: "Hello Interview: Multiplayer Chess", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-multiplayer-game", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Online%20Multiplayer%20Chess", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Online%20Multiplayer%20Chess%20interview%20solution", kind: "search" },
  ],
  "fantasy-sports-scoring": [
    { title: "Hello Interview: Fantasy Sports", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-fantasy-sports-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Fantasy%20Sports%20Scoring", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Fantasy%20Sports%20Scoring%20interview%20solution", kind: "search" },
  ],
  "sports-live-scores": [
    { title: "Hello Interview: Live Scores", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-live-score-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Sports%20Live%20Scores", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Sports%20Live%20Scores%20interview%20solution", kind: "search" },
  ],
  "news-aggregator": [
    { title: "Hello Interview: News Aggregator", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-news-feed", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20News%20Aggregator", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20News%20Aggregator%20interview%20solution", kind: "search" },
  ],
  "rss-reader-scale": [
    { title: "Hello Interview: RSS Reader", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-rss-reader", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20RSS%20Reader%20at%20Scale", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20RSS%20Reader%20at%20Scale%20interview%20solution", kind: "search" },
  ],
  "pocket-bookmark-manager": [
    { title: "Hello Interview: Bookmarks", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-bookmark-manager", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Pocket-like%20Bookmark%20Manager", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Pocket-like%20Bookmark%20Manager%20interview%20solution", kind: "search" },
  ],
  "url-preview-unfurl": [
    { title: "Hello Interview: URL Preview", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-url-preview-service", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20URL%20Preview%20and%20Link%20Unfurling", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20URL%20Preview%20and%20Link%20Unfurling%20interview%20solution", kind: "search" },
  ],
  "screenshot-annotation": [
    { title: "Hello Interview: Screenshots", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-screenshot-tool", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Screenshot%20Annotation%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Screenshot%20Annotation%20Service%20interview%20solution", kind: "search" },
  ],
  "pdf-generation-pipeline": [
    { title: "Hello Interview: PDF Generation", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-pdf-generation-service", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20PDF%20Generation%20Pipeline", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20PDF%20Generation%20Pipeline%20interview%20solution", kind: "search" },
  ],
  "thumbnail-generation": [
    { title: "Hello Interview: Thumbnails", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-thumbnail-service", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Thumbnail%20Generation%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Thumbnail%20Generation%20Service%20interview%20solution", kind: "search" },
  ],
  "video-clip-editor-backend": [
    { title: "Hello Interview: Video Editing Backend", url: "https://www.hellointerview.com/learn/system-design/problem/design-youtube", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Video%20Clip%20Editor%20Backend", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Video%20Clip%20Editor%20Backend%20interview%20solution", kind: "search" },
  ],
  "caption-subtitle-pipeline": [
    { title: "Hello Interview: Captions", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-subtitle-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Caption%20and%20Subtitle%20Pipeline", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Caption%20and%20Subtitle%20Pipeline%20interview%20solution", kind: "search" },
  ],
  "translation-service": [
    { title: "Hello Interview: Translation", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-translation-service", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Translation%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Translation%20Service%20interview%20solution", kind: "search" },
  ],
  "speech-to-text-platform": [
    { title: "Hello Interview: Speech-to-Text", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-speech-to-text-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Speech-to-Text%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Speech-to-Text%20Platform%20interview%20solution", kind: "search" },
  ],
  "text-to-speech": [
    { title: "Hello Interview: Text-to-Speech", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-text-to-speech-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Text-to-Speech%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Text-to-Speech%20Platform%20interview%20solution", kind: "search" },
  ],
  "face-recognition-gallery": [
    { title: "Hello Interview: Face Recognition", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-face-recognition-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Face%20Recognition%20Gallery", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Face%20Recognition%20Gallery%20interview%20solution", kind: "search" },
  ],
  "duplicate-photo-detection": [
    { title: "Hello Interview: Duplicate Photos", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-duplicate-detection-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Duplicate%20Photo%20Detection", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Duplicate%20Photo%20Detection%20interview%20solution", kind: "search" },
  ],
  "map-tile-server": [
    { title: "Hello Interview: Maps / Tiles", url: "https://www.hellointerview.com/learn/system-design/problem/design-google-maps", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Map%20Tile%20Server", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Map%20Tile%20Server%20interview%20solution", kind: "search" },
  ],
  "reverse-geocoding": [
    { title: "Hello Interview: Geocoding", url: "https://www.hellointerview.com/learn/system-design/problem/design-google-maps", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Reverse%20Geocoding%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Reverse%20Geocoding%20Service%20interview%20solution", kind: "search" },
  ],
  "eta-prediction-service": [
    { title: "Hello Interview: ETA / Rides", url: "https://www.hellointerview.com/learn/system-design/problem/design-uber", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20ETA%20Prediction%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20ETA%20Prediction%20Service%20interview%20solution", kind: "search" },
  ],
  "driver-routing-optimization": [
    { title: "Hello Interview: Routing", url: "https://www.hellointerview.com/learn/system-design/problem/design-uber", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Driver%20Routing%20Optimization", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Driver%20Routing%20Optimization%20interview%20solution", kind: "search" },
  ],
  "inventory-sync-warehouses": [
    { title: "Hello Interview: Inventory Sync", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-inventory-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Inventory%20Sync%20Across%20Warehouses", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Inventory%20Sync%20Across%20Warehouses%20interview%20solution", kind: "search" },
  ],
  "warehouse-management": [
    { title: "Hello Interview: WMS", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-warehouse-management-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Warehouse%20Management%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Warehouse%20Management%20System%20interview%20solution", kind: "search" },
  ],
  "loyalty-points-system": [
    { title: "Hello Interview: Loyalty", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-loyalty-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Loyalty%20Points%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Loyalty%20Points%20System%20interview%20solution", kind: "search" },
  ],
  "coupon-engine": [
    { title: "Hello Interview: Coupons", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-coupon-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Coupon%20Engine", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Coupon%20Engine%20interview%20solution", kind: "search" },
  ],
  "subscription-billing": [
    { title: "Hello Interview: Billing", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-payment-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Subscription%20Billing%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Subscription%20Billing%20System%20interview%20solution", kind: "search" },
  ],
  "invoice-generation": [
    { title: "Hello Interview: Invoicing", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-invoicing-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Invoice%20Generation%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Invoice%20Generation%20Service%20interview%20solution", kind: "search" },
  ],
  "tax-calculation-service": [
    { title: "Hello Interview: Tax Calculation", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-tax-service", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Tax%20Calculation%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Tax%20Calculation%20Service%20interview%20solution", kind: "search" },
  ],
  "multi-tenant-saas-isolation": [
    { title: "Hello Interview: Multi-Tenant SaaS", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-multi-tenant-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Multi-Tenant%20SaaS%20Isolation", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Multi-Tenant%20SaaS%20Isolation%20interview%20solution", kind: "search" },
  ],
  "feature-usage-metering": [
    { title: "Hello Interview: Usage Metering", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-metering-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Feature%20Usage%20Metering", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Feature%20Usage%20Metering%20interview%20solution", kind: "search" },
  ],
  "api-key-management": [
    { title: "Hello Interview: API Keys", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-api-gateway", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20API%20Key%20Management", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20API%20Key%20Management%20interview%20solution", kind: "search" },
  ],
  "oauth-provider": [
    { title: "Hello Interview: OAuth / Auth", url: "https://www.hellointerview.com/learn/system-design/problem/design-authentication", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20OAuth%20Provider", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20OAuth%20Provider%20interview%20solution", kind: "search" },
  ],
  "sso-saml-gateway": [
    { title: "Hello Interview: SSO", url: "https://www.hellointerview.com/learn/system-design/problem/design-authentication", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20SSO%20%2F%20SAML%20Gateway", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20SSO%20%2F%20SAML%20Gateway%20interview%20solution", kind: "search" },
  ],
  "webhook-delivery-platform": [
    { title: "Hello Interview: Webhooks", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-webhook-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Webhook%20Delivery%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Webhook%20Delivery%20Platform%20interview%20solution", kind: "search" },
  ],
  "cron-as-a-service": [
    { title: "Hello Interview: Cron / Scheduler", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-job-scheduler", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Cron%20as%20a%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Cron%20as%20a%20Service%20interview%20solution", kind: "search" },
  ],
  "distributed-lock-service": [
    { title: "Hello Interview: Distributed Lock", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-distributed-lock", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Distributed%20Lock%20Service", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Distributed%20Lock%20Service%20interview%20solution", kind: "search" },
  ],
  "config-service-etcd": [
    { title: "Hello Interview: Config Service", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-configuration-service", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Config%20Service%20(etcd-like)", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Config%20Service%20(etcd-like)%20interview%20solution", kind: "search" },
  ],
  "secrets-manager": [
    { title: "Hello Interview: Secrets Manager", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-secrets-manager", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Secrets%20Manager", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Secrets%20Manager%20interview%20solution", kind: "search" },
  ],
  "ml-feature-store": [
    { title: "Hello Interview: Feature Store", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-feature-store", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20ML%20Feature%20Store", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20ML%20Feature%20Store%20interview%20solution", kind: "search" },
  ],
  "model-registry": [
    { title: "Hello Interview: Model Registry", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-ml-platform", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20ML%20Model%20Registry", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20ML%20Model%20Registry%20interview%20solution", kind: "search" },
  ],
  "online-feature-serving": [
    { title: "Hello Interview: Feature Serving", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-feature-store", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Online%20Feature%20Serving", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Online%20Feature%20Serving%20interview%20solution", kind: "search" },
  ],
  "vector-db-internals": [
    { title: "Hello Interview: Vector DB", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-vector-database", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Vector%20Database%20Internals", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Vector%20Database%20Internals%20interview%20solution", kind: "search" },
  ],
  "embedding-pipeline": [
    { title: "Hello Interview: Embeddings", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-embedding-pipeline", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Embedding%20Pipeline", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Embedding%20Pipeline%20interview%20solution", kind: "search" },
  ],
  "chatbot-platform": [
    { title: "Hello Interview: Chatbot", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-chatbot", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Chatbot%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Chatbot%20Platform%20interview%20solution", kind: "search" },
  ],
  "voice-agent-telephony": [
    { title: "Hello Interview: Voice / Telephony", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-call-center", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Voice%20Agent%20Telephony%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Voice%20Agent%20Telephony%20Platform%20interview%20solution", kind: "search" },
  ],
  "call-center-queue": [
    { title: "Hello Interview: Call Center", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-call-center", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Call%20Center%20Queue%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Call%20Center%20Queue%20System%20interview%20solution", kind: "search" },
  ],
  "helpdesk-ticketing": [
    { title: "Hello Interview: Helpdesk", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-ticketing-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Helpdesk%20Ticketing%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Helpdesk%20Ticketing%20System%20interview%20solution", kind: "search" },
  ],
  "knowledge-base-search": [
    { title: "Hello Interview: Knowledge Base", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-search-engine", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Knowledge%20Base%20Search", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Knowledge%20Base%20Search%20interview%20solution", kind: "search" },
  ],
  "status-page-system": [
    { title: "Hello Interview: Status Page", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-status-page", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Status%20Page%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Status%20Page%20System%20interview%20solution", kind: "search" },
  ],
  "incident-management": [
    { title: "Hello Interview: Incidents", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-incident-management-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Incident%20Management%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Incident%20Management%20Platform%20interview%20solution", kind: "search" },
  ],
  "oncall-scheduling": [
    { title: "Hello Interview: On-Call", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-on-call-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20On-Call%20Scheduling", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20On-Call%20Scheduling%20interview%20solution", kind: "search" },
  ],
  "error-tracking-sentry": [
    { title: "Hello Interview: Error Tracking", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-error-tracking-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Error%20Tracking%20(Sentry-like)", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Error%20Tracking%20(Sentry-like)%20interview%20solution", kind: "search" },
  ],
  "session-replay": [
    { title: "Hello Interview: Session Replay", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-session-replay-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Session%20Replay%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Session%20Replay%20Platform%20interview%20solution", kind: "search" },
  ],
  "product-analytics-mixpanel": [
    { title: "Hello Interview: Analytics", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-metrics-monitoring-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Product%20Analytics%20(Mixpanel-like)", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Product%20Analytics%20(Mixpanel-like)%20interview%20solution", kind: "search" },
  ],
  "heatmap-analytics": [
    { title: "Hello Interview: Heatmaps", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-metrics-monitoring-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Heatmap%20Analytics", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Heatmap%20Analytics%20interview%20solution", kind: "search" },
  ],
  "form-builder-backend": [
    { title: "Hello Interview: Form Builder", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-form-builder", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Form%20Builder%20Backend", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Form%20Builder%20Backend%20interview%20solution", kind: "search" },
  ],
  "survey-platform": [
    { title: "Hello Interview: Survey", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-survey-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Survey%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Survey%20Platform%20interview%20solution", kind: "search" },
  ],
  "polling-voting-scale": [
    { title: "Hello Interview: Voting", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-voting-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Polling%20and%20Voting%20at%20Scale", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Polling%20and%20Voting%20at%20Scale%20interview%20solution", kind: "search" },
  ],
  "ebay-auction-house": [
    { title: "Hello Interview: Auction", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-auction-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Auction%20House%20(eBay-like)", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Auction%20House%20(eBay-like)%20interview%20solution", kind: "search" },
  ],
  "classifieds-marketplace": [
    { title: "Hello Interview: Marketplace", url: "https://www.hellointerview.com/learn/system-design/problem/design-craigslist", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Classifieds%20Marketplace", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Classifieds%20Marketplace%20interview%20solution", kind: "search" },
  ],
  "real-estate-listing-search": [
    { title: "Hello Interview: Listings Search", url: "https://www.hellointerview.com/learn/system-design/problem/design-airbnb", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Real%20Estate%20Listing%20Search", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Real%20Estate%20Listing%20Search%20interview%20solution", kind: "search" },
  ],
  "car-rental-booking": [
    { title: "Hello Interview: Car Rental", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-car-rental-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Car%20Rental%20Booking", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Car%20Rental%20Booking%20interview%20solution", kind: "search" },
  ],
  "parking-reservation": [
    { title: "Hello Interview: Parking", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-parking-lot", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Parking%20Reservation%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Parking%20Reservation%20System%20interview%20solution", kind: "search" },
  ],
  "ev-charger-booking": [
    { title: "Hello Interview: EV Charging", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-booking-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20EV%20Charger%20Booking", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20EV%20Charger%20Booking%20interview%20solution", kind: "search" },
  ],
  "food-delivery-tracking": [
    { title: "Hello Interview: Food Delivery", url: "https://www.hellointerview.com/learn/system-design/problem/design-uber-eats", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Food%20Delivery%20Tracking", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Food%20Delivery%20Tracking%20interview%20solution", kind: "search" },
  ],
  "grocery-delivery": [
    { title: "Hello Interview: Delivery", url: "https://www.hellointerview.com/learn/system-design/problem/design-uber-eats", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Grocery%20Delivery%20Platform", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Grocery%20Delivery%20Platform%20interview%20solution", kind: "search" },
  ],
  "pharmacy-delivery": [
    { title: "Hello Interview: Pharmacy Delivery", url: "https://www.hellointerview.com/learn/system-design/problem/design-uber-eats", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Pharmacy%20Delivery", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Pharmacy%20Delivery%20interview%20solution", kind: "search" },
  ],
  "blood-bank-inventory": [
    { title: "Hello Interview: Blood Bank", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-inventory-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Blood%20Bank%20Inventory", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Blood%20Bank%20Inventory%20interview%20solution", kind: "search" },
  ],
  "hospital-appointment-system": [
    { title: "Hello Interview: Appointments", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-hospital-management-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Hospital%20Appointment%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Hospital%20Appointment%20System%20interview%20solution", kind: "search" },
  ],
  "telemedicine-video-records": [
    { title: "Hello Interview: Telemedicine", url: "https://www.hellointerview.com/learn/system-design/problem/design-zoom", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Telemedicine%20Video%20and%20Records", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Telemedicine%20Video%20and%20Records%20interview%20solution", kind: "search" },
  ],
  "ehr-sync": [
    { title: "Hello Interview: EHR Sync", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-ehr-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Electronic%20Health%20Records%20Sync", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Electronic%20Health%20Records%20Sync%20interview%20solution", kind: "search" },
  ],
  "library-catalog": [
    { title: "Hello Interview: Library", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-library-management-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Library%20Catalog%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Library%20Catalog%20System%20interview%20solution", kind: "search" },
  ],
  "university-course-registration": [
    { title: "Hello Interview: Course Registration", url: "https://www.hellointerview.com/learn/system-design/problem/design-a-course-registration-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20University%20Course%20Registration", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20University%20Course%20Registration%20interview%20solution", kind: "search" },
  ],
  "exam-proctoring-system": [
    { title: "Hello Interview: Exam Proctoring", url: "https://www.hellointerview.com/learn/system-design/problem/design-an-exam-proctoring-system", kind: "article" },
    { title: "YouTube: system design walkthroughs", url: "https://www.youtube.com/results?search_query=system%20design%20Exam%20Proctoring%20System", kind: "search" },
    { title: "Google: interview solution articles", url: "https://www.google.com/search?q=system%20design%20Exam%20Proctoring%20System%20interview%20solution", kind: "search" },
  ],
};

/**
 * @param {{ id: string, title: string }} problem
 * @returns {SolutionLink[]}
 */
export function getSolutions(problem) {
  const curated = SOLUTIONS_BY_ID[problem?.id] || [];
  const title = problem?.title || "";
  const fallbacks = [
    {
      title: 'YouTube: system design walkthroughs',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`system design ${title}`)}`,
      kind: 'search',
    },
    {
      title: 'Google: interview solution articles',
      url: `https://www.google.com/search?q=${encodeURIComponent(`system design ${title} interview solution`)}`,
      kind: 'search',
    },
  ];
  const seen = new Set();
  /** @type {SolutionLink[]} */
  const out = [];
  for (const link of [...curated, ...fallbacks]) {
    if (!link?.url || seen.has(link.url)) continue;
    seen.add(link.url);
    out.push(link);
  }
  return out;
}
