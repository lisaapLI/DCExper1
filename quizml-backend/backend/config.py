import os

class Config:
    # MySQL
    MYSQL_HOST     = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_PORT     = int(os.getenv('MYSQL_PORT', 3306))
    MYSQL_USER     = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
    MYSQL_DB       = os.getenv('MYSQL_DB', 'quizml_db')
    MYSQL_CURSORCLASS = 'DictCursor'
    # App
    SECRET_KEY = os.getenv('SECRET_KEY', 'quizml-secret-key-2024')
    DEBUG      = False
    # ML
    KMEANS_N_CLUSTERS   = 2
    KMEANS_RANDOM_STATE = 42
