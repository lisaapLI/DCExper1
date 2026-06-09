import pandas as pd
import numpy as np

np.random.seed(42)
N = 500

# ─────────────────────────────────────────
# 1. BUAT PROFIL KEMAMPUAN MAHASISWA
#    Dibagi 3 kelompok agar distribusi realistis
# ─────────────────────────────────────────
# Beginner   : ~40% mahasiswa  → skor rendah
# Intermediate: ~40% mahasiswa → skor menengah
# Advanced   : ~20% mahasiswa  → skor tinggi

kelompok = np.random.choice(
    ['Beginner', 'Intermediate', 'Advanced'],
    size=N,
    p=[0.40, 0.40, 0.20]
)

# Parameter rata-rata dan standar deviasi per kelompok
profil = {
    'Beginner':     {'mean': 38, 'std': 10},
    'Intermediate': {'mean': 62, 'std': 10},
    'Advanced':     {'mean': 83, 'std': 7},
}

# ─────────────────────────────────────────
# 2. GENERATE SKOR PER MATERI (6 materi)
# ─────────────────────────────────────────
materi = [
    'limit_score',
    'turunan_score',
    'aplikasi_turunan_score',
    'integral_tentu_score',
    'teknik_integrasi_score',
    'integral_lipat_score',
]

data = {}

for i, mat in enumerate(materi):
    skor_list = []
    for k in kelompok:
        m = profil[k]['mean']
        s = profil[k]['std']
        # Tiap materi punya variasi sedikit berbeda agar tidak identik
        noise = np.random.normal(0, 5)
        skor = np.clip(np.random.normal(m + noise, s), 0, 100)
        skor_list.append(round(skor, 1))
    data[mat] = skor_list

df = pd.DataFrame(data)

# ─────────────────────────────────────────
# 3. HITUNG KOLOM TURUNAN
# ─────────────────────────────────────────
df['total_score'] = df[materi].mean(axis=1).round(1)

# Jumlah soal per materi diasumsikan 20 soal total per quiz
# Skala 0-100 → jumlah benar dari 20 soal
df['jumlah_benar'] = (df['total_score'] / 100 * 20).round().astype(int)
df['jumlah_salah'] = 20 - df['jumlah_benar']

# Waktu pengerjaan: mahasiswa lemah cenderung lebih lama
# Beginner: 15-25 menit, Intermediate: 10-20 menit, Advanced: 7-15 menit
waktu_list = []
for k in kelompok:
    if k == 'Beginner':
        w = np.random.uniform(15 * 60, 25 * 60)
    elif k == 'Intermediate':
        w = np.random.uniform(10 * 60, 20 * 60)
    else:
        w = np.random.uniform(7 * 60, 15 * 60)
    waktu_list.append(round(w))
df['waktu_detik'] = waktu_list

# Skor per level kesulitan
# Mudah = rata-rata materi dasar (limit, turunan)
# Sedang = materi menengah (aplikasi turunan, integral tentu)
# Sulit  = materi lanjut (teknik integrasi, integral lipat)
df['mudah_score']  = df[['limit_score', 'turunan_score']].mean(axis=1).round(1)
df['sedang_score'] = df[['aplikasi_turunan_score', 'integral_tentu_score']].mean(axis=1).round(1)
df['sulit_score']  = df[['teknik_integrasi_score', 'integral_lipat_score']].mean(axis=1).round(1)

# Konsistensi: seberapa merata skor antar materi
# Nilai rendah = konsisten, nilai tinggi = tidak merata
df['konsistensi_score'] = df[materi].std(axis=1).round(2)

# Percobaan ke-berapa (mahasiswa lemah cenderung lebih sering mencoba)
attempt_list = []
for k in kelompok:
    if k == 'Beginner':
        a = np.random.choice([1, 2, 3, 4], p=[0.3, 0.35, 0.25, 0.10])
    elif k == 'Intermediate':
        a = np.random.choice([1, 2, 3, 4], p=[0.45, 0.35, 0.15, 0.05])
    else:
        a = np.random.choice([1, 2, 3, 4], p=[0.65, 0.25, 0.08, 0.02])
    attempt_list.append(a)
df['attempt_ke'] = attempt_list

# Level quiz yang dikerjakan
level_list = []
for k in kelompok:
    if k == 'Beginner':
        l = np.random.choice(['Mudah', 'Sedang', 'Sulit'], p=[0.60, 0.30, 0.10])
    elif k == 'Intermediate':
        l = np.random.choice(['Mudah', 'Sedang', 'Sulit'], p=[0.30, 0.45, 0.25])
    else:
        l = np.random.choice(['Mudah', 'Sedang', 'Sulit'], p=[0.15, 0.35, 0.50])
    level_list.append(l)
df['level_quiz'] = level_list

# ─────────────────────────────────────────
# 4. TAMBAH IDENTITAS MAHASISWA
# ─────────────────────────────────────────
nim_list = [f"2023{str(i).zfill(5)}" for i in range(1, N + 1)]
df.insert(0, 'nim', nim_list)

# Label kelompok (ini TIDAK dipakai saat clustering — hanya untuk validasi)
df['label_kelompok'] = kelompok

# ─────────────────────────────────────────
# 5. SIMPAN KE CSV
# ─────────────────────────────────────────
output_path = '/home/claude/dataset_quiz.csv'
df.to_csv(output_path, index=False)

print("✅ Dataset berhasil dibuat!")
print(f"   Jumlah data : {len(df)} baris")
print(f"   Jumlah kolom: {len(df.columns)} kolom")
print(f"\nKolom yang ada:")
for col in df.columns:
    print(f"   - {col}")
print(f"\nDistribusi kelompok:")
print(df['label_kelompok'].value_counts())
print(f"\nSample 3 baris pertama:")
print(df.head(3).to_string())
