<?php
session_start();
require_once '../../config/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$pdo = getDBConnection();
$userId = $_SESSION['user_id'];

try {
    $stmt = $pdo->prepare("
        SELECT 
            c.code as course, 
            d.task_name as task, 
            DATE_FORMAT(d.due_date, '%d %b %Y') as due, 
            d.weight, 
            d.status 
        FROM deadlines d
        JOIN courses c ON d.course_id = c.id
        WHERE d.user_id = ?
        ORDER BY d.due_date ASC
    ");
    $stmt->execute([$userId]);
    $deadlines = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $deadlines
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
