import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LEVELS = [
  {
    key: "Mudah",
    label: "Mudah",
    icon: "🌱",
    desc: "Konsep dasar limit, turunan, dan integral",
    soal: "20 Soal",
    bg: "#FFF3E0",
    accent: "#FF9800",
    badge: "#E65100",
  },
  {
    key: "Sedang",
    label: "Sedang",
    icon: "⚡",
    desc: "Teknik lanjut, aturan rantai, dan integral tentu",
    soal: "20 Soal",
    bg: "#FFF8E1",
    accent: "#FFC107",
    badge: "#F57F17",
  },
  {
    key: "Sulit",
    label: "Sulit",
    icon: "🔥",
    desc: "Teknik integrasi lanjut dan integral lipat",
    soal: "20 Soal",
    bg: "#FBE9E7",
    accent: "#FF5722",
    badge: "#BF360C",
  },
];

const getScoreColor = (s) =>
  s >= 80 ? "#4CAF50" : s >= 60 ? "#FF9800" : "#F44336";

const getKategoriIcon = (k) =>
  k === "Advanced" ? "🏆" : k === "Sedang" ? "⚡" : "📚";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("quizml_user");
      if (!raw) { navigate("/"); return; }
      const u = JSON.parse(raw);
      if (!u?.nim) { navigate("/"); return; }
      setUser(u);
      const saved = JSON.parse(localStorage.getItem(`quizml_history_${u.nim}`) || "[]");
      setHistory([...saved].reverse());
    } catch {
      navigate("/");
    } finally {
      setReady(true);
    }
  }, []);

  if (!ready || !user) return (
    <div style={{ minHeight: "100vh", background: "#FFF8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: "50%", background: "#FF9800",
            animation: "bounce 0.6s infinite alternate",
            animationDelay: `${i * 0.15}s`
          }} />
        ))}
      </div>
    </div>
  );

  const startQuiz = (level) => navigate("/quiz", { state: { level } });

  const handleLogout = () => {
    sessionStorage.removeItem("quizml_user");
    sessionStorage.removeItem("quizml_result");
    sessionStorage.removeItem("quizml_nim");
    navigate("/");
  };

  const bestScores = history.reduce((acc, r) => {
    if (acc[r.level] === undefined || r.total_score > acc[r.level])
      acc[r.level] = r.total_score;
    return acc;
  }, {});

  const attempts = (level) => history.filter(h => h.level === level).length;

  const totalAttempts = history.length;
  const avgScore = totalAttempts > 0
    ? Math.round(history.reduce((s, h) => s + h.total_score, 0) / totalAttempts)
    : 0;
  const bestOverall = totalAttempts > 0
    ? Math.max(...history.map(h => h.total_score))
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#FFF8F0", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-8px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .card-hover { transition: all 0.2s ease; cursor: pointer; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(255,152,0,0.18) !important; }
        .level-card:hover .start-btn { background: #E65100 !important; }
        .tab-btn { border: none; cursor: pointer; transition: all 0.2s; }
        .logout-btn:hover { background: #FF5722 !important; color: white !important; }
        .history-row { transition: background 0.15s; }
        .history-row:hover { background: #FFF3E0 !important; }
        .clear-btn:hover { background: #FFCCBC !important; }
      `}</style>

      {/* Navbar */}
      <header style={{
        background: "white",
        borderBottom: "2px solid #FFE0B2",
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 2px 12px rgba(255,152,0,0.08)"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#FF9800,#FF5722)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              🎓
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#1A1A1A", letterSpacing: "-0.5px" }}>
              Eureka <span style={{ color: "#FF9800" }}>Quiz</span>
            </span>
          </div>

          {/* Nav tabs */}
          <div style={{ display: "flex", gap: 4, background: "#FFF3E0", borderRadius: 10, padding: 4 }}>
            {[{ id: "dashboard", label: "Dashboard" }, { id: "history", label: "Riwayat" }].map(t => (
              <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "6px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  background: activeTab === t.id ? "#FF9800" : "transparent",
                  color: activeTab === t.id ? "white" : "#9E6B00",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* User + logout */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right", display: "none" }} className="sm-show">
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{user.nama}</div>
              <div style={{ fontSize: 12, color: "#9E9E9E" }}>NIM: {user.nim}</div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg,#FF9800,#FF5722)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: 15
            }}>
              {user.nama?.[0]?.toUpperCase() || "U"}
            </div>
            <button className="logout-btn" onClick={handleLogout} style={{
              padding: "7px 16px", borderRadius: 8, border: "1.5px solid #FFE0B2",
              background: "white", color: "#FF5722", fontWeight: 700, fontSize: 13,
              cursor: "pointer", transition: "all 0.2s"
            }}>
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {activeTab === "dashboard" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            {/* Welcome */}
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 13, color: "#9E6B00", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                Selamat datang kembali 👋
              </p>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>
                {user.nama}
              </h1>
              <p style={{ fontSize: 14, color: "#9E9E9E", marginTop: 4 }}>NIM: {user.nim} · Pilih level untuk mulai kuis Kalkulus</p>
            </div>

            {/* Stats row */}
            {totalAttempts > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
                {[
                  { label: "Total Percobaan", value: totalAttempts, icon: "📝", color: "#FF9800" },
                  { label: "Rata-rata Skor", value: `${avgScore}`, icon: "📊", color: "#4CAF50" },
                  { label: "Skor Tertinggi", value: `${bestOverall}`, icon: "🏆", color: "#2196F3" },
                ].map(s => (
                  <div key={s.label} style={{
                    background: "white", borderRadius: 16, padding: "20px 24px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14
                  }}>
                    <div style={{ fontSize: 28 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: "#9E9E9E", fontWeight: 500 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Level section title */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 4, height: 22, background: "#FF9800", borderRadius: 2 }} />
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Pilih Level Kuis</h2>
            </div>

            {/* Level cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginBottom: 40 }}>
              {LEVELS.map(lv => {
                const best = bestScores[lv.key];
                const att = attempts(lv.key);
                return (
                  <div key={lv.key} className="card-hover level-card" onClick={() => startQuiz(lv.key)}
                    style={{
                      background: "white", borderRadius: 20, overflow: "hidden",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      border: `2px solid ${lv.bg}`
                    }}>
                    {/* Card top */}
                    <div style={{ background: lv.bg, padding: "24px 24px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: 40 }}>{lv.icon}</span>
                        <span style={{
                          background: lv.badge, color: "white", fontSize: 11,
                          fontWeight: 700, padding: "3px 10px", borderRadius: 20
                        }}>{lv.soal}</span>
                      </div>
                      <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: "12px 0 4px" }}>{lv.label}</h3>
                      <p style={{ fontSize: 13, color: "#616161", margin: 0, lineHeight: 1.5 }}>{lv.desc}</p>
                    </div>

                    {/* Card bottom */}
                    <div style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                        <div>
                          <div style={{ fontSize: 11, color: "#9E9E9E", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Best Score</div>
                          <div style={{ fontSize: 22, fontWeight: 800, color: best !== undefined ? getScoreColor(best) : "#BDBDBD" }}>
                            {best !== undefined ? `${best}` : "—"}
                            {best !== undefined && <span style={{ fontSize: 13, color: "#9E9E9E", fontWeight: 500 }}>/100</span>}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "#9E9E9E", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Percobaan</div>
                          <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>{att}x</div>
                        </div>
                      </div>
                      <button className="start-btn" style={{
                        width: "100%", padding: "11px", borderRadius: 12, border: "none",
                        background: lv.accent, color: "white", fontWeight: 700, fontSize: 14,
                        cursor: "pointer", transition: "background 0.2s"
                      }}>
                        Mulai Kuis →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Riwayat Kuis</h2>
                <p style={{ fontSize: 13, color: "#9E9E9E", marginTop: 4 }}>{history.length} sesi pengerjaan</p>
              </div>
              {history.length > 0 && (
                <button className="clear-btn" onClick={() => {
                  localStorage.removeItem(`quizml_history_${user.nim}`);
                  setHistory([]);
                }} style={{
                  padding: "8px 16px", borderRadius: 10, border: "1.5px solid #FFE0B2",
                  background: "white", color: "#FF5722", fontWeight: 600, fontSize: 13, cursor: "pointer"
                }}>
                  Hapus Semua
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div style={{
                background: "white", borderRadius: 20, padding: "60px 24px",
                textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <p style={{ fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Belum ada riwayat</p>
                <p style={{ fontSize: 13, color: "#9E9E9E" }}>Selesaikan kuis pertamamu!</p>
                <button onClick={() => setActiveTab("dashboard")} style={{
                  marginTop: 20, padding: "10px 24px", borderRadius: 12, border: "none",
                  background: "#FF9800", color: "white", fontWeight: 700, cursor: "pointer"
                }}>Mulai Kuis</button>
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                {history.map((h, i) => {
                  const lv = LEVELS.find(l => l.key === h.level) || LEVELS[0];
                  return (
                    <div key={i} className="history-row" style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "16px 24px",
                      borderBottom: i < history.length - 1 ? "1px solid #FFF3E0" : "none",
                      background: "white"
                    }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 12,
                        background: lv.bg, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 20, flexShrink: 0
                      }}>
                        {lv.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                          <span style={{
                            fontSize: 12, fontWeight: 700, color: lv.badge,
                            background: lv.bg, padding: "2px 8px", borderRadius: 6
                          }}>{h.level}</span>
                          {h.kategori_kemampuan && (
                            <span style={{ fontSize: 12, color: "#9E9E9E" }}>
                              {getKategoriIcon(h.kategori_kemampuan)} {h.kategori_kemampuan}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 13, color: "#616161" }}>
                          {h.jumlah_benar}/{h.total_soal || 20} benar
                          {h.materi_terlemah && ` · Lemah: ${h.materi_terlemah}`}
                        </div>
                        <div style={{ fontSize: 11, color: "#BDBDBD", marginTop: 2 }}>
                          {h.timestamp ? new Date(h.timestamp).toLocaleString("id-ID") : ""}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: getScoreColor(h.total_score) }}>
                          {h.total_score}
                        </div>
                        <div style={{ fontSize: 11, color: "#9E9E9E" }}>/ 100</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={{ textAlign: "center", padding: "24px", color: "#BDBDBD", fontSize: 12, borderTop: "1px solid #FFE0B2", marginTop: 32 }}>
        © 2026 Eureka Quiz — Capstone Project Machine Learning
      </footer>
    </div>
  );
}
