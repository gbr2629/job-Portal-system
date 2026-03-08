import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const F = "'Instrument Sans', sans-serif";
const S = "'Lora', Georgia, serif";
const accents = ["#2563eb", "#0d9488", "#dc2626"];
const tags = ["Featured", "New", "Urgent"];

function Counter({ end }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0;
    const step = Math.ceil(end / 55);
    const t = setInterval(() => {
      i += step;
      if (i >= end) { setN(end); clearInterval(t); } else setN(i);
    }, 18);
    return () => clearInterval(t);
  }, [end]);
  return <>{n.toLocaleString()}+</>;
}

export default function Home() {
  const [cardHover, setCardHover] = useState(null);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalJobs: 0 });

  useEffect(() => {
    // ✅ FIXED: Removed /jobs/dashboard (404 error)
    // Now using only /jobs endpoint for both jobs list and stats
    fetch(`${API_BASE}/jobs`)
      .then(r => r.json())
      .then(d => {
        const allJobs = d.jobs || [];
        setJobs(allJobs.slice(0, 3));
        // Compute stats from the jobs response
        setStats({
          totalJobs: d.totalJobs || allJobs.length || 0,
          totalUsers: d.totalUsers || 0,
        });
      })
      .catch(() => {});
  }, []);

  const displayJobs = jobs.length > 0 ? jobs : [
    { title: "Frontend Developer", company: "Stripe", location: "Remote", salary: "$120k–$150k" },
    { title: "Product Designer", company: "Figma", location: "San Francisco", salary: "$110k–$140k" },
    { title: "Data Scientist", company: "OpenAI", location: "New York", salary: "$140k–$180k" },
  ];

  return (
    <div style={{ fontFamily: S, background: "#f8f6f2", minHeight: "100vh", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", background: "#f8f6f2", borderBottom: "1px solid #e4dfd7", position: "sticky", top: 0, zIndex: 40 }}>
        <span style={{ fontFamily: S, fontSize: 17, fontWeight: 700, color: "#1a1a1a" }}>Job Portal</span>
        <div style={{ display: "flex", alignItems: "center", gap: 28, fontFamily: F }}>
          <Link to="/jobs" style={{ color: "#6b6560", fontSize: 13.5, fontWeight: 500, textDecoration: "none" }}>Browse Jobs</Link>
          <Link to="/users" style={{ color: "#6b6560", fontSize: 13.5, fontWeight: 500, textDecoration: "none" }}>Users</Link>
          <Link to="/login" style={{ color: "#1a1a1a", fontSize: 13.5, fontWeight: 500, textDecoration: "none", borderBottom: "1px solid #1a1a1a", paddingBottom: 1 }}>Log in</Link>
          <Link to="/register">
            <button style={{ background: "#1a1a1a", color: "#f8f6f2", border: "none", padding: "8px 20px", borderRadius: 5, fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: F }}>Get started</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "88px 48px 56px", maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#a09690", marginBottom: 20 }}>Your next opportunity</p>
        <h1 style={{ fontFamily: S, fontSize: "clamp(38px, 5vw, 66px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1, letterSpacing: "-2px", margin: "0 auto 22px" }}>
          Find work that<br /><em style={{ fontStyle: "italic", color: "#2563eb" }}>actually fits you</em>
        </h1>
        <p style={{ fontFamily: F, color: "#6b6560", fontSize: 16.5, lineHeight: 1.78, maxWidth: 420, margin: "0 auto 44px" }}>
          No noise, no clutter. Connect with companies that value your skills.
        </p>

        <div style={{ display: "flex", maxWidth: 480, margin: "0 auto 10px", background: "#fff", border: focused ? "1.5px solid #2563eb" : "1.5px solid #ddd8cf", boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.08)" : "0 2px 12px rgba(0,0,0,0.04)", padding: "5px 5px 5px 18px", borderRadius: 6, transition: "all 0.2s" }}>
          <input value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="Job title, company, or keyword..."
            style={{ flex: 1, border: "none", background: "none", fontSize: 14.5, color: "#1a1a1a", outline: "none", fontFamily: F }} />
          <Link to={`/jobs${query ? `?q=${encodeURIComponent(query)}` : ""}`}>
            <button style={{ background: "#1a1a1a", color: "#f8f6f2", border: "none", borderRadius: 4, padding: "10px 20px", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: F }}>Search</button>
          </Link>
        </div>
        <p style={{ fontFamily: F, color: "#b8b0a6", fontSize: 12.5 }}>Popular: React Developer · UX Designer · Data Analyst</p>
      </section>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", maxWidth: 520, margin: "0 auto", padding: "0 24px 68px", borderBottom: "1px solid #e4dfd7" }}>
        {[
          { label: "Open Positions", value: stats.totalJobs || 124 },
          { label: "Registered Users", value: stats.totalUsers || 320 },
          { label: "Placed This Month", value: 84 },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", padding: "0 12px", borderRight: i < 2 ? "1px solid #e4dfd7" : "none" }}>
            <div style={{ fontFamily: S, fontSize: 36, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-1.5px" }}><Counter end={s.value} /></div>
            <div style={{ fontFamily: F, fontSize: 12, color: "#a09690", marginTop: 5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Featured roles */}
      <section style={{ padding: "64px 48px 72px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
          <h2 style={{ fontFamily: S, fontSize: 26, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.4px" }}>Featured roles</h2>
          <Link to="/jobs" style={{ fontFamily: F, fontSize: 13, color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>View all</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {displayJobs.map((job, i) => {
            const accent = accents[i % accents.length];
            return (
              <div key={i} onMouseEnter={() => setCardHover(i)} onMouseLeave={() => setCardHover(null)}
                style={{ background: "#fff", borderRadius: 8, padding: "24px", border: "1px solid #e4dfd7", borderLeft: `3px solid ${accent}`, boxShadow: cardHover === i ? "0 8px 28px rgba(0,0,0,0.07)" : "none", transform: cardHover === i ? "translateY(-2px)" : "none", transition: "all 0.18s", cursor: "pointer" }}>
                <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: accent }}>{tags[i]}</span>
                <h3 style={{ fontFamily: S, fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: "10px 0 3px" }}>{job.title}</h3>
                <p style={{ fontFamily: F, fontSize: 13, color: "#6b6560", fontWeight: 500, margin: "0 0 2px" }}>{job.company}</p>
                <p style={{ fontFamily: F, fontSize: 12.5, color: "#a09690", margin: "0 0 20px" }}>
                  {[job.location, job.salary].filter(Boolean).join("  ·  ")}
                </p>
                <button style={{ width: "100%", background: cardHover === i ? accent : "transparent", color: cardHover === i ? "#fff" : accent, border: `1.5px solid ${accent}`, borderRadius: 5, padding: "9px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: F, transition: "all 0.18s" }}>
                  Apply now
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 48px 80px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", background: "#1a1a1a", borderRadius: 10, padding: "52px 44px", textAlign: "center" }}>
          <h2 style={{ fontFamily: S, fontSize: 28, fontWeight: 700, color: "#f8f6f2", letterSpacing: "-0.5px", marginBottom: 12 }}>Ready for your next chapter?</h2>
          <p style={{ fontFamily: F, color: "rgba(248,246,242,0.52)", fontSize: 15, lineHeight: 1.75, marginBottom: 32 }}>Join thousands of professionals who found their perfect role</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link to="/register"><button style={{ background: "#f8f6f2", color: "#1a1a1a", border: "none", borderRadius: 5, padding: "12px 26px", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: F }}>Create free account</button></Link>
            <Link to="/login"><button style={{ background: "transparent", color: "rgba(248,246,242,0.58)", border: "1px solid rgba(248,246,242,0.16)", borderRadius: 5, padding: "12px 26px", fontSize: 14, cursor: "pointer", fontFamily: F }}>Sign in</button></Link>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #e4dfd7", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: F }}>
        <span style={{ fontFamily: S, fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>Job Portal</span>
        <span style={{ fontSize: 12.5, color: "#a09690" }}>2025 · Built by <a href="https://github.com/gbr2629" style={{ color: "#6b6560", textDecoration: "none", borderBottom: "1px solid #d0cbc4" }}>Gauri Riswal</a></span>
      </footer>
    </div>
  );
}