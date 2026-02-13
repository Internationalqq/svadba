<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ-панель - Ответы гостей</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
            font-size: 32px;
        }
        .stats {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        .stat-card {
            flex: 1;
            min-width: 200px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
        }
        .stat-card h3 {
            font-size: 14px;
            font-weight: normal;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        .stat-card .number {
            font-size: 36px;
            font-weight: bold;
        }
        .actions {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
        }
        .btn {
            padding: 10px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #5568d3;
        }
        .btn-success {
            background: #48bb78;
        }
        .btn-success:hover {
            background: #38a169;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: #f7fafc;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #4a5568;
            border-bottom: 2px solid #e2e8f0;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        tr:hover {
            background: #f7fafc;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-yes {
            background: #c6f6d5;
            color: #22543d;
        }
        .badge-no {
            background: #fed7d7;
            color: #742a2a;
        }
        .empty {
            text-align: center;
            padding: 40px;
            color: #a0aec0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 Ответы гостей на свадьбу</h1>
        
        <?php
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
        
        // Статистика
        $total = $db->query("SELECT COUNT(*) FROM responses")->fetchColumn();
        $coming = $db->query("SELECT COUNT(*) FROM responses WHERE attendance LIKE '%удовольствием%'")->fetchColumn();
        $not_coming = $db->query("SELECT COUNT(*) FROM responses WHERE attendance LIKE '%Не смогу%'")->fetchColumn();
        $bus_users = $db->query("SELECT COUNT(*) FROM responses WHERE bus_option != '' AND bus_option != 'no' AND bus_option IS NOT NULL")->fetchColumn();
        ?>
        
        <div class="stats">
            <div class="stat-card">
                <h3>Всего ответов</h3>
                <div class="number"><?= $total ?></div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);">
                <h3>Придут</h3>
                <div class="number"><?= $coming ?></div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #f56565 0%, #c53030 100%);">
                <h3>Не придут</h3>
                <div class="number"><?= $not_coming ?></div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);">
                <h3>Едут автобусом</h3>
                <div class="number"><?= $bus_users ?></div>
            </div>
        </div>
        
        <div class="actions">
            <a href="export_excel.php" class="btn btn-success">📥 Скачать Excel</a>
            <button onclick="location.reload()" class="btn">🔄 Обновить</button>
        </div>
        
        <?php
        $stmt = $db->query("SELECT * FROM responses ORDER BY created_at DESC");
        $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (count($responses) > 0):
        ?>
        
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Придет?</th>
                    <th>С кем</th>
                    <th>Автобус</th>
                    <th>Напитки</th>
                    <th>Дата ответа</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($responses as $row): ?>
                <tr>
                    <td><?= $row['id'] ?></td>
                    <td><strong><?= htmlspecialchars($row['name']) ?></strong></td>
                    <td>
                        <?php if (strpos($row['attendance'], 'удовольствием') !== false): ?>
                            <span class="badge badge-yes">✓ Да</span>
                        <?php else: ?>
                            <span class="badge badge-no">✗ Нет</span>
                        <?php endif; ?>
                    </td>
                    <td><?= htmlspecialchars($row['companion']) ?: '-' ?></td>
                    <td><?= htmlspecialchars($row['bus_option']) ?: '-' ?></td>
                    <td><?= htmlspecialchars($row['drinks']) ?: '-' ?></td>
                    <td><?= date('d.m.Y H:i', strtotime($row['created_at'])) ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        
        <?php else: ?>
        <div class="empty">
            <p>Пока нет ответов от гостей</p>
        </div>
        <?php endif; ?>
    </div>
</body>
</html>
