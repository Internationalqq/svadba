#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Простой веб-сервер для сбора ответов гостей на свадьбу
Использует PostgreSQL (Supabase) вместо SQLite для надежного хранения данных
"""

import http.server
import socketserver
import json
import urllib.parse
from datetime import datetime
import os
import csv
import io
import psycopg2
from psycopg2.extras import RealDictCursor
from urllib.parse import urlparse

PORT = int(os.environ.get('PORT', 8000))

def get_db_connection():
    """Получение подключения к PostgreSQL"""
    # Пробуем получить из переменных окружения
    database_url = os.environ.get('DATABASE_URL')
    
    # Если не найдена, пробуем прочитать из файла .env
    if not database_url:
        # Пробуем несколько возможных путей к .env файлу
        possible_paths = [
            os.path.join(os.path.dirname(__file__), '..', '.env'),  # Корень проекта
            os.path.join(os.path.dirname(__file__), '.env'),  # В папке admin
            os.path.join(os.getcwd(), '.env'),  # Текущая рабочая директория
            '.env'  # Текущая директория
        ]
        
        for env_file in possible_paths:
            env_file = os.path.abspath(env_file)
            print(f"Checking .env file at: {env_file}")
            if os.path.exists(env_file):
                print(f"Found .env file at: {env_file}")
                try:
                    with open(env_file, 'r', encoding='utf-8') as f:
                        for line in f:
                            line = line.strip()
                            if line and not line.startswith('#') and 'DATABASE_URL' in line:
                                if '=' in line:
                                    database_url = line.split('=', 1)[1].strip().strip('"').strip("'")
                                    print(f"Loaded DATABASE_URL from .env file")
                                    break
                except Exception as e:
                    print(f"Error reading .env file: {e}")
                if database_url:
                    break
    
    # Если все еще не найдена, используем значение по умолчанию (для локальной разработки)
    if not database_url:
        database_url = "postgresql://postgres:tQ/5ShuHtg7FbgT@db.dxfnguweggcefslzgvzs.supabase.co:5432/postgres"
        print("⚠️  DATABASE_URL не установлена, используется значение по умолчанию")
    
    # Проверяем, что database_url установлена
    if not database_url:
        raise Exception("DATABASE_URL не установлена в переменных окружения или файле .env")
    
    print(f"Using DATABASE_URL: {database_url[:50]}...")  # Показываем только начало для безопасности
    
    # Парсим URL вручную, так как urlparse не может правильно обработать пароль с символом /
    # Формат: postgresql://user:password@host:port/database
    import re
    from urllib.parse import unquote
    
    print(f"Attempting to connect to database...")
    
    # Используем регулярное выражение для парсинга
    # Схема: postgresql://
    # Пользователь и пароль: user:password@
    # Хост и порт: host:port
    # База данных: /database?params
    pattern = r'postgresql://([^:]+):([^@]+)@([^:/]+):(\d+)/([^?]+)(?:\?(.+))?'
    match = re.match(pattern, database_url)
    
    conn = None
    
    if match:
        username, password, hostname, port_str, database, params = match.groups()
        # Декодируем URL-кодированные символы
        username = unquote(username)
        password = unquote(password)
        database = unquote(database)
        
        # Убираем параметры из имени базы данных если они там есть
        if '?' in database:
            database = database.split('?')[0]
        
        print(f"Parsed connection params: user={username}, host={hostname}, port={port_str}, db={database}")
        
        try:
            port = int(port_str)
        except ValueError:
            raise Exception(f"Неверный формат порта: {port_str}")
        
        try:
            print(f"Connecting to PostgreSQL at {hostname}:{port}...")
            
            # Пробуем резолвить домен (IPv4 или IPv6)
            import socket
            resolved_address = None
            
            # Сначала пробуем IPv4
            try:
                print(f"Resolving hostname {hostname} to IPv4...")
                addr_info = socket.getaddrinfo(hostname, port, socket.AF_INET, socket.SOCK_STREAM)
                if addr_info:
                    resolved_address = addr_info[0][4][0]
                    print(f"✅ Resolved to IPv4: {resolved_address}")
            except (socket.gaierror, IndexError):
                print(f"⚠️  No IPv4 address found, trying IPv6...")
                # Пробуем IPv6
                try:
                    addr_info = socket.getaddrinfo(hostname, port, socket.AF_INET6, socket.SOCK_STREAM)
                    if addr_info:
                        resolved_address = addr_info[0][4][0]
                        print(f"✅ Resolved to IPv6: {resolved_address}")
                except (socket.gaierror, IndexError):
                    print(f"⚠️  No IPv6 address found either")
            
            # Пробуем подключиться через резолвленный адрес (если найден)
            if resolved_address:
                try:
                    print(f"Connecting via resolved address {resolved_address}...")
                    conn = psycopg2.connect(
                        database=database,
                        user=username,
                        password=password,
                        host=resolved_address,
                        port=port,
                        connect_timeout=5  # Уменьшаем таймаут до 5 секунд для быстрого ответа
                    )
                    print(f"✅ Database connection established!")
                    return conn
                except Exception as e:
                    print(f"❌ Failed via resolved address: {e}")
                    print(f"Trying via hostname directly...")
            
            # Если резолвинг не сработал, пробуем через hostname напрямую
            # psycopg2 сам попробует резолвить и подключиться
            print(f"Connecting via hostname {hostname} (psycopg2 will handle DNS)...")
            
            # Формируем параметры подключения
            connect_params = {
                'database': database,
                'user': username,
                'password': password,
                'host': hostname,
                'port': port,
                'connect_timeout': 5
            }
            
            # Если есть параметры в URL (например ?pgbouncer=true), добавляем их
            if params:
                print(f"Connection params from URL: {params}")
            
            conn = psycopg2.connect(**connect_params)
            print(f"✅ Database connection established!")
            return conn
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Error connecting to database: {error_msg}")
            import traceback
            traceback.print_exc()
            
            # Более понятное сообщение об ошибке
            if "getaddrinfo failed" in error_msg or "11001" in error_msg:
                raise Exception(
                    "Не удалось подключиться к базе данных Supabase.\n\n"
                    "Возможные причины:\n"
                    "1. Supabase блокирует прямые подключения на порту 5432\n"
                    "2. Нужно использовать Connection Pooling (порт 6543)\n"
                    "3. Проблема с интернет-соединением или DNS\n\n"
                    "Решение: Используйте Connection Pooling URL из Supabase Dashboard:\n"
                    "Settings → Database → Connection string → Connection pooling\n"
                    f"Текущая ошибка: {error_msg}"
                )
            else:
                raise Exception(f"Ошибка подключения к БД: {error_msg}")
    else:
        # Если регулярное выражение не сработало, пробуем напрямую
        print(f"Regex didn't match, trying direct connection with URL...")
        try:
            # Для прямого подключения psycopg2 сам разберет URL
            # Включая параметры типа ?pgbouncer=true
            conn = psycopg2.connect(database_url, connect_timeout=5)
            print(f"✅ Database connection established (direct)!")
            return conn
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Error connecting to database (direct): {error_msg}")
            import traceback
            traceback.print_exc()
            raise Exception(f"Ошибка подключения к БД: {error_msg}")
    
    # Если мы дошли сюда, что-то пошло не так
    if conn is None:
        raise Exception("Не удалось установить подключение к БД: функция вернула None")
    
    return conn

class WeddingHandler(http.server.SimpleHTTPRequestHandler):
    
    def do_GET(self):
        """Обработка GET запросов"""
        try:
            print(f"GET request: {self.path}")
            if self.path == '/admin/api/responses':
                print("Processing /admin/api/responses request...")
                try:
                    responses = self.get_responses()
                    print(f"Got {len(responses)} responses from DB")
                    # Убеждаемся, что возвращаем массив
                    if not isinstance(responses, list):
                        responses = []
                    self.send_json_response(responses)
                    print("Response sent successfully")
                except Exception as e:
                    import traceback
                    error_msg = str(e)
                    traceback.print_exc()
                    print(f"Error in get_responses: {error_msg}")
                    # Возвращаем пустой массив при ошибке, чтобы не ломать фронтенд
                    self.send_json_response([])
            elif self.path == '/admin/api/stats':
                print("Processing /admin/api/stats request...")
                try:
                    stats = self.get_stats()
                    print(f"Got stats: {stats}")
                    self.send_json_response(stats)
                    print("Stats response sent successfully")
                except Exception as e:
                    import traceback
                    error_msg = str(e)
                    traceback.print_exc()
                    print(f"Error in get_stats: {error_msg}")
                    # Возвращаем пустую статистику при ошибке
                    self.send_json_response({
                        'total': 0,
                        'coming': 0,
                        'not_coming': 0,
                        'bus_users': 0,
                        'drinks_stats': {
                            'Белое вино': 0,
                            'Красное вино': 0,
                            'Виски': 0,
                            'Водка': 0,
                            'Не пью алкоголь': 0
                        }
                    })
            elif self.path.startswith('/admin/api/export'):
                self.export_to_csv()
            else:
                # Обработка обычных файлов (HTML, CSS, JS)
                super().do_GET()
        except Exception as e:
            import traceback
            error_msg = str(e)
            traceback.print_exc()
            print(f"Error in do_GET: {error_msg}")
            try:
                self.send_json_response({
                    'error': True,
                    'message': error_msg
                })
            except:
                self.send_response(500)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'error': True, 'message': error_msg}, ensure_ascii=False).encode('utf-8'))
    
    def do_POST(self):
        """Обработка POST запросов"""
        if self.path == '/admin/api/delete':
            # Удаление записи
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                params = urllib.parse.parse_qs(post_data.decode('utf-8'))
                record_id_str = params.get('id', [''])[0]
                
                if not record_id_str:
                    self.send_json_response({
                        'success': False,
                        'message': 'ID записи не указан'
                    })
                    return
                
                # Преобразуем ID в число
                try:
                    record_id = int(record_id_str)
                except ValueError:
                    self.send_json_response({
                        'success': False,
                        'message': 'Неверный формат ID'
                    })
                    return
                
                # Инициализируем БД
                self.init_database()
                
                # Удаляем из БД
                conn = get_db_connection()
                if conn is None:
                    raise Exception("get_db_connection() вернул None вместо объекта подключения")
                cursor = conn.cursor()
                cursor.execute('DELETE FROM responses WHERE id = %s', (record_id,))
                deleted_count = cursor.rowcount
                conn.commit()
                cursor.close()
                conn.close()
                
                print(f"Deleted record ID: {record_id}, deleted_count: {deleted_count}")
                
                if deleted_count > 0:
                    self.send_json_response({
                        'success': True,
                        'message': 'Запись успешно удалена'
                    })
                else:
                    self.send_json_response({
                        'success': False,
                        'message': 'Запись не найдена'
                    })
            except Exception as e:
                import traceback
                error_msg = str(e)
                traceback.print_exc()
                print(f"Error deleting record: {error_msg}")
                self.send_json_response({
                    'success': False,
                    'message': f'Ошибка удаления: {error_msg}'
                })
        elif self.path == '/admin/api/save':
            try:
                print(f"=== POST /admin/api/save ===")
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                print(f"Received data length: {content_length}")
                print(f"Raw data: {post_data.decode('utf-8')[:200]}")
                
                # Парсим данные формы (application/x-www-form-urlencoded)
                params = urllib.parse.parse_qs(post_data.decode('utf-8'))
                print(f"Parsed params: {params}")
                
                # Извлекаем значения
                name = params.get('name', [''])[0].strip()
                companion = params.get('companion', [''])[0].strip()
                choice = params.get('choice', [''])[0]
                bus = params.get('bus', [''])[0]
                drinks_list = params.get('alco[]', [])
                companion_drinks_list = params.get('companion_alco[]', [])
                print(f"Extracted: name={name}, companion={companion}, choice={choice}, bus={bus}, drinks={drinks_list}, companion_drinks={companion_drinks_list}")
                
                # Маппинг напитков
                drinks_map = {
                    '2': 'Белое вино',
                    '3': 'Красное вино',
                    '4': 'Виски',
                    '5': 'Водка',
                    '8': 'Не пью алкоголь'
                }
                drinks_text = [drinks_map.get(d, d) for d in drinks_list]
                drinks = ', '.join(drinks_text) if drinks_text else ''
                
                companion_drinks_text = [drinks_map.get(d, d) for d in companion_drinks_list]
                companion_drinks = ', '.join(companion_drinks_text) if companion_drinks_text else ''
                
                # Маппинг автобуса
                bus_map = {
                    'both': 'Да, в обе стороны',
                    'there': 'Да, только туда',
                    'back': 'Да, только обратно',
                    'no': 'Нет, доберусь сам(а)'
                }
                bus_text = bus_map.get(bus, bus) if bus else ''
                
                # Валидация на сервере
                if not name:
                    self.send_json_response({
                        'success': False,
                        'message': 'Пожалуйста, укажите ваше имя'
                    })
                    return
                
                if not choice:
                    self.send_json_response({
                        'success': False,
                        'message': 'Пожалуйста, выберите, приедете ли вы на свадьбу'
                    })
                    return
                
                # Сохраняем в БД
                attendance = 'Да, с удовольствием' if choice == '1' else 'Не смогу'
                try:
                    print(f"Attempting to save: name={name}, companion={companion}, attendance={attendance}, bus={bus_text}, drinks={drinks}, companion_drinks={companion_drinks}")
                    self.save_response(name, companion, attendance, bus_text, drinks, companion_drinks)
                    print(f"✅ Data saved successfully: name={name}, companion={companion}, attendance={attendance}, bus={bus_text}, drinks={drinks}, companion_drinks={companion_drinks}")
                except Exception as db_error:
                    error_msg = str(db_error)
                    # Убираем эмодзи и специальные символы из сообщения об ошибке
                    error_msg_clean = error_msg.encode('ascii', errors='ignore').decode('ascii')
                    print(f"[ERROR] Database error: {error_msg_clean}")
                    import traceback
                    traceback.print_exc()
                    
                    # Формируем понятное сообщение об ошибке (без эмодзи)
                    if "Connection" in error_msg or "timeout" in error_msg.lower() or "getaddrinfo" in error_msg:
                        user_message = (
                            "Не удалось подключиться к базе данных.\n\n"
                            "Используйте Connection Pooling URL из Supabase:\n"
                            "Settings → Database → Connection pooling\n"
                            "И обновите DATABASE_URL в файле .env"
                        )
                    else:
                        # Убираем эмодзи из сообщения
                        clean_error = error_msg.encode('ascii', errors='ignore').decode('ascii')
                        user_message = f"Ошибка сохранения в БД: {clean_error}"
                    
                    # Отправляем ошибку клиенту
                    self.send_json_response({
                        'success': False,
                        'message': user_message
                    })
                    return
                
                print(f"=== Sending success response ===")
                self.send_json_response({
                    'success': True,
                    'message': 'Спасибо! Ваши данные сохранены.'
                })
            except Exception as e:
                import traceback
                error_msg = str(e)
                traceback.print_exc()
                # Убираем эмодзи из сообщения об ошибке
                error_msg_clean = error_msg.encode('ascii', errors='ignore').decode('ascii')
                print(f"Error in do_POST: {error_msg_clean}")
                try:
                    self.send_json_response({
                        'success': False,
                        'message': f'Ошибка сервера: {error_msg_clean}'
                    })
                except:
                    # Если не удалось отправить JSON, отправляем простой текст
                    self.send_response(500)
                    self.send_header('Content-type', 'text/plain; charset=utf-8')
                    self.end_headers()
                    error_bytes = error_msg_clean.encode('utf-8', errors='ignore')
                    self.wfile.write(error_bytes)
        else:
            self.send_error(404)
    
    def send_json_response(self, data):
        """Отправка JSON ответа"""
        try:
            # Убираем эмодзи из сообщений для клиента (чтобы избежать проблем с кодировкой)
            if isinstance(data, dict) and 'message' in data:
                # Заменяем эмодзи на текст в сообщениях
                message = data['message']
                message = message.replace('❌', '[ОШИБКА]').replace('✅', '[OK]').replace('⚠️', '[ВНИМАНИЕ]')
                data = data.copy()
                data['message'] = message
            
            json_str = json.dumps(data, ensure_ascii=False, default=str)
            json_bytes = json_str.encode('utf-8')
            
            # Логируем без эмодзи для Windows консоли
            try:
                log_str = json_str.replace('❌', '[ERROR]').replace('✅', '[OK]').replace('⚠️', '[WARN]')
                print(f"Sending JSON response: {log_str[:200]}")
            except:
                print(f"Sending JSON response (length: {len(json_bytes)} bytes)")
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Length', str(len(json_bytes)))
            self.end_headers()
            self.wfile.write(json_bytes)
            self.wfile.flush()
        except Exception as e:
            # При ошибке отправки используем безопасную кодировку
            error_msg = str(e).encode('ascii', errors='replace').decode('ascii')
            print(f"Error in send_json_response: {error_msg}")
            import traceback
            try:
                traceback.print_exc()
            except:
                pass
            raise
    
    def init_database(self):
        """Инициализация базы данных PostgreSQL"""
        try:
            conn = get_db_connection()
            if conn is None:
                raise Exception("get_db_connection() вернул None вместо объекта подключения")
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS responses (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    companion TEXT,
                    attendance TEXT,
                    bus_option TEXT,
                    drinks TEXT,
                    companion_drinks TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Проверяем и добавляем колонку companion если её нет (миграция для существующих таблиц)
            try:
                cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='responses' AND column_name='companion'
                """)
                if cursor.fetchone() is None:
                    cursor.execute('ALTER TABLE responses ADD COLUMN companion TEXT')
                    print("Added companion column to existing table")
            except Exception as migration_error:
                print(f"Migration check failed (may be OK if column exists): {migration_error}")
            
            # Проверяем и добавляем колонку companion_drinks если её нет
            try:
                cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='responses' AND column_name='companion_drinks'
                """)
                if cursor.fetchone() is None:
                    cursor.execute('ALTER TABLE responses ADD COLUMN companion_drinks TEXT')
                    print("Added companion_drinks column to existing table")
            except Exception as migration_error:
                print(f"Migration check failed (may be OK if column exists): {migration_error}")
            
            conn.commit()
            cursor.close()
            conn.close()
            print("Database initialized successfully")
        except Exception as e:
            print(f"Error initializing database: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    def save_response(self, name, companion, attendance, bus, drinks, companion_drinks=None):
        """Сохранение ответа в БД"""
        print(f"save_response called: name={name}, companion={companion}, attendance={attendance}, bus={bus}, drinks={drinks}, companion_drinks={companion_drinks}")
        try:
            self.init_database()
            print("Database initialized")
            conn = get_db_connection()
            if conn is None:
                raise Exception("get_db_connection() вернул None вместо объекта подключения")
            print("Database connection established")
            cursor = conn.cursor()
            print("Cursor created")
            cursor.execute('''
                INSERT INTO responses (name, companion, attendance, bus_option, drinks, companion_drinks)
                VALUES (%s, %s, %s, %s, %s, %s)
            ''', (name, companion if companion else None, attendance, bus, drinks, companion_drinks if companion_drinks else None))
            print(f"INSERT executed, rowcount: {cursor.rowcount}")
            conn.commit()
            print("Transaction committed")
            cursor.close()
            conn.close()
            print("Connection closed")
        except Exception as e:
            print(f"Error in save_response: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    def get_responses(self):
        """Получение всех ответов"""
        try:
            self.init_database()
            conn = get_db_connection()
            if conn is None:
                raise Exception("get_db_connection() вернул None вместо объекта подключения")
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute('SELECT * FROM responses ORDER BY created_at DESC')
            rows = cursor.fetchall()
            cursor.close()
            conn.close()
            
            # Преобразуем в список словарей
            result = []
            for row in rows:
                row_dict = dict(row)
                # Логируем для отладки
                if row_dict.get('companion_drinks'):
                    print(f"Found companion_drinks for row {row_dict.get('id')}: {row_dict.get('companion_drinks')}")
                result.append(row_dict)
            print(f"Total responses fetched: {len(result)}")
            # Убеждаемся, что возвращаем список
            return result if isinstance(result, list) else []
        except Exception as e:
            import traceback
            error_msg = str(e)
            traceback.print_exc()
            print(f"Error in get_responses: {error_msg}")
            # Возвращаем пустой список вместо исключения
            return []
    
    def get_stats(self):
        """Получение статистики"""
        try:
            self.init_database()
            conn = get_db_connection()
            if conn is None:
                raise Exception("get_db_connection() вернул None вместо объекта подключения")
            cursor = conn.cursor()
            
            cursor.execute('SELECT COUNT(*) FROM responses')
            total = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM responses WHERE attendance LIKE %s", ('%удовольствием%',))
            coming = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM responses WHERE attendance LIKE %s", ('%Не смогу%',))
            not_coming = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM responses WHERE bus_option != '' AND bus_option != 'no' AND bus_option IS NOT NULL")
            bus_users = cursor.fetchone()[0]
            
            # Статистика по алкоголю (учитываем алкоголь основного гостя и второго гостя)
            cursor.execute("SELECT drinks, companion_drinks FROM responses WHERE (drinks IS NOT NULL AND drinks != '') OR (companion_drinks IS NOT NULL AND companion_drinks != '')")
            all_drinks = cursor.fetchall()
            
            # Подсчитываем каждый тип напитка
            drinks_stats = {
                'Белое вино': 0,
                'Красное вино': 0,
                'Виски': 0,
                'Водка': 0,
                'Не пью алкоголь': 0
            }
            
            for (drinks_str, companion_drinks_str) in all_drinks:
                # Алкоголь основного гостя
                if drinks_str:
                    drinks_list = [d.strip() for d in drinks_str.split(',')]
                    for drink in drinks_list:
                        if drink in drinks_stats:
                            drinks_stats[drink] += 1
                
                # Алкоголь второго гостя
                if companion_drinks_str:
                    companion_drinks_list = [d.strip() for d in companion_drinks_str.split(',')]
                    for drink in companion_drinks_list:
                        if drink in drinks_stats:
                            drinks_stats[drink] += 1
            
            cursor.close()
            conn.close()
            
            return {
                'total': total,
                'coming': coming,
                'not_coming': not_coming,
                'bus_users': bus_users,
                'drinks_stats': drinks_stats
            }
        except Exception as e:
            import traceback
            error_msg = str(e)
            traceback.print_exc()
            print(f"Error in get_stats: {error_msg}")
            raise Exception(f"Ошибка получения статистики из БД: {error_msg}")
    
    def export_to_csv(self):
        """Экспорт в CSV"""
        responses = self.get_responses()
        
        # Создаем CSV в памяти
        output = io.StringIO()
        writer = csv.writer(output, delimiter=';')
        
        # Заголовки
        writer.writerow(['ID', 'Имя', 'Второй гость', 'Придет?', 'Автобус', 'Напитки (гость)', 'Напитки (2-й гость)', 'Дата ответа'])
        
        # Данные
        for row in responses:
            writer.writerow([
                row['id'],
                row['name'],
                row.get('companion', '') or '',
                row['attendance'],
                row['bus_option'],
                row.get('drinks', '') or '',
                row.get('companion_drinks', '') or '',
                row['created_at']
            ])
        
        # Отправляем файл
        csv_data = output.getvalue()
        self.send_response(200)
        self.send_header('Content-type', 'text/csv; charset=utf-8')
        self.send_header('Content-Disposition', f'attachment; filename="wedding_responses_{datetime.now().strftime("%Y-%m-%d")}.csv"')
        self.end_headers()
        self.wfile.write('\ufeff'.encode('utf-8'))  # BOM для Excel
        self.wfile.write(csv_data.encode('utf-8'))

def main():
    """Запуск сервера"""
    # Меняем рабочую директорию на родительскую (где лежит сайт)
    os.chdir(os.path.join(os.path.dirname(__file__), '..'))
    
    # Проверяем DATABASE_URL при старте
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        # Пробуем прочитать из .env
        env_file = os.path.join(os.getcwd(), '.env')
        if os.path.exists(env_file):
            print(f"Reading DATABASE_URL from .env file: {env_file}")
            try:
                with open(env_file, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and 'DATABASE_URL' in line and '=' in line:
                            database_url = line.split('=', 1)[1].strip().strip('"').strip("'")
                            os.environ['DATABASE_URL'] = database_url
                            print("✅ DATABASE_URL loaded from .env file")
                            break
            except Exception as e:
                print(f"Error reading .env: {e}")
    
    # Если все еще нет, устанавливаем по умолчанию
    if not database_url:
        database_url = "postgresql://postgres:tQ/5ShuHtg7FbgT@db.dxfnguweggcefslzgvzs.supabase.co:5432/postgres"
        os.environ['DATABASE_URL'] = database_url
        print("⚠️  Using default DATABASE_URL")
    
    # Инициализируем БД при старте
    try:
        handler = WeddingHandler(None, None, None)
        handler.init_database()
        print("✅ Database connection successful!")
    except Exception as e:
        print(f"WARNING: Database initialization failed: {e}")
        import traceback
        traceback.print_exc()
        print("Server will start anyway, but database operations may fail.")
    
    Handler = WeddingHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 60)
        print(f"SERVER STARTED!")
        print(f"Port:        {PORT}")
        print(f"Database:    PostgreSQL (Supabase)")
        print(f"Site:        http://localhost:{PORT}/index.html")
        print(f"Admin panel: http://localhost:{PORT}/admin/dashboard.html")
        print(f"Stop:        Ctrl+C")
        print("=" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped")

if __name__ == "__main__":
    main()
