import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/quizApi";

function EyeIcon({ open }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ nim:"", nama:"", password:"", confirm:"" });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [showCf, setShowCf]     = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi";
    if (!form.nim.trim()) e.nim = "NIM wajib diisi";
    else if (!/^\d{5,12}$/.test(form.nim.trim())) e.nim = "NIM harus 5-12 digit angka";
    if (!form.password) e.password = "Password wajib diisi";
    else if (form.password.length < 6) e.password = "Password minimal 6 karakter";
    if (form.password !== form.confirm) e.confirm = "Konfirmasi password tidak cocok";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setApiError("");
    try {
      await register({ nim: form.nim.trim(), nama: form.nama.trim(), password: form.password });
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setApiError(err.response?.data?.error || "Registrasi gagal. Coba lagi.");
      setLoading(false);
    }
  };

  const change = (key) => (e) => {
    const val = key === "nim" ? e.target.value.replace(/\D/g,"") : e.target.value;
    setForm(f => ({ ...f, [key]: val }));
    setErrors(er => ({ ...er, [key]: undefined }));
  };

  return (
    <div style={s.root}>
      {/* Left Panel */}
      <div style={s.left}>
        <div style={s.brand}>
          <div style={s.logoBox}><span style={{ fontSize:32 }}>&#127891;</span></div>
          <h1 style={s.brandName}>Eureka Quiz</h1>
          <p style={s.brandSub}>Platform belajar cerdas berbasis AI</p>
        </div>
        <div style={s.stepsWrap}>
          <p style={s.stepsLabel}>Cara mulai belajar:</p>
          {[
            { n:"1", text:"Isi data diri", active:true },
            { n:"2", text:"Mulai quiz",    active:false },
            { n:"3", text:"Lihat hasil AI", active:false },
          ].map((st, i) => (
            <div key={i} style={s.stepRow}>
              <div style={{
                ...s.stepNum,
                background: st.active ? `linear-gradient(135deg, #F97316, #EA580C)` : "#44403C",
                boxShadow: st.active ? "0 4px 12px #F9731655" : "none",
              }}>{st.n}</div>
              <span style={{ ...s.stepText, color: st.active ? "#F5F5F4" : "#A8A29E" }}>{st.text}</span>
            </div>
          ))}
        </div>
        <div style={s.infoCard}>
          <p style={s.infoText}>&#128161; Setelah mendaftar, kamu langsung bisa mengerjakan quiz dan mendapatkan analisis AI tentang kemampuanmu.</p>
        </div>
        <div style={s.leftFooter}>
          <p style={s.leftFooterText}>&copy; 2026 Eureka Quiz &middot; Sistem Pembelajaran AI</p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={s.right}>
        <div style={s.card}>
          {/* Mobile logo */}
          <div style={s.mobileLogo}>
            <div style={s.mobileLogoBox}><span style={{ fontSize:24 }}>&#127891;</span></div>
            <span style={s.mobileLogoText}>Eureka Quiz</span>
          </div>

          {success ? (
            <div style={s.successBox}>
              <div style={{ fontSize:56, marginBottom:20 }}>&#9989;</div>
              <h3 style={s.successTitle}>Berhasil Daftar!</h3>
              <p style={s.successSub}>Akun kamu sudah dibuat. Mengarahkan ke halaman login...</p>
            </div>
          ) : (
            <>
              <h2 style={s.title}>Buat Akun Baru</h2>
              <p style={s.subtitle}>Daftar dan mulai perjalanan belajarmu</p>

              {apiError && (
                <div style={s.errorBox}><span>&#9888;</span> {apiError}</div>
              )}

              <div style={s.form}>
                <div style={s.field}>
                  <label style={s.label}>Nama Lengkap</label>
                  <input type="text" placeholder="Nama lengkap kamu" value={form.nama}
                    onChange={change("nama")} style={s.input} />
                  {errors.nama && <p style={s.fieldError}>{errors.nama}</p>}
                </div>

                <div style={s.field}>
                  <label style={s.label}>NIM</label>
                  <input type="text" inputMode="numeric" placeholder="Nomor Induk Mahasiswa"
                    value={form.nim} onChange={change("nim")} style={s.input} />
                  {errors.nim && <p style={s.fieldError}>{errors.nim}</p>}
                </div>

                <div style={s.field}>
                  <label style={s.label}>Password</label>
                  <div style={s.pwWrapper}>
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="Min. 6 karakter"
                      value={form.password}
                      onChange={change("password")}
                      style={s.inputPw}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={s.eyeBtn}>
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                  {errors.password && <p style={s.fieldError}>{errors.password}</p>}
                </div>

                <div style={s.field}>
                  <label style={s.label}>Konfirmasi Password</label>
                  <div style={s.pwWrapper}>
                    <input
                      type={showCf ? "text" : "password"}
                      placeholder="Ulangi password"
                      value={form.confirm}
                      onChange={change("confirm")}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      style={s.inputPw}
                    />
                    <button type="button" onClick={() => setShowCf(v => !v)} style={s.eyeBtn}>
                      <EyeIcon open={showCf} />
                    </button>
                  </div>
                  {errors.confirm && <p style={s.fieldError}>{errors.confirm}</p>}
                </div>

                <button onClick={handleSubmit} disabled={loading}
                  style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Mendaftar..." : "Daftar Sekarang"}
                </button>
              </div>

              <div style={s.divider}>
                <span style={s.divLine} /><span style={s.divText}>atau</span><span style={s.divLine} />
              </div>

              <p style={s.switchText}>
                Sudah punya akun?{" "}
                <Link to="/" style={s.switchLink}>Masuk di sini</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const O = "#F97316"; const OD = "#EA580C"; const SB = "#1C1917";

const s = {
  root: { display:"flex", minHeight:"100vh", fontFamily:"'Inter',sans-serif" },
  left: {
    width:400, minWidth:340,
    background:`linear-gradient(160deg, ${SB} 0%, #292524 100%)`,
    display:"flex", flexDirection:"column", padding:"48px 40px",
  },
  brand: { marginBottom:40 },
  logoBox: {
    width:64, height:64, borderRadius:18,
    background:`linear-gradient(135deg, ${O}, ${OD})`,
    display:"flex", alignItems:"center", justifyContent:"center",
    marginBottom:20, boxShadow:`0 8px 24px ${O}55`,
  },
  brandName: { fontSize:28, fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.5px" },
  brandSub: { fontSize:15, color:"#A8A29E", margin:0 },
  stepsWrap: { marginBottom:28 },
  stepsLabel: { fontSize:12, fontWeight:600, color:"#78716C", textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 16px" },
  stepRow: { display:"flex", alignItems:"center", gap:14, marginBottom:14 },
  stepNum: {
    width:32, height:32, borderRadius:10,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:13, fontWeight:700, color:"#fff", flexShrink:0,
  },
  stepText: { fontSize:14, fontWeight:500 },
  infoCard: { background:"#292524", border:"1px solid #44403C", borderRadius:14, padding:"16px 20px", flex:1 },
  infoText: { fontSize:13, color:"#A8A29E", margin:0, lineHeight:1.6 },
  leftFooter: { marginTop:28, paddingTop:24, borderTop:"1px solid #44403C" },
  leftFooterText: { fontSize:12, color:"#78716C", margin:0 },

  right: {
    flex:1, background:"#FAFAF9",
    display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px",
    minHeight:"100vh",
  },
  card: { width:"100%", maxWidth:460 },
  mobileLogo: { display:"flex", alignItems:"center", gap:10, marginBottom:24 },
  mobileLogoBox: {
    width:40, height:40, borderRadius:12,
    background:`linear-gradient(135deg, ${O}, ${OD})`,
    display:"flex", alignItems:"center", justifyContent:"center",
  },
  mobileLogoText: { fontSize:18, fontWeight:800, color:"#1C1917" },

  title: { fontSize:28, fontWeight:800, color:"#1C1917", margin:"0 0 8px", letterSpacing:"-0.5px" },
  subtitle: { fontSize:15, color:"#78716C", margin:"0 0 28px" },
  errorBox: {
    background:"#FEF2F2", border:"1.5px solid #FECACA", borderRadius:10,
    padding:"12px 16px", fontSize:14, color:"#DC2626",
    display:"flex", alignItems:"center", gap:8, marginBottom:20,
  },
  form: { display:"flex", flexDirection:"column", gap:18 },
  field: { display:"flex", flexDirection:"column", gap:8 },
  label: { fontSize:14, fontWeight:600, color:"#292524" },
  input: {
    border:"1.5px solid #E7E5E4", borderRadius:12, padding:"14px 16px",
    fontSize:15, color:"#1C1917", outline:"none", background:"#fff",
    fontFamily:"inherit", width:"100%", boxSizing:"border-box",
  },
  inputPw: {
    border:"1.5px solid #E7E5E4", borderRadius:12, padding:"14px 48px 14px 16px",
    fontSize:15, color:"#1C1917", outline:"none", background:"#fff",
    fontFamily:"inherit", width:"100%", boxSizing:"border-box",
  },
  pwWrapper: { position:"relative" },
  eyeBtn: {
    position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
    background:"none", border:"none", cursor:"pointer", padding:4,
    display:"flex", alignItems:"center", justifyContent:"center",
  },
  fieldError: { fontSize:13, color:"#DC2626", margin:"4px 0 0" },
  btn: {
    background:`linear-gradient(135deg, ${O}, ${OD})`, color:"#fff",
    border:"none", borderRadius:12, padding:15,
    fontSize:15, fontWeight:700, cursor:"pointer",
    boxShadow:`0 4px 16px ${O}44`, fontFamily:"inherit", marginTop:4,
  },
  divider: { display:"flex", alignItems:"center", gap:12, margin:"24px 0" },
  divLine: { flex:1, height:1, background:"#E7E5E4" },
  divText: { fontSize:13, color:"#A8A29E" },
  switchText: { textAlign:"center", fontSize:14, color:"#78716C", margin:0 },
  switchLink: { color:O, fontWeight:700, textDecoration:"none" },

  successBox: { textAlign:"center", padding:"60px 32px" },
  successTitle: { fontSize:26, fontWeight:800, color:"#1C1917", margin:"0 0 12px" },
  successSub: { fontSize:15, color:"#78716C", margin:0 },
};
