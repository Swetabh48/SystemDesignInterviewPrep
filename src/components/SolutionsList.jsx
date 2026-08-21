const KIND_LABEL = {
  course: "Course / walkthrough",
  article: "Article",
  video: "YouTube video",
  search: "Search results",
};

/**
 * Linked reference solutions so users can compare after attempting.
 */
export default function SolutionsList({
  solutions,
  title = "REFERENCE SOLUTIONS — COMPARE AFTER YOU TRY",
}) {
  if (!solutions?.length) return null;
  return (
    <div
      style={{
        background: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "14px 16px",
        marginBottom: 16,
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber)", marginBottom: 6 }}>{title}</div>
      <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.45 }}>
        Yes — most of these problems have public walkthroughs (ByteByteGo/Alex Xu courses, Hello Interview, YouTube). Use them after your mock to judge depth, not to copy diagrams beforehand.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {solutions.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              display: "block",
              textDecoration: "none",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "10px 12px",
              background: "var(--panel-alt)",
              color: "var(--text)",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600 }}>{s.title}</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3, fontFamily: "var(--font-mono)" }}>
              {KIND_LABEL[s.kind] || s.kind}
              {s.note ? ` · ${s.note}` : ""}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
