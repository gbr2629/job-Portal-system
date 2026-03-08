const F = "'Instrument Sans', sans-serif";
const S = "'Lora', Georgia, serif";

export default function JobCard({ job, applied, onApply, onEdit, onDelete }) {
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) : null;

  return (
    <div
      style={{
        background: "#fff", borderRadius: 14, padding: "22px 22px 20px",
        border: "1px solid #e8e4de", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column", transition: "box-shadow 0.18s",
      }}
      onMouseOver={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"}
      onMouseOut={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"}
    >
      {/* Row 1: status dot + type badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          <span style={{ fontFamily: F, fontSize: 13, color: "#374151", fontWeight: 500 }}>Open</span>
        </div>
        {job.type && (
          <span style={{
            fontFamily: F, fontSize: 12, fontWeight: 500,
            color: "#3b82f6", background: "#eff6ff",
            border: "1px solid #bfdbfe", borderRadius: 6, padding: "3px 10px",
          }}>
            {job.type}
          </span>
        )}
      </div>

      {/* Title + Company */}
      <h3 style={{ fontFamily: S, fontSize: 17.5, fontWeight: 700, color: "#111827", margin: "0 0 3px", letterSpacing: "-0.2px" }}>
        {job.title}
      </h3>
      <p style={{ fontFamily: F, fontSize: 13, color: "#6b7280", margin: "0 0 10px", fontWeight: 400 }}>
        {job.company}
      </p>

      {/* Description */}
      {job.description && (
        <p style={{
          fontFamily: F, fontSize: 13, color: "#6b7280", lineHeight: 1.6,
          margin: "0 0 12px", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {job.description}
        </p>
      )}

      {/* Salary chip */}
      {job.salary && (
        <div style={{ marginBottom: 10 }}>
          <span style={{
            fontFamily: F, fontSize: 13, fontWeight: 600,
            color: "#16a34a", background: "#f0fdf4",
            border: "1px solid #bbf7d0", borderRadius: 6,
            padding: "3px 12px", display: "inline-block",
          }}>
            {job.salary}
          </span>
        </div>
      )}

      {/* Dates */}
      {(job.createdAt || job.updatedAt) && (
        <p style={{ fontFamily: F, fontSize: 11.5, color: "#9ca3af", margin: "0 0 8px" }}>
          {job.createdAt && `Posted ${fmt(job.createdAt)}`}
          {job.createdAt && job.updatedAt && "   "}
          {job.updatedAt && `Updated ${fmt(job.updatedAt)}`}
        </p>
      )}

      {/* Location */}
      {job.location && (
        <p style={{ fontFamily: F, fontSize: 13, color: "#374151", margin: "0 0 16px", fontWeight: 500 }}>
          {job.location}
        </p>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
        <button
          onClick={() => onEdit(job)}
          style={{ padding: "7px 18px", borderRadius: 7, border: "1px solid #e4dfd7", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: F }}
          onMouseOver={e => e.currentTarget.style.background = "#f8f6f2"}
          onMouseOut={e => e.currentTarget.style.background = "#fff"}
        >Edit</button>

        <button
          onClick={() => onDelete(job)}
          style={{ padding: "7px 18px", borderRadius: 7, border: "1px solid #fecaca", background: "#fff", color: "#dc2626", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: F }}
          onMouseOver={e => e.currentTarget.style.background = "#fff5f5"}
          onMouseOut={e => e.currentTarget.style.background = "#fff"}
        >Delete</button>

        <div style={{ marginLeft: "auto" }}>
          {applied ? (
            <div style={{
              padding: "7px 20px", borderRadius: 7,
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              color: "#16a34a", fontSize: 13, fontWeight: 600, fontFamily: F,
            }}>
              Applied
            </div>
          ) : (
            <button
              onClick={() => onApply(job)}
              style={{ padding: "7px 22px", borderRadius: 7, border: "none", background: "#1a1a1a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >Apply</button>
          )}
        </div>
      </div>
    </div>
  );
}