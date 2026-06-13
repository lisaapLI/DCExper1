"""
Rule-Based Recommendation System - Kalkulus Purcell Edisi 9
Semua link YouTube sudah diverifikasi aktif per Juni 2026.
Sumber: YouTube (terverifikasi), Paul's Online Notes, LibreTexts, MIT OCW
"""

THRESHOLD_LEMAH  = 60
THRESHOLD_SEDANG = 80

RECOMMENDATIONS = {
    'Limit': {
        'lemah': [
            {
                'judul': '3Blue1Brown - Limits (Essence of Calculus Ch.7)',
                'url': 'https://www.youtube.com/watch?v=kfF40MiS7zA',
                'tipe': 'Video',
                'deskripsi': 'Visualisasi intuitif konsep limit dan aturan L\'Hopital dengan animasi matematis. Gratis, tanpa login.',
                'materi': 'Limit',
            },
            {
                'judul': 'Organic Chemistry Tutor - Limits and Continuity',
                'url': 'https://www.youtube.com/watch?v=TglD4Y6lmQk',
                'tipe': 'Video',
                'deskripsi': 'Penjelasan lengkap limit dari dasar: evaluasi limit, limit satu sisi, limit tak hingga, dan kekontinuan fungsi.',
                'materi': 'Limit',
            },
            {
                'judul': "Paul's Online Notes - Introduction to Limits",
                'url': 'https://tutorial.math.lamar.edu/Classes/CalcI/limitsIntro.aspx',
                'tipe': 'Artikel',
                'deskripsi': 'Catatan kuliah lengkap limit dengan contoh soal dan pembahasan bertahap. Gratis, tanpa login.',
                'materi': 'Limit',
            },
            {
                'judul': 'LibreTexts - Limits (OpenStax Calculus Bab 2)',
                'url': 'https://math.libretexts.org/Bookshelves/Calculus/Calculus_(OpenStax)/02%3A_Limits',
                'tipe': 'Buku',
                'deskripsi': 'Buku teks kalkulus open-source gratis setara Purcell Bab 1. Lengkap dengan definisi, contoh, dan latihan soal.',
                'materi': 'Limit',
            },
            {
                'judul': 'Purcell Edisi 9 - Bab 1: Limit dan Kekontinuan',
                'url': None,
                'tipe': 'Buku',
                'deskripsi': 'Kerjakan latihan Purcell Bab 1.1 (definisi limit), 1.2 (limit satu sisi), 1.3 (limit tak hingga), dan 1.5 (kekontinuan).',
                'materi': 'Limit',
            },
        ],
        'sedang': [
            {
                'judul': 'MIT OCW - Single Variable Calculus: Limits',
                'url': 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/',
                'tipe': 'Latihan',
                'deskripsi': 'Problem set dan solusi lengkap dari MIT. Fokus pada bagian Limits untuk pendalaman. Gratis, tanpa login.',
                'materi': 'Limit',
            },
        ],
    },

    'Turunan': {
        'lemah': [
            {
                'judul': '3Blue1Brown - The Paradox of the Derivative (Essence of Calculus Ch.2)',
                'url': 'https://www.youtube.com/watch?v=9vKqVkMQHKk',
                'tipe': 'Video',
                'deskripsi': 'Penjelasan intuitif konsep turunan sebagai laju perubahan sesaat dengan visualisasi animasi.',
                'materi': 'Turunan',
            },
            {
                'judul': 'Organic Chemistry Tutor - Derivatives Full Lecture',
                'url': 'https://www.youtube.com/watch?v=5yfh5cf4-0Y',
                'tipe': 'Video',
                'deskripsi': 'Lengkap: definisi turunan, aturan pangkat, perkalian, pembagian, rantai, trigonometri, dan turunan implisit.',
                'materi': 'Turunan',
            },
            {
                'judul': "Paul's Online Notes - Differentiation Formulas",
                'url': 'https://tutorial.math.lamar.edu/Classes/CalcI/DiffFormulas.aspx',
                'tipe': 'Artikel',
                'deskripsi': 'Daftar lengkap rumus turunan dengan penjelasan dan contoh penerapan. Gratis, tanpa login.',
                'materi': 'Turunan',
            },
            {
                'judul': 'LibreTexts - Derivatives (OpenStax Calculus Bab 3)',
                'url': 'https://math.libretexts.org/Bookshelves/Calculus/Calculus_(OpenStax)/03%3A_Derivatives',
                'tipe': 'Buku',
                'deskripsi': 'Buku teks kalkulus open-source gratis setara Purcell Bab 2. Lengkap dengan teori, contoh, dan soal latihan.',
                'materi': 'Turunan',
            },
            {
                'judul': 'Purcell Edisi 9 - Bab 2: Turunan',
                'url': None,
                'tipe': 'Buku',
                'deskripsi': 'Kerjakan latihan Purcell Bab 2.1 (definisi turunan), 2.2 (aturan turunan), 2.3 (aturan rantai), 2.5 (turunan trig).',
                'materi': 'Turunan',
            },
        ],
        'sedang': [
            {
                'judul': 'MIT OCW - Differentiation',
                'url': 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/1.-differentiation/',
                'tipe': 'Latihan',
                'deskripsi': 'Problem set turunan dari MIT dengan solusi lengkap. Fokus aturan rantai dan turunan implisit. Gratis, tanpa login.',
                'materi': 'Turunan',
            },
        ],
    },

    'Aplikasi Turunan': {
        'lemah': [
            {
                'judul': 'Prof. Leonard - Calculus 1 Lec 3.1: Increasing/Decreasing & Concavity',
                'url': 'https://www.youtube.com/watch?v=Mx39JbbzEAo',
                'tipe': 'Video',
                'deskripsi': 'Penjelasan mendalam interval naik-turun, cekung-cembung grafik fungsi menggunakan turunan pertama dan kedua.',
                'materi': 'Aplikasi Turunan',
            },
            {
                'judul': 'Organic Chemistry Tutor - Optimization Problems Calculus',
                'url': 'https://www.youtube.com/watch?v=q3G4oFfXVQQ',
                'tipe': 'Video',
                'deskripsi': 'Panduan langkah demi langkah menyelesaikan soal optimasi nilai maksimum dan minimum dengan banyak contoh.',
                'materi': 'Aplikasi Turunan',
            },
            {
                'judul': "Paul's Online Notes - Applications of Derivatives",
                'url': 'https://tutorial.math.lamar.edu/Classes/CalcI/DerivativeApps.aspx',
                'tipe': 'Artikel',
                'deskripsi': 'Nilai kritis, interval naik-turun, nilai ekstrem absolut, dan optimasi. Gratis, tanpa login.',
                'materi': 'Aplikasi Turunan',
            },
            {
                'judul': 'LibreTexts - Applications of Derivatives (OpenStax Bab 4)',
                'url': 'https://math.libretexts.org/Bookshelves/Calculus/Calculus_(OpenStax)/04%3A_Applications_of_Derivatives',
                'tipe': 'Buku',
                'deskripsi': 'Buku teks open-source setara Purcell Bab 3. Mencakup uji turunan pertama, kedua, optimasi, dan laju terkait.',
                'materi': 'Aplikasi Turunan',
            },
            {
                'judul': 'Purcell Edisi 9 - Bab 3: Aplikasi Turunan',
                'url': None,
                'tipe': 'Buku',
                'deskripsi': 'Kerjakan latihan Purcell Bab 3.1 (nilai maks & min), 3.2 (uji turunan pertama), 3.4 (optimasi), 3.7 (laju terkait).',
                'materi': 'Aplikasi Turunan',
            },
        ],
        'sedang': [
            {
                'judul': 'MIT OCW - Applications of Differentiation',
                'url': 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/2.-applications-of-differentiation/',
                'tipe': 'Latihan',
                'deskripsi': 'Problem set aplikasi turunan dari MIT dengan solusi lengkap. Cocok untuk latihan soal optimasi. Gratis, tanpa login.',
                'materi': 'Aplikasi Turunan',
            },
        ],
    },

    'Integral Tentu': {
        'lemah': [
            {
                'judul': '3Blue1Brown - Integration & Fundamental Theorem (Essence of Calculus Ch.8)',
                'url': 'https://www.youtube.com/watch?v=rfG8ce4nNh0',
                'tipe': 'Video',
                'deskripsi': 'Visualisasi intuitif integral tentu sebagai luas di bawah kurva dan Teorema Dasar Kalkulus.',
                'materi': 'Integral Tentu',
            },
            {
                'judul': 'Organic Chemistry Tutor - Integration & Antiderivatives',
                'url': 'https://www.youtube.com/watch?v=o75AqTInKDU',
                'tipe': 'Video',
                'deskripsi': 'Penjelasan lengkap antiturunan, integral tentu, Teorema Dasar Kalkulus, dan teknik substitusi dasar.',
                'materi': 'Integral Tentu',
            },
            {
                'judul': "Paul's Online Notes - The Definite Integral",
                'url': 'https://tutorial.math.lamar.edu/Classes/CalcI/DefnOfDefiniteIntegral.aspx',
                'tipe': 'Artikel',
                'deskripsi': 'Definisi, sifat-sifat, dan Teorema Dasar Kalkulus dengan contoh soal bertahap. Gratis, tanpa login.',
                'materi': 'Integral Tentu',
            },
            {
                'judul': 'LibreTexts - Integration (OpenStax Calculus Bab 5)',
                'url': 'https://math.libretexts.org/Bookshelves/Calculus/Calculus_(OpenStax)/05%3A_Integration',
                'tipe': 'Buku',
                'deskripsi': 'Buku teks open-source setara Purcell Bab 4. Lengkap dengan jumlah Riemann, Teorema Dasar Kalkulus, dan latihan soal.',
                'materi': 'Integral Tentu',
            },
            {
                'judul': 'Purcell Edisi 9 - Bab 4: Integral',
                'url': None,
                'tipe': 'Buku',
                'deskripsi': 'Kerjakan latihan Purcell Bab 4.1 (antiturunan), 4.3 (jumlah Riemann), 4.4 (Teorema Dasar Kalkulus), 4.5 (sifat integral tentu).',
                'materi': 'Integral Tentu',
            },
        ],
        'sedang': [
            {
                'judul': 'MIT OCW - Integration',
                'url': 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/3.-integration/',
                'tipe': 'Latihan',
                'deskripsi': 'Problem set integral tentu dari MIT dengan solusi lengkap. Fokus penerapan Teorema Dasar Kalkulus. Gratis, tanpa login.',
                'materi': 'Integral Tentu',
            },
        ],
    },

    'Teknik Integrasi': {
        'lemah': [
            {
                'judul': 'Prof. Leonard - Calculus 2 Lec 7.1: Integration By Parts',
                'url': 'https://www.youtube.com/watch?v=EOwjiFpDY_s',
                'tipe': 'Video',
                'deskripsi': 'Kuliah lengkap integrasi parsial (uv - ∫v du) dengan aturan LIATE dan banyak contoh soal bertahap.',
                'materi': 'Teknik Integrasi',
            },
            {
                'judul': 'Organic Chemistry Tutor - U-Substitution Integration',
                'url': 'https://www.youtube.com/watch?v=sdYdnpYn-1o',
                'tipe': 'Video',
                'deskripsi': 'Penjelasan lengkap teknik substitusi (u-substitution) sebagai teknik integrasi paling dasar dan penting.',
                'materi': 'Teknik Integrasi',
            },
            {
                'judul': "Paul's Online Notes - Integration Techniques",
                'url': 'https://tutorial.math.lamar.edu/Classes/CalcII/IntegrationTechniques.aspx',
                'tipe': 'Artikel',
                'deskripsi': 'Referensi lengkap substitusi, parsial, substitusi trigonometri, dan pecahan parsial. Gratis, tanpa login.',
                'materi': 'Teknik Integrasi',
            },
            {
                'judul': 'LibreTexts - Techniques of Integration (OpenStax Bab 7)',
                'url': 'https://math.libretexts.org/Bookshelves/Calculus/Calculus_(OpenStax)/07%3A_Techniques_of_Integration',
                'tipe': 'Buku',
                'deskripsi': 'Buku teks open-source setara Purcell Bab 7. Mencakup integrasi parsial, substitusi trig, dan pecahan parsial.',
                'materi': 'Teknik Integrasi',
            },
            {
                'judul': 'Purcell Edisi 9 - Bab 7: Teknik Pengintegralan',
                'url': None,
                'tipe': 'Buku',
                'deskripsi': 'Kerjakan latihan Purcell Bab 7.1 (substitusi), 7.2 (integrasi parsial), 7.3 (substitusi trigonometri), 7.5 (pecahan parsial).',
                'materi': 'Teknik Integrasi',
            },
        ],
        'sedang': [
            {
                'judul': 'MIT OCW - Techniques of Integration',
                'url': 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/4.-techniques-of-integration/',
                'tipe': 'Latihan',
                'deskripsi': 'Problem set teknik integrasi dari MIT dengan solusi. Cocok untuk latihan soal campuran berbagai teknik. Gratis, tanpa login.',
                'materi': 'Teknik Integrasi',
            },
        ],
    },

    'Integral Lipat': {
        'lemah': [
            {
                'judul': 'Prof. Leonard - Calculus 3 Lec 14.1: Introduction to Double Integrals',
                'url': 'https://www.youtube.com/watch?v=lv_awaaT6gY',
                'tipe': 'Video',
                'deskripsi': 'Pengantar integral lipat dua: definisi, interpretasi geometris, dan cara menentukan batas integrasi.',
                'materi': 'Integral Lipat',
            },
            {
                'judul': 'Prof. Leonard - Calculus 3 Lec 14.2: Solving Double Integrals',
                'url': 'https://www.youtube.com/watch?v=HxRG_phgGUw',
                'tipe': 'Video',
                'deskripsi': 'Teknik menyelesaikan integral ganda: urutan integrasi, perubahan batas, dan soal dengan daerah umum.',
                'materi': 'Integral Lipat',
            },
            {
                'judul': "Paul's Online Notes - Multiple Integrals",
                'url': 'https://tutorial.math.lamar.edu/Classes/CalcIII/MultipleIntegrals.aspx',
                'tipe': 'Artikel',
                'deskripsi': 'Integral lipat dua dan tiga, perubahan urutan integrasi, dan koordinat polar. Gratis, tanpa login.',
                'materi': 'Integral Lipat',
            },
            {
                'judul': 'LibreTexts - Multiple Integration (OpenStax Bab 15)',
                'url': 'https://math.libretexts.org/Bookshelves/Calculus/Calculus_(OpenStax)/15%3A_Multiple_Integration',
                'tipe': 'Buku',
                'deskripsi': 'Buku teks open-source setara Purcell Bab 13. Mencakup integral ganda, koordinat polar, dan integral triple.',
                'materi': 'Integral Lipat',
            },
            {
                'judul': 'Purcell Edisi 9 - Bab 13: Integral Lipat',
                'url': None,
                'tipe': 'Buku',
                'deskripsi': 'Kerjakan latihan Purcell Bab 13.1 (integral ganda persegi panjang), 13.2 (daerah umum), 13.3 (koordinat polar), 13.6 (integral triple).',
                'materi': 'Integral Lipat',
            },
        ],
        'sedang': [
            {
                'judul': 'MIT OCW - Multivariable Calculus: Multiple Integrals',
                'url': 'https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/',
                'tipe': 'Latihan',
                'deskripsi': 'Problem set integral lipat dari MIT dengan solusi. Fokus Unit 4: Double Integrals. Gratis, tanpa login.',
                'materi': 'Integral Lipat',
            },
        ],
    },
}


def get_recommendations(scores: dict) -> dict:
    rekomendasi_list = []
    lemah_list       = []
    sedang_list      = []

    for materi, skor in scores.items():
        if materi not in RECOMMENDATIONS:
            continue

        if skor < THRESHOLD_LEMAH:
            lemah_list.append(materi)
            for item in RECOMMENDATIONS[materi]['lemah']:
                rekomendasi_list.append({
                    'materi':    materi,
                    'level':     'lemah',
                    'skor':      skor,
                    'judul':     item['judul'],
                    'url':       item['url'],
                    'tipe':      item['tipe'],
                    'deskripsi': item['deskripsi'],
                })
        elif skor < THRESHOLD_SEDANG:
            sedang_list.append(materi)
            for item in RECOMMENDATIONS[materi]['sedang']:
                rekomendasi_list.append({
                    'materi':    materi,
                    'level':     'sedang',
                    'skor':      skor,
                    'judul':     item['judul'],
                    'url':       item['url'],
                    'tipe':      item['tipe'],
                    'deskripsi': item['deskripsi'],
                })

    materi_terlemah = min(scores, key=scores.get) if scores else '-'

    if lemah_list:
        ringkasan = f"Fokus perbaiki materi: {', '.join(lemah_list)}"
    elif sedang_list:
        ringkasan = f"Tingkatkan pemahaman di: {', '.join(sedang_list)}"
    else:
        ringkasan = "Performa sangat baik! Terus latihan soal tingkat lanjut."

    return {
        'materi_terlemah': materi_terlemah,
        'rekomendasi':     rekomendasi_list,
        'ringkasan':       ringkasan,
        'lemah_count':     len(lemah_list),
        'sedang_count':    len(sedang_list),
    }
