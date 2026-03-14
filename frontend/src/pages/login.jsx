import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const RECRUITER_EMAIL = "riswalgauri@gmail.com";
const API_BASE = "https://job-portal-system-ksbv.onrender.com/jobs";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("User");
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Show logout toast if redirected from logout
  useState(() => {
    if (sessionStorage.getItem("loggedOut") === "true") {
      sessionStorage.removeItem("loggedOut");
      setTimeout(() => toast("You have been logged out.", {
        icon: "👋",
        style: { fontFamily: "'DM Sans', sans-serif", fontSize: 14, background: "#1c1917", color: "#f7f5f2" }
      }), 100);
    }
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRoleSelect = (selected) => {
    setRole(selected);
    setError("");
    if (selected === "Recruiter") {
      setForm((prev) => ({ ...prev, email: RECRUITER_EMAIL }));
    } else {
      setForm((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (role === "Recruiter" && form.email !== RECRUITER_EMAIL) {
      setError("This email is not authorized as a Recruiter.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/users/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("userEmail", form.email);

      const name = res.data.user?.fullName || res.data.user?.name || form.email.split("@")[0];
      toast.success(`Welcome back, ${name}!`, { duration: 2000 });
      setTimeout(() => navigate("/jobs"), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const inp = (name) => ({
    border: focused === name ? "1.5px solid #1d4ed8" : "1.5px solid #ddd7cf",
    boxShadow: focused === name ? "0 0 0 3px rgba(29,78,216,0.08)" : "none",
    borderRadius: 7, padding: "11px 14px", fontSize: 14.5,
    fontFamily: "'DM Sans', sans-serif", color: "#1c1917",
    background: "#fff", outline: "none", width: "100%",
    transition: "all 0.2s", boxSizing: "border-box",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f2", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: 14, background: "#1c1917", color: "#f7f5f2" } }} />

      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1c1917" }}>TalentBridge</span>
          </Link>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: "40px 36px", border: "1px solid #e5e0d8", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#1c1917", marginBottom: 6, letterSpacing: "-0.3px" }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "#a8a09a", marginBottom: 28 }}>Sign in to your account to continue</p>

          {/* ── Role Selector ── */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#44403c", display: "block", marginBottom: 8 }}>
              Sign in as
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {["User", "Recruiter"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  style={{
                    padding: "10px 14px", borderRadius: 7,
                    border: role === r ? "1.5px solid #1c1917" : "1.5px solid #ddd7cf",
                    background: role === r ? "#1c1917" : "#fff",
                    color: role === r ? "#f7f5f2" : "#78716c",
                    fontSize: 14, fontWeight: role === r ? 600 : 400,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.18s",
                  }}
                >{r}</button>
              ))}
            </div>
            {role === "Recruiter" && (
              <p style={{ fontSize: 12, color: "#a8a09a", marginTop: 8 }}>
                Recruiter access is restricted to authorized accounts only.
              </p>
            )}
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 7, padding: "11px 14px", fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#44403c" }}>Email address</label>
              <input
                name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required
                onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                readOnly={role === "Recruiter"}
                style={{
                  ...inp("email"),
                  background: role === "Recruiter" ? "#f5f3f0" : "#fff",
                  color: role === "Recruiter" ? "#78716c" : "#1c1917",
                  cursor: role === "Recruiter" ? "default" : "text",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#44403c" }}>Password</label>
              <input
                name="password" type="password"
                placeholder={role === "Recruiter" ? "Enter recruiter password" : "Your password"}
                value={form.password} onChange={handleChange} required
                onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                style={inp("password")}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                marginTop: 4, background: loading ? "#a8a09a" : "#1c1917",
                color: "#f7f5f2", border: "none", borderRadius: 7,
                padding: "13px", fontSize: 15, fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s",
              }}
            >{loading ? "Signing in..." : `Sign in as ${role}`}</button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#a8a09a" }}>
          No account yet?{" "}
          <Link to="/register" style={{ color: "#1d4ed8", fontWeight: 500, textDecoration: "none" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
