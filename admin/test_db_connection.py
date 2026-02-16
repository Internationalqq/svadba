#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Тестовый скрипт для проверки подключения к БД"""

import os
import sys

# Добавляем текущую директорию в путь
sys.path.insert(0, os.path.dirname(__file__))

# Пробуем загрузить DATABASE_URL из .env
env_file = os.path.join(os.path.dirname(__file__), '..', '.env')
if os.path.exists(env_file):
    print(f"Found .env file at: {env_file}")
    with open(env_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and 'DATABASE_URL' in line and '=' in line:
                database_url = line.split('=', 1)[1].strip().strip('"').strip("'")
                os.environ['DATABASE_URL'] = database_url
                print(f"Loaded DATABASE_URL from .env")
                break
else:
    print(f".env file not found at: {env_file}")
    # Используем значение по умолчанию
    os.environ['DATABASE_URL'] = "postgresql://postgres:tQ/5ShuHtg7FbgT@db.dxfnguweggcefslzgvzs.supabase.co:5432/postgres"
    print("Using default DATABASE_URL")

# Теперь пробуем подключиться
try:
    from server import get_db_connection
    print("\nTesting database connection...")
    conn = get_db_connection()
    
    if conn is None:
        print("❌ ERROR: get_db_connection() returned None!")
        sys.exit(1)
    
    print("✅ Connection object created successfully!")
    
    # Пробуем выполнить простой запрос
    cursor = conn.cursor()
    cursor.execute("SELECT 1")
    result = cursor.fetchone()
    print(f"✅ Test query executed successfully: {result}")
    
    cursor.close()
    conn.close()
    print("✅ Connection closed successfully!")
    print("\n🎉 Database connection test PASSED!")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
