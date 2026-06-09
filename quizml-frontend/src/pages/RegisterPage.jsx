import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/quizApi";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nama.trim()) e.nama = "NAMA WAJIB DIISI";
    if (!form.nim.trim()) e.nim = "NIM WAJIB DIISI";
    else if (!/^\d{5,12}$/.test(form.nim.trim()))
      e.nim = "NIM HARUS 5-12 DIGIT ANGKA";
    if (!form.password) e.password = "PASSWORD WAJIB DIISI";
    else if (form.password.length < 6)
      e.password = "PASSWORD MINIMAL 6 KARAKTER";
    if (form.password !== form.confirm)
      e.confirm = "KONFIRMASI PASSWORD TIDAK COCOK";
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
      await register({
        nim: form.nim.trim(),
        nama: form.nama.trim(),
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setApiError(err.response?.data?.error || "Registrasi gagal. Coba lagi.");
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
            <div className="w-16 h-16 bg-primary border-[3px] border-black neo-shadow-sm flex items-center justify-center text-3xl mb-4">
              📝
            </div>
            <h1 className="font-display text-headline-lg text-center mb-1 uppercase tracking-tighter text-on-surface">
              Daftar Akun
            </h1>
            <p className="text-on-surface-variant text-center font-label-mono text-label-mono uppercase">
              Buat akun untuk menyimpan progres belajarmu
            </p>
          </div>

          {/* Success state */}
          {success && (
            <div className="bg-primary border-[3px] border-black p-4 mb-6 neo-shadow text-center">
              <p className="font-display text-headline-md text-black uppercase">
                ✓ REGISTRASI BERHASIL!
              </p>
              <p className="font-label-mono text-label-mono text-black/70 mt-1">
                Mengalihkan ke halaman login...
              </p>
            </div>
          )}

          {/* API Error */}
          {apiError && (
            <div className="bg-error-container border-[3px] border-black p-3 mb-6 neo-shadow-sm">
              <p className="font-label-mono text-label-mono text-on-error-container font-black uppercase">
                ⚠ {apiError}
              </p>
            </div>
          )}

          {!success && (
            <div className="space-y-5">
              {/* Nama */}
              <div>
                <label className="block font-label-mono text-label-mono mb-2 uppercase font-black text-on-surface">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="w-full bg-surface-container border-[3px] border-black p-4 font-body-lg text-on-surface focus:border-primary outline-none transition-all"
                  placeholder="Budi Santoso"
                  value={form.nama}
                  style={{ borderRadius: 0 }}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nama: e.target.value }))
                  }
                />
                {errors.nama && (
                  <p className="mt-1 font-label-sm text-label-sm text-error">
                    {errors.nama}
                  </p>
                )}
              </div>

              {/* NIM */}
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
                />
                {errors.nim && (
                  <p className="mt-1 font-label-sm text-label-sm text-error">
                    {errors.nim}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block font-label-mono text-label-mono mb-2 uppercase font-black text-on-surface">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full bg-surface-container border-[3px] border-black p-4 font-body-lg text-on-surface focus:border-secondary outline-none transition-all"
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  style={{ borderRadius: 0 }}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
                {errors.password && (
                  <p className="mt-1 font-label-sm text-label-sm text-error">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Konfirmasi */}
              <div>
                <label className="block font-label-mono text-label-mono mb-2 uppercase font-black text-on-surface">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  className="w-full bg-surface-container border-[3px] border-black p-4 font-body-lg text-on-surface focus:border-secondary outline-none transition-all"
                  placeholder="Ulangi password"
                  value={form.confirm}
                  style={{ borderRadius: 0 }}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, confirm: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                {errors.confirm && (
                  <p className="mt-1 font-label-sm text-label-sm text-error">
                    {errors.confirm}
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="neo-btn w-full bg-primary text-black font-black text-headline-md py-4 border-[3px] border-black neo-shadow uppercase tracking-tight disabled:opacity-50"
                style={{ borderRadius: 0 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="inline-flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-2 h-2 bg-black rounded-full animate-bounce-dot"
                          style={{ animationDelay: `${i * 0.16}s` }}
                        />
                      ))}
                    </span>
                    MENDAFTAR...
                  </span>
                ) : (
                  "DAFTAR SEKARANG →"
                )}
              </button>
            </div>
          )}

          {/* Login link */}
          <div className="mt-8 pt-6 border-t-[3px] border-black text-center">
            <p className="font-label-mono text-label-mono text-on-surface-variant">
              Sudah punya akun?{" "}
              <Link
                to="/"
                className="text-secondary font-black hover:underline uppercase"
              >
                LOGIN →
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full bg-surface border-t-[3px] border-black py-4 px-margin-desktop">
        <p className="text-center font-label-sm text-label-sm text-on-surface-variant">
          © 2024 EUREKA QUIZ. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
