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
            icon, 
            title, 
            body, 
            time_label as time, 
            tag, 
            is_unread as unread 
        FROM notifications 
        WHERE user_id = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$userId]);
    $notifications = $stmt->fetchAll();

    // The database treats boolean as tinyint 0 or 1, let's map it to true/false for JSON
    foreach ($notifications as &$notif) {
        $notif['unread'] = (bool)$notif['unread'];
    }

    echo json_encode([
        'success' => true,
        'data' => $notifications
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
