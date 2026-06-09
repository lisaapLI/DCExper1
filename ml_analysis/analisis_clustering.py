import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import seaborn as sns
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
from sklearn.decomposition import PCA
import warnings
warnings.filterwarnings('ignore')

# ═══════════════════════════════════════════════════════
# PATH OTOMATIS — ikuti folder tempat script ini berada
# ═══════════════════════════════════════════════════════
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def path(filename):
    return os.path.join(BASE_DIR, filename)

# ═══════════════════════════════════════════════════════
# SETUP VISUAL
# ═══════════════════════════════════════════════════════
plt.rcParams['figure.facecolor'] = '#0f0f0f'
plt.rcParams['axes.facecolor']   = '#1a1a2e'
plt.rcParams['axes.edgecolor']   = '#444'
plt.rcParams['text.color']       = '#e0e0e0'
plt.rcParams['axes.labelcolor']  = '#e0e0e0'
plt.rcParams['xtick.color']      = '#aaa'
plt.rcParams['ytick.color']      = '#aaa'
plt.rcParams['axes.titlecolor']  = '#ffffff'
plt.rcParams['axes.grid']        = True
plt.rcParams['grid.color']       = '#333'
plt.rcParams['grid.alpha']       = 0.5
plt.rcParams['font.family']      = 'DejaVu Sans'

COLORS  = ['#b4ffec', '#c8b4ff', '#ffd166', '#ff6b6b', '#4ecdc4', '#a8dadc']
PALETTE = {'Beginner': '#ff6b6b', 'Intermediate': '#ffd166', 'Advanced': '#b4ffec'}

# ═══════════════════════════════════════════════════════
# LOAD DATA
# ═══════════════════════════════════════════════════════
df = pd.read_csv(path('dataset_quiz.csv'))
FITUR = ['total_score','jumlah_benar','waktu_detik',
         'limit_score','turunan_score','aplikasi_turunan_score',
         'integral_tentu_score','teknik_integrasi_score','integral_lipat_score',
         'mudah_score','sedang_score','sulit_score','konsistensi_score']

print(f"✅ Data berhasil dimuat: {len(df)} baris, {len(df.columns)} kolom")

# ═══════════════════════════════════════════════════════
# GAMBAR 1 — EDA OVERVIEW
# ═══════════════════════════════════════════════════════
fig = plt.figure(figsize=(20, 14))
fig.suptitle('EDA - Eureka Quiz Dataset (500 Data)', fontsize=18, fontweight='bold', y=0.98)
gs = gridspec.GridSpec(2, 3, figure=fig, hspace=0.45, wspace=0.35)

ax1 = fig.add_subplot(gs[0, 0])
counts = df['label_kelompok'].value_counts()
wedge_props = dict(width=0.55, edgecolor='#0f0f0f', linewidth=2)
ax1.pie(counts.values, labels=counts.index,
        colors=[PALETTE[k] for k in counts.index],
        autopct='%1.1f%%', wedgeprops=wedge_props,
        textprops={'color': '#e0e0e0', 'fontsize': 11})
ax1.set_title('Distribusi Kelompok Kemampuan', fontsize=12, pad=12)

ax2 = fig.add_subplot(gs[0, 1])
for grp, color in PALETTE.items():
    subset = df[df['label_kelompok'] == grp]['total_score']
    ax2.hist(subset, bins=20, alpha=0.7, color=color, label=grp, edgecolor='#0f0f0f')
ax2.axvline(df['total_score'].mean(), color='white', linestyle='--', linewidth=1.5,
            label=f'Rata-rata: {df["total_score"].mean():.1f}')
ax2.set_title('Distribusi Total Skor', fontsize=12)
ax2.set_xlabel('Skor')
ax2.set_ylabel('Frekuensi')
ax2.legend(fontsize=9)

ax3 = fig.add_subplot(gs[0, 2])
materi_cols   = ['limit_score','turunan_score','aplikasi_turunan_score',
                 'integral_tentu_score','teknik_integrasi_score','integral_lipat_score']
materi_labels = ['Limit','Turunan','Apk.\nTurunan','Int.\nTentu','Tek.\nIntegrasi','Int.\nLipat']
bp = ax3.boxplot([df[c] for c in materi_cols], patch_artist=True,
                 medianprops=dict(color='white', linewidth=2),
                 whiskerprops=dict(color='#aaa'), capprops=dict(color='#aaa'),
                 flierprops=dict(marker='o', markerfacecolor='#ff6b6b', markersize=3))
for patch, color in zip(bp['boxes'], COLORS):
    patch.set_facecolor(color)
    patch.set_alpha(0.8)
ax3.set_xticklabels(materi_labels, fontsize=9)
ax3.set_title('Distribusi Skor per Materi', fontsize=12)
ax3.set_ylabel('Skor')

ax4 = fig.add_subplot(gs[1, 0:2])
mean_by_grp = df.groupby('label_kelompok')[materi_cols].mean()
x = np.arange(len(materi_labels))
width = 0.25
for i, (grp, color) in enumerate(PALETTE.items()):
    vals = mean_by_grp.loc[grp].values if grp in mean_by_grp.index else [0]*6
    ax4.bar(x + i*width, vals, width, label=grp, color=color, alpha=0.85, edgecolor='#0f0f0f')
ax4.set_xticks(x + width)
ax4.set_xticklabels(materi_labels, fontsize=10)
ax4.set_title('Rata-rata Skor per Materi per Kelompok', fontsize=12)
ax4.set_ylabel('Rata-rata Skor')
ax4.legend(fontsize=10)
ax4.set_ylim(0, 110)

ax5 = fig.add_subplot(gs[1, 2])
for grp, color in PALETTE.items():
    subset = df[df['label_kelompok'] == grp]
    ax5.scatter(subset['waktu_detik']/60, subset['total_score'],
                alpha=0.5, color=color, s=20, label=grp)
ax5.set_title('Waktu vs Total Skor', fontsize=12)
ax5.set_xlabel('Waktu (menit)')
ax5.set_ylabel('Total Skor')
ax5.legend(fontsize=9)

plt.savefig(path('plot_eda.png'), dpi=150, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()
print("✅ Plot 1 (EDA) saved")

# ═══════════════════════════════════════════════════════
# GAMBAR 2 — HEATMAP KORELASI
# ═══════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(14, 10))
fig.patch.set_facecolor('#0f0f0f')
ax.set_facecolor('#0f0f0f')
corr = df[FITUR].corr()
mask = np.triu(np.ones_like(corr, dtype=bool))
cmap = sns.diverging_palette(220, 10, as_cmap=True)
sns.heatmap(corr, mask=mask, cmap=cmap, vmax=1, vmin=-1, center=0,
            annot=True, fmt='.2f', annot_kws={'size': 8, 'color': 'white'},
            linewidths=0.5, linecolor='#333', ax=ax, cbar_kws={'shrink': 0.8})
ax.set_title('Heatmap Korelasi Antar Fitur', fontsize=15, fontweight='bold', pad=15)
plt.xticks(rotation=45, ha='right', fontsize=9)
plt.yticks(rotation=0, fontsize=9)
plt.tight_layout()
plt.savefig(path('plot_korelasi.png'), dpi=150, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()
print("✅ Plot 2 (Korelasi) saved")

# ═══════════════════════════════════════════════════════
# GAMBAR 3 — CARI CLUSTER OPTIMAL
# ═══════════════════════════════════════════════════════
scaler = MinMaxScaler()
X = scaler.fit_transform(df[FITUR])

K_RANGE = range(2, 10)
results = []
for k in K_RANGE:
    km = KMeans(n_clusters=k, init='k-means++', n_init=20, random_state=42)
    labels = km.fit_predict(X)
    results.append({
        'k': k,
        'inertia': km.inertia_,
        'silhouette': silhouette_score(X, labels),
        'davies_bouldin': davies_bouldin_score(X, labels),
        'calinski': calinski_harabasz_score(X, labels),
    })

res_df = pd.DataFrame(results)
k_optimal = int(res_df.loc[res_df['silhouette'].idxmax(), 'k'])
print(f"\n📌 K optimal (Silhouette tertinggi): {k_optimal}")
print(res_df.to_string(index=False))

fig, axes = plt.subplots(1, 3, figsize=(18, 5))
fig.patch.set_facecolor('#0f0f0f')
fig.suptitle('Evaluasi Jumlah Cluster Optimal', fontsize=16, fontweight='bold')

ax = axes[0]
ax.plot(res_df['k'], res_df['inertia'], 'o-', color='#b4ffec', linewidth=2, markersize=8)
ax.axvline(k_optimal, color='#ff6b6b', linestyle='--', linewidth=1.5, label=f'K optimal = {k_optimal}')
ax.set_title('Elbow Method (Inertia)', fontsize=13)
ax.set_xlabel('Jumlah Cluster (k)')
ax.set_ylabel('Inertia')
ax.legend()

ax = axes[1]
bars = ax.bar(res_df['k'], res_df['silhouette'],
              color=['#ff6b6b' if k == k_optimal else '#c8b4ff' for k in res_df['k']],
              edgecolor='#0f0f0f', alpha=0.85)
ax.set_title('Silhouette Score (lebih tinggi lebih baik)', fontsize=13)
ax.set_xlabel('Jumlah Cluster (k)')
ax.set_ylabel('Silhouette Score')
for bar, val in zip(bars, res_df['silhouette']):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.005,
            f'{val:.3f}', ha='center', va='bottom', fontsize=9, color='white')

ax = axes[2]
bars = ax.bar(res_df['k'], res_df['davies_bouldin'],
              color=['#ff6b6b' if k == k_optimal else '#ffd166' for k in res_df['k']],
              edgecolor='#0f0f0f', alpha=0.85)
ax.set_title('Davies-Bouldin Index (lebih rendah lebih baik)', fontsize=13)
ax.set_xlabel('Jumlah Cluster (k)')
ax.set_ylabel('DB Index')
for bar, val in zip(bars, res_df['davies_bouldin']):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.005,
            f'{val:.3f}', ha='center', va='bottom', fontsize=9, color='white')

plt.tight_layout()
plt.savefig(path('plot_cluster_optimal.png'), dpi=150, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()
print("✅ Plot 3 (Cluster Optimal) saved")

# ═══════════════════════════════════════════════════════
# GAMBAR 4 — GRID SEARCH PARAMETER KMEANS
# ═══════════════════════════════════════════════════════
print("\n⏳ Grid Search parameter KMeans...")
param_grid = {
    'n_clusters': [2, 3, 4, 5],
    'init': ['k-means++', 'random'],
    'max_iter': [100, 300, 500],
    'n_init': [10, 20],
}
gs_results = []
best_score  = -1
best_params = {}

for nc in param_grid['n_clusters']:
    for init in param_grid['init']:
        for max_iter in param_grid['max_iter']:
            for n_init in param_grid['n_init']:
                km = KMeans(n_clusters=nc, init=init, max_iter=max_iter,
                            n_init=n_init, random_state=42)
                labels = km.fit_predict(X)
                sil = silhouette_score(X, labels)
                db  = davies_bouldin_score(X, labels)
                gs_results.append({
                    'n_clusters': nc, 'init': init,
                    'max_iter': max_iter, 'n_init': n_init,
                    'silhouette': round(sil, 4),
                    'davies_bouldin': round(db, 4),
                })
                if sil > best_score:
                    best_score  = sil
                    best_params = {'n_clusters': nc, 'init': init,
                                   'max_iter': max_iter, 'n_init': n_init}

gs_df = pd.DataFrame(gs_results).sort_values('silhouette', ascending=False)
print(f"\n🏆 Parameter terbaik: {best_params}")
print(f"   Silhouette Score terbaik: {best_score:.4f}")
print(f"\nTop 10 kombinasi:")
print(gs_df.head(10).to_string(index=False))

fig, axes = plt.subplots(1, 2, figsize=(16, 6))
fig.patch.set_facecolor('#0f0f0f')
fig.suptitle('Grid Search Parameter KMeans', fontsize=16, fontweight='bold')

for n_init_val, ax in zip([10, 20], axes):
    subset = gs_df[gs_df['n_init'] == n_init_val]
    pivot  = subset.groupby(['n_clusters', 'init'])['silhouette'].max().unstack()
    sns.heatmap(pivot, annot=True, fmt='.4f', cmap='YlOrRd',
                ax=ax, linewidths=0.5, linecolor='#333',
                annot_kws={'size': 11, 'color': 'black'})
    ax.set_title(f'n_init = {n_init_val}', fontsize=13)
    ax.set_xlabel('Init Method')
    ax.set_ylabel('n_clusters')

plt.tight_layout()
plt.savefig(path('plot_gridsearch.png'), dpi=150, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()
print("✅ Plot 4 (Grid Search) saved")

# ═══════════════════════════════════════════════════════
# GAMBAR 5 — PERBANDINGAN ALGORITMA
# ═══════════════════════════════════════════════════════
print("\n⏳ Membandingkan algoritma clustering...")
algos = {
    'KMeans (k-means++)': KMeans(
        n_clusters=best_params['n_clusters'], init=best_params['init'],
        max_iter=best_params['max_iter'], n_init=best_params['n_init'], random_state=42),
    'KMeans (random)': KMeans(
        n_clusters=best_params['n_clusters'], init='random',
        max_iter=best_params['max_iter'], n_init=best_params['n_init'], random_state=42),
    'Agglomerative (ward)': AgglomerativeClustering(
        n_clusters=best_params['n_clusters'], linkage='ward'),
    'Agglomerative (complete)': AgglomerativeClustering(
        n_clusters=best_params['n_clusters'], linkage='complete'),
}

algo_results = []
for name, model in algos.items():
    labels = model.fit_predict(X)
    sil = silhouette_score(X, labels)
    db  = davies_bouldin_score(X, labels)
    ch  = calinski_harabasz_score(X, labels)
    algo_results.append({'Algoritma': name, 'Silhouette': round(sil, 4),
                         'Davies-Bouldin': round(db, 4), 'Calinski-Harabasz': round(ch, 1)})
    print(f"  {name:30s} | Sil: {sil:.4f} | DB: {db:.4f} | CH: {ch:.1f}")

algo_df   = pd.DataFrame(algo_results)
best_algo = algo_df.loc[algo_df['Silhouette'].idxmax(), 'Algoritma']
print(f"\n🏆 Algoritma terbaik: {best_algo}")

fig, axes = plt.subplots(1, 3, figsize=(18, 6))
fig.patch.set_facecolor('#0f0f0f')
fig.suptitle('Perbandingan Algoritma Clustering', fontsize=16, fontweight='bold')

metrics_info = [('Silhouette', True), ('Davies-Bouldin', False), ('Calinski-Harabasz', True)]
for ax, (metric, higher_better) in zip(axes, metrics_info):
    vals      = algo_df[metric].values
    names     = algo_df['Algoritma'].tolist()
    best_idx  = vals.argmax() if higher_better else vals.argmin()
    colors    = ['#ff6b6b' if i == best_idx else '#c8b4ff' for i in range(len(vals))]
    bars      = ax.bar(names, vals, color=colors, edgecolor='#0f0f0f', alpha=0.85)
    direction = '(lebih tinggi lebih baik)' if higher_better else '(lebih rendah lebih baik)'
    ax.set_title(f'{metric}\n{direction}', fontsize=11)
    ax.set_ylabel('Nilai')
    for bar, val in zip(bars, vals):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(vals)*0.01,
                f'{val:.3f}', ha='center', va='bottom', fontsize=9, color='white')
    ax.tick_params(axis='x', labelsize=8)
    plt.setp(ax.get_xticklabels(), rotation=15, ha='right')

plt.tight_layout()
plt.savefig(path('plot_perbandingan_algo.png'), dpi=150, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()
print("✅ Plot 5 (Perbandingan Algoritma) saved")

# ═══════════════════════════════════════════════════════
# GAMBAR 6 — HASIL CLUSTERING FINAL (PCA 2D)
# ═══════════════════════════════════════════════════════
best_model   = KMeans(n_clusters=best_params['n_clusters'], init=best_params['init'],
                      max_iter=best_params['max_iter'], n_init=best_params['n_init'],
                      random_state=42)
final_labels = best_model.fit_predict(X)
df['cluster'] = final_labels

cluster_means = df.groupby('cluster')['total_score'].mean().sort_values()
label_names   = ['Beginner', 'Intermediate', 'Advanced']
label_map     = {cid: label_names[rank] for rank, cid in enumerate(cluster_means.index)}
df['cluster_label'] = df['cluster'].map(label_map)

pca           = PCA(n_components=2, random_state=42)
X_pca         = pca.fit_transform(X)
var_explained = pca.explained_variance_ratio_
cluster_pal   = {'Beginner': '#ff6b6b', 'Intermediate': '#ffd166', 'Advanced': '#b4ffec'}

fig, axes = plt.subplots(1, 2, figsize=(16, 7))
fig.patch.set_facecolor('#0f0f0f')
fig.suptitle('Hasil Clustering Final - Visualisasi PCA 2D', fontsize=16, fontweight='bold')

for ax, title, col in zip(axes,
    ['Hasil K-Means Clustering', 'Label Kelompok Sebenarnya (Validasi)'],
    ['cluster_label', 'label_kelompok']):
    for grp, color in cluster_pal.items():
        mask = df[col] == grp
        ax.scatter(X_pca[mask, 0], X_pca[mask, 1],
                   c=color, s=25, alpha=0.65, label=grp, edgecolors='none')
    ax.set_title(title, fontsize=13)
    ax.set_xlabel(f'PC1 ({var_explained[0]*100:.1f}% variansi)')
    ax.set_ylabel(f'PC2 ({var_explained[1]*100:.1f}% variansi)')
    ax.legend(fontsize=10)

plt.tight_layout()
plt.savefig(path('plot_hasil_clustering.png'), dpi=150, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()
print("✅ Plot 6 (Hasil Clustering) saved")

# ═══════════════════════════════════════════════════════
# SIMPAN DATASET FINAL + RINGKASAN
# ═══════════════════════════════════════════════════════
df.to_csv(path('dataset_quiz_final.csv'), index=False)

print("\n" + "="*55)
print("RINGKASAN HASIL ANALISIS")
print("="*55)
print(f"  Total data            : {len(df)}")
print(f"  Jumlah fitur          : {len(FITUR)}")
print(f"  K optimal             : {k_optimal}")
print(f"  Parameter terbaik     : {best_params}")
print(f"  Silhouette Score final: {silhouette_score(X, final_labels):.4f}")
print(f"  Davies-Bouldin final  : {davies_bouldin_score(X, final_labels):.4f}")
print(f"\n  Distribusi cluster hasil:")
print(df['cluster_label'].value_counts().to_string())
print("="*55)
print(f"\n✅ Semua file tersimpan di: {BASE_DIR}")
