"""
Pipeline K-Means + Benchmarking - Sistem Rekomendasi Belajar Kalkulus (PJK-GM044)
================================================================================
Membaca dataset hasil generator, lalu:
  1. Preprocessing (scaling) - WAJIB sebelum K-Means.
  2. Benchmarking: Elbow (inertia) + Silhouette + Davies-Bouldin utk k=2..6.
  3. Latih K-Means k=3, beri label centroid SECARA DINAMIS (Rendah/Sedang/Tinggi).
  4. Fungsi rekomendasi materi: kombinasi (kategori cluster) + (sub-topik terlemah).

Kebutuhan: pandas, scikit-learn, matplotlib.
  pip install pandas scikit-learn matplotlib
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# ------------------------------------------------------------------ load
df = pd.read_csv("dataset_kalkulus_clustering_ready.csv")
FITUR = list(df.columns)            # 6 sub-topik (sudah tanpa id/label)
X = df[FITUR].values.astype(float)

# 1) PREPROCESSING: scaling (K-Means sensitif terhadap skala)
scaler = StandardScaler()
Xs = scaler.fit_transform(X)

# 2) BENCHMARKING: cari k terbaik
print("=== BENCHMARKING ===")
print(f"{'k':>2} {'inertia':>10} {'silhouette':>11} {'davies_bouldin':>15}")
inertias = []
for k in range(2, 7):
    km = KMeans(n_clusters=k, n_init=10, random_state=42).fit(Xs)
    sil = silhouette_score(Xs, km.labels_)
    db = davies_bouldin_score(Xs, km.labels_)
    inertias.append(km.inertia_)
    print(f"{k:>2} {km.inertia_:>10.1f} {sil:>11.3f} {db:>15.3f}")

# Plot Elbow + Silhouette utk laporan
ks = list(range(2, 7))
sils = [silhouette_score(Xs, KMeans(n_clusters=k, n_init=10, random_state=42).fit_predict(Xs)) for k in ks]
fig, ax = plt.subplots(1, 2, figsize=(11, 4))
ax[0].plot(ks, inertias, "o-"); ax[0].set_title("Elbow (Inertia)"); ax[0].set_xlabel("k")
ax[1].plot(ks, sils, "o-", color="green"); ax[1].set_title("Silhouette"); ax[1].set_xlabel("k")
plt.tight_layout(); plt.savefig("benchmark_kmeans.png", dpi=120)
print("Grafik benchmark disimpan: benchmark_kmeans.png")

# 3) MODEL FINAL: k=3 (sesuai kebutuhan 3 level) + pelabelan DINAMIS
K = 3
km = KMeans(n_clusters=K, n_init=10, random_state=42).fit(Xs)
df["cluster"] = km.labels_

# Urutkan cluster berdasarkan rata-rata skor centroid -> label dinamis
centroid_asli = scaler.inverse_transform(km.cluster_centers_)
rata_centroid = centroid_asli.mean(axis=1)
urutan = np.argsort(rata_centroid)                 # rendah -> tinggi
nama_level = {urutan[0]: "Rendah", urutan[1]: "Sedang", urutan[2]: "Tinggi"}
df["kategori"] = df["cluster"].map(nama_level)
print("\nDistribusi kategori:", dict(df["kategori"].value_counts()))

# 4) REKOMENDASI MATERI: kategori cluster + sub-topik terlemah mahasiswa
MATERI = {
    "limit_score":            "Konsep Limit & Kekontinuan",
    "turunan_score":          "Aturan Turunan Dasar",
    "aplikasi_turunan_score": "Aplikasi Turunan (maks-min, laju)",
    "integral_tentu_score":   "Integral Tentu & Teorema Dasar Kalkulus",
    "teknik_integrasi_score": "Teknik Integrasi (substitusi, parsial)",
    "integral_lipat_score":   "Integral Lipat",
}
KEDALAMAN = {
    "Rendah": "materi remedial + banyak latihan terbimbing",
    "Sedang": "materi penguatan + latihan tingkat menengah",
    "Tinggi": "materi pengayaan + soal aplikasi menantang",
}

def rekomendasi(baris):
    kategori = baris["kategori"]
    topik_terlemah = min(FITUR, key=lambda c: baris[c])
    return f"[{kategori}] Fokus: {MATERI[topik_terlemah]} - {KEDALAMAN[kategori]}"

df["rekomendasi"] = df.apply(rekomendasi, axis=1)
df.to_csv("hasil_clustering_rekomendasi.csv", index=False)
print("\nContoh hasil:")
print(df[[*FITUR, "kategori", "rekomendasi"]].head(5).to_string(index=False))
print("\nDisimpan: hasil_clustering_rekomendasi.csv")

# --- INFERENCE utk mahasiswa baru (saat selesai kuis) -------------------
# skor_baru = [[limit, turunan, apl_turunan, integral_tentu, teknik_int, integral_lipat]]
# Xs_baru = scaler.transform(skor_baru)        # WAJIB scaler yg sama
# cluster_baru = km.predict(Xs_baru)
# kategori_baru = [nama_level[c] for c in cluster_baru]
