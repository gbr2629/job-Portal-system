import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const API_BASE = "https://job-portal-system-ksbv.onrender.com/jobs";
const F = "'Instrument Sans', sans-serif";
const S = "'Lora', Georgia, serif";

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  return (
    <div style={{
      position: "fixed", top: 20, left: "50%",
      transform: "translateX(-50%)",
      zIndex: 300,
      display: "flex", alignItems: "center", gap: 10,
      background: "#1a1a1a", color: "#fff",
      padding: "11px 22px", borderRadius: 50,
      fontSize: 14, fontFamily: F, fontWeight: 500,
      boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
      whiteSpace: "nowrap", pointerEvents: "none",
      animation: "slideDown 0.22s ease",
    }}>
      <span style={{
        width: 20, height: 20, borderRadius: "50%",
        background: type === "error" ? "#ef4444" : "#22c55e",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {type === "error"
          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        }
      </span>
      {msg}
    </div>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────
function JobCard({ job, applied, onApply, onEdit, onDelete }) {
  const fmt = (d) => d
    ? new Date(d).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
    : null;

  return (
    <div
      style={{ background: "#fff", borderRadius: 14, padding: "22px 22px 20px", border: "1px solid #e8e4de", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", transition: "box-shadow 0.18s" }}
      onMouseOver={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"}
      onMouseOut={e  => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"}
    >
      {/* Type badge only (no Open dot) */}
      {job.type && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: "#3b82f6", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "3px 10px" }}>
            {job.type}
          </span>
        </div>
      )}

      {/* Title + Company */}
      <h3 style={{ fontFamily: S, fontSize: 17.5, fontWeight: 700, color: "#111827", margin: "0 0 3px", letterSpacing: "-0.2px" }}>{job.title}</h3>
      <p style={{ fontFamily: F, fontSize: 13, color: "#6b7280", margin: "0 0 10px" }}>{job.company}</p>

      {/* Description */}
      {job.description && (
        <p style={{ fontFamily: F, fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {job.description}
        </p>
      )}

      {/* Salary chip */}
      {job.salary && (
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "3px 12px", display: "inline-block" }}>
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
        <p style={{ fontFamily: F, fontSize: 13, color: "#374151", margin: "0 0 16px", fontWeight: 500 }}>{job.location}</p>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
        <button onClick={() => onEdit(job)}
          style={{ padding: "7px 18px", borderRadius: 7, border: "1px solid #e4dfd7", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: F }}
          onMouseOver={e => e.currentTarget.style.background = "#f8f6f2"}
          onMouseOut={e  => e.currentTarget.style.background = "#fff"}
        >Edit</button>
        <button onClick={() => onDelete(job)}
          style={{ padding: "7px 18px", borderRadius: 7, border: "1px solid #fecaca", background: "#fff", color: "#dc2626", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: F }}
          onMouseOver={e => e.currentTarget.style.background = "#fff5f5"}
          onMouseOut={e  => e.currentTarget.style.background = "#fff"}
        >Delete</button>
        <div style={{ marginLeft: "auto" }}>
          {applied ? (
            <div style={{ padding: "7px 20px", borderRadius: 7, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", fontSize: 13, fontWeight: 600, fontFamily: F }}>
              Applied
            </div>
          ) : (
            <button onClick={() => onApply(job)}
              style={{ padding: "7px 22px", borderRadius: 7, border: "none", background: "#1a1a1a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
              onMouseOut={e  => e.currentTarget.style.opacity = "1"}
            >Apply</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Job Form Modal ────────────────────────────────────────────────────────────
function JobFormModal({ job, onClose, onSaved }) {
  const isEdit = !!job;
  const [form, setForm] = useState({
    title:       job?.title       || "",
    company:     job?.company     || "",
    location:    job?.location    || "",
    salary:      job?.salary      || "",
    description: job?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title.trim() || !form.company.trim()) { setErr("Title and company are required."); return; }
    setSaving(true); setErr("");
    try {
      const url = isEdit ? `${API_BASE}/${job._id}` : API_BASE;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      onSaved(data.job, isEdit);
    } catch (e) { setErr(e.message); setSaving(false); }
  };

  const inp = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1px solid #e4dfd7", background: "#fff",
    fontSize: 14, color: "#1a1a1a", outline: "none",
    fontFamily: F, boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const focus = e => (e.target.style.borderColor = "#1a1a1a");
  const blur  = e => (e.target.style.borderColor = "#e4dfd7");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,26,26,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 14, padding: "36px 40px", width: "100%", maxWidth: 520, boxShadow: "0 24px 64px rgba(0,0,0,0.16)", border: "1px solid #e4dfd7", maxHeight: "92vh", overflowY: "auto", animation: "fadeIn 0.2s ease" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <h2 style={{ fontFamily: S, fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>
              {isEdit ? "Edit job listing" : "Post a new job"}
            </h2>
            <p style={{ fontFamily: F, fontSize: 13, color: "#9c9188", margin: 0 }}>
              {isEdit ? "Update the details below" : "Fill in the details to post a new role"}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "#f5f4f2", border: "1px solid #e4dfd7", borderRadius: 7, width: 32, height: 32, cursor: "pointer", fontSize: 17, color: "#6b6560", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 16 }}>×</button>
        </div>

        {err && <p style={{ fontFamily: F, fontSize: 13, color: "#dc2626", margin: "14px 0 0", padding: "9px 12px", background: "#fff5f5", borderRadius: 6, border: "1px solid #fca5a5" }}>{err}</p>}

        <p style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#9c9188", margin: "24px 0 14px" }}>Job Details</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "#1a1a1a", marginBottom: 6 }}>Job title <span style={{ color: "#dc2626" }}>*</span></label>
          <input style={inp} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Frontend Developer" onFocus={focus} onBlur={blur} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "#1a1a1a", marginBottom: 6 }}>Company <span style={{ color: "#dc2626" }}>*</span></label>
          <input style={inp} value={form.company} onChange={e => set("company", e.target.value)} placeholder="e.g. TCS" onFocus={focus} onBlur={blur} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "#1a1a1a", marginBottom: 6 }}>Location <span style={{ color: "#dc2626" }}>*</span></label>
            <input style={inp} value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Mumbai" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "#1a1a1a", marginBottom: 6 }}>Salary <span style={{ fontWeight: 400, color: "#9c9188", fontSize: 12 }}>(optional)</span></label>
            <input style={inp} value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="e.g. 50000" onFocus={focus} onBlur={blur} />
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "#1a1a1a", marginBottom: 6 }}>Description <span style={{ color: "#dc2626" }}>*</span></label>
          <textarea style={{ ...inp, minHeight: 100, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe the role and requirements..." onFocus={focus} onBlur={blur} />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: "1px solid #e4dfd7", background: "#f5f4f2", color: "#44403c", fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: F }}>Cancel</button>
          <button onClick={submit} disabled={saving} style={{ flex: 2, padding: "12px 0", borderRadius: 8, border: "none", background: "#1a1a1a", color: "#fff", fontWeight: 600, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", fontFamily: F, opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Post job"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ job, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,26,26,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "30px 32px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.14)", border: "1px solid #e4dfd7", animation: "fadeIn 0.2s ease" }}>
        <h3 style={{ fontFamily: S, fontSize: 18, color: "#1a1a1a", margin: "0 0 10px" }}>Delete this job?</h3>
        <p style={{ fontFamily: F, color: "#6b6560", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 22px" }}>
          <strong style={{ color: "#1a1a1a" }}>{job?.title}</strong> at <strong style={{ color: "#1a1a1a" }}>{job?.company}</strong> will be permanently removed.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px 0", borderRadius: 7, border: "1px solid #e4dfd7", background: "#faf9f7", color: "#44403c", fontWeight: 500, fontSize: 13.5, cursor: "pointer", fontFamily: F }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "10px 0", borderRadius: 7, border: "none", background: "#dc2626", color: "#fff", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: F }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Jobs() {
  const [jobs,         setJobs]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [query,        setQuery]        = useState("");
  const [locFilter,    setLocFilter]    = useState("");
  const [toast,        setToast]        = useState(null);
  const [appliedJobs,  setAppliedJobs]  = useState(new Set());
  const [showPanel,    setShowPanel]    = useState(false);
  const [editJob,      setEditJob]      = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const location = useLocation();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2600);
  };

  const fetchJobs = async (q = "", loc = "") => {
    setLoading(true); setError("");
    try {
      let url = API_BASE;
      if (q)        url = `${API_BASE}/search?title=${encodeURIComponent(q)}`;
      else if (loc) url = `${API_BASE}/filter?location=${encodeURIComponent(loc)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setJobs(prev => prev.filter(j => j._id !== deleteTarget._id));
      showToast("Job removed.");
    } catch (e) { showToast(e.message, "error"); }
    finally { setDeleteTarget(null); }
  };

  const handleSaved = (job, isEdit) => {
    if (isEdit) setJobs(prev => prev.map(j => j._id === job._id ? job : j));
    else        setJobs(prev => [job, ...prev]);
    setShowPanel(false); setEditJob(null);
    showToast(isEdit ? "Job updated." : "Job posted successfully.");
  };

  const handleApply = (job) => {
    setAppliedJobs(prev => new Set([...prev, job._id]));
    showToast(`Applied to ${job.title} at ${job.company}!`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setQuery(q);
    fetchJobs(q);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchJobs(query, locFilter), 380);
    return () => clearTimeout(t);
  }, [query, locFilter]);

  return (
    <div style={{ fontFamily: S, background: "#f8f6f2", minHeight: "100vh", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", background: "#f8f6f2", borderBottom: "1px solid #e4dfd7", position: "sticky", top: 0, zIndex: 40 }}>
        <Link to="/" style={{ fontFamily: S, fontSize: 17, fontWeight: 700, color: "#1a1a1a", textDecoration: "none" }}>Job Portal</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: F }}>
          <span style={{ color: "#1a1a1a", fontSize: 13.5, fontWeight: 600, borderBottom: "2px solid #1a1a1a", paddingBottom: 2 }}>Browse Jobs</span>
          <Link to="/">
            <button style={{ display: "flex", alignItems: "center", gap: 7, background: "#1a1a1a", color: "#f8f6f2", border: "none", padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: F }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.8"}
              onMouseOut={e  => e.currentTarget.style.opacity = "1"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Back to Home
            </button>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div style={{ padding: "48px 48px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
          <div>
            <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#a09690", marginBottom: 7 }}>
              {loading ? "—" : `${jobs.length} open position${jobs.length !== 1 ? "s" : ""}`}
            </p>
            <h1 style={{ fontFamily: S, fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.8px", margin: 0 }}>Browse all jobs</h1>
          </div>
          <button onClick={() => { setEditJob(null); setShowPanel(true); }}
            style={{ background: "#1a1a1a", color: "#f8f6f2", border: "none", padding: "10px 22px", borderRadius: 7, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: F }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
            onMouseOut={e  => e.currentTarget.style.opacity = "1"}
          >+ Post a job</button>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 200, background: "#fff", border: "1px solid #e4dfd7", borderRadius: 7, display: "flex", alignItems: "center", padding: "0 14px" }}>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by title..."
              style={{ flex: 1, border: "none", background: "none", fontSize: 13.5, color: "#1a1a1a", outline: "none", fontFamily: F, padding: "10px 0" }} />
            {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#a09690", fontSize: 17 }}>×</button>}
          </div>
          <div style={{ flex: 1, minWidth: 160, background: "#fff", border: "1px solid #e4dfd7", borderRadius: 7, display: "flex", alignItems: "center", padding: "0 14px" }}>
            <input value={locFilter} onChange={e => setLocFilter(e.target.value)} placeholder="Filter by location..."
              style={{ flex: 1, border: "none", background: "none", fontSize: 13.5, color: "#1a1a1a", outline: "none", fontFamily: F, padding: "10px 0" }} />
            {locFilter && <button onClick={() => setLocFilter("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#a09690", fontSize: 17 }}>×</button>}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 88px" }}>
        {error && (
          <p style={{ fontFamily: F, fontSize: 13.5, color: "#dc2626", marginBottom: 20 }}>
            {error} — <button onClick={() => fetchJobs(query, locFilter)} style={{ background: "none", border: "none", color: "#dc2626", fontWeight: 600, cursor: "pointer", fontFamily: F, padding: 0, textDecoration: "underline" }}>Retry</button>
          </p>
        )}

        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, height: 220, border: "1px solid #e4dfd7", animation: "pulse 1.4s ease-in-out infinite" }} />
            ))}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div style={{ textAlign: "center", padding: "88px 0" }}>
            <h3 style={{ fontFamily: S, fontSize: 21, color: "#1a1a1a", marginBottom: 8 }}>No jobs found</h3>
            <p style={{ fontFamily: F, color: "#6b6560", fontSize: 14, marginBottom: 22 }}>Try a different search, or post a new role.</p>
            <button onClick={() => setShowPanel(true)} style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 7, padding: "10px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: F }}>Post a job</button>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {jobs.map(job => (
              <JobCard
                key={job._id}
                job={job}
                applied={appliedJobs.has(job._id)}
                onApply={handleApply}
                onEdit={j  => { setEditJob(j); setShowPanel(true); }}
                onDelete={j => setDeleteTarget(j)}
              />
            ))}
          </div>
        )}
      </main>

      {(showPanel || editJob) && (
        <JobFormModal
          job={editJob || null}
          onClose={() => { setShowPanel(false); setEditJob(null); }}
          onSaved={handleSaved}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          job={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <style>{`
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes slideDown { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes fadeIn    { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
      `}</style>

      <footer style={{ borderTop: "1px solid #e4dfd7", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: F }}>
        <span style={{ fontFamily: S, fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>Job Portal</span>
        <span style={{ fontSize: 12.5, color: "#a09690" }}>2025 · Built by <a href="https://github.com/gbr2629" style={{ color: "#6b6560", textDecoration: "none", borderBottom: "1px solid #d0cbc4" }}>Gauri Riswal</a></span>
      </footer>
    </div>
  );
}
