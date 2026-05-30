"""
K-Means Clustering untuk kategorisasi kemampuan mahasiswa Kalkulus Purcell.
Input: skor per materi (Limit, Turunan, Aplikasi Turunan, Teknik Integrasi, Integral Lipat)
       + skor per kesulitan (Mudah, Sedang, Sulit) + total score + waktu
Kategori: Beginner (0), Intermediate (1), Advanced (2)
"""
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler

# ---------------------------------------------------------------------------
# Dataset training sintetis
# Format: [total_score, jumlah_benar, waktu_detik,
#          limit, turunan, aplikasi_turunan, teknik_integrasi, integral_lipat,
#          mudah, sedang, sulit]
# ---------------------------------------------------------------------------
TRAINING_DATA = np.array([
    # Beginner
    [15,  9,  3000, 10, 20, 10,  5,  5, 30, 10,  0],
    [18, 11,  2800, 20, 15, 10, 10,  5, 35, 10,  0],
    [22, 13,  3100, 20, 20, 15, 10, 10, 40, 15,  0],
    [10,  6,  3500,  5, 10,  5,  5,  5, 20,  5,  0],
    [28, 17,  2600, 30, 25, 20, 15, 10, 50, 20,  5],
    [20, 12,  2900, 15, 20, 15, 10, 10, 35, 15,  0],
    [25, 15,  3000, 25, 20, 20, 10, 10, 45, 15,  5],
    [12,  7,  3300, 10, 15,  5,  5,  5, 25,  5,  0],

    # Intermediate
    [50, 30,  1800, 60, 50, 45, 40, 40, 75, 45, 20],
    [55, 33,  1700, 65, 55, 50, 45, 45, 80, 50, 25],
    [60, 36,  1600, 70, 60, 55, 50, 50, 85, 55, 30],
    [45, 27,  1900, 55, 45, 40, 35, 35, 70, 40, 15],
    [65, 39,  1500, 75, 65, 60, 55, 55, 90, 60, 35],
    [48, 29,  1850, 55, 50, 45, 40, 35, 72, 42, 18],
    [52, 31,  1750, 60, 52, 48, 42, 40, 78, 48, 22],
    [58, 35,  1650, 68, 58, 53, 48, 48, 82, 53, 28],

    # Advanced
    [80, 48,  900, 90, 85, 80, 75, 75, 100, 80, 60],
    [85, 51,  800, 95, 90, 85, 80, 80, 100, 85, 65],
    [90, 54,  700, 95, 95, 90, 85, 85, 100, 90, 75],
    [95, 57,  600,100,100, 95, 90, 90, 100, 95, 85],
    [75, 45, 1000, 85, 80, 75, 70, 70,  95, 75, 55],
    [88, 53,  750, 95, 90, 88, 83, 83, 100, 88, 70],
    [92, 55,  680,100, 95, 90, 88, 88, 100, 92, 78],
    [78, 47,  950, 88, 82, 78, 72, 72,  98, 78, 58],
])

# Pre-fit
_scaler  = MinMaxScaler()
_X_scaled = _scaler.fit_transform(TRAINING_DATA)

_kmeans  = KMeans(n_clusters=3, random_state=42, n_init=10)
_kmeans.fit(_X_scaled)

# Petakan cluster ke label berdasarkan total_score centroid (kolom 0)
_centroids   = _scaler.inverse_transform(_kmeans.cluster_centers_)
_score_order = np.argsort(_centroids[:, 0])
_CLUSTER_MAP = {
    _score_order[0]: 'Beginner',
    _score_order[1]: 'Intermediate',
    _score_order[2]: 'Advanced',
}


def predict_category(
    total_score: float,
    jumlah_benar: int,
    waktu_detik: int,
    limit_score: float,
    turunan_score: float,
    aplikasi_turunan_score: float,
    teknik_integrasi_score: float,
    integral_lipat_score: float,
    mudah_score: float,
    sedang_score: float,
    sulit_score: float,
) -> dict:
    features = np.array([[
        total_score, jumlah_benar, waktu_detik,
        limit_score, turunan_score, aplikasi_turunan_score,
        teknik_integrasi_score, integral_lipat_score,
        mudah_score, sedang_score, sulit_score,
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
