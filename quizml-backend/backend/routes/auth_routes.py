"""
Auth routes: register, login, profile, history
"""
from flask import Blueprint, request, jsonify
from utils.db import get_cursor, commit, close
import hashlib

auth_bp = Blueprint('auth', __name__)

def hash_password(password):
    """SHA-256 hash — cukup untuk project capstone"""
    return hashlib.sha256(password.encode()).hexdigest()


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    POST /api/auth/register
    Body: { "nim": "20230001", "nama": "Budi", "password": "abc123" }
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body harus JSON'}), 400

    nim      = data.get('nim',      '').strip()
    nama     = data.get('nama',     '').strip()
    password = data.get('password', '').strip()

    if not nim or not nama or not password:
        return jsonify({'error': 'nim, nama, dan password wajib diisi'}), 422
    if len(password) < 6:
        return jsonify({'error': 'Password minimal 6 karakter'}), 422
    if not nim.isdigit():
        return jsonify({'error': 'NIM harus berupa angka'}), 422

    conn, cur = get_cursor()
    try:
        # Cek NIM sudah terdaftar
        cur.execute("SELECT id FROM users WHERE nim = %s", (nim,))
        if cur.fetchone():
            return jsonify({'error': 'NIM sudah terdaftar'}), 409

        hashed = hash_password(password)
        cur.execute(
            "INSERT INTO users (nim, nama, password) VALUES (%s, %s, %s)",
            (nim, nama, hashed)
        )
        commit(conn)
        user_id = cur.lastrowid

        # Juga insert ke students untuk kompatibilitas quiz_results
        cur.execute("SELECT id FROM students WHERE nim = %s", (nim,))
        if not cur.fetchone():
            cur.execute("INSERT INTO students (nim, nama) VALUES (%s, %s)", (nim, nama))
            commit(conn)

        return jsonify({
            'success': True,
            'message': 'Registrasi berhasil',
            'user': { 'id': user_id, 'nim': nim, 'nama': nama }
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        close(conn, cur)


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    POST /api/auth/login
    Body: { "nim": "20230001", "password": "abc123" }
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body harus JSON'}), 400

    nim      = data.get('nim',      '').strip()
    password = data.get('password', '').strip()

    if not nim or not password:
        return jsonify({'error': 'NIM dan password wajib diisi'}), 422

    conn, cur = get_cursor()
    try:
        hashed = hash_password(password)
        cur.execute(
            "SELECT id, nim, nama, created_at FROM users WHERE nim = %s AND password = %s",
            (nim, hashed)
        )
        user = cur.fetchone()
        if not user:
            return jsonify({'error': 'NIM atau password salah'}), 401

        # Update last_login
        cur.execute("UPDATE users SET last_login = NOW() WHERE id = %s", (user['id'],))
        commit(conn)

        return jsonify({
            'success': True,
            'message': 'Login berhasil',
            'user': {
                'id':         user['id'],
                'nim':        user['nim'],
                'nama':       user['nama'],
                'created_at': str(user['created_at']),
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        close(conn, cur)


@auth_bp.route('/profile/<nim>', methods=['GET'])
def get_profile(nim):
    """GET /api/auth/profile/:nim"""
    conn, cur = get_cursor()
    try:
        cur.execute(
            "SELECT id, nim, nama, created_at, last_login FROM users WHERE nim = %s",
            (nim,)
        )
        user = cur.fetchone()
        if not user:
            return jsonify({'error': 'User tidak ditemukan'}), 404

        # Hitung statistik
        cur.execute("""
            SELECT
                COUNT(*)                    AS total_sesi,
                MAX(total_score)            AS best_score,
                AVG(total_score)            AS avg_score,
                SUM(jumlah_benar)           AS total_benar,
                SUM(jumlah_salah)           AS total_salah
            FROM quiz_results qr
            JOIN students s ON qr.student_id = s.id
            WHERE s.nim = %s
        """, (nim,))
        stats = cur.fetchone()

        return jsonify({
            'user':  {k: str(v) if hasattr(v, 'isoformat') else v for k, v in user.items()},
            'stats': {k: float(v) if v is not None else 0 for k, v in (stats or {}).items()},
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        close(conn, cur)


@auth_bp.route('/history/<nim>', methods=['GET'])
def get_history(nim):
    """GET /api/auth/history/:nim — riwayat semua quiz user"""
    conn, cur = get_cursor()
    try:
        cur.execute("""
            SELECT
                qr.id,
                qr.total_score,
                qr.jumlah_benar,
                qr.jumlah_salah,
                qr.total_soal,
                qr.limit_score,
                qr.turunan_score,
                qr.aplikasi_turunan_score,
                qr.teknik_integrasi_score,
                qr.integral_lipat_score,
                qr.mudah_score,
                qr.sedang_score,
                qr.sulit_score,
                qr.materi_terlemah,
                qr.kategori_kemampuan,
                qr.cluster_label,
                qr.waktu_detik,
                qr.created_at,
                qs.waktu_pengerjaan,
                qs.started_at,
                -- Tentukan level dari skor kesulitan
                CASE
                    WHEN qr.mudah_score  > 0 AND qr.sedang_score = 0 AND qr.sulit_score = 0 THEN 'Mudah'
                    WHEN qr.sedang_score > 0 AND qr.sulit_score  = 0 THEN 'Sedang'
                    WHEN qr.sulit_score  > 0 THEN 'Sulit'
                    ELSE 'Semua'
                END AS level
            FROM quiz_results qr
            JOIN quiz_sessions qs ON qr.session_id = qs.id
            JOIN students s       ON qr.student_id = s.id
            WHERE s.nim = %s
            ORDER BY qr.created_at DESC
            LIMIT 50
        """, (nim,))
        results = cur.fetchall()

        # Serialize datetime
        serialized = []
        for r in results:
            row = {}
            for k, v in r.items():
                row[k] = str(v) if hasattr(v, 'isoformat') else v
            serialized.append(row)

        return jsonify({'history': serialized, 'total': len(serialized)}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        close(conn, cur)
