import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MATERI_HEX = {
  "Limit":              "#1D6FA4",
  "Turunan":            "#6D28D9",
  "Aplikasi Turunan":   "#047857",
  "Integral Tentu":     "#0F766E",
  "Teknik Integrasi":   "#B45309",
  "Integral Lipat":     "#BE123C",
};

const TIPE_ICON = {
  "Video":   "▶",
  "Artikel": "📄",
  "Latihan": "✏️",
  "Buku":    "📚",
};

const TIPE_COLOR = {
  "Video":   { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  "Artikel": { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" },
  "Latihan": { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
  "Buku":    { bg: "#FAF5FF", color: "#7E22CE", border: "#E9D5FF" },
};

const LEVEL_PILL = {
  Mudah:  { bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7" },
  Sedang: { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D" },
  Sulit:  { bg: "#FFE4E6", color: "#9F1239", border: "#FCA5A5" },
};

const KATEGORI = {
  Beginner:     { icon: "📚", bg: "#FEF9C3", border: "#FDE68A", color: "#92400E" },
  Intermediate: { icon: "⚡", bg: "#EDE9FE", border: "#C4B5FD", color: "#5B21B6" },
  Advanced:     { icon: "🏆", bg: "#D1FAE5", border: "#6EE7B7", color: "#065F46" },
  Rendah:       { icon: "📚", bg: "#FEF9C3", border: "#FDE68A", color: "#92400E" },
};

const LABEL_COLOR = {
  "Sangat Lemah": { bg: "#FFE4E6", color: "#9F1239", border: "#FCA5A5" },
  "Lemah":        { bg: "#FEE2E2", color: "#B91C1C", border: "#FCA5A5" },
  "Cukup":        { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D" },
  "Baik":         { bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7" },
  "Sangat Baik":  { bg: "#DCFCE7", color: "#14532D", border: "#86EFAC" },
};

const formatWaktu = (detik) => {
  if (!detik) return "-";
  return `${Math.floor(detik / 60)}m ${detik % 60}s`;
};

function saveToHistory(r, s) {
  try {
    const flag = `quizml_saved_${r.session_id || r.result_id}`;
    if (localStorage.getItem(flag)) return;
    localStorage.setItem(flag, "1");
    const entry = {
      level: r.level || "Mudah",
      total_score: r.total_score,
      jumlah_benar: r.jumlah_benar,
      total_soal: r.total_soal,
      kategori_kemampuan: r.kategori_kemampuan,
      materi_terlemah: r.materi_terlemah,
      waktu: formatWaktu(r.waktu_detik),
      timestamp: new Date().toLocaleString("id-ID"),
    };
    const key = `quizml_history_${s.nim}`;
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    prev.push(entry);
    localStorage.setItem(key, JSON.stringify(prev));
  } catch (e) { console.error(e); }
}

function MateriBar({ label, value, hex }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ fontSize:13, fontWeight:700, color:"#292524" }}>{label}</span>
        <span style={{ fontSize:13, fontWeight:800, color: hex }}>{Math.round(value)}%</span>
      </div>
      <div style={{ height:10, borderRadius:99, background:"#EDE8E3", overflow:"hidden" }}>
        <div style={{
          height:"100%", width:`${Math.min(value,100)}%`,
          background: hex, borderRadius:99,
          transition:"width 0.6s cubic-bezier(.4,0,.2,1)",
        }}/>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [student, setStudent] = useState(null);
  const [ready, setReady] = useState(false);
  const [expandedMateri, setExpandedMateri] = useState({});

  useEffect(() => {
    try {
      const r = JSON.parse(sessionStorage.getItem("quizml_result") || "null");
      const s = JSON.parse(sessionStorage.getItem("quizml_user") || "null");
      if (!r || !s) { navigate("/"); return; }
      setResult(r); setStudent(s);
      saveToHistory(r, s);
    } catch (e) { navigate("/"); }
    finally { setReady(true); }
  }, []);

  if (!ready) return (
    <div style={{ minHeight:"100vh", background:"#FFF8F2", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',sans-serif" }}>
      <div style={{ display:"flex", gap:8 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:10, height:10, borderRadius:"50%", background:"#F97316",
            animation:"bx 0.6s infinite alternate",
            animationDelay:`${i*0.15}s`,
          }}/>
        ))}
      </div>
      <style>{`@keyframes bx{from{transform:translateY(0)}to{transform:translateY(-10px)}}`}</style>
    </div>
  );

  if (!result || !student) return null;

  const {
    total_score, jumlah_benar, jumlah_salah, total_soal,
    level, materi_scores, kesulitan_scores, materi_terlemah,
    kategori_kemampuan, rekomendasi, ringkasan, analisis_detail,
  } = result;

  const kat    = KATEGORI[kategori_kemampuan] || KATEGORI.Beginner;
  const lvPill = LEVEL_PILL[level] || LEVEL_PILL.Mudah;

  // rekomendasi sudah flat list dari backend
  const rekList = Array.isArray(rekomendasi) ? rekomendasi : [];

  const scoreGrade =
    total_score >= 80 ? { color:"#065F46", bg:"#D1FAE5", border:"#6EE7B7", label:"Bagus Sekali! 🎉" } :
    total_score >= 60 ? { color:"#92400E", bg:"#FEF3C7", border:"#FCD34D", label:"Cukup Baik! 💪" } :
                        { color:"#9F1239", bg:"#FFE4E6", border:"#FCA5A5", label:"Ayo Semangat! 📚" };

  const handleRetry     = () => { sessionStorage.removeItem("quizml_result"); navigate("/quiz", { state: { level } }); };
  const handleDashboard = () => { sessionStorage.removeItem("quizml_result"); navigate("/dashboard"); };
  const toggleMateri    = (m) => setExpandedMateri(prev => ({ ...prev, [m]: !prev[m] }));

  const O = "#F97316", OD = "#EA580C";
  const card = (extra = {}) => ({
    background:"#FFFCF9", border:"1.5px solid #F0E6DA",
    borderRadius:18, padding:24,
    boxShadow:"0 2px 16px rgba(249,115,22,0.07)", ...extra,
  });
  const tTitle = { fontSize:15, fontWeight:700, color:"#1C1917" };

  return (
    <div style={{ minHeight:"100vh", background:"#FFF8F2", fontFamily:"'Inter',sans-serif", color:"#1C1917" }}>

      {/* TopNav */}
      <nav style={{
        position:"sticky", top:0, zIndex:50, background:"#FFFCF9",
        borderBottom:"1.5px solid #F0E6DA",
        boxShadow:"0 2px 8px rgba(249,115,22,0.08)",
        padding:"10px 32px", display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <span style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.4px", color:"#1C1917" }}>🎓 Eureka Quiz</span>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{
            background:lvPill.bg, color:lvPill.color,
            border:`1.5px solid ${lvPill.border}`,
            borderRadius:20, padding:"3px 14px", fontSize:12, fontWeight:700,
          }}>{level}</span>
          <button onClick={handleDashboard} style={{
            background:"#FFF7ED", color:OD, border:`1.5px solid #FED7AA`,
            borderRadius:10, padding:"7px 18px", fontSize:13, fontWeight:700,
            cursor:"pointer", fontFamily:"inherit",
          }}>← Dashboard</button>
        </div>
      </nav>

      <main style={{ maxWidth:1080, margin:"0 auto", padding:"28px 24px 64px" }}>

        {/* Hero Score */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 200px", gap:20, marginBottom:24 }}>
          <div style={{
            background:scoreGrade.bg, border:`1.5px solid ${scoreGrade.border}`,
            borderRadius:20, padding:"32px 36px",
            boxShadow:"0 4px 24px rgba(0,0,0,0.06)", position:"relative", overflow:"hidden",
          }}>
            <div style={{ fontSize:11, fontWeight:700, color:scoreGrade.color, textTransform:"uppercase", letterSpacing:1.2, marginBottom:10 }}>
              Hasil Quiz • Level {level}
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:8, marginBottom:8 }}>
              <span style={{ fontSize:80, fontWeight:900, color:scoreGrade.color, lineHeight:1 }}>{total_score}</span>
              <span style={{ fontSize:26, color:`${scoreGrade.color}99`, marginBottom:10 }}>/100</span>
            </div>
            <div style={{ fontSize:20, fontWeight:700, color:"#1C1917", marginBottom:16 }}>{scoreGrade.label}</div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ background:"rgba(255,255,255,0.7)", borderRadius:10, padding:"5px 14px", border:"1px solid rgba(0,0,0,0.08)" }}>
                <span style={{ fontSize:11, color:"#78716C", fontFamily:"monospace" }}>NIM: {student.nim}</span>
              </div>
              <span style={{ fontSize:16, fontWeight:700 }}>{student.nama}</span>
            </div>
            <div style={{ position:"absolute", right:16, bottom:-12, fontSize:110, opacity:0.08, userSelect:"none" }}>🤖</div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              { label:"Benar",      value:jumlah_benar, bg:"#D1FAE5", color:"#065F46", border:"#6EE7B7" },
              { label:"Salah",      value:jumlah_salah, bg:"#FFE4E6", color:"#9F1239", border:"#FCA5A5" },
              { label:"Total Soal", value:total_soal,   bg:"#FEF3C7", color:"#92400E", border:"#FCD34D" },
            ].map(st => (
              <div key={st.label} style={{
                background:st.bg, border:`1.5px solid ${st.border}`,
                borderRadius:14, padding:"10px 16px", flex:1,
                boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize:10, color:st.color, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8 }}>{st.label}</div>
                <div style={{ fontSize:34, fontWeight:900, color:st.color, lineHeight:1.2 }}>{st.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Kesulitan + Kategori */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
          {kesulitan_scores && Object.keys(kesulitan_scores).length > 0 && (
            <div style={card()}>
              <div style={tTitle}>📊 Analisis Kesulitan</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:16 }}>
                {Object.entries(kesulitan_scores).map(([k, v]) => {
                  const c = k==="Mudah"
                    ? { bg:"#D1FAE5", color:"#065F46", border:"#6EE7B7" }
                    : k==="Sedang"
                    ? { bg:"#FEF3C7", color:"#92400E", border:"#FCD34D" }
                    : { bg:"#FFE4E6", color:"#9F1239", border:"#FCA5A5" };
                  return (
                    <div key={k} style={{ background:c.bg, border:`1.5px solid ${c.border}`, borderRadius:12, padding:"14px 8px", textAlign:"center" }}>
                      <div style={{ fontSize:10, fontWeight:700, color:c.color, textTransform:"uppercase", letterSpacing:0.5 }}>{k}</div>
                      <div style={{ fontSize:30, fontWeight:900, color:c.color }}>{Math.round(v)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={card()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={tTitle}>🧠 Kategori Kemampuan</div>
              <span style={{
                background:`linear-gradient(135deg,${O},${OD})`, color:"#fff",
                borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700,
              }}>K-Means AI</span>
            </div>
            <div style={{
              background:kat.bg, border:`1.5px solid ${kat.border}`,
              borderRadius:14, padding:"16px 20px",
              display:"flex", alignItems:"center", gap:14,
            }}>
              <span style={{ fontSize:44 }}>{kat.icon}</span>
              <div>
                <div style={{ fontWeight:800, fontSize:18, color:kat.color }}>{kategori_kemampuan} Learner</div>
                <div style={{ fontSize:13, color:"#44403C", marginTop:4, lineHeight:1.5 }}>{ringkasan || ""}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Penguasaan Materi + Analisis Deskriptif */}
        {materi_scores && Object.keys(materi_scores).length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>

            {/* Kiri: progress bar per materi */}
            <div style={card()}>
              <div style={tTitle}>📘 Penguasaan Materi</div>
              <div style={{ display:"flex", flexDirection:"column", gap:18, marginTop:18 }}>
                {Object.entries(materi_scores).map(([materi, skor]) => {
                  const hex    = MATERI_HEX[materi] || "#FBBF24";
                  const detail = analisis_detail?.[materi];
                  const lc     = LABEL_COLOR[detail?.label] || LABEL_COLOR["Cukup"];
                  return (
                    <div key={materi}>
                      <MateriBar label={materi} value={skor} hex={hex} />
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6, flexWrap:"wrap" }}>
                        {detail?.label && (
                          <span style={{
                            background:lc.bg, color:lc.color, border:`1px solid ${lc.border}`,
                            borderRadius:20, padding:"2px 10px", fontSize:10, fontWeight:700,
                          }}>
                            {detail.label}
                          </span>
                        )}
                        {materi === materi_terlemah && (
                          <span style={{
                            background:"#FFE4E6", border:"1px solid #FCA5A5",
                            borderRadius:20, padding:"2px 10px", fontSize:10, fontWeight:700, color:"#9F1239",
                          }}>
                            ⚠ Butuh Perhatian Ekstra
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kanan: Analisis Deskriptif per materi */}
            <div style={card()}>
              <div style={tTitle}>🔍 Analisis Deskriptif</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:16 }}>
                {Object.entries(materi_scores).map(([materi, skor]) => {
                  const hex    = MATERI_HEX[materi] || "#FBBF24";
                  const detail = analisis_detail?.[materi];
                  const isOpen = expandedMateri[materi];
                  if (!detail) return null;
                  return (
                    <div key={materi} style={{
                      border:`1.5px solid ${hex}22`,
                      borderRadius:12, overflow:"hidden",
                    }}>
                      {/* Header accordion */}
                      <button
                        onClick={() => toggleMateri(materi)}
                        style={{
                          width:"100%", display:"flex", alignItems:"center",
                          justifyContent:"space-between",
                          background: isOpen ? `${hex}12` : "#FFFCF9",
                          padding:"10px 14px", border:"none", cursor:"pointer",
                          fontFamily:"inherit", borderBottom: isOpen ? `1px solid ${hex}22` : "none",
                        }}
                      >
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:10, height:10, borderRadius:"50%", background:hex, flexShrink:0 }}/>
                          <span style={{ fontSize:13, fontWeight:700, color:"#1C1917" }}>{materi}</span>
                          <span style={{ fontSize:12, fontWeight:800, color:hex }}>{Math.round(skor)}%</span>
                        </div>
                        <span style={{ fontSize:12, color:"#78716C", transform: isOpen ? "rotate(180deg)" : "none", transition:"transform 0.2s" }}>
                          ▼
                        </span>
                      </button>

                      {/* Body accordion */}
                      {isOpen && (
                        <div style={{ padding:"12px 14px", background:"#FFFCF9" }}>
                          <p style={{
                            fontSize:12, color:"#44403C", margin:0,
                            lineHeight:1.7,
                          }}>
                            {detail.analisis}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
                <p style={{ fontSize:11, color:"#A8956E", margin:"4px 0 0", fontStyle:"italic" }}>
                  Klik materi untuk melihat analisis lengkap
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rekomendasi Belajar */}
        {rekList.length > 0 && (
          <div style={{ marginBottom:28 }}>
            <div style={{ ...tTitle, marginBottom:8, fontSize:16 }}>🚀 Rekomendasi Belajar</div>
            <p style={{ fontSize:13, color:"#78716C", marginBottom:16 }}>
              Berdasarkan hasil analisis, berikut sumber belajar yang direkomendasikan:
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              {rekList.map((rec, i) => {
                const hex  = MATERI_HEX[rec.materi] || "#FBBF24";
                const tc   = TIPE_COLOR[rec.tipe] || TIPE_COLOR["Artikel"];
                const icon = TIPE_ICON[rec.tipe] || "📄";
                return (
                  <div key={i} style={card({ padding:0, overflow:"hidden", display:"flex", flexDirection:"column" })}>
                    {/* color stripe */}
                    <div style={{ height:4, background:`linear-gradient(90deg,${hex},${hex}66)` }}/>
                    <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", flex:1 }}>
                      {/* badges */}
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{
                          background:tc.bg, color:tc.color, border:`1px solid ${tc.border}`,
                          borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700,
                        }}>
                          {icon} {rec.tipe}
                        </span>
                        <span style={{
                          background:`${hex}18`, color:hex,
                          borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700,
                        }}>
                          {rec.materi}
                        </span>
                      </div>

                      {/* judul */}
                      <div style={{ fontWeight:700, fontSize:13, marginBottom:8, lineHeight:1.4, color:"#1C1917" }}>
                        {rec.judul}
                      </div>

                      {/* deskripsi */}
                      <div style={{ fontSize:12, color:"#57534E", flexGrow:1, marginBottom:12, lineHeight:1.6 }}>
                        {rec.deskripsi}
                      </div>

                      {/* tombol */}
                      {rec.url ? (
                        <a
                          href={rec.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display:"block", textAlign:"center",
                            background:`linear-gradient(135deg,${O},${OD})`,
                            color:"#fff", borderRadius:10,
                            padding:"8px 12px", fontSize:12, fontWeight:700,
                            textDecoration:"none", boxShadow:`0 3px 10px ${O}33`,
                          }}
                        >
                          Buka Sumber →
                        </a>
                      ) : (
                        <div style={{
                          textAlign:"center", background:"#F5F0EB", color:"#78716C",
                          borderRadius:10, padding:"8px 12px", fontSize:12, fontWeight:600,
                        }}>
                          📖 Buku Referensi (Offline)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display:"flex", gap:16 }}>
          <button onClick={handleRetry} style={{
            flex:1, background:`linear-gradient(135deg,${O},${OD})`,
            color:"#fff", border:"none", borderRadius:14,
            padding:"16px 24px", fontSize:15, fontWeight:700,
            cursor:"pointer", fontFamily:"inherit",
            boxShadow:`0 6px 20px ${O}44`,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>↺ Ulangi Level {level}</button>
          <button onClick={handleDashboard} style={{
            flex:1, background:"#FFFCF9", color:OD,
            border:`1.5px solid #FED7AA`, borderRadius:14,
            padding:"16px 24px", fontSize:15, fontWeight:700,
            cursor:"pointer", fontFamily:"inherit",
            boxShadow:"0 2px 8px rgba(249,115,22,0.1)",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>⎗ Pilih Level Lain</button>
        </div>
      </main>

      <footer style={{
        borderTop:"1.5px solid #F0E6DA", background:"#FFFCF9",
        textAlign:"center", padding:"14px",
        fontSize:12, color:"#A8956E", marginTop:32,
      }}>
        © 2026 Eureka Quiz
      </footer>
    </div>
  );
}
