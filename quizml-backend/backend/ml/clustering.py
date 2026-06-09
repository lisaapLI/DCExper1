"""
K-Means Clustering untuk kategorisasi kemampuan mahasiswa Kalkulus Purcell.
Input: 13 fitur (skor per materi, skor per kesulitan, total score, waktu, konsistensi)
Kategori: Beginner (0), Advanced (1)
K optimal = 2 berdasarkan hasil analisis Silhouette Score
"""
import os
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler

# ---------------------------------------------------------------------------
# Load dataset
# ---------------------------------------------------------------------------
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_df = pd.read_csv(os.path.join(_BASE_DIR, 'dataset_quiz_final.csv'))

FITUR = [
    'total_score', 'jumlah_benar', 'waktu_detik',
    'limit_score', 'turunan_score', 'aplikasi_turunan_score',
    'integral_tentu_score', 'teknik_integrasi_score', 'integral_lipat_score',
    'mudah_score', 'sedang_score', 'sulit_score', 'konsistensi_score'
]

# ---------------------------------------------------------------------------
# Pre-fit model
# ---------------------------------------------------------------------------
_scaler   = MinMaxScaler()
_X_scaled = _scaler.fit_transform(_df[FITUR])
_kmeans   = KMeans(n_clusters=2, init='k-means++', n_init=20, random_state=42)
_kmeans.fit(_X_scaled)

# Petakan cluster ke label berdasarkan total_score centroid (kolom 0)
_centroids   = _scaler.inverse_transform(_kmeans.cluster_centers_)
_score_order = np.argsort(_centroids[:, 0])
_CLUSTER_MAP = {
    _score_order[0]: 'Beginner',
    _score_order[1]: 'Advanced',
}

def predict_category(
    total_score: float,
    jumlah_benar: int,
    waktu_detik: int,
    limit_score: float,
    turunan_score: float,
    aplikasi_turunan_score: float,
    integral_tentu_score: float,
    teknik_integrasi_score: float,
    integral_lipat_score: float,
    mudah_score: float,
    sedang_score: float,
    sulit_score: float,
    konsistensi_score: float = 0.0,
) -> dict:
    features = np.array([[
        total_score, jumlah_benar, waktu_detik,
        limit_score, turunan_score, aplikasi_turunan_score,
        integral_tentu_score, teknik_integrasi_score, integral_lipat_score,
        mudah_score, sedang_score, sulit_score, konsistensi_score
    ]])
    features_scaled = _scaler.transform(features)
    cluster_raw     = int(_kmeans.predict(features_scaled)[0])
    kategori        = _CLUSTER_MAP[cluster_raw]

    distances = {}
    for raw_idx, label in _CLUSTER_MAP.items():
        dist = float(np.linalg.norm(features_scaled - _kmeans.cluster_centers_[raw_idx]))
        distances[label] = round(dist, 4)

    return {
        'kategori':          kategori,
        'cluster_label':     cluster_raw,
        'confidence_scores': distances,
    }
