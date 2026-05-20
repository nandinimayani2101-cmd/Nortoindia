import { useState, useEffect, useCallback, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const G = {
  gold: "#C9A84C", goldLight: "#E2C47A", goldDark: "#8A6430",
  bg: "#0A0A0B", surface: "#111113", surface2: "#18181B",
  surface3: "#1F1F24", border: "rgba(255,255,255,0.07)",
  borderGold: "rgba(201,168,76,0.3)", text: "#F4F4F5",
  muted: "#71717A", muted2: "#52525B",
  green: "#22C55E", greenBg: "rgba(34,197,94,0.1)",
  red: "#EF4444", redBg: "rgba(239,68,68,0.1)",
  amber: "#F59E0B", amberBg: "rgba(245,158,11,0.1)",
  blue: "#3B82F6", blueBg: "rgba(59,130,246,0.1)",
};

// ─── FONTS ─────────────────────────────────────────────────────────────────────
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0A0B; color: #F4F4F5; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111113; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px #18181B inset !important; -webkit-text-fill-color: #F4F4F5 !important; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }
  @keyframes slideIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
  @keyframes toastIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  .fade-up { animation: fadeUp 0.45s ease both; }
  .fade-in { animation: fadeIn 0.3s ease both; }
  .spin { animation: spin 0.8s linear infinite; }
  .pulse-dot { animation: pulse 2s infinite; }
`;

// ─── INITIAL DATA ──────────────────────────────────────────────────────────────
const ADMIN = { email: "admin@nortoindia.com", password: "admin123", role: "admin", name: "Admin" };

const SEED_SELLERS = [
  { id: "s1", name: "Rahul Sharma", businessName: "RS Dropship", phone: "9876543210", email: "rahul@example.com", password: "pass123", role: "seller", joinedAt: "2026-01-15", plan: "Pro", totalOrders: 47, rtoRate: 12 },
  { id: "s2", name: "Priya Singh", businessName: "Trend Bazaar", phone: "9123456780", email: "priya@example.com", password: "pass123", role: "seller", joinedAt: "2026-02-10", plan: "Basic", totalOrders: 28, rtoRate: 22 },
];

const SEED_ORDERS = [
  { id: "o1", nrtoId: "NRTO-2026-0001", sellerId: "s1", sellerName: "Rahul Sharma", customerName: "Amit Kumar", customerPhone: "9988776655", address: "45 MG Road, Bengaluru 560001", product: "Blue Denim Jacket", orderId: "ORD-001", awb: "AWB123456", codAmount: 1299, courier: "Delhivery", status: "confirmed", submittedAt: "2026-05-01", notes: "", riskScore: 18 },
  { id: "o2", nrtoId: "NRTO-2026-0002", sellerId: "s1", sellerName: "Rahul Sharma", customerName: "Sunita Devi", customerPhone: "9112233445", address: "78 Gandhi Nagar, Jaipur 302001", product: "Cotton Kurta Set", orderId: "ORD-002", awb: "AWB123457", codAmount: 899, courier: "Bluedart", status: "pending", submittedAt: "2026-05-03", notes: "", riskScore: 62 },
  { id: "o3", nrtoId: "NRTO-2026-0003", sellerId: "s2", sellerName: "Priya Singh", customerName: "Vikram Patel", customerPhone: "9001122334", address: "12 Park Street, Kolkata 700016", product: "Wireless Earbuds", orderId: "ORD-003", awb: "AWB123458", codAmount: 599, courier: "Ekart", status: "risky", submittedAt: "2026-05-05", notes: "Customer unresponsive on 2 attempts", riskScore: 78 },
  { id: "o4", nrtoId: "NRTO-2026-0004", sellerId: "s1", sellerName: "Rahul Sharma", customerName: "Neha Gupta", customerPhone: "9876512345", address: "99 Connaught Place, Delhi 110001", product: "Silk Saree", orderId: "ORD-004", awb: "AWB123459", codAmount: 2199, courier: "DTDC", status: "rejected", submittedAt: "2026-05-06", notes: "Invalid address confirmed", riskScore: 91 },
  { id: "o5", nrtoId: "NRTO-2026-0005", sellerId: "s2", sellerName: "Priya Singh", customerName: "Ravi Mehta", customerPhone: "9543210987", address: "33 Linking Road, Mumbai 400050", product: "Running Shoes", orderId: "ORD-005", awb: "AWB123460", codAmount: 1799, courier: "Delhivery", status: "confirmed", submittedAt: "2026-05-08", notes: "", riskScore: 22 },
];

const SEED_CLAIMS = [
  { id: "c1", nrtoOrderId: "NRTO-2026-0001", sellerId: "s1", sellerName: "Rahul Sharma", notes: "Customer refused delivery", status: "claim_approved", submittedAt: "2026-05-10", amount: 1299 },
  { id: "c2", nrtoOrderId: "NRTO-2026-0003", sellerId: "s2", sellerName: "Priya Singh", notes: "RTO after 3 attempts", status: "claim_pending", submittedAt: "2026-05-12", amount: 599 },
];

const SEED_NOTIFS = [
  { id: "n1", sellerId: "s1", message: "Order NRTO-2026-0001 has been Confirmed ✅", read: false, createdAt: "2026-05-01" },
  { id: "n2", sellerId: "s1", message: "RTO Claim for NRTO-2026-0001 has been Approved 🎉", read: false, createdAt: "2026-05-10" },
  { id: "n3", sellerId: "s2", message: "Order NRTO-2026-0005 has been Confirmed ✅", read: true, createdAt: "2026-05-08" },
];

// ─── STORAGE HELPERS ───────────────────────────────────────────────────────────
const LS = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

function initStore() {
  if (!LS.get("nrto_init")) {
    LS.set("nrto_sellers", SEED_SELLERS);
    LS.set("nrto_orders", SEED_ORDERS);
    LS.set("nrto_claims", SEED_CLAIMS);
    LS.set("nrto_notifs", SEED_NOTIFS);
    LS.set("nrto_orderSeq", 5);
    LS.set("nrto_init", true);
  }
}

// ─── UTILITY ───────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);
const fmtDate = (s) => s ? new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const calcRisk = (phone, address) => {
  let score = Math.floor(Math.random() * 40) + 10;
  if (phone.startsWith("9999")) score += 30;
  if (address.length < 20) score += 25;
  if (address.toLowerCase().includes("fake")) score += 40;
  return Math.min(score, 99);
};
const statusColor = (s) => ({
  pending: { color: G.amber, bg: G.amberBg, label: "Pending" },
  confirmed: { color: G.green, bg: G.greenBg, label: "Confirmed" },
  rejected: { color: G.red, bg: G.redBg, label: "Rejected" },
  risky: { color: "#F97316", bg: "rgba(249,115,22,0.1)", label: "Risky" },
  claim_pending: { color: G.amber, bg: G.amberBg, label: "Claim Pending" },
  claim_approved: { color: G.green, bg: G.greenBg, label: "Approved" },
  claim_rejected: { color: G.red, bg: G.redBg, label: "Rejected" },
  payout_completed: { color: G.blue, bg: G.blueBg, label: "Payout Done" },
}[s] || { color: G.muted, bg: "rgba(113,113,122,0.1)", label: s });

// ─── PRIMITIVE COMPONENTS ──────────────────────────────────────────────────────
const Syne = ({ children, style, ...p }) => (
  <span style={{ fontFamily: "'Syne',sans-serif", ...style }} {...p}>{children}</span>
);

const Badge = ({ status }) => {
  const sc = statusColor(status);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 50,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
      color: sc.color, background: sc.bg, border: `1px solid ${sc.color}30`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, display: "inline-block" }} />
      {sc.label}
    </span>
  );
};

const Btn = ({ children, variant = "primary", size = "md", onClick, disabled, style, type = "button" }) => {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
    border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
    borderRadius: 10, transition: "all 0.2s",
    opacity: disabled ? 0.5 : 1,
    ...(size === "sm" ? { padding: "6px 14px", fontSize: 12 } :
       size === "lg" ? { padding: "13px 28px", fontSize: 15 } :
       { padding: "9px 18px", fontSize: 13 }),
    ...(variant === "primary" ? { background: G.gold, color: "#0A0A0B" } :
       variant === "ghost" ? { background: "transparent", color: G.muted, border: `1px solid ${G.border}` } :
       variant === "danger" ? { background: G.redBg, color: G.red, border: `1px solid ${G.red}30` } :
       variant === "success" ? { background: G.greenBg, color: G.green, border: `1px solid ${G.green}30` } :
       variant === "outline" ? { background: "transparent", color: G.gold, border: `1px solid ${G.borderGold}` } :
       { background: G.surface3, color: G.text, border: `1px solid ${G.border}` }),
    ...style,
  };
  return <button type={type} style={base} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Input = ({ label, value, onChange, placeholder, type = "text", required, error, hint, icon }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: G.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}{required && <span style={{ color: G.red }}> *</span>}</label>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: G.muted, pointerEvents: "none", fontSize: 15 }}>{icon}</span>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        style={{
          width: "100%", padding: `10px ${icon ? "12px 10px 36px" : "14px"}`,
          background: G.surface3, border: `1px solid ${error ? G.red : G.border}`,
          borderRadius: 10, color: G.text, fontSize: 14, outline: "none",
          fontFamily: "'DM Sans',sans-serif",
          ...(icon ? { paddingLeft: 38 } : {}),
        }}
      />
    </div>
    {error && <span style={{ fontSize: 11, color: G.red }}>{error}</span>}
    {hint && <span style={{ fontSize: 11, color: G.muted }}>{hint}</span>}
  </div>
);

const Select = ({ label, value, onChange, options, required }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: G.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}{required && <span style={{ color: G.red }}> *</span>}</label>}
    <select value={value} onChange={e => onChange(e.target.value)} required={required}
      style={{ padding: "10px 14px", background: G.surface3, border: `1px solid ${G.border}`, borderRadius: 10, color: G.text, fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Card = ({ children, style, glow }) => (
  <div style={{
    background: G.surface, border: `1px solid ${glow ? G.borderGold : G.border}`,
    borderRadius: 16, padding: 24,
    boxShadow: glow ? `0 0 24px ${G.goldDark}30` : "none",
    ...style,
  }}>{children}</div>
);

const StatCard = ({ icon, label, value, sub, color, delay = 0 }) => (
  <div className="fade-up" style={{
    background: G.surface, border: `1px solid ${G.border}`, borderRadius: 16,
    padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12,
    animationDelay: `${delay}ms`,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
      {sub !== undefined && <span style={{ fontSize: 11, color: sub >= 0 ? G.green : G.red, fontWeight: 600 }}>{sub >= 0 ? "▲" : "▼"} {Math.abs(sub)}%</span>}
    </div>
    <div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: G.muted, marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

const RiskMeter = ({ score }) => {
  const color = score < 30 ? G.green : score < 60 ? G.amber : G.red;
  const label = score < 30 ? "Low Risk" : score < 60 ? "Medium Risk" : "High Risk";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: G.muted }}>Risk Score</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}/100 · {label}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: G.surface3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
};

const Toast = ({ toasts }) => (
  <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
    {toasts.map(t => (
      <div key={t.id} className="fade-up" style={{
        padding: "12px 20px", borderRadius: 12, fontWeight: 500, fontSize: 13,
        background: t.type === "success" ? G.greenBg : t.type === "error" ? G.redBg : G.surface3,
        border: `1px solid ${t.type === "success" ? G.green : t.type === "error" ? G.red : G.border}30`,
        color: t.type === "success" ? G.green : t.type === "error" ? G.red : G.text,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)", maxWidth: 340,
      }}>{t.msg}</div>
    ))}
  </div>
);

const Modal = ({ open, onClose, title, children, width = 560 }) => {
  if (!open) return null;
  return (
    <div className="fade-in" style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fade-up" style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 20, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Syne style={{ fontSize: 18, fontWeight: 700 }}>{title}</Syne>
          <button onClick={onClose} style={{ background: "none", border: "none", color: G.muted, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

const Spinner = () => <div className="spin" style={{ width: 18, height: 18, border: `2px solid ${G.border}`, borderTopColor: G.gold, borderRadius: "50%" }} />;

const EmptyState = ({ icon, title, sub }) => (
  <div style={{ textAlign: "center", padding: "60px 20px" }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{title}</div>
    <div style={{ color: G.muted, fontSize: 13 }}>{sub}</div>
  </div>
);

// ─── SIDEBAR ───────────────────────────────────────────────────────────────────
const Sidebar = ({ user, page, setPage, unread, onLogout, open, setOpen }) => {
  const isAdmin = user?.role === "admin";
  const navItems = isAdmin
    ? [
        { id: "admin_overview", icon: "⬡", label: "Overview" },
        { id: "admin_sellers", icon: "👥", label: "Sellers" },
        { id: "admin_orders", icon: "📦", label: "All Orders" },
        { id: "admin_claims", icon: "🛡️", label: "RTO Claims" },
        { id: "admin_analytics", icon: "📊", label: "Analytics" },
      ]
    : [
        { id: "overview", icon: "⬡", label: "Dashboard" },
        { id: "add_order", icon: "＋", label: "Add Order" },
        { id: "my_orders", icon: "📦", label: "My Orders" },
        { id: "claims", icon: "🛡️", label: "RTO Claims" },
        { id: "notifications", icon: "🔔", label: "Notifications", badge: unread },
      ];

  const sideStyle = {
    width: 230, background: G.surface, borderRight: `1px solid ${G.border}`,
    display: "flex", flexDirection: "column", height: "100vh",
    position: "fixed", top: 0, left: 0, zIndex: 200,
    transition: "transform 0.3s ease",
  };

  return (
    <>
      {open && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199 }} onClick={() => setOpen(false)} />}
      <div style={{ ...sideStyle, transform: open ? "translateX(0)" : window.innerWidth < 768 ? "translateX(-100%)" : "translateX(0)" }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${G.border}` }}>
          <Syne style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>
            No<span style={{ color: G.gold }}>RTO</span> India
          </Syne>
          <div style={{ fontSize: 11, color: G.muted, marginTop: 2 }}>{isAdmin ? "Admin Console" : "Seller Portal"}</div>
        </div>
        {/* User pill */}
        <div style={{ padding: "12px 16px", margin: "12px", background: G.surface2, borderRadius: 12, border: `1px solid ${G.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: G.muted }}>{user?.email}</div>
          {!isAdmin && <div style={{ marginTop: 4, fontSize: 10, color: G.gold, fontWeight: 600, letterSpacing: "0.06em" }}>● {user?.plan || "Basic"} Plan</div>}
        </div>
        {/* Nav */}
        <nav style={{ flex: 1, padding: "4px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left", width: "100%",
              background: page === n.id ? `${G.gold}18` : "transparent",
              color: page === n.id ? G.gold : G.muted,
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: page === n.id ? 600 : 400,
              borderLeft: page === n.id ? `3px solid ${G.gold}` : "3px solid transparent",
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 15 }}>{n.icon}</span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.badge > 0 && <span style={{ background: G.red, color: "#fff", borderRadius: 50, fontSize: 10, padding: "1px 6px", fontWeight: 700 }}>{n.badge}</span>}
            </button>
          ))}
        </nav>
        {/* Logout */}
        <div style={{ padding: "12px 12px 20px" }}>
          <button onClick={onLogout} style={{
            width: "100%", padding: "10px 12px", background: G.redBg, border: `1px solid ${G.red}20`,
            borderRadius: 10, color: G.red, fontFamily: "'DM Sans',sans-serif", fontSize: 13,
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          }}>⬡ Sign Out</button>
        </div>
      </div>
    </>
  );
};

// ─── TOPBAR ────────────────────────────────────────────────────────────────────
const Topbar = ({ title, sub, onMenuClick, actions }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 28px", borderBottom: `1px solid ${G.border}`,
    background: G.bg, position: "sticky", top: 0, zIndex: 100,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button onClick={onMenuClick} style={{ background: "none", border: "none", color: G.muted, cursor: "pointer", fontSize: 22, display: "none", ...(window.innerWidth < 768 ? { display: "block" } : {}) }}>☰</button>
      <div>
        <Syne style={{ fontSize: 20, fontWeight: 800 }}>{title}</Syne>
        {sub && <div style={{ fontSize: 12, color: G.muted, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
    {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
  </div>
);

// ─── AUTH PAGE ─────────────────────────────────────────────────────────────────
const AuthPage = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", businessName: "", phone: "", email: "", password: "" });
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const handle = () => {
    setErr(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (form.email === ADMIN.email && form.password === ADMIN.password) { onLogin(ADMIN); return; }
      const sellers = LS.get("nrto_sellers", []);
      if (mode === "login") {
        const s = sellers.find(s => s.email === form.email && s.password === form.password);
        if (s) { onLogin(s); } else { setErr("Invalid email or password."); }
      } else {
        if (!form.name || !form.businessName || !form.phone || !form.email || !form.password) { setErr("All fields are required."); return; }
        if (sellers.find(s => s.email === form.email)) { setErr("Email already registered."); return; }
        const newSeller = { id: uid(), ...form, role: "seller", joinedAt: new Date().toISOString().split("T")[0], plan: "Basic", totalOrders: 0, rtoRate: 0 };
        LS.set("nrto_sellers", [...sellers, newSeller]);
        onLogin(newSeller);
      }
    }, 900);
  };

  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <style>{fontStyle}</style>
      <div className="fade-up" style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Syne style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", display: "block" }}>
            No<span style={{ color: G.gold }}>RTO</span> India
          </Syne>
          <p style={{ color: G.muted, fontSize: 14, marginTop: 6 }}>Reduce your COD RTO losses — smarter.</p>
        </div>
        <Card>
          <div style={{ display: "flex", gap: 0, marginBottom: 24, background: G.surface2, borderRadius: 10, padding: 4 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(""); }} style={{
                flex: 1, padding: "8px", borderRadius: 8, border: "none",
                background: mode === m ? G.gold : "transparent",
                color: mode === m ? "#0A0A0B" : G.muted,
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer",
                textTransform: "capitalize", transition: "all 0.2s",
              }}>{m === "login" ? "Sign In" : "Sign Up"}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && <>
              <Input label="Full Name" value={form.name} onChange={set("name")} placeholder="Rahul Sharma" required icon="👤" />
              <Input label="Business Name" value={form.businessName} onChange={set("businessName")} placeholder="My Shop" required icon="🏪" />
              <Input label="Phone Number" value={form.phone} onChange={set("phone")} placeholder="9876543210" required icon="📱" />
            </>}
            <Input label="Email" value={form.email} onChange={set("email")} placeholder="you@example.com" type="email" required icon="✉️" />
            <Input label="Password" value={form.password} onChange={set("password")} placeholder="••••••••" type="password" required icon="🔒" />
            {err && <div style={{ padding: "10px 14px", background: G.redBg, borderRadius: 8, fontSize: 13, color: G.red, border: `1px solid ${G.red}30` }}>{err}</div>}
            <Btn variant="primary" size="lg" onClick={handle} disabled={loading} style={{ width: "100%", marginTop: 4 }}>
              {loading ? <Spinner /> : mode === "login" ? "Sign In →" : "Create Account →"}
            </Btn>
            {mode === "login" && (
              <div style={{ padding: "10px 14px", background: G.surface2, borderRadius: 8, fontSize: 12, color: G.muted }}>
                Demo Admin: <strong style={{ color: G.gold }}>admin@nortoindia.com</strong> / <strong style={{ color: G.gold }}>admin123</strong><br />
                Demo Seller: <strong style={{ color: G.gold }}>rahul@example.com</strong> / <strong style={{ color: G.gold }}>pass123</strong>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── SELLER: ADD ORDER ─────────────────────────────────────────────────────────
const AddOrder = ({ user, addToast }) => {
  const COURIERS = ["Delhivery", "Bluedart", "DTDC", "Ekart", "XpressBees", "Shadowfax", "Ecom Express", "Other"];
  const blank = { customerName: "", customerPhone: "", address: "", product: "", orderId: "", awb: "", codAmount: "", courier: "Delhivery" };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.customerName) e.customerName = "Required";
    if (!/^\d{10}$/.test(form.customerPhone)) e.customerPhone = "Enter valid 10-digit phone";
    if (!form.address || form.address.length < 15) e.address = "Full address required (min 15 chars)";
    if (!form.product) e.product = "Required";
    if (!form.orderId) e.orderId = "Required";
    if (!form.awb) e.awb = "Required";
    if (!form.codAmount || isNaN(form.codAmount) || +form.codAmount <= 0) e.codAmount = "Valid amount required";
    const orders = LS.get("nrto_orders", []);
    if (orders.find(o => o.orderId === form.orderId && o.sellerId === user.id)) e.orderId = "Order ID already submitted";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const orders = LS.get("nrto_orders", []);
      const seq = LS.get("nrto_orderSeq", 0) + 1;
      LS.set("nrto_orderSeq", seq);
      const nrtoId = `NRTO-${new Date().getFullYear()}-${String(seq).padStart(4, "0")}`;
      const risk = calcRisk(form.customerPhone, form.address);
      const newOrder = {
        id: uid(), nrtoId, sellerId: user.id, sellerName: user.name,
        ...form, codAmount: +form.codAmount,
        status: "pending", submittedAt: new Date().toISOString().split("T")[0],
        notes: "", riskScore: risk,
      };
      LS.set("nrto_orders", [...orders, newOrder]);
      // notify
      const notifs = LS.get("nrto_notifs", []);
      LS.set("nrto_notifs", [...notifs, { id: uid(), sellerId: user.id, message: `Order ${nrtoId} submitted for verification 📋`, read: false, createdAt: new Date().toISOString().split("T")[0] }]);
      setLoading(false);
      setDone({ nrtoId, risk });
      setForm(blank);
      addToast("Order submitted successfully!", "success");
    }, 1000);
  };

  if (done) return (
    <div style={{ padding: 28 }}>
      <Card glow style={{ textAlign: "center", maxWidth: 440, margin: "40px auto" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <Syne style={{ fontSize: 22, fontWeight: 800, display: "block", marginBottom: 8 }}>Order Submitted!</Syne>
        <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: G.gold, margin: "12px 0", padding: "8px 20px", background: G.surface2, borderRadius: 8, display: "inline-block" }}>{done.nrtoId}</div>
        <p style={{ color: G.muted, fontSize: 13, marginBottom: 8 }}>Save your NoRTO Order Number for future reference.</p>
        <RiskMeter score={done.risk} />
        <div style={{ marginTop: 4, fontSize: 12, color: G.muted }}>Our team will verify this order before dispatch.</div>
        <Btn variant="outline" onClick={() => setDone(null)} style={{ marginTop: 16, width: "100%" }}>Submit Another Order</Btn>
      </Card>
    </div>
  );

  return (
    <div style={{ padding: 28 }}>
      <div className="fade-up" style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <Syne style={{ fontSize: 22, fontWeight: 800 }}>Submit New Order</Syne>
          <p style={{ color: G.muted, fontSize: 13, marginTop: 4 }}>All fields are mandatory. We'll verify before you ship.</p>
        </div>
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1/-1" }}><Input label="Customer Name" value={form.customerName} onChange={set("customerName")} placeholder="Amit Kumar" required error={errors.customerName} icon="👤" /></div>
            <Input label="Customer Phone" value={form.customerPhone} onChange={set("customerPhone")} placeholder="9988776655" required error={errors.customerPhone} icon="📱" />
            <Input label="COD Amount (₹)" value={form.codAmount} onChange={set("codAmount")} placeholder="1299" type="number" required error={errors.codAmount} icon="₹" />
            <div style={{ gridColumn: "1/-1" }}><Input label="Full Address" value={form.address} onChange={set("address")} placeholder="House No, Street, City, State, PIN" required error={errors.address} icon="📍" /></div>
            <Input label="Product Name" value={form.product} onChange={set("product")} placeholder="Blue Denim Jacket" required error={errors.product} icon="🏷️" />
            <Input label="Your Order ID" value={form.orderId} onChange={set("orderId")} placeholder="ORD-001" required error={errors.orderId} icon="🆔" />
            <Input label="AWB Number" value={form.awb} onChange={set("awb")} placeholder="AWB123456" required error={errors.awb} icon="📮" />
            <Select label="Courier Partner" value={form.courier} onChange={set("courier")} required options={COURIERS.map(c => ({ value: c, label: c }))} />
          </div>
          <div style={{ marginTop: 20, padding: "12px 16px", background: G.surface2, borderRadius: 10, fontSize: 12, color: G.muted }}>
            ⚡ A unique <strong style={{ color: G.gold }}>NRTO-YYYY-XXXX</strong> number will be auto-generated for your order.
          </div>
          <Btn variant="primary" size="lg" onClick={submit} disabled={loading} style={{ marginTop: 20, width: "100%" }}>
            {loading ? <><Spinner /> Submitting...</> : "Submit for Verification →"}
          </Btn>
        </Card>
      </div>
    </div>
  );
};

// ─── SELLER: MY ORDERS ────────────────────────────────────────────────────────
const MyOrders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const all = LS.get("nrto_orders", []);
    setOrders(all.filter(o => o.sellerId === user.id));
  }, [user.id]);

  const filtered = orders.filter(o => {
    const match = q ? [o.nrtoId, o.customerName, o.orderId, o.product].some(s => s?.toLowerCase().includes(q.toLowerCase())) : true;
    const statusMatch = filter === "all" || o.status === filter;
    return match && statusMatch;
  });

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Input value={q} onChange={setQ} placeholder="Search by NRTO ID, customer, product..." icon="🔍" />
        </div>
        <Select value={filter} onChange={setFilter} options={[
          { value: "all", label: "All Status" },
          { value: "pending", label: "Pending" },
          { value: "confirmed", label: "Confirmed" },
          { value: "risky", label: "Risky" },
          { value: "rejected", label: "Rejected" },
        ]} />
      </div>
      {filtered.length === 0 ? <EmptyState icon="📦" title="No orders yet" sub="Submit your first order using Add Order" /> :
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((o, i) => (
            <div key={o.id} className="fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <Card style={{ padding: "16px 20px", cursor: "pointer" }} onClick={() => setDetail(o)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: G.gold, minWidth: 140 }}>{o.nrtoId}</div>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{o.customerName}</div>
                    <div style={{ fontSize: 11, color: G.muted }}>{o.product}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: G.text }}>₹{o.codAmount}</div>
                  <Badge status={o.status} />
                  <div style={{ fontSize: 11, color: G.muted }}>{fmtDate(o.submittedAt)}</div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      }
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.nrtoId || ""}>
        {detail && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["Customer", detail.customerName], ["Phone", detail.customerPhone], ["Product", detail.product], ["COD Amount", `₹${detail.codAmount}`], ["Order ID", detail.orderId], ["AWB", detail.awb], ["Courier", detail.courier], ["Submitted", fmtDate(detail.submittedAt)]].map(([l, v]) => (
                <div key={l} style={{ background: G.surface2, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                </div>
              ))}
              <div style={{ gridColumn: "1/-1", background: G.surface2, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Address</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{detail.address}</div>
              </div>
            </div>
            <RiskMeter score={detail.riskScore} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: G.surface2, borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: G.muted }}>Status</span>
              <Badge status={detail.status} />
            </div>
            {detail.notes && <div style={{ padding: "10px 14px", background: G.amberBg, borderRadius: 8, fontSize: 13, color: G.amber, border: `1px solid ${G.amber}30` }}>📝 {detail.notes}</div>}
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─── SELLER: CLAIMS ───────────────────────────────────────────────────────────
const Claims = ({ user, addToast }) => {
  const [claims, setClaims] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nrtoOrderId: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const load = useCallback(() => {
    const all = LS.get("nrto_claims", []);
    setClaims(all.filter(c => c.sellerId === user.id));
  }, [user.id]);

  useEffect(() => { load(); }, [load]);

  const submit = () => {
    const e = {};
    if (!form.nrtoOrderId) e.nrtoOrderId = "Required";
    else {
      const orders = LS.get("nrto_orders", []);
      const order = orders.find(o => o.nrtoId === form.nrtoOrderId && o.sellerId === user.id);
      if (!order) e.nrtoOrderId = "Order not found in your account";
      else if (order.status !== "confirmed") e.nrtoOrderId = "Only confirmed orders are eligible for RTO claims";
    }
    if (!form.notes) e.notes = "Please describe the RTO situation";
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      const orders = LS.get("nrto_orders", []);
      const order = orders.find(o => o.nrtoId === form.nrtoOrderId);
      const all = LS.get("nrto_claims", []);
      const newClaim = { id: uid(), ...form, sellerId: user.id, sellerName: user.name, status: "claim_pending", submittedAt: new Date().toISOString().split("T")[0], amount: order?.codAmount || 0 };
      LS.set("nrto_claims", [...all, newClaim]);
      setLoading(false); setModal(false); setForm({ nrtoOrderId: "", notes: "" }); load();
      addToast("RTO claim submitted!", "success");
    }, 800);
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <Syne style={{ fontSize: 20, fontWeight: 800 }}>RTO Claims</Syne>
          <p style={{ color: G.muted, fontSize: 12, marginTop: 4 }}>Submit a claim if your confirmed order was returned.</p>
        </div>
        <Btn variant="primary" onClick={() => setModal(true)}>+ File Claim</Btn>
      </div>
      {claims.length === 0 ? <EmptyState icon="🛡️" title="No claims yet" sub="File a claim when an order gets returned." /> :
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {claims.map((c, i) => (
            <div key={c.id} className="fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <Card style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: G.gold }}>{c.nrtoOrderId}</div>
                  <div style={{ flex: 1, fontSize: 13, color: G.muted }}>{c.notes}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>₹{c.amount}</div>
                  <Badge status={c.status} />
                  <div style={{ fontSize: 11, color: G.muted }}>{fmtDate(c.submittedAt)}</div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      }
      <Modal open={modal} onClose={() => { setModal(false); setErrors({}); }} title="File RTO Claim">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="NoRTO Order Number" value={form.nrtoOrderId} onChange={set("nrtoOrderId")} placeholder="NRTO-2026-0001" required error={errors.nrtoOrderId} icon="🆔" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: G.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>Notes <span style={{ color: G.red }}>*</span></label>
            <textarea value={form.notes} onChange={e => set("notes")(e.target.value)} placeholder="Describe the RTO situation..." rows={3}
              style={{ padding: "10px 14px", background: G.surface3, border: `1px solid ${errors.notes ? G.red : G.border}`, borderRadius: 10, color: G.text, fontSize: 14, fontFamily: "'DM Sans',sans-serif", resize: "vertical", outline: "none" }} />
            {errors.notes && <span style={{ fontSize: 11, color: G.red }}>{errors.notes}</span>}
          </div>
          <div style={{ padding: "10px 14px", background: G.surface2, borderRadius: 8, fontSize: 12, color: G.muted }}>
            📎 Courier screenshot and proof uploads would be attached here in the full app.
          </div>
          <Btn variant="primary" onClick={submit} disabled={loading} style={{ width: "100%" }}>
            {loading ? <><Spinner /> Submitting...</> : "Submit Claim →"}
          </Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─── SELLER: NOTIFICATIONS ────────────────────────────────────────────────────
const Notifications = ({ user, onRead }) => {
  const [notifs, setNotifs] = useState([]);
  useEffect(() => {
    const all = LS.get("nrto_notifs", []);
    const mine = all.filter(n => n.sellerId === user.id).reverse();
    setNotifs(mine);
    const updated = all.map(n => n.sellerId === user.id ? { ...n, read: true } : n);
    LS.set("nrto_notifs", updated);
    onRead();
  }, [user.id]);

  return (
    <div style={{ padding: 28 }}>
      <Syne style={{ fontSize: 20, fontWeight: 800, display: "block", marginBottom: 20 }}>Notifications</Syne>
      {notifs.length === 0 ? <EmptyState icon="🔔" title="No notifications" sub="You'll be notified on order updates and claim decisions." /> :
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifs.map((n, i) => (
            <div key={n.id} className="fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <Card style={{ padding: "14px 18px", borderColor: n.read ? G.border : G.borderGold }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ fontSize: 13, flex: 1 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: G.muted, whiteSpace: "nowrap" }}>{fmtDate(n.createdAt)}</div>
                </div>
                {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: G.gold, position: "absolute", top: 8, right: 8 }} />}
              </Card>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

// ─── SELLER: DASHBOARD OVERVIEW ───────────────────────────────────────────────
const SellerOverview = ({ user, setPage }) => {
  const orders = LS.get("nrto_orders", []).filter(o => o.sellerId === user.id);
  const claims = LS.get("nrto_claims", []).filter(c => c.sellerId === user.id);
  const confirmed = orders.filter(o => o.status === "confirmed").length;
  const pending = orders.filter(o => o.status === "pending").length;
  const revenue = orders.filter(o => o.status === "confirmed").reduce((s, o) => s + o.codAmount, 0);
  const rtoRate = orders.length ? Math.round((claims.length / orders.length) * 100) : 0;
  const recent = [...orders].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <Syne style={{ fontSize: 22, fontWeight: 800 }}>Welcome back, {user.name.split(" ")[0]} 👋</Syne>
        <p style={{ color: G.muted, fontSize: 13, marginTop: 4 }}>Here's your order overview for {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard icon="📦" label="Total Orders" value={orders.length} color={G.gold} delay={0} />
        <StatCard icon="✅" label="Confirmed" value={confirmed} color={G.green} delay={60} />
        <StatCard icon="⏳" label="Pending" value={pending} color={G.amber} delay={120} />
        <StatCard icon="🛡️" label="RTO Claims" value={claims.length} color={G.blue} delay={180} />
        <StatCard icon="📉" label="RTO Rate" value={`${rtoRate}%`} color={rtoRate > 25 ? G.red : G.green} delay={240} />
        <StatCard icon="💰" label="Protected Value" value={`₹${(revenue / 1000).toFixed(1)}K`} color={G.gold} delay={300} />
      </div>
      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        <button onClick={() => setPage("add_order")} style={{
          background: `linear-gradient(135deg, ${G.gold}22, ${G.goldDark}11)`, border: `1px solid ${G.borderGold}`,
          borderRadius: 14, padding: "18px 20px", cursor: "pointer", textAlign: "left",
          transition: "transform 0.15s",
        }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>＋</div>
          <Syne style={{ fontSize: 15, fontWeight: 700, color: G.gold, display: "block" }}>Add New Order</Syne>
          <div style={{ fontSize: 12, color: G.muted, marginTop: 3 }}>Submit for verification</div>
        </button>
        <button onClick={() => setPage("claims")} style={{
          background: `linear-gradient(135deg, ${G.blue}18, ${G.blue}08)`, border: `1px solid ${G.blue}30`,
          borderRadius: 14, padding: "18px 20px", cursor: "pointer", textAlign: "left",
          transition: "transform 0.15s",
        }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🛡️</div>
          <Syne style={{ fontSize: 15, fontWeight: 700, color: G.blue, display: "block" }}>File RTO Claim</Syne>
          <div style={{ fontSize: 12, color: G.muted, marginTop: 3 }}>Get payout for returns</div>
        </button>
      </div>
      {/* Recent Orders */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Syne style={{ fontSize: 15, fontWeight: 700 }}>Recent Orders</Syne>
          <Btn variant="ghost" size="sm" onClick={() => setPage("my_orders")}>View All →</Btn>
        </div>
        {recent.length === 0 ? <EmptyState icon="📦" title="No orders yet" sub="Click Add Order to get started" /> :
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recent.map(o => (
              <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${G.border}` }}>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: G.gold, minWidth: 130 }}>{o.nrtoId}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{o.customerName}</div>
                  <div style={{ fontSize: 11, color: G.muted }}>{o.product}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>₹{o.codAmount}</div>
                <Badge status={o.status} />
              </div>
            ))}
          </div>
        }
      </Card>
      {/* Fraud Tips */}
      <div style={{ marginTop: 20, padding: "16px 20px", background: `${G.gold}0A`, border: `1px solid ${G.borderGold}`, borderRadius: 14 }}>
        <Syne style={{ fontSize: 14, fontWeight: 700, color: G.gold, display: "block", marginBottom: 8 }}>💡 Fraud Prevention Tips</Syne>
        {["Avoid shipping to P.O. Box or very short addresses.", "High RTO areas: Tier 3+ cities need extra verification.", "Orders above ₹2000 COD always request prepayment incentive.", "Repeat customers with successful delivery history = low risk."].map((t, i) => (
          <div key={i} style={{ fontSize: 12, color: G.muted, marginBottom: 4 }}>→ {t}</div>
        ))}
      </div>
    </div>
  );
};

// ─── ADMIN: OVERVIEW ──────────────────────────────────────────────────────────
const AdminOverview = ({ setPage }) => {
  const sellers = LS.get("nrto_sellers", []);
  const orders = LS.get("nrto_orders", []);
  const claims = LS.get("nrto_claims", []);
  const confirmed = orders.filter(o => o.status === "confirmed").length;
  const pending = orders.filter(o => o.status === "pending").length;
  const pendingClaims = claims.filter(c => c.status === "claim_pending").length;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <Syne style={{ fontSize: 22, fontWeight: 800 }}>Admin Overview</Syne>
        <p style={{ color: G.muted, fontSize: 13, marginTop: 4 }}>Platform-wide metrics at a glance.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard icon="👥" label="Total Sellers" value={sellers.length} color={G.blue} delay={0} />
        <StatCard icon="📦" label="Total Orders" value={orders.length} color={G.gold} delay={60} />
        <StatCard icon="✅" label="Confirmed" value={confirmed} color={G.green} delay={120} />
        <StatCard icon="⏳" label="Pending Review" value={pending} color={G.amber} delay={180} />
        <StatCard icon="🛡️" label="RTO Claims" value={claims.length} color={G.blue} delay={240} />
        <StatCard icon="🚨" label="Pending Claims" value={pendingClaims} color={G.red} delay={300} />
      </div>
      {/* Alerts */}
      {pending > 0 && (
        <div style={{ padding: "14px 18px", background: G.amberBg, border: `1px solid ${G.amber}30`, borderRadius: 12, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: G.amber }}>⚠️ <strong>{pending}</strong> orders are awaiting verification</span>
          <Btn variant="ghost" size="sm" onClick={() => setPage("admin_orders")}>Review →</Btn>
        </div>
      )}
      {pendingClaims > 0 && (
        <div style={{ padding: "14px 18px", background: G.redBg, border: `1px solid ${G.red}30`, borderRadius: 12, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: G.red }}>🚨 <strong>{pendingClaims}</strong> RTO claims need attention</span>
          <Btn variant="ghost" size="sm" onClick={() => setPage("admin_claims")}>Review →</Btn>
        </div>
      )}
      {/* Recent Orders Table */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Syne style={{ fontSize: 15, fontWeight: 700 }}>Recent Orders</Syne>
          <Btn variant="ghost" size="sm" onClick={() => setPage("admin_orders")}>View All →</Btn>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>{["NRTO ID", "Seller", "Customer", "Amount", "Risk", "Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: G.muted, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${G.border}` }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {[...orders].reverse().slice(0, 6).map(o => (
                <tr key={o.id}>
                  <td style={{ padding: "10px", fontFamily: "monospace", fontSize: 12, color: G.gold }}>{o.nrtoId}</td>
                  <td style={{ padding: "10px" }}>{o.sellerName}</td>
                  <td style={{ padding: "10px" }}>{o.customerName}</td>
                  <td style={{ padding: "10px", fontWeight: 700 }}>₹{o.codAmount}</td>
                  <td style={{ padding: "10px" }}><span style={{ fontSize: 12, fontWeight: 700, color: o.riskScore < 30 ? G.green : o.riskScore < 60 ? G.amber : G.red }}>{o.riskScore}</span></td>
                  <td style={{ padding: "10px" }}><Badge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ─── ADMIN: ALL ORDERS ────────────────────────────────────────────────────────
const AdminOrders = ({ addToast }) => {
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const [notes, setNotes] = useState("");

  const load = () => setOrders(LS.get("nrto_orders", []));
  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o => {
    const match = q ? [o.nrtoId, o.customerName, o.orderId, o.sellerName, o.product].some(s => s?.toLowerCase().includes(q.toLowerCase())) : true;
    return match && (filter === "all" || o.status === filter);
  });

  const updateStatus = (id, status) => {
    const all = LS.get("nrto_orders", []);
    const order = all.find(o => o.id === id);
    const updated = all.map(o => o.id === id ? { ...o, status, notes } : o);
    LS.set("nrto_orders", updated);
    // Send notification to seller
    if (order) {
      const notifs = LS.get("nrto_notifs", []);
      const msg = status === "confirmed" ? `Order ${order.nrtoId} has been Confirmed ✅` :
                  status === "rejected" ? `Order ${order.nrtoId} has been Rejected ❌` :
                  `Order ${order.nrtoId} flagged as Risky ⚠️`;
      LS.set("nrto_notifs", [...notifs, { id: uid(), sellerId: order.sellerId, message: msg, read: false, createdAt: new Date().toISOString().split("T")[0] }]);
    }
    load(); setDetail(null); addToast(`Order ${status}!`, "success");
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}><Input value={q} onChange={setQ} placeholder="Search orders..." icon="🔍" /></div>
        <Select value={filter} onChange={setFilter} options={[
          { value: "all", label: "All" }, { value: "pending", label: "Pending" },
          { value: "confirmed", label: "Confirmed" }, { value: "risky", label: "Risky" }, { value: "rejected", label: "Rejected" },
        ]} />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>{["NRTO ID", "Seller", "Customer", "Product", "Amount", "Risk", "Date", "Status", "Action"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: G.muted, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${G.border}`, whiteSpace: "nowrap" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr key={o.id} style={{ borderBottom: `1px solid ${G.border}`, transition: "background 0.1s" }}
                onMouseEnter={e => e.currentTarget.style.background = G.surface2}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "12px", fontFamily: "monospace", fontSize: 12, color: G.gold, whiteSpace: "nowrap" }}>{o.nrtoId}</td>
                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>{o.sellerName}</td>
                <td style={{ padding: "12px" }}>{o.customerName}<div style={{ fontSize: 10, color: G.muted }}>{o.customerPhone}</div></td>
                <td style={{ padding: "12px", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.product}</td>
                <td style={{ padding: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>₹{o.codAmount}</td>
                <td style={{ padding: "12px" }}><span style={{ fontWeight: 700, color: o.riskScore < 30 ? G.green : o.riskScore < 60 ? G.amber : G.red }}>{o.riskScore}</span></td>
                <td style={{ padding: "12px", whiteSpace: "nowrap", fontSize: 11, color: G.muted }}>{fmtDate(o.submittedAt)}</td>
                <td style={{ padding: "12px" }}><Badge status={o.status} /></td>
                <td style={{ padding: "12px" }}><Btn variant="ghost" size="sm" onClick={() => { setDetail(o); setNotes(o.notes || ""); }}>Review</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon="📦" title="No orders found" sub="Try adjusting your search or filter." />}
      </div>
      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Review: ${detail?.nrtoId}`} width={600}>
        {detail && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["Seller", detail.sellerName], ["Customer", detail.customerName], ["Phone", detail.customerPhone], ["COD Amount", `₹${detail.codAmount}`], ["Product", detail.product], ["Courier", detail.courier], ["Order ID", detail.orderId], ["AWB", detail.awb]].map(([l, v]) => (
                <div key={l} style={{ background: G.surface2, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                </div>
              ))}
              <div style={{ gridColumn: "1/-1", background: G.surface2, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Address</div>
                <div style={{ fontSize: 13 }}>{detail.address}</div>
              </div>
            </div>
            <RiskMeter score={detail.riskScore} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: G.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Admin Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Add verification notes..."
                style={{ padding: "10px 14px", background: G.surface3, border: `1px solid ${G.border}`, borderRadius: 10, color: G.text, fontSize: 14, fontFamily: "'DM Sans',sans-serif", resize: "vertical", outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn variant="success" onClick={() => updateStatus(detail.id, "confirmed")}>✅ Confirm</Btn>
              <Btn variant="danger" onClick={() => updateStatus(detail.id, "rejected")}>❌ Reject</Btn>
              <Btn style={{ background: "rgba(249,115,22,0.1)", color: "#F97316", border: "1px solid rgba(249,115,22,0.3)" }} onClick={() => updateStatus(detail.id, "risky")}>⚠️ Flag Risky</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─── ADMIN: SELLERS ───────────────────────────────────────────────────────────
const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [q, setQ] = useState("");
  useEffect(() => { setSellers(LS.get("nrto_sellers", [])); }, []);
  const filtered = sellers.filter(s => !q || [s.name, s.businessName, s.email, s.phone].some(v => v?.toLowerCase().includes(q.toLowerCase())));

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 16 }}><Input value={q} onChange={setQ} placeholder="Search sellers..." icon="🔍" /></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {filtered.map((s, i) => {
          const orders = LS.get("nrto_orders", []).filter(o => o.sellerId === s.id);
          const rtoRate = orders.length ? Math.round((LS.get("nrto_claims", []).filter(c => c.sellerId === s.id).length / orders.length) * 100) : 0;
          return (
            <div key={s.id} className="fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: G.muted }}>{s.businessName}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: G.gold, background: `${G.gold}18`, padding: "3px 8px", borderRadius: 50, letterSpacing: "0.06em" }}>{s.plan}</span>
                </div>
                <div style={{ fontSize: 12, color: G.muted, marginBottom: 8 }}>📧 {s.email}<br />📱 {s.phone}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[["Orders", orders.length, G.gold], ["RTO%", `${rtoRate}%`, rtoRate > 30 ? G.red : G.green], ["Joined", fmtDate(s.joinedAt), G.muted]].map(([l, v, c]) => (
                    <div key={l} style={{ textAlign: "center", background: G.surface2, borderRadius: 8, padding: "8px 6px" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</div>
                      <div style={{ fontSize: 10, color: G.muted }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── ADMIN: CLAIMS ────────────────────────────────────────────────────────────
const AdminClaims = ({ addToast }) => {
  const [claims, setClaims] = useState([]);
  const [detail, setDetail] = useState(null);
  const load = () => setClaims(LS.get("nrto_claims", []));
  useEffect(() => { load(); }, []);

  const updateClaim = (id, status) => {
    const all = LS.get("nrto_claims", []);
    const claim = all.find(c => c.id === id);
    const updated = all.map(c => c.id === id ? { ...c, status } : c);
    LS.set("nrto_claims", updated);
    if (claim) {
      const notifs = LS.get("nrto_notifs", []);
      const msg = status === "claim_approved" ? `RTO Claim for ${claim.nrtoOrderId} Approved 🎉` :
                  status === "payout_completed" ? `Payout for ${claim.nrtoOrderId} completed 💸` :
                  `RTO Claim for ${claim.nrtoOrderId} Rejected ❌`;
      LS.set("nrto_notifs", [...notifs, { id: uid(), sellerId: claim.sellerId, message: msg, read: false, createdAt: new Date().toISOString().split("T")[0] }]);
    }
    load(); setDetail(null); addToast("Claim updated!", "success");
  };

  return (
    <div style={{ padding: 28 }}>
      {claims.length === 0 ? <EmptyState icon="🛡️" title="No claims yet" sub="RTO claims from sellers will appear here." /> :
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {claims.map((c, i) => (
            <div key={c.id} className="fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <Card style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: G.gold, minWidth: 130 }}>{c.nrtoOrderId}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.sellerName}</div>
                    <div style={{ fontSize: 11, color: G.muted }}>{c.notes}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>₹{c.amount}</div>
                  <Badge status={c.status} />
                  <Btn variant="ghost" size="sm" onClick={() => setDetail(c)}>Manage</Btn>
                </div>
              </Card>
            </div>
          ))}
        </div>
      }
      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Claim: ${detail?.nrtoOrderId}`}>
        {detail && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[["Seller", detail.sellerName], ["Order", detail.nrtoOrderId], ["Amount", `₹${detail.amount}`], ["Submitted", fmtDate(detail.submittedAt)]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: G.surface2, borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: G.muted }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ padding: "10px 14px", background: G.surface2, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: G.muted, marginBottom: 4 }}>Notes</div>
              <div style={{ fontSize: 13 }}>{detail.notes}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn variant="success" onClick={() => updateClaim(detail.id, "claim_approved")}>✅ Approve</Btn>
              <Btn variant="danger" onClick={() => updateClaim(detail.id, "claim_rejected")}>❌ Reject</Btn>
              <Btn style={{ background: G.blueBg, color: G.blue, border: `1px solid ${G.blue}30` }} onClick={() => updateClaim(detail.id, "payout_completed")}>💸 Mark Payout Done</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─── ADMIN: ANALYTICS ────────────────────────────────────────────────────────
const AdminAnalytics = () => {
  const orders = LS.get("nrto_orders", []);
  const sellers = LS.get("nrto_sellers", []);
  const claims = LS.get("nrto_claims", []);

  const statusDist = ["pending", "confirmed", "risky", "rejected"].map(s => ({
    label: statusColor(s).label, count: orders.filter(o => o.status === s).length, color: statusColor(s).color,
  }));
  const maxCount = Math.max(...statusDist.map(s => s.count), 1);

  const riskBuckets = [
    { label: "Low (0–30)", count: orders.filter(o => o.riskScore < 30).length, color: G.green },
    { label: "Medium (30–60)", count: orders.filter(o => o.riskScore >= 30 && o.riskScore < 60).length, color: G.amber },
    { label: "High (60+)", count: orders.filter(o => o.riskScore >= 60).length, color: G.red },
  ];

  const topCouriers = Object.entries(orders.reduce((acc, o) => { acc[o.courier] = (acc[o.courier] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const totalValue = orders.filter(o => o.status === "confirmed").reduce((s, o) => s + o.codAmount, 0);
  const avgOrder = orders.length ? Math.round(orders.reduce((s, o) => s + o.codAmount, 0) / orders.length) : 0;

  return (
    <div style={{ padding: 28 }}>
      <Syne style={{ fontSize: 22, fontWeight: 800, display: "block", marginBottom: 20 }}>Platform Analytics</Syne>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard icon="💰" label="Protected Value" value={`₹${(totalValue / 1000).toFixed(1)}K`} color={G.gold} />
        <StatCard icon="📊" label="Avg Order Value" value={`₹${avgOrder}`} color={G.blue} />
        <StatCard icon="📉" label="Platform RTO%" value={`${orders.length ? Math.round((claims.length / orders.length) * 100) : 0}%`} color={G.amber} />
        <StatCard icon="🏪" label="Active Sellers" value={sellers.length} color={G.green} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Order Status Chart */}
        <Card>
          <Syne style={{ fontSize: 14, fontWeight: 700, display: "block", marginBottom: 16 }}>Order Status Distribution</Syne>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {statusDist.map(s => (
              <div key={s.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: G.muted }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: s.color }}>{s.count}</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: G.surface2 }}>
                  <div style={{ height: "100%", width: `${(s.count / maxCount) * 100}%`, background: s.color, borderRadius: 4, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        {/* Risk Chart */}
        <Card>
          <Syne style={{ fontSize: 14, fontWeight: 700, display: "block", marginBottom: 16 }}>Risk Score Distribution</Syne>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {riskBuckets.map(b => (
              <div key={b.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: G.muted }}>{b.label}</span>
                  <span style={{ fontWeight: 700, color: b.color }}>{b.count}</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: G.surface2 }}>
                  <div style={{ height: "100%", width: `${(b.count / Math.max(orders.length, 1)) * 100}%`, background: b.color, borderRadius: 4, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {/* Top Couriers */}
      <Card>
        <Syne style={{ fontSize: 14, fontWeight: 700, display: "block", marginBottom: 16 }}>Courier Usage</Syne>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {topCouriers.map(([name, count]) => (
            <div key={name} style={{ padding: "10px 16px", background: G.surface2, borderRadius: 10, border: `1px solid ${G.border}`, textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: G.gold }}>{count}</div>
              <div style={{ fontSize: 11, color: G.muted, marginTop: 2 }}>{name}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => LS.get("nrto_user", null));
  const [page, setPage] = useState(() => LS.get("nrto_user", null)?.role === "admin" ? "admin_overview" : "overview");
  const [toasts, setToasts] = useState([]);
  const [sideOpen, setSideOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => { initStore(); }, []);
  useEffect(() => {
    if (user?.role === "seller") {
      const all = LS.get("nrto_notifs", []);
      setUnread(all.filter(n => n.sellerId === user.id && !n.read).length);
    }
  }, [page, user]);

  const addToast = useCallback((msg, type = "info") => {
    const id = uid();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const login = (u) => {
    LS.set("nrto_user", u);
    setUser(u);
    setPage(u.role === "admin" ? "admin_overview" : "overview");
  };

  const logout = () => {
    LS.set("nrto_user", null);
    setUser(null);
    setPage("overview");
  };

  if (!user) return <><style>{fontStyle}</style><AuthPage onLogin={login} /></>;

  const isAdmin = user.role === "admin";
  const pageTitle = {
    overview: "Dashboard", add_order: "Add Order", my_orders: "My Orders",
    claims: "RTO Claims", notifications: "Notifications",
    admin_overview: "Overview", admin_sellers: "Sellers", admin_orders: "All Orders",
    admin_claims: "RTO Claims", admin_analytics: "Analytics",
  }[page] || page;

  const renderPage = () => {
    if (isAdmin) {
      if (page === "admin_overview") return <AdminOverview setPage={setPage} />;
      if (page === "admin_sellers") return <AdminSellers />;
      if (page === "admin_orders") return <AdminOrders addToast={addToast} />;
      if (page === "admin_claims") return <AdminClaims addToast={addToast} />;
      if (page === "admin_analytics") return <AdminAnalytics />;
    } else {
      if (page === "overview") return <SellerOverview user={user} setPage={setPage} />;
      if (page === "add_order") return <AddOrder user={user} addToast={addToast} />;
      if (page === "my_orders") return <MyOrders user={user} />;
      if (page === "claims") return <Claims user={user} addToast={addToast} />;
      if (page === "notifications") return <Notifications user={user} onRead={() => setUnread(0)} />;
    }
    return null;
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: G.bg }}>
        <Sidebar user={user} page={page} setPage={setPage} unread={unread} onLogout={logout} open={sideOpen} setOpen={setSideOpen} />
        <div style={{ marginLeft: window.innerWidth < 768 ? 0 : 230, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Topbar title={pageTitle} onMenuClick={() => setSideOpen(o => !o)} />
          <div style={{ flex: 1 }}>
            {renderPage()}
          </div>
        </div>
      </div>
      <Toast toasts={toasts} />
    </>
  );
}
