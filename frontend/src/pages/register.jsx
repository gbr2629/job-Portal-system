import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// Kept OUTSIDE to prevent remount/focus loss
function Field({ label, name, type = "text", placeholder, value, onChange, required = true, focused, onFocus, onBlur }) {
  const isActive = focused === name;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#44403c" }}>{label}</label>
      <input
        name={name} type={type} placeholder={placeholder}
        value={value} onChange={onChange} required={required}
        onFocus={() => onFocus(name)} onBlur={() => onBlur("")}
        style={{
          border: isActive ? "1.5px solid #1d4ed8" : "1.5px solid #ddd7cf",
          boxShadow: isActive ? "0 0 0 3px rgba(29,78,216,0.08)" : "none",
          borderRadius: 7, padding: "11px 14px", fontSize: 14.5,
          fontFamily: "'DM Sans', sans-serif", color: "#1c1917",
          background: "#fff", outline: "none", width: "100%",
          transition: "all 0.2s", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ fullName: "", email: "", password: "", phoneNo: "", sscMarks: "", hscMarks: "", qualification: "", location: "" });
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: name === "phoneNo" ? value.replace(/\D/g, "").slice(0, 10) : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://job-portal-system-ksbv.onrender.com/users/register", user);
      setSuccess(true);
      setUser({ fullName: "", email: "", password: "", phoneNo: "", sscMarks: "", hscMarks: "", qualification: "", location: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f2", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px 60px", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1c1917" }}> JOB PORTAL</span>
          </Link>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: "40px 36px", border: "1px solid #e5e0d8", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#1c1917", marginBottom: 6, letterSpacing: "-0.3px" }}>Create your account</h1>
          <p style={{ fontSize: 14, color: "#a8a09a", marginBottom: 28 }}>Fill in your details to get started</p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 7, padding: "11px 14px", fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", borderRadius: 7, padding: "11px 14px", fontSize: 13, marginBottom: 20 }}>
              Account created!{" "}
              <Link to="/login" style={{ color: "#15803d", fontWeight: 600, textDecoration: "underline" }}>Sign in now</Link>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: "#a8a09a", margin: "0 0 4px" }}>Personal details</p>

            <Field label="Full name" name="fullName" placeholder="Your full name" value={user.fullName} onChange={handleChange} focused={focused} onFocus={setFocused} onBlur={setFocused} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Email address" name="email" type="email" placeholder="you@email.com" value={user.email} onChange={handleChange} focused={focused} onFocus={setFocused} onBlur={setFocused} />
              <Field label="Phone number" name="phoneNo" placeholder="10-digit number" value={user.phoneNo} onChange={handleChange} focused={focused} onFocus={setFocused} onBlur={setFocused} />
            </div>

            <Field label="Password" name="password" type="password" placeholder="Choose a password" value={user.password} onChange={handleChange} focused={focused} onFocus={setFocused} onBlur={setFocused} />

            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: "#a8a09a", margin: "8px 0 4px" }}>Academic details</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="SSC Marks %" name="sscMarks" placeholder="e.g. 85" value={user.sscMarks} onChange={handleChange} focused={focused} onFocus={setFocused} onBlur={setFocused} />
              <Field label="HSC Marks %" name="hscMarks" placeholder="e.g. 78" value={user.hscMarks} onChange={handleChange} focused={focused} onFocus={setFocused} onBlur={setFocused} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Qualification" name="qualification" placeholder="e.g. B.Tech" value={user.qualification} onChange={handleChange} focused={focused} onFocus={setFocused} onBlur={setFocused} />
              <Field label="Location" name="location" placeholder="e.g. Mumbai" value={user.location} onChange={handleChange} focused={focused} onFocus={setFocused} onBlur={setFocused} />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                marginTop: 6, background: loading ? "#93c5fd" : "#1c1917",
                color: "#f7f5f2", border: "none", borderRadius: 7,
                padding: "13px", fontSize: 15, fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >{loading ? "Creating account..." : "Create account"}</button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#a8a09a" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1d4ed8", fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}