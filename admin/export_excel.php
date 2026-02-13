<?php
// Экспорт данных в Excel (CSV формат с поддержкой Excel)
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

$stmt = $db->query("SELECT * FROM responses ORDER BY created_at DESC");
$responses = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Устанавливаем заголовки для скачивания CSV
header('Content-Type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="wedding_responses_' . date('Y-m-d') . '.csv"');
header('Pragma: no-cache');
header('Expires: 0');

// Добавляем BOM для корректного отображения кириллицы в Excel
echo "\xEF\xBB\xBF";

// Открываем поток вывода
$output = fopen('php://output', 'w');

// Заголовки столбцов
fputcsv($output, [
    'ID',
    'Имя',
    'Придет?',
    'С кем придет',
    'Автобус',
    'Напитки',
    'Дата ответа'
], ';');

// Данные
foreach ($responses as $row) {
    fputcsv($output, [
        $row['id'],
        $row['name'],
        $row['attendance'],
        $row['companion'],
        $row['bus_option'],
        $row['drinks'],
        date('d.m.Y H:i', strtotime($row['created_at']))
    ], ';');
}

fclose($output);
exit;
