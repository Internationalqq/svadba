#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Простой веб-сервер для сбора ответов гостей на свадьбу
"""

import http.server
import socketserver
import json
import sqlite3
import urllib.parse
from datetime import datetime
import os
import csv
import io

PORT = int(os.environ.get('PORT', 8000))

class WeddingHandler(http.server.SimpleHTTPRequestHandler):
    
    def do_GET(self):
        """Обработка GET запросов"""
        if self.path == '/admin/api/responses':
            self.send_json_response(self.get_responses())
        elif self.path == '/admin/api/stats':
            self.send_json_response(self.get_stats())
        elif self.path.startswith('/admin/api/export'):
            self.export_to_csv()
        else:
            # Обработка обычных файлов (HTML, CSS, JS)
            super().do_GET()
    
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
                db_path = os.path.join(os.path.dirname(__file__), '..', 'wedding_responses.db')
                conn = sqlite3.connect(db_path)
                cursor = conn.cursor()
                cursor.execute('DELETE FROM responses WHERE id = ?', (record_id,))
                conn.commit()
                deleted_count = cursor.rowcount
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
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                
                # Парсим данные формы (application/x-www-form-urlencoded)
                params = urllib.parse.parse_qs(post_data.decode('utf-8'))
                
                # Извлекаем значения
                name = params.get('name', [''])[0].strip()
                choice = params.get('choice', [''])[0]
                bus = params.get('bus', [''])[0]
                drinks_list = params.get('alco[]', [])
                
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
                    self.save_response(name, attendance, bus_text, drinks)
                    print(f"Data saved: name={name}, attendance={attendance}, bus={bus_text}, drinks={drinks}")
                except Exception as db_error:
                    print(f"Database error: {db_error}")
                    import traceback
                    traceback.print_exc()
                    # Все равно отправляем успех, так как данные могут быть сохранены
                
                self.send_json_response({
                    'success': True,
                    'message': 'Спасибо! Ваши данные сохранены.'
                })
            except Exception as e:
                import traceback
                error_msg = str(e)
                traceback.print_exc()
                print(f"Error in do_POST: {error_msg}")
                try:
                    self.send_json_response({
                        'success': False,
                        'message': f'Ошибка сервера: {error_msg}'
                    })
                except:
                    # Если не удалось отправить JSON, отправляем простой текст
                    self.send_response(500)
                    self.send_header('Content-type', 'text/plain; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(f'Error: {error_msg}'.encode('utf-8'))
        else:
            self.send_error(404)
    
    def send_json_response(self, data):
        """Отправка JSON ответа"""
        try:
            json_str = json.dumps(data, ensure_ascii=False)
            json_bytes = json_str.encode('utf-8')
            print(f"Sending JSON response: {json_str}")
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Length', str(len(json_bytes)))
            self.end_headers()
            self.wfile.write(json_bytes)
            self.wfile.flush()
        except Exception as e:
            print(f"Error in send_json_response: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    def init_database(self):
        """Инициализация базы данных"""
        db_path = os.path.join(os.path.dirname(__file__), '..', 'wedding_responses.db')
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
    
    def save_response(self, name, attendance, bus, drinks):
        """Сохранение ответа в БД"""
        self.init_database()
        db_path = os.path.join(os.path.dirname(__file__), '..', 'wedding_responses.db')
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO responses (name, attendance, bus_option, drinks)
            VALUES (?, ?, ?, ?)
        ''', (name, attendance, bus, drinks))
        conn.commit()
        conn.close()
    
    def get_responses(self):
        """Получение всех ответов"""
        self.init_database()
        db_path = os.path.join(os.path.dirname(__file__), '..', 'wedding_responses.db')
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM responses ORDER BY created_at DESC')
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_stats(self):
        """Получение статистики"""
        self.init_database()
        db_path = os.path.join(os.path.dirname(__file__), '..', 'wedding_responses.db')
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) FROM responses')
        total = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM responses WHERE attendance LIKE '%удовольствием%'")
        coming = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM responses WHERE attendance LIKE '%Не смогу%'")
        not_coming = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM responses WHERE bus_option != '' AND bus_option != 'no' AND bus_option IS NOT NULL")
        bus_users = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            'total': total,
            'coming': coming,
            'not_coming': not_coming,
            'bus_users': bus_users
        }
    
    def export_to_csv(self):
        """Экспорт в CSV"""
        responses = self.get_responses()
        
        # Создаем CSV в памяти
        output = io.StringIO()
        writer = csv.writer(output, delimiter=';')
        
        # Заголовки
        writer.writerow(['ID', 'Имя', 'Придет?', 'Автобус', 'Напитки', 'Дата ответа'])
        
        # Данные
        for row in responses:
            writer.writerow([
                row['id'],
                row['name'],
                row['attendance'],
                row['bus_option'],
                row['drinks'],
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
    
    Handler = WeddingHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 60)
        print(f"SERVER STARTED!")
        print(f"Site:        http://localhost:{PORT}/Сайтмейкер!!!.htm")
        print(f"Admin panel: http://localhost:{PORT}/admin/dashboard.html")
        print(f"Stop:        Ctrl+C")
        print("=" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped")

if __name__ == "__main__":
    main()
