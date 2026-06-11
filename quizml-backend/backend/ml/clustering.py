"""
K-Means Clustering - Eureka Quiz
=================================
Menggunakan pipeline dari advisor:
- Fitur: 6 sub-topik saja (tanpa label, tanpa total_score)
- Scaling: StandardScaler (bukan MinMaxScaler)
- K=3 dinamis: Rendah / Sedang / Tinggi
- Dataset: dataset_kalkulus_clustering_ready.csv (600 data, tanpa label)
"""
import os
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# ── Load dataset (hanya 6 sub-topik, tanpa label) ──────────────────────────
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_df = pd.read_csv(os.path.join(_BASE_DIR, 'dataset_kalkulus_clustering_ready.csv'))

FITUR = [
    'limit_score',
    'turunan_score',
    'aplikasi_turunan_score',
    'integral_tentu_score',
    'teknik_integrasi_score',
    'integral_lipat_score',
]

# ── Pre-fit model ───────────────────────────────────────────────────────────
_scaler   = StandardScaler()
_X_scaled = _scaler.fit_transform(_df[FITUR])
_kmeans   = KMeans(n_clusters=3, n_init=10, random_state=42)
_kmeans.fit(_X_scaled)

# Label dinamis berdasarkan rata-rata centroid (Rendah/Sedang/Tinggi)
_centroid_asli = _scaler.inverse_transform(_kmeans.cluster_centers_)
_rata_centroid = _centroid_asli.mean(axis=1)
_urutan        = np.argsort(_rata_centroid)
_CLUSTER_MAP   = {
    _urutan[0]: 'Rendah',
    _urutan[1]: 'Sedang',
    _urutan[2]: 'Tinggi',
}

def predict_category(
    limit_score: float,
    turunan_score: float,
    aplikasi_turunan_score: float,
    integral_tentu_score: float,
    teknik_integrasi_score: float,
    integral_lipat_score: float,
) -> dict:
    """
    Prediksi kategori kemampuan mahasiswa berdasarkan 6 skor sub-topik.
    Return: dict berisi kategori, cluster_label, topik_terlemah, confidence_scores
    """
    features = np.array([[
        limit_score, turunan_score, aplikasi_turunan_score,
        integral_tentu_score, teknik_integrasi_score, integral_lipat_score,
    ]])
    features_scaled = _scaler.transform(features)
    cluster_raw     = int(_kmeans.predict(features_scaled)[0])
    kategori        = _CLUSTER_MAP[cluster_raw]

    # Topik terlemah
    skor_dict = {
        'limit_score':            limit_score,
        'turunan_score':          turunan_score,
        'aplikasi_turunan_score': aplikasi_turunan_score,
        'integral_tentu_score':   integral_tentu_score,
        'teknik_integrasi_score': teknik_integrasi_score,
        'integral_lipat_score':   integral_lipat_score,
    }
    topik_terlemah = min(skor_dict, key=skor_dict.get)

    # Jarak ke tiap centroid
    distances = {}
    for raw_idx, label in _CLUSTER_MAP.items():
        dist = float(np.linalg.norm(features_scaled - _kmeans.cluster_centers_[raw_idx]))
        distances[label] = round(dist, 4)

    return {
        'kategori':          kategori,
        'cluster_label':     cluster_raw,
        'topik_terlemah':    topik_terlemah,
        'confidence_scores': distances,
    }
