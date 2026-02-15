"""
API endpoint для сохранения ответов гостей
Vercel serverless function
"""
import json
import urllib.parse
from db import init_database, get_db_path
import sqlite3

def handler(request):
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': False, 'message': 'Method not allowed'}, ensure_ascii=False)
        }
    
    try:
        # Получаем тело запроса
        body = request.body if hasattr(request, 'body') else ''
        if isinstance(body, bytes):
            body = body.decode('utf-8')
        
        # Парсим данные формы
        params = urllib.parse.parse_qs(body)
        
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
        
        # Валидация
        if not name:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'message': 'Пожалуйста, укажите ваше имя'
                }, ensure_ascii=False)
            }
        
        if not choice:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'message': 'Пожалуйста, выберите, приедете ли вы на свадьбу'
                }, ensure_ascii=False)
            }
        
        # Сохраняем в БД
        init_database()
        attendance = 'Да, с удовольствием' if choice == '1' else 'Не смогу'
        
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO responses (name, attendance, bus_option, drinks)
            VALUES (?, ?, ?, ?)
        ''', (name, attendance, bus_text, drinks))
        conn.commit()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Спасибо! Ваши данные сохранены.'
            }, ensure_ascii=False)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'message': f'Ошибка сервера: {str(e)}'
            }, ensure_ascii=False)
        }
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            # Парсим данные формы
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
            
            # Валидация
            if not name:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'message': 'Пожалуйста, укажите ваше имя'
                }, ensure_ascii=False).encode('utf-8'))
                return
            
            if not choice:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'message': 'Пожалуйста, выберите, приедете ли вы на свадьбу'
                }, ensure_ascii=False).encode('utf-8'))
                return
            
            # Сохраняем в БД
            init_database()
            attendance = 'Да, с удовольствием' if choice == '1' else 'Не смогу'
            
            db_path = get_db_path()
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO responses (name, attendance, bus_option, drinks)
                VALUES (?, ?, ?, ?)
            ''', (name, attendance, bus_text, drinks))
            conn.commit()
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'message': 'Спасибо! Ваши данные сохранены.'
            }, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'message': f'Ошибка сервера: {str(e)}'
            }, ensure_ascii=False).encode('utf-8'))
