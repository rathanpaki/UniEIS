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
// Normally this would be based on the current semester
$semester = 'sem2';

try {
    $stmt = $pdo->prepare("
        SELECT 
            c.code, c.name, 
            a.total_sessions as total, 
            a.attended_sessions as attended,
            ROUND((a.attended_sessions / a.total_sessions) * 100) as pct
        FROM attendance a
        JOIN user_courses uc ON a.user_course_id = uc.id
        JOIN courses c ON uc.course_id = c.id
        WHERE uc.user_id = ? AND uc.semester = ?
    ");
    $stmt->execute([$userId, $semester]);
    $attendance = $stmt->fetchAll();

    $attendanceRateWeeklyTrend = [100, 95, 90, 83, 88, 84, 87]; // Mock trend

    echo json_encode([
        'success' => true,
        'data' => $attendance,
        'trend' => $attendanceRateWeeklyTrend
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
