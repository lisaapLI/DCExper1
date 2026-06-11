"""
Analyzer - Eureka Quiz
=======================
Menghitung skor per materi, per kesulitan,
lalu memanggil clustering dengan 6 fitur sub-topik saja.
"""
from ml.clustering     import predict_category
from ml.recommendation import get_recommendations

MATERI_LIST    = ['Limit', 'Turunan', 'Aplikasi Turunan',
                  'Integral Tentu', 'Teknik Integrasi', 'Integral Lipat']
KESULITAN_LIST = ['Mudah', 'Sedang', 'Sulit']

# Mapping nama materi di DB -> key fitur clustering
MATERI_KEY_MAP = {
    'Limit':             'limit_score',
    'Turunan':           'turunan_score',
    'Aplikasi Turunan':  'aplikasi_turunan_score',
    'Integral Tentu':    'integral_tentu_score',
    'Teknik Integrasi':  'teknik_integrasi_score',
    'Integral Lipat':    'integral_lipat_score',
}

def analyze_quiz(answers: list, questions: list, waktu_detik: int) -> dict:
    q_map           = {q['id']: q for q in questions}
    materi_stats    = {m: {'benar': 0, 'total': 0} for m in MATERI_LIST}
    kesulitan_stats = {k: {'benar': 0, 'total': 0} for k in KESULITAN_LIST}
    jumlah_benar    = 0
    answer_details  = []

    for ans in answers:
        qid        = ans['question_id']
        q          = q_map.get(qid)
        if not q:
            continue
        materi     = q['materi']
        kesulitan  = q['tingkat_kesulitan']
        is_correct = ans['jawaban'].upper() == q['jawaban_benar'].upper()

        if materi in materi_stats:
            materi_stats[materi]['total'] += 1
            if is_correct:
                materi_stats[materi]['benar'] += 1

        if kesulitan in kesulitan_stats:
            kesulitan_stats[kesulitan]['total'] += 1
            if is_correct:
                kesulitan_stats[kesulitan]['benar'] += 1

        if is_correct:
            jumlah_benar += 1

        answer_details.append({
            'question_id':       qid,
            'jawaban_mahasiswa': ans['jawaban'].upper(),
            'jawaban_benar':     q['jawaban_benar'],
            'is_correct':        is_correct,
            'materi':            materi,
            'kesulitan':         kesulitan,
        })

    total_soal   = len(answer_details)
    jumlah_salah = total_soal - jumlah_benar
    total_score  = round((jumlah_benar / total_soal * 100), 2) if total_soal else 0

    # Skor per materi (0-100)
    materi_scores = {}
    for m in MATERI_LIST:
        stat = materi_stats[m]
        materi_scores[m] = round(stat['benar'] / stat['total'] * 100, 2) if stat['total'] else 0.0

    # Skor per kesulitan
    kesulitan_scores = {}
    for k in KESULITAN_LIST:
        stat = kesulitan_stats[k]
        kesulitan_scores[k] = round(stat['benar'] / stat['total'] * 100, 2) if stat['total'] else 0.0

    # Hanya materi yang ada soalnya
    active_scores = {m: s for m, s in materi_scores.items() if materi_stats[m]['total'] > 0}

    # Clustering — hanya 6 sub-topik (sesuai rekomendasi advisor)
    cluster_result = predict_category(
        limit_score            = materi_scores.get('Limit', 0),
        turunan_score          = materi_scores.get('Turunan', 0),
        aplikasi_turunan_score = materi_scores.get('Aplikasi Turunan', 0),
        integral_tentu_score   = materi_scores.get('Integral Tentu', 0),
        teknik_integrasi_score = materi_scores.get('Teknik Integrasi', 0),
        integral_lipat_score   = materi_scores.get('Integral Lipat', 0),
    )

    rec_result = get_recommendations(active_scores)

    return {
        'total_score':        total_score,
        'jumlah_benar':       jumlah_benar,
        'jumlah_salah':       jumlah_salah,
        'total_soal':         total_soal,
        'materi_scores':      active_scores,
        'kesulitan_scores':   kesulitan_scores,
        'materi_terlemah':    rec_result['materi_terlemah'],
        'kategori_kemampuan': cluster_result['kategori'],
        'cluster_label':      cluster_result['cluster_label'],
        'topik_terlemah':     cluster_result['topik_terlemah'],
        'rekomendasi':        rec_result['rekomendasi'],
        'ringkasan':          rec_result['ringkasan'],
        'answer_details':     answer_details,
    }
