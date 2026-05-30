import MySQLdb
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return MySQLdb.connect(
        host=os.getenv('MYSQL_HOST', 'localhost'),
        user=os.getenv('MYSQL_USER', 'root'),
        passwd=os.getenv('MYSQL_PASSWORD', ''),
        db=os.getenv('MYSQL_DB', 'quiz'),
        charset='utf8mb4',
        connect_timeout=10,
    )

def get_cursor():
    conn = get_connection()
    return conn, conn.cursor(MySQLdb.cursors.DictCursor)

def commit(conn):
    conn.commit()

def close(conn, cur):
    cur.close()
    conn.close()
