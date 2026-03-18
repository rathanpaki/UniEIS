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
            s.day_of_week as day, 
            DATE_FORMAT(s.start_time, '%H:%i') as time, 
            s.room, 
            s.color_code as color 
        FROM schedule s
        JOIN courses c ON s.course_id = c.id
        WHERE s.user_id = ?
        ORDER BY s.day_of_week, s.start_time
    ");
    $stmt->execute([$userId]);
    $rawSchedule = $stmt->fetchAll();

    // Group by day for frontend
    $schedule = [
        'MON' => [],
        'TUE' => [],
        'WED' => [],
        'THU' => [],
        'FRI' => []
    ];

    foreach ($rawSchedule as $slot) {
        $schedule[$slot['day']][] = [
            'time' => $slot['time'],
            'course' => $slot['course'],
            'room' => $slot['room'],
            'color' => $slot['color']
        ];
    }

    echo json_encode([
        'success' => true,
        'data' => $schedule
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
