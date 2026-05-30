from flask import Blueprint, jsonify
from utils.db import get_cursor, close

student_bp = Blueprint('student', __name__)

@student_bp.route('/', methods=['GET'])
def get_all_students():
    conn, cur = get_cursor()
    try:
        cur.execute("SELECT id, nim, nama, created_at FROM students ORDER BY created_at DESC")
        students = cur.fetchall()
        return jsonify({'students': students, 'total': len(students)}), 200
    finally:
        close(conn, cur)

@student_bp.route('/<nim>', methods=['GET'])
def get_student(nim):
    conn, cur = get_cursor()
    try:
        cur.execute("SELECT id, nim, nama, created_at FROM students WHERE nim = %s", (nim,))
        student = cur.fetchone()
        if not student:
            return jsonify({'error': 'Mahasiswa tidak ditemukan'}), 404
        return jsonify(student), 200
    finally:
        close(conn, cur)

@student_bp.route('/<nim>/results', methods=['GET'])
def get_student_results(nim):
    conn, cur = get_cursor()
    try:
        cur.execute("""
            SELECT qr.*, qs.waktu_pengerjaan, qs.started_at
            FROM quiz_results qr
            JOIN quiz_sessions qs ON qr.session_id = qs.id
            JOIN students s ON qr.student_id = s.id
            WHERE s.nim = %s
            ORDER BY qr.created_at DESC
        """, (nim,))
        results = cur.fetchall()
        return jsonify({'results': results, 'total': len(results)}), 200
    finally:
        close(conn, cur)
