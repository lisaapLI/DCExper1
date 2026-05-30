"""
Rule-Based Recommendation System — Kalkulus Purcell Edisi 9
Materi: Limit, Turunan, Aplikasi Turunan, Integral Tentu, Teknik Integrasi, Integral Lipat
"""

THRESHOLD_LEMAH  = 60
THRESHOLD_SEDANG = 80

RECOMMENDATIONS = {
    'Limit': {
        'lemah': [
            { 'judul': 'Khan Academy — Limits and Continuity', 'url': 'https://www.khanacademy.org/math/calculus-1/cs1-limits-and-continuity', 'tipe': 'Video', 'deskripsi': 'Pelajari konsep limit dari dasar hingga mahir secara gratis dan interaktif' },
            { 'judul': '3Blue1Brown — Essence of Calculus: Limits', 'url': 'https://www.youtube.com/watch?v=WUvTyaaNkzM', 'tipe': 'Video', 'deskripsi': 'Pemahaman intuitif limit dengan animasi visual yang memukau' },
            { 'judul': 'Purcell Bab 1 — Latihan Soal Limit', 'url': None, 'tipe': 'Latihan', 'deskripsi': 'Kerjakan ulang soal-soal Bab 1 Purcell dimulai dari latihan 1.1 hingga 1.6' },
        ],
        'sedang': [
            { 'judul': "Paul's Online Notes — Limits", 'url': 'https://tutorial.math.lamar.edu/Classes/CalcI/limitsIntro.aspx', 'tipe': 'Artikel', 'deskripsi': 'Catatan lengkap limit dengan contoh soal dan pembahasan detail' },
        ],
    },
    'Turunan': {
        'lemah': [
            { 'judul': 'Khan Academy — Derivatives', 'url': 'https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules', 'tipe': 'Video', 'deskripsi': 'Pelajari definisi dan aturan-aturan dasar turunan secara sistematis' },
            { 'judul': '3Blue1Brown — Derivative Formulas Through Geometry', 'url': 'https://www.youtube.com/watch?v=S0_qX4VJhMQ', 'tipe': 'Video', 'deskripsi': 'Visualisasi geometri di balik rumus-rumus turunan' },
            { 'judul': 'Purcell Bab 2 — Latihan Soal Turunan', 'url': None, 'tipe': 'Latihan', 'deskripsi': 'Kerjakan latihan 2.1-2.7 di Purcell untuk memperkuat pemahaman turunan' },
        ],
        'sedang': [
            { 'judul': 'MIT OCW — Differentiation', 'url': 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/1.-differentiation/', 'tipe': 'Latihan', 'deskripsi': 'Materi dan problem set turunan dari MIT OpenCourseWare' },
        ],
    },
    'Aplikasi Turunan': {
        'lemah': [
            { 'judul': 'Khan Academy — Applications of Derivatives', 'url': 'https://www.khanacademy.org/math/calculus-1/cs1-applications-of-derivatives', 'tipe': 'Video', 'deskripsi': 'Aplikasi turunan: nilai ekstrim, optimasi, dan laju perubahan terkait' },
            { 'judul': 'Organic Chemistry Tutor — Optimization Problems', 'url': 'https://www.youtube.com/watch?v=q3G4oFfXVQQ', 'tipe': 'Video', 'deskripsi': 'Panduan langkah-demi-langkah menyelesaikan soal optimasi kalkulus' },
            { 'judul': 'Purcell Bab 3 — Latihan Aplikasi Turunan', 'url': None, 'tipe': 'Latihan', 'deskripsi': 'Fokus pada latihan soal optimasi dan laju perubahan di Bab 3 Purcell' },
        ],
        'sedang': [
            { 'judul': "Paul's Online Notes — Applications of Derivatives", 'url': 'https://tutorial.math.lamar.edu/Classes/CalcI/DerivativeApps.aspx', 'tipe': 'Artikel', 'deskripsi': 'Pembahasan lengkap aplikasi turunan dengan contoh soal bervariasi' },
        ],
    },
    'Integral Tentu': {
        'lemah': [
            { 'judul': 'Khan Academy — Integral Calculus', 'url': 'https://www.khanacademy.org/math/integral-calculus', 'tipe': 'Video', 'deskripsi': 'Teorema Dasar Kalkulus, jumlah Riemann, dan sifat-sifat integral tentu' },
            { 'judul': '3Blue1Brown — Integration and the fundamental theorem', 'url': 'https://www.youtube.com/watch?v=rfG8ce4nNh0', 'tipe': 'Video', 'deskripsi': 'Visualisasi intuitif integral tentu sebagai luas di bawah kurva' },
            { 'judul': 'Purcell Bab 4 — Latihan Integral Tentu', 'url': None, 'tipe': 'Latihan', 'deskripsi': 'Kerjakan latihan sifat integral tentu dan Teorema Dasar Kalkulus di Bab 4' },
        ],
        'sedang': [
            { 'judul': 'MIT OCW — Integration', 'url': 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/3.-integration/', 'tipe': 'Latihan', 'deskripsi': 'Problem set integral tentu dari MIT dengan solusi lengkap' },
        ],
    },
    'Teknik Integrasi': {
        'lemah': [
            { 'judul': 'Khan Academy — Integration Techniques', 'url': 'https://www.khanacademy.org/math/integral-calculus/ic-integration', 'tipe': 'Video', 'deskripsi': 'Teknik integrasi: parsial, substitusi trigonometri, dan pecahan parsial' },
            { 'judul': 'Professor Leonard — Integration by Parts', 'url': 'https://www.youtube.com/watch?v=wDsqCH5AQms', 'tipe': 'Video', 'deskripsi': 'Penjelasan mendalam integrasi parsial dengan banyak contoh soal' },
            { 'judul': 'Purcell Bab 7 — Latihan Teknik Integrasi', 'url': None, 'tipe': 'Latihan', 'deskripsi': 'Kerjakan latihan substitusi, parsial, dan pecahan parsial di Bab 7' },
        ],
        'sedang': [
            { 'judul': 'MIT OCW — Techniques of Integration', 'url': 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/', 'tipe': 'Latihan', 'deskripsi': 'Problem set teknik integrasi dari MIT dengan solusi lengkap' },
        ],
    },
    'Integral Lipat': {
        'lemah': [
            { 'judul': 'Khan Academy — Double Integrals', 'url': 'https://www.khanacademy.org/math/multivariable-calculus/integrating-multivariable-functions', 'tipe': 'Video', 'deskripsi': 'Pelajari integral lipat dua dari definisi hingga penerapan koordinat polar' },
            { 'judul': '3Blue1Brown — Double Integrals', 'url': 'https://www.youtube.com/watch?v=85zGpKa6vEY', 'tipe': 'Video', 'deskripsi': 'Visualisasi intuitif integral lipat dua dan maknanya secara geometri' },
            { 'judul': 'Purcell Bab 13 — Latihan Integral Lipat', 'url': None, 'tipe': 'Latihan', 'deskripsi': 'Kerjakan soal-soal integral lipat dua di Bab 13 Purcell secara bertahap' },
        ],
        'sedang': [
            { 'judul': "Paul's Online Notes — Multiple Integrals", 'url': 'https://tutorial.math.lamar.edu/Classes/CalcIII/MultipleIntegrals.aspx', 'tipe': 'Artikel', 'deskripsi': 'Referensi integral lipat dengan pembahasan perubahan urutan dan koordinat polar' },
        ],
    },
}


def get_recommendations(scores: dict) -> dict:
    rekomendasi = {}
    lemah_list  = []
    sedang_list = []

    for materi, skor in scores.items():
        if materi not in RECOMMENDATIONS:
            continue
        if skor < THRESHOLD_LEMAH:
            lemah_list.append(materi)
            rekomendasi[materi] = { 'level': 'lemah', 'skor': skor, 'sumber': RECOMMENDATIONS[materi]['lemah'] }
        elif skor < THRESHOLD_SEDANG:
            sedang_list.append(materi)
            rekomendasi[materi] = { 'level': 'sedang', 'skor': skor, 'sumber': RECOMMENDATIONS[materi]['sedang'] }

    materi_terlemah = min(scores, key=scores.get) if scores else '-'

    if lemah_list:
        ringkasan = f"Fokus perbaiki materi: {', '.join(lemah_list)}"
    elif sedang_list:
        ringkasan = f"Tingkatkan pemahaman di: {', '.join(sedang_list)}"
    else:
        ringkasan = "Performa sangat baik! Terus latihan soal tingkat lanjut dari Purcell."

    return {
        'materi_terlemah': materi_terlemah,
        'rekomendasi':     rekomendasi,
        'ringkasan':       ringkasan,
        'lemah_count':     len(lemah_list),
        'sedang_count':    len(sedang_list),
    }
