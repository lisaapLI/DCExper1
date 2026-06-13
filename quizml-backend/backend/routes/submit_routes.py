from flask    import Blueprint, request, jsonify
from utils.db import get_cursor, commit, close
from ml.analyzer import analyze_quiz

submit_bp = Blueprint('submit', __name__)

@submit_bp.route('/submit', methods=['POST'])
def submit_quiz():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body harus JSON'}), 400

    nama        = data.get('nama', '').strip()
    nim         = data.get('nim',  '').strip()
    answers     = data.get('answers', [])
    waktu_detik = data.get('waktu_detik', 600)

    if not nama or not nim or not answers:
        return jsonify({'error': 'nama, nim, dan answers wajib diisi'}), 422

    conn, cur = get_cursor()
    try:
        # 1. Upsert student
        cur.execute("SELECT id FROM students WHERE nim = %s", (nim,))
        student = cur.fetchone()
        if student:
            student_id = student['id']
        else:
            cur.execute("INSERT INTO students (nim, nama) VALUES (%s, %s)", (nim, nama))
            commit(conn)
            student_id = cur.lastrowid

        # 2. Buat quiz session
        cur.execute(
            "INSERT INTO quiz_sessions (student_id, waktu_pengerjaan) VALUES (%s, %s)",
            (student_id, waktu_detik)
        )
        commit(conn)
        session_id = cur.lastrowid

        # 3. Ambil soal untuk validasi
        question_ids = [a['question_id'] for a in answers]
        fmt = ','.join(['%s'] * len(question_ids))
        cur.execute(
            f"SELECT id, jawaban_benar, materi, bab, tingkat_kesulitan FROM questions WHERE id IN ({fmt})",
            tuple(question_ids)
        )
        questions = cur.fetchall()

        # 4. Analisis ML
        result = analyze_quiz(answers, questions, waktu_detik)

        # 5. Simpan jawaban
        for detail in result['answer_details']:
            cur.execute(
                "INSERT INTO quiz_answers (session_id, question_id, jawaban_mahasiswa, is_correct) VALUES (%s,%s,%s,%s)",
                (session_id, detail['question_id'], detail['jawaban_mahasiswa'], detail['is_correct'])
            )

        # 6. Simpan hasil
        ms = result['materi_scores']
        ks = result['kesulitan_scores']
        cur.execute(
            """INSERT INTO quiz_results
               (session_id, student_id, total_score, jumlah_benar, jumlah_salah,
                limit_score, turunan_score, aplikasi_turunan_score,
                teknik_integrasi_score, integral_lipat_score,
                mudah_score, sedang_score, sulit_score,
                materi_terlemah, kategori_kemampuan, cluster_label)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
            (
                session_id, student_id,
                result['total_score'], result['jumlah_benar'], result['jumlah_salah'],
                ms.get('Limit', 0), ms.get('Turunan', 0), ms.get('Aplikasi Turunan', 0),
                ms.get('Teknik Integrasi', 0), ms.get('Integral Lipat', 0),
                ks.get('Mudah', 0), ks.get('Sedang', 0), ks.get('Sulit', 0),
                result['materi_terlemah'], result['kategori_kemampuan'], result['cluster_label']
            )
        )
        commit(conn)
        result_id = cur.lastrowid

        # 7. Simpan rekomendasi
        for rec in result['rekomendasi']:
            cur.execute(
                "INSERT INTO recommendations (result_id, materi, judul, url, tipe) VALUES (%s,%s,%s,%s,%s)",
                (result_id, rec['materi'], rec['judul'], rec.get('url'), rec['tipe'])
            )
        commit(conn)

        return jsonify({
            'success':            True,
            'session_id':         session_id,
            'result_id':          result_id,
            'nama':               nama,
            'nim':                nim,
            'total_score':        result['total_score'],
            'jumlah_benar':       result['jumlah_benar'],
            'jumlah_salah':       result['jumlah_salah'],
            'total_soal':         result['total_soal'],
            'materi_scores':      result['materi_scores'],
            'kesulitan_scores':   result['kesulitan_scores'],
            'materi_terlemah':    result['materi_terlemah'],
            'kategori_kemampuan': result['kategori_kemampuan'],
            'rekomendasi':        result['rekomendasi'],
            'analisis_detail':    result.get('analisis_detail', {}),
            'ringkasan':          result['ringkasan'],
            'waktu_detik':        waktu_detik,
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        close(conn, cur)
