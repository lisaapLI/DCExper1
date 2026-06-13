"""
Analyzer - Eureka Quiz
=======================
Menghitung skor per materi, per kesulitan,
memanggil clustering, dan generate analisis kalimat per materi.
"""
from ml.clustering     import predict_category
from ml.recommendation import get_recommendations

MATERI_LIST    = ['Limit', 'Turunan', 'Aplikasi Turunan',
                  'Integral Tentu', 'Teknik Integrasi', 'Integral Lipat']
KESULITAN_LIST = ['Mudah', 'Sedang', 'Sulit']

ANALISIS_MATERI = {
    'Limit': {
        'sangat_rendah': "Penguasaan materi Limit masih sangat lemah. Kamu perlu memulai dari dasar: definisi limit, pendekatan nilai limit dari kiri dan kanan, serta limit fungsi aljabar sederhana.",
        'rendah':        "Pemahamanmu tentang Limit masih perlu diperkuat. Fokus pada limit satu sisi, limit tak hingga, dan sifat-sifat limit dasar.",
        'sedang':        "Penguasaan Limit sudah cukup, namun masih ada ruang untuk berkembang. Latih soal-soal limit trigonometri dan limit bentuk tak tentu (0/0 dan ∞/∞).",
        'baik':          "Pemahamanmu tentang Limit sudah baik. Tingkatkan dengan mempelajari kaidah L'Hôpital dan limit fungsi komposisi.",
        'sangat_baik':   "Penguasaan materi Limit sangat baik! Pertahankan dan perluas dengan topik kekontinuan fungsi.",
    },
    'Turunan': {
        'sangat_rendah': "Penguasaan materi Turunan masih sangat lemah. Mulailah dari definisi turunan sebagai limit, kemudian pelajari aturan dasar seperti aturan pangkat dan konstanta.",
        'rendah':        "Pemahaman Turunan perlu diperkuat. Fokus pada aturan perkalian, pembagian, dan aturan rantai yang merupakan fondasi penting.",
        'sedang':        "Penguasaan Turunan sudah cukup. Tingkatkan dengan berlatih turunan fungsi trigonometri, eksponensial, dan logaritma.",
        'baik':          "Pemahamanmu tentang Turunan sudah baik. Kembangkan dengan mempelajari turunan tingkat tinggi dan turunan implisit.",
        'sangat_baik':   "Penguasaan materi Turunan sangat baik! Pertahankan kemampuanmu.",
    },
    'Aplikasi Turunan': {
        'sangat_rendah': "Penguasaan Aplikasi Turunan masih sangat lemah. Mulai dengan memahami konsep nilai maksimum dan minimum lokal menggunakan uji turunan pertama.",
        'rendah':        "Pemahamanmu tentang Aplikasi Turunan perlu ditingkatkan. Pelajari cara mencari titik kritis, interval naik-turun, dan nilai ekstrem.",
        'sedang':        "Penguasaan Aplikasi Turunan sudah cukup. Latih soal optimisasi (luas maksimum, biaya minimum) dan masalah laju yang berkaitan.",
        'baik':          "Pemahamanmu tentang Aplikasi Turunan sudah baik. Perdalam dengan mempelajari teorema nilai rata-rata dan aproksimasi linear.",
        'sangat_baik':   "Penguasaan Aplikasi Turunan sangat baik! Pertahankan kemampuanmu.",
    },
    'Integral Tentu': {
        'sangat_rendah': "Penguasaan Integral Tentu masih sangat lemah. Mulailah dengan memahami konsep antiturunan dan Teorema Dasar Kalkulus bagian pertama.",
        'rendah':        "Pemahamanmu tentang Integral Tentu perlu diperkuat. Fokus pada sifat-sifat integral tentu dan Teorema Dasar Kalkulus bagian kedua.",
        'sedang':        "Penguasaan Integral Tentu sudah cukup. Tingkatkan dengan berlatih menghitung luas daerah dan volume benda putar.",
        'baik':          "Pemahamanmu tentang Integral Tentu sudah baik. Kembangkan dengan mempelajari aplikasi integral dalam fisika dan geometri.",
        'sangat_baik':   "Penguasaan Integral Tentu sangat baik! Pertahankan kemampuanmu.",
    },
    'Teknik Integrasi': {
        'sangat_rendah': "Penguasaan Teknik Integrasi masih sangat lemah. Mulailah dari teknik substitusi sederhana — ini fondasi sebelum teknik yang lebih kompleks.",
        'rendah':        "Pemahamanmu tentang Teknik Integrasi perlu ditingkatkan. Kuasai substitusi trigonometri dan integrasi parsial sebagai prioritas utama.",
        'sedang':        "Penguasaan Teknik Integrasi sudah cukup. Latih soal-soal integral dengan pecahan parsial dan kombinasi berbagai teknik.",
        'baik':          "Pemahamanmu tentang Teknik Integrasi sudah baik. Perkuat dengan mengenali pola integral dan memilih teknik yang tepat secara efisien.",
        'sangat_baik':   "Penguasaan Teknik Integrasi sangat baik! Pertahankan kemampuanmu.",
    },
    'Integral Lipat': {
        'sangat_rendah': "Penguasaan Integral Lipat masih sangat lemah. Mulailah dengan integral ganda pada daerah persegi panjang sebelum beralih ke daerah yang lebih kompleks.",
        'rendah':        "Pemahamanmu tentang Integral Lipat perlu diperkuat. Fokus pada cara menentukan batas integrasi dan urutan integrasi yang tepat.",
        'sedang':        "Penguasaan Integral Lipat sudah cukup. Tingkatkan dengan berlatih integral ganda menggunakan koordinat polar dan perubahan variabel.",
        'baik':          "Pemahamanmu tentang Integral Lipat sudah baik. Kembangkan dengan mempelajari integral lipat tiga dan aplikasinya.",
        'sangat_baik':   "Penguasaan Integral Lipat sangat baik! Pertahankan kemampuanmu.",
    },
}

def _get_level(skor):
    if skor < 20:   return 'sangat_rendah'
    elif skor < 40: return 'rendah'
    elif skor < 60: return 'sedang'
    elif skor < 80: return 'baik'
    else:           return 'sangat_baik'

def _get_label(skor):
    if skor < 20:   return 'Sangat Lemah'
    elif skor < 40: return 'Lemah'
    elif skor < 60: return 'Cukup'
    elif skor < 80: return 'Baik'
    else:           return 'Sangat Baik'

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

    materi_scores = {}
    for m in MATERI_LIST:
        stat = materi_stats[m]
        materi_scores[m] = round(stat['benar'] / stat['total'] * 100, 2) if stat['total'] else 0.0

    kesulitan_scores = {}
    for k in KESULITAN_LIST:
        stat = kesulitan_stats[k]
        kesulitan_scores[k] = round(stat['benar'] / stat['total'] * 100, 2) if stat['total'] else 0.0

    analisis_detail = {}
    for m in MATERI_LIST:
        if materi_stats[m]['total'] > 0:
            skor  = materi_scores[m]
            level = _get_level(skor)
            analisis_detail[m] = {
                'skor':     skor,
                'label':    _get_label(skor),
                'analisis': ANALISIS_MATERI[m][level],
            }

    active_scores = {m: s for m, s in materi_scores.items() if materi_stats[m]['total'] > 0}

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
        'analisis_detail':    analisis_detail,
        'materi_terlemah':    rec_result['materi_terlemah'],
        'kategori_kemampuan': cluster_result['kategori'],
        'cluster_label':      cluster_result['cluster_label'],
        'topik_terlemah':     cluster_result['topik_terlemah'],
        'rekomendasi':        rec_result['rekomendasi'],
        'ringkasan':          rec_result['ringkasan'],
        'answer_details':     answer_details,
    }