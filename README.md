# 🎓 Eureka Quiz — Platform Kuis Kalkulus Berbasis AI

> Capstone Project | Program Studi Independen Bersertifikat (MSIB) Dicoding

Platform kuis adaptif berbasis **K-Means Clustering** untuk menganalisis kemampuan mahasiswa Kalkulus dan memberikan rekomendasi belajar yang personal.

---

## 📋 Deskripsi Proyek

Eureka Quiz adalah web aplikasi kuis Kalkulus yang menggunakan Machine Learning untuk:
- Mengelompokkan kemampuan mahasiswa secara otomatis (**K-Means Clustering**)
- Menganalisis materi mana yang paling lemah
- Memberikan **rekomendasi belajar personal** berdasarkan hasil analisis

---

## 🛠️ Tech Stack

| Bagian | Teknologi |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Flask (Python) REST API |
| Database | MySQL |
| Machine Learning | Scikit-learn (K-Means Clustering) |

---

## 📁 Struktur Folder

```
DCExper1/
├── quizml-frontend/        # React + Vite + Tailwind
│   └── src/
│       ├── pages/          # LoginPage, RegisterPage, DashboardPage, QuizPage, ResultPage
│       ├── components/     # RadarChart, CategoryBadge, ProgressBar
│       ├── hooks/          # useQuiz.js
│       └── api/            # quizApi.js
├── quizml-backend/         # Flask REST API
│   ├── backend/
│   │   ├── ml/             # clustering.py, analyzer.py, recommendation.py
│   │   ├── routes/         # auth, quiz, submit, student routes
│   │   └── utils/          # db.py
│   └── database/           # schema.sql, schema_users.sql, update_questions.sql
└── ml_analysis/            # Analisis ML lengkap
    ├── dataset_kalkulus_realistis_full.csv     # Dataset lengkap + label referensi
    ├── dataset_kalkulus_clustering_ready.csv   # Dataset bersih untuk clustering
    ├── generate_dataset.py                     # Script generate dataset
    └── kmeans_pipeline.py                      # Pipeline K-Means + benchmarking
```

---

## 🤖 Machine Learning

### Dataset
- **600 data** hasil kuis mahasiswa (sintetis realistis)
- **6 fitur clustering**: limit_score, turunan_score, aplikasi_turunan_score, integral_tentu_score, teknik_integrasi_score, integral_lipat_score
- Korelasi antar sub-topik ~0.6 (realistis, tidak multikolinear)
- File terpisah: `_clustering_ready.csv` (untuk fit model) dan `_full.csv` (untuk validasi)

### Pipeline K-Means
| Tahap | Detail |
|---|---|
| Preprocessing | StandardScaler |
| Evaluasi K | Elbow Method + Silhouette Score + Davies-Bouldin Index |
| K Optimal | k=3 (Rendah / Sedang / Tinggi) |
| Parameter | n_init=10, random_state=42 |
| Label | Dinamis berdasarkan rata-rata centroid |

### Hasil Benchmarking

| k | Inertia | Silhouette | Davies-Bouldin |
|---|---|---|---|
| 2 | 1761.8 | 0.401 | 0.942 |
| **3** | **1391.3** | **0.285** | **1.224** |
| 4 | 1252.8 | 0.206 | 1.534 |
| 5 | 1185.7 | 0.176 | 1.718 |

### Kategori Kemampuan
- 🟥 **Rendah** — skor sub-topik rendah, butuh materi remedial
- 🟨 **Sedang** — skor menengah, butuh penguatan
- 🟩 **Tinggi** — skor tinggi, butuh pengayaan

---

## 🚀 Cara Menjalankan

### Prasyarat
- Python 3.10+
- Node.js 18+
- XAMPP (MySQL)

### 1. Setup Database
```bash
# Buka phpMyAdmin → buat database 'quiz'
# Import file SQL berurutan:
database/schema.sql
database/schema_users.sql
database/update_questions.sql
```

### 2. Setup Backend
```bash
cd quizml-backend/backend

# Buat virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Buat file .env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=quiz
FLASK_DEBUG=True
SECRET_KEY=quizml-secret-key-2024

# Jalankan
python app.py
```

### 3. Setup Frontend
```bash
cd quizml-frontend
npm install
npm run dev
```

### 4. Buka Aplikasi
```
http://localhost:5173
```

---

## 🔌 REST API Endpoints

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/api/auth/register` | Daftar akun |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/history/:nim` | Riwayat quiz |
| GET | `/api/quiz/questions?level=Mudah` | Ambil soal per level |
| POST | `/api/quiz/submit` | Submit + analisis ML |
| GET | `/api/health` | Cek status server |

---

## 📊 Fitur Aplikasi

- ✅ Register & Login mahasiswa
- ✅ Quiz 3 level: Mudah / Sedang / Sulit
- ✅ 20 soal acak per sesi (`ORDER BY RAND()`)
- ✅ Analisis skor per materi dan per level kesulitan
- ✅ Kategorisasi kemampuan dengan K-Means (Rendah/Sedang/Tinggi)
- ✅ Rekomendasi belajar berbasis rule
- ✅ Radar chart visualisasi penguasaan materi
- ✅ Riwayat quiz tersimpan

---

## 👩‍💻 Developer

**Lilis** — Mahasiswa Program Studi Independen Bersertifikat (MSIB) Dicoding

---

## 📄 Lisensi

Project ini dibuat untuk keperluan akademik — Capstone Project MSIB Dicoding.
