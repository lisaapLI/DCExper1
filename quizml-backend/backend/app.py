from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=["http://localhost:5173"])

    from routes.quiz_routes    import quiz_bp
    from routes.submit_routes  import submit_bp
    from routes.student_routes import student_bp
    from routes.auth_routes    import auth_bp

    app.register_blueprint(quiz_bp,     url_prefix='/api/quiz')
    app.register_blueprint(submit_bp,   url_prefix='/api/quiz')
    app.register_blueprint(student_bp,  url_prefix='/api/students')
    app.register_blueprint(auth_bp,     url_prefix='/api/auth')

    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'QuizML API is running'}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
