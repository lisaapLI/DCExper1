import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/quizApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nim: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.nim.trim()) e.nim = "NIM wajib diisi";
    if (!form.password.trim()) e.password = "Password wajib diisi";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setApiError("");
    try {
      const res = await login({ nim: form.nim.trim(), password: form.password });
      const user = res.data.user;
      sessionStorage.setItem("quizml_user", JSON.stringify(user));
      const prevNim = sessionStorage.getItem("quizml_nim");
      if (prevNim !== user.nim) {
        sessionStorage.removeItem("quizml_history");
        sessionStorage.setItem("quizml_nim", user.nim);
      }
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.error || "Login gagal. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div style={s.root}>
      {/* Left Panel */}
      <div style={s.left}>
        <div style={s.brand}>
          <div style={s.logoBox}>
            <span style={{ fontSize: 32 }}>&#127891;</span>
          </div>
          <h1 style={s.brandName}>Eureka Quiz</h1>
          <p style={s.brandSub}>Platform belajar cerdas berbasis AI</p>
        </div>

        <div style={s.features}>
          {[
            { icon: "&#129504;", text: "Analisis kemampuan dengan Machine Learning" },
            { icon: "&#128202;", text: "Laporan detail per materi" },
            { icon: "&#127919;", text: "Soal adaptif sesuai levelmu" },
            { icon: "&#127942;", text: "Pantau progres belajarmu" },
          ].map((f, i) => (
            <div key={i} style={s.featureRow}>
              <span style={s.featureIcon} dangerouslySetInnerHTML={{ __html: f.icon }} />
              <span style={s.featureText}>{f.text}</span>
            </div>
          ))}
        </div>

        <div style={s.leftFooter}>
          <p style={s.leftFooterText}>&copy; 2026 Eureka Quiz &middot; Sistem Pembelajaran AI</p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={s.right}>
        <div style={s.card}>
          <h2 style={s.title}>Selamat Datang!</h2>
          <p style={s.subtitle}>Masuk ke akun Eureka Quiz kamu</p>

          {apiError && (
            <div style={s.errorBox}>
              <span>&#9888;</span> {apiError}
            </div>
          )}

          <div style={s.form}>
            <div style={s.field}>
              <label style={s.label}>NIM</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Masukkan NIM kamu"
                value={form.nim}
                onChange={(e) => {
                  setForm(f => ({ ...f, nim: e.target.value.replace(/\D/g, "") }));
                  setErrors(er => ({ ...er, nim: undefined }));
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={s.input}
              />
              {errors.nim && <p style={s.fieldError}>{errors.nim}</p>}
            </div>

            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={(e) => {
                  setForm(f => ({ ...f, password: e.target.value }));
                  setErrors(er => ({ ...er, password: undefined }));
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={s.input}
              />
              {errors.password && <p style={s.fieldError}>{errors.password}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>
          </div>

          <div style={s.divider}>
            <span style={s.divLine} /><span style={s.divText}>atau</span><span style={s.divLine} />
          </div>

          <p style={s.switchText}>
            Belum punya akun?{" "}
            <Link to="/register" style={s.switchLink}>Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const O = "#F97316";
const OD = "#EA580C";
const SB = "#1C1917";

const s = {
  root: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  left: {
    width: 400, minWidth: 340,
    background: `linear-gradient(160deg, ${SB} 0%, #292524 100%)`,
    display: "flex", flexDirection: "column", padding: "48px 40px",
  },
  brand: { marginBottom: 48 },
  logoBox: {
    width: 64, height: 64, borderRadius: 18,
    background: `linear-gradient(135deg, ${O}, ${OD})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 20, boxShadow: `0 8px 24px ${O}55`,
  },
  brandName: { fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.5px" },
  brandSub: { fontSize: 15, color: "#A8A29E", margin: 0 },
  features: { display: "flex", flexDirection: "column", gap: 20, flex: 1 },
  featureRow: { display: "flex", alignItems: "flex-start", gap: 14 },
  featureIcon: { fontSize: 22, flexShrink: 0, marginTop: 1 },
  featureText: { fontSize: 14, color: "#D6D3D1", lineHeight: 1.5 },
  leftFooter: { marginTop: 48, paddingTop: 24, borderTop: "1px solid #44403C" },
  leftFooterText: { fontSize: 12, color: "#78716C", margin: 0 },

  right: {
    flex: 1, background: "#FAFAF9",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px",
  },
  card: { width: "100%", maxWidth: 420 },
  title: { fontSize: 30, fontWeight: 800, color: "#1C1917", margin: "0 0 8px", letterSpacing: "-0.5px" },
  subtitle: { fontSize: 15, color: "#78716C", margin: "0 0 32px" },

  errorBox: {
    background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 10,
    padding: "12px 16px", fontSize: 14, color: "#DC2626",
    display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
  },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 14, fontWeight: 600, color: "#292524" },
  input: {
    border: "1.5px solid #E7E5E4", borderRadius: 12, padding: "14px 16px",
    fontSize: 15, color: "#1C1917", outline: "none", background: "#fff",
    fontFamily: "inherit",
  },
  fieldError: { fontSize: 13, color: "#DC2626", margin: "4px 0 0" },
  btn: {
    background: `linear-gradient(135deg, ${O}, ${OD})`,
    color: "#fff", border: "none", borderRadius: 12, padding: 15,
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    boxShadow: `0 4px 16px ${O}44`, fontFamily: "inherit", marginTop: 4,
  },
  divider: { display: "flex", alignItems: "center", gap: 12, margin: "28px 0" },
  divLine: { flex: 1, height: 1, background: "#E7E5E4" },
  divText: { fontSize: 13, color: "#A8A29E" },
  switchText: { textAlign: "center", fontSize: 14, color: "#78716C", margin: 0 },
  switchLink: { color: O, fontWeight: 700, textDecoration: "none" },
};
