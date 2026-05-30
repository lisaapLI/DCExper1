import random
from flask import Blueprint, jsonify, request
from utils.db import get_cursor, close

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/questions', methods=['GET'])
def get_questions():
    """
    GET /api/quiz/questions?level=Mudah|Sedang|Sulit
    Soal dikembalikan dalam urutan ACAK setiap request.
    """
    level = request.args.get('level')

    conn, cur = get_cursor()
    try:
        if level and level in ('Mudah', 'Sedang', 'Sulit'):
            cur.execute("""
                SELECT id, soal,
                       pilihan_a, pilihan_b, pilihan_c, pilihan_d,
                       materi, bab, tingkat_kesulitan
                FROM questions
                WHERE tingkat_kesulitan = %s
                ORDER BY RAND()
            """, (level,))
        else:
            cur.execute("""
                SELECT id, soal,
                       pilihan_a, pilihan_b, pilihan_c, pilihan_d,
                       materi, bab, tingkat_kesulitan
                FROM questions
                ORDER BY RAND()
            """)

        questions = cur.fetchall()
        return jsonify({
            'questions': questions,
            'total':     len(questions),
            'level':     level or 'Semua',
        }), 200
    finally:
        close(conn, cur)
