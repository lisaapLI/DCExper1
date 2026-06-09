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
    if (!form.nim.trim()) e.nim = "NIM WAJIB DIISI";
    if (!form.password.trim()) e.password = "PASSWORD WAJIB DIISI";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      const res = await login({
        nim: form.nim.trim(),
        password: form.password,
      });
      const user = res.data.user;
      sessionStorage.setItem("quizml_user", JSON.stringify(user));
      // Reset history kalau NIM berbeda
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
    <div className="bg-secondary-container text-on-surface min-h-screen overflow-x-hidden">
      <div className="floating-blob bg-primary w-[300px] h-[300px] top-10 -left-20 rounded-full" />
      <div className="floating-blob bg-tertiary w-[250px] h-[250px] bottom-10 -right-10 rounded-full" />

      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-lg bg-surface border-[3px] border-black neo-shadow-lg p-8 md:p-12 animate-fade-up">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-6 relative">
              <div className="w-20 h-20 bg-tertiary-container border-[3px] border-black rounded-full neo-shadow-sm flex items-center justify-center text-4xl">
                🧮
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary px-2 py-0.5 border-2 border-black font-label-sm text-label-sm text-black font-black neo-shadow-sm whitespace-nowrap">
                AI POWERED
              </div>
            </div>
            <h1 className="font-display text-headline-lg text-center mb-2 uppercase tracking-tighter text-on-surface">
              Eureka Quiz
            </h1>
            <p className="text-on-surface-variant text-center font-label-mono text-label-mono uppercase">
              Login untuk melanjutkan
            </p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="bg-error-container border-[3px] border-black p-3 mb-6 neo-shadow-sm">
              <p className="font-label-mono text-label-mono text-on-error-container font-black uppercase">
                ⚠ {apiError}
              </p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="block font-label-mono text-label-mono mb-2 uppercase font-black text-on-surface">
                NIM / Student ID
              </label>
              <input
                type="text"
                inputMode="numeric"
                className="w-full bg-surface-container border-[3px] border-black p-4 font-label-mono text-label-mono text-on-surface focus:border-primary outline-none transition-all"
                placeholder="202400123"
                value={form.nim}
                style={{ borderRadius: 0 }}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    nim: e.target.value.replace(/\D/g, ""),
                  }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              {errors.nim && (
                <p className="mt-1 font-label-sm text-label-sm text-error">
                  {errors.nim}
                </p>
              )}
            </div>

            <div>
              <label className="block font-label-mono text-label-mono mb-2 uppercase font-black text-on-surface">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-surface-container border-[3px] border-black p-4 font-body-lg text-on-surface focus:border-secondary outline-none transition-all"
                placeholder="••••••••"
                value={form.password}
                style={{ borderRadius: 0 }}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              {errors.password && (
                <p className="mt-1 font-label-sm text-label-sm text-error">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="neo-btn w-full bg-secondary text-on-secondary font-black text-headline-md py-4 border-[3px] border-black neo-shadow uppercase tracking-tight disabled:opacity-50"
              style={{ borderRadius: 0 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="inline-flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-on-secondary rounded-full animate-bounce-dot"
                        style={{ animationDelay: `${i * 0.16}s` }}
                      />
                    ))}
                  </span>
                  MEMVERIFIKASI...
                </span>
              ) : (
                "MASUK →"
              )}
            </button>
          </div>

          {/* Register link */}
          <div className="mt-8 pt-6 border-t-[3px] border-black text-center">
            <p className="font-label-mono text-label-mono text-on-surface-variant">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-primary font-black hover:underline uppercase"
              >
                DAFTAR SEKARANG →
              </Link>
            </p>
          </div>

          {/* Badges */}
          <div className="mt-6 flex gap-3 justify-center">
            <div className="bg-primary text-black px-3 py-1 border-2 border-black font-label-sm text-label-sm font-black neo-shadow-sm flex items-center gap-1.5">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                quiz
              </span>
              60 SOAL
            </div>
            <div className="bg-tertiary-container text-black px-3 py-1 border-2 border-black font-label-sm text-label-sm font-black neo-shadow-sm flex items-center gap-1.5">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                calculate
              </span>
              KALKULUS
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-surface border-t-[3px] border-black py-4 px-margin-desktop">
        <p className="text-center font-label-sm text-label-sm text-on-surface-variant">
          © 2026 EUREKA QUIZ. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
