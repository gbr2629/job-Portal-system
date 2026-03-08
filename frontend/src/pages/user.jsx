import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/users";
const F = "'Instrument Sans', sans-serif";
const S = "'Lora', Georgia, serif";

const ROLE_COLORS = {
  user: { bg: "#fef9ec", text: "#92400e", border: "#fde68a" },
  Recruiter: { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
};

function Toast({ msg, type }) {
  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 300,
      background: "#1a1a1a", color: "#fff",
      padding: "15px 30px", borderRadius: 8,
      fontSize: 14.5, fontFamily: F, fontWeight: 500,
      boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
      borderLeft: `4px solid ${type === "error" ? "#ef4444" : "#22c55e"}`,
      pointerEvents: "none",
      animation: "fadeUp 0.2s ease",
    }}>
      {msg}
    </div>
  );
}

function DeleteModal({ user, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,26,26,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 10, padding: "32px 36px", maxWidth: 400, width: "90%", boxShadow: "0 24px 60px rgba(0,0,0,0.15)", border: "1px solid #e4dfd7" }}>
        <h3 style={{ fontFamily: S, fontSize: 19, color: "#1a1a1a", margin: "0 0 10px" }}>Delete user?</h3>
        <p style={{ fontFamily: F, color: "#6b6560", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
          <strong style={{ color: "#1a1a1a" }}>{user?.fullName}</strong>'s account will be permanently deleted.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px 0", borderRadius: 5, border: "1px solid #e4dfd7", background: "#f8f6f2", color: "#44403c", fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: F }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "10px 0", borderRadius: 5, border: "none", background: "#dc2626", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: F }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function UserDrawer({ user, onClose, onDelete }) {
  if (!user) return null;
  const roleStyle = ROLE_COLORS[user.role] || ROLE_COLORS.user;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(26,26,26,0.25)" }} />
      <div style={{ position: "relative", width: 380, background: "#fff", boxShadow: "-12px 0 40px rgba(0,0,0,0.1)", padding: "38px 34px", overflowY: "auto", borderLeft: "1px solid #e4dfd7", animation: "slideIn 0.22s ease" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 18, right: 18, background: "#f8f6f2", border: "1px solid #e4dfd7", borderRadius: 6, width: 30, height: 30, cursor: "pointer", fontSize: 17, color: "#6b6560", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>×</button>

        <div style={{ marginBottom: 26 }}>
          <h2 style={{ fontFamily: S, fontSize: 21, color: "#1a1a1a", margin: "0 0 8px" }}>{user.fullName}</h2>
          <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: F, background: roleStyle.bg, color: roleStyle.text, border: `1px solid ${roleStyle.border}` }}>{user.role}</span>
        </div>

        {[
          { label: "Email", value: user.email },
          { label: "Phone", value: user.phoneNo },
          { label: "Location", value: user.location || "—" },
          { label: "Qualification", value: user.qualification || "—" },
          { label: "SSC Marks", value: user.sscMarks != null ? `${user.sscMarks}%` : "—" },
          { label: "HSC Marks", value: user.hscMarks != null ? `${user.hscMarks}%` : "—" },
          { label: "Member since", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—" },
        ].map(({ label, value }) => (
          <div key={label} style={{ padding: "12px 0", borderBottom: "1px solid #f0ece6" }}>
            <div style={{ fontFamily: F, fontSize: 10, color: "#a09690", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
            <div style={{ fontFamily: F, fontSize: 14, color: "#1a1a1a" }}>{value}</div>
          </div>
        ))}

        <button onClick={() => onDelete(user)} style={{ width: "100%", marginTop: 24, padding: "11px 0", borderRadius: 5, border: "1px solid #fca5a5", background: "#fff5f5", color: "#dc2626", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: F }}
          onMouseOver={e => e.currentTarget.style.background = "#fee2e2"}
          onMouseOut={e => e.currentTarget.style.background = "#fff5f5"}
        >Delete User</button>
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const debounceRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2400);
  };

  const fetchUsers = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch users");
      setUsers(await res.json());
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const searchUsers = async (keyword) => {
    if (!keyword.trim()) { fetchUsers(); return; }
    setSearching(true);
    try {
      const res = await fetch(`${API_BASE}/search?keyword=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error("Search failed");
      setUsers(await res.json());
    } catch (e) { setError(e.message); }
    finally { setSearching(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API_BASE}/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setUsers(prev => prev.filter(u => u._id !== deleteTarget._id));
      if (selectedUser?._id === deleteTarget._id) setSelectedUser(null);
      showToast(`${deleteTarget.fullName} deleted.`);
    } catch (e) { showToast(e.message, "error"); }
    finally { setDeleteTarget(null); }
  };

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchUsers(query), 360);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div style={{ fontFamily: S, background: "#f8f6f2", minHeight: "100vh", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", background: "#f8f6f2", borderBottom: "1px solid #e4dfd7", position: "sticky", top: 0, zIndex: 40 }}>
        <Link to="/" style={{ fontFamily: S, fontSize: 17, fontWeight: 700, color: "#1a1a1a", textDecoration: "none" }}>Job Portal</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: F }}>
          <span style={{ color: "#1a1a1a", fontSize: 13.5, fontWeight: 600, borderBottom: "2px solid #1a1a1a", paddingBottom: 2 }}>Users</span>
          <Link to="/">
            <button style={{ display: "flex", alignItems: "center", gap: 7, background: "#1a1a1a", color: "#f8f6f2", border: "none", padding: "8px 18px", borderRadius: 5, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: F }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.8"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Back to Home
            </button>
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 48px" }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#a09690", marginBottom: 8 }}>Administration</p>
          <h1 style={{ fontFamily: S, fontSize: 32, color: "#1a1a1a", margin: "0 0 6px", fontWeight: 700, letterSpacing: "-0.5px" }}>User Management</h1>
          <p style={{ fontFamily: F, color: "#6b6560", fontSize: 13.5, margin: 0 }}>
            {loading ? "Loading..." : `${users.length} user${users.length !== 1 ? "s" : ""} total`}
          </p>
        </div>

        <div style={{ position: "relative", maxWidth: 400, marginBottom: 32 }}>
          <input type="text" placeholder="Search by name or location..." value={query} onChange={e => setQuery(e.target.value)}
            style={{ width: "100%", padding: "10px 38px 10px 14px", borderRadius: 6, border: "1px solid #ddd8cf", background: "#fff", fontSize: 13.5, color: "#1a1a1a", outline: "none", fontFamily: F, boxSizing: "border-box" }} />
          {searching && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontFamily: F, fontSize: 12, color: "#a09690" }}>…</span>}
          {query && !searching && <button onClick={() => setQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a09690", fontSize: 18 }}>×</button>}
        </div>

        {error && <p style={{ fontFamily: F, fontSize: 13.5, color: "#dc2626", marginBottom: 20 }}>{error} — <button onClick={fetchUsers} style={{ background: "none", border: "none", color: "#dc2626", fontWeight: 600, cursor: "pointer", fontFamily: F, padding: 0, textDecoration: "underline" }}>Retry</button></p>}

        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
            {[...Array(6)].map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 8, height: 96, border: "1px solid #e4dfd7", animation: "pulse 1.4s ease-in-out infinite" }} />)}
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <h3 style={{ fontFamily: S, fontSize: 21, color: "#1a1a1a", marginBottom: 8 }}>No users found</h3>
            <p style={{ fontFamily: F, color: "#6b6560", fontSize: 14 }}>Try a different search term.</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
            {users.map(user => {
              const roleStyle = ROLE_COLORS[user.role] || ROLE_COLORS.user;
              return (
                <div key={user._id} onClick={() => setSelectedUser(user)}
                  style={{ background: "#fff", borderRadius: 8, padding: "18px 20px", border: "1px solid #e4dfd7", cursor: "pointer", transition: "box-shadow 0.18s, transform 0.18s" }}
                  onMouseOver={e => { e.currentTarget.style.boxShadow = "0 6px 22px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontFamily: F, fontSize: 14.5, fontWeight: 600, color: "#1a1a1a", marginBottom: 5 }}>{user.fullName}</div>
                      <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: F, background: roleStyle.bg, color: roleStyle.text, border: `1px solid ${roleStyle.border}` }}>{user.role}</span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setDeleteTarget(user); }}
                      style={{ background: "none", border: "none", padding: "2px 6px", cursor: "pointer", fontSize: 12, color: "#c8bfb6", fontFamily: F, fontWeight: 500 }}
                      onMouseOver={e => e.currentTarget.style.color = "#dc2626"}
                      onMouseOut={e => e.currentTarget.style.color = "#c8bfb6"}
                    >Delete</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontFamily: F, fontSize: 13, color: "#6b6560" }}>{user.email}</span>
                    {user.location && <span style={{ fontFamily: F, fontSize: 12.5, color: "#a09690" }}>{user.location}</span>}
                    {user.qualification && <span style={{ fontFamily: F, fontSize: 12.5, color: "#a09690" }}>{user.qualification}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedUser && <UserDrawer user={selectedUser} onClose={() => setSelectedUser(null)} onDelete={u => setDeleteTarget(u)} />}
      {deleteTarget && <DeleteModal user={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes fadeUp { from{opacity:0;transform:translate(-50%,-44%)} to{opacity:1;transform:translate(-50%,-50%)} }
        @keyframes slideIn { from{transform:translateX(40px);opacity:0} to{transform:translateX(0);opacity:1} }
      `}</style>

      <footer style={{ borderTop: "1px solid #e4dfd7", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: F }}>
        <span style={{ fontFamily: S, fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>Job Portal</span>
        <span style={{ fontSize: 12.5, color: "#a09690" }}>2025 · Built by <a href="https://github.com/gbr2629" style={{ color: "#6b6560", textDecoration: "none", borderBottom: "1px solid #d0cbc4" }}>Gauri Riswal</a></span>
      </footer>
    </div>
  );
}