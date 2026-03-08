const F = "'Instrument Sans', sans-serif";
const S = "'Lora', Georgia, serif";

export default function DeleteModal({ job, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(26,26,26,0.4)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 12,
        padding: "30px 32px", width: "100%", maxWidth: 380,
        boxShadow: "0 20px 60px rgba(0,0,0,0.14)",
        border: "1px solid #e4dfd7",
        animation: "fadeIn 0.2s ease",
      }}>
        <h3 style={{ fontFamily: S, fontSize: 18, color: "#1a1a1a", margin: "0 0 10px" }}>
          Delete this job?
        </h3>
        <p style={{ fontFamily: F, color: "#6b6560", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 22px" }}>
          <strong style={{ color: "#1a1a1a" }}>{job?.title}</strong> at{" "}
          <strong style={{ color: "#1a1a1a" }}>{job?.company}</strong> will be permanently removed.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 7,
              border: "1px solid #e4dfd7", background: "#faf9f7",
              color: "#44403c", fontWeight: 500, fontSize: 13.5,
              cursor: "pointer", fontFamily: F,
            }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 7,
              border: "none", background: "#dc2626", color: "#fff",
              fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: F,
            }}
          >Delete</button>
        </div>
      </div>
    </div>
  );
}