"""
Общие функции для работы с базой данных
"""
import sqlite3
import os

def get_db_path():
    """Получить путь к базе данных"""
    # В Vercel используем /tmp для записи
    if os.path.exists('/tmp'):
        return '/tmp/wedding_responses.db'
    # Локально используем родительскую директорию
    return os.path.join(os.path.dirname(__file__), '..', 'wedding_responses.db')

def init_database():
    """Инициализация базы данных"""
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            attendance TEXT,
            bus_option TEXT,
            drinks TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
