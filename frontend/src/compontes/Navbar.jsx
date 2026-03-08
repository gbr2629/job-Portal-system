import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const stats = [
  { label: "Active Jobs", value: "12400" },
  { label: "Companies Hiring", value: "3200" },
  { label: "Placed This Month", value: "840" },
];

const featuredRoles = [
  { title: "Frontend Developer", company: "Stripe", location: "Remote", tag: "Featured", accent: "#1d4ed8" },
  { title: "Product Designer", company: "Figma", location: "San Francisco", tag: "New", accent: "#0f766e" },
  { title: "Data Scientist", company: "OpenAI", location: "New York", tag: "Urgent", accent: "#c2410c" },
];

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
}

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f7f5f2", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 52px", background: "#f7f5f2", borderBottom: "1px solid #e5e0d8", position: "sticky", top: 0, zIndex: 40 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1c1917", letterSpacing: "-0.2px" }}>Job Portal System</span>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Link to="/jobs" style={{ color: "#78716c", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Browse Jobs</Link>
          </div>
          </nav>


        <footer style={{ borderTop: "1px solid #e5e0d8", padding: "28px 40px", display: "flex", justifyContent: "center", gap: 16, alignItems: "center" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: "#1c1917" }}>JOb Portal </span>
        <span style={{ color: "#d6d0c8" }}>·</span>
        <span style={{ fontSize: 13, color: "#a8a09a" }}>2025 · Built for job seekers</span>
        <br></br>
        <span style={{color: "#a8a09a" , fontSize: 13 }}>Powered by <a href="https://github.com/gbr2629">Gauri Riswal</a>
        </span>
      </footer>
    </div>
    );
