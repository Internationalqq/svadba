<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Создаем или открываем базу данных SQLite
$db = new PDO('sqlite:../wedding_responses.db');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Создаем таблицу если её нет
$db->exec("CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    attendance TEXT,
    companion TEXT,
    bus_option TEXT,
    drinks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Получаем данные из формы
        $name = $_POST['name'] ?? '';
        $attendance = $_POST['choice'] ?? '';
        $companion = $_POST['company'] ?? '';
        $bus = $_POST['bus'] ?? '';
        
        // Собираем напитки
        $drinks = [];
        if (isset($_POST['alco'])) {
            $drinks = array_merge($drinks, $_POST['alco']);
        }
        $drinks_str = implode(', ', $drinks);
        
        // Сохраняем в БД
        $stmt = $db->prepare("INSERT INTO responses (name, attendance, companion, bus_option, drinks) 
                              VALUES (:name, :attendance, :companion, :bus, :drinks)");
        
        $stmt->execute([
            ':name' => $name,
            ':attendance' => $attendance == '1' ? 'Да, с удовольствием' : 'Не смогу',
            ':companion' => $companion,
            ':bus' => $bus,
            ':drinks' => $drinks_str
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Спасибо! Ваши данные сохранены.'
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Ошибка: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Неверный метод запроса'
    ]);
}
