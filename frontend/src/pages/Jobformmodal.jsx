import { useState } from "react";

const API_BASE = "http://localhost:5000/jobs";
const F = "'Instrument Sans', sans-serif";
const S = "'Lora', Georgia, serif";

export default function JobFormModal({ job, onClose, onSaved }) {
  const isEdit = !!job;

  const [form, setForm] = useState({
    title:       job?.title       || "",
    company:     job?.company     || "",
    location:    job?.location    || "",
    salary:      job?.salary      || "",
    description: job?.description || "",
    type:        job?.type        || "Full-time",
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title.trim() || !form.company.trim()) {
      setErr("Title and company are required.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      const url    = isEdit ? `${API_BASE}/${job._id}` : API_BASE;
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      onSaved(data.job, isEdit);
    } catch (e) {
      setErr(e.message);
      setSaving(false);
    }
  };

  const inp = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1px solid #e4dfd7", background: "#fff",
    fontSize: 14, color: "#1a1a1a", outline: "none",
    fontFamily: F, boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  const focus = e => (e.target.style.borderColor = "#1a1a1a");
  const blur  = e => (e.target.style.borderColor = "#e4dfd7");

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(26,26,26,0.45)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 14,
        padding: "36px 40px", width: "100%", maxWidth: 520,
        boxShadow: "0 24px 64px rgba(0,0,0,0.16)",
        border: "1px solid #e4dfd7",
        maxHeight: "92vh", overflowY: "auto",
        animation: "fadeIn 0.2s ease",
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <h2 style={{ fontFamily: S, fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>
              {isEdit ? "Edit job listing" : "Post a new job"}
            </h2>
            <p style={{ fontFamily: F, fontSize: 13, color: "#9c9188", margin: 0 }}>
              {isEdit ? "Update the details below" : "Fill in the details to post a new role"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f5f4f2", border: "1px solid #e4dfd7", borderRadius: 7,
              width: 32, height: 32, cursor: "pointer", fontSize: 17, color: "#6b6560",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontFamily: F, marginLeft: 16,
            }}
          >×</button>
        </div>

        {/* ── Error ── */}
        {err && (
          <p style={{
            fontFamily: F, fontSize: 13, color: "#dc2626",
            margin: "14px 0 0", padding: "9px 12px",
            background: "#fff5f5", borderRadius: 6, border: "1px solid #fca5a5",
          }}>{err}</p>
        )}

        {/* ── Section label ── */}
        <p style={{
          fontFamily: F, fontSize: 10.5, fontWeight: 700,
          letterSpacing: "1.5px", textTransform: "uppercase",
          color: "#9c9188", margin: "24px 0 14px",
        }}>Job Details</p>

        {/* ── Job Title ── */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "#1a1a1a", marginBottom: 6 }}>
            Job title <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            style={inp}
            value={form.title}
            onChange={e => set("title", e.target.value)}
            placeholder="e.g. Frontend Developer"
            onFocus={focus} onBlur={blur}
          />
        </div>

        {/* ── Company ── */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "#1a1a1a", marginBottom: 6 }}>
            Company <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            style={inp}
            value={form.company}
            onChange={e => set("company", e.target.value)}
            placeholder="e.g. TCS"
            onFocus={focus} onBlur={blur}
          />
        </div>

        {/* ── Location + Salary (2-col) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "#1a1a1a", marginBottom: 6 }}>
              Location <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              style={inp}
              value={form.location}
              onChange={e => set("location", e.target.value)}
              placeholder="e.g. Mumbai"
              onFocus={focus} onBlur={blur}
            />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "#1a1a1a", marginBottom: 6 }}>
              Salary{" "}
              <span style={{ fontWeight: 400, color: "#9c9188", fontSize: 12 }}>(optional)</span>
            </label>
            <input
              style={inp}
              value={form.salary}
              onChange={e => set("salary", e.target.value)}
              placeholder="e.g. 50000"
              onFocus={focus} onBlur={blur}
            />
          </div>
        </div>

        {/* ── Description ── */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "#1a1a1a", marginBottom: 6 }}>
            Description <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <textarea
            style={{ ...inp, minHeight: 100, resize: "vertical" }}
            value={form.description}
            onChange={e => set("description", e.target.value)}
            placeholder="Describe the role and requirements..."
            onFocus={focus} onBlur={blur}
          />
        </div>

        {/* ── Buttons ── */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 8,
              border: "1px solid #e4dfd7", background: "#f5f4f2",
              color: "#44403c", fontWeight: 500, fontSize: 14,
              cursor: "pointer", fontFamily: F,
            }}
          >Cancel</button>
          <button
            onClick={submit}
            disabled={saving}
            style={{
              flex: 2, padding: "12px 0", borderRadius: 8,
              border: "none", background: "#1a1a1a", color: "#fff",
              fontWeight: 600, fontSize: 14,
              cursor: saving ? "not-allowed" : "pointer",
              fontFamily: F, opacity: saving ? 0.7 : 1,
            }}
          >{saving ? "Saving…" : isEdit ? "Save changes" : "Post job"}</button>
        </div>
      </div>
    </div>
  );
}