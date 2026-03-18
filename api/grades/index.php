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
$semester = $_GET['semester'] ?? 'sem2';

try {
    $stmt = $pdo->prepare("
        SELECT 
            c.code, c.name, c.credits, 
            uc.midterm_score as midterm, 
            uc.final_score as final, 
            uc.assignment_score as assign, 
            uc.total_score as total, 
            uc.grade, uc.status 
        FROM user_courses uc
        JOIN courses c ON uc.course_id = c.id
        WHERE uc.user_id = ? AND uc.semester = ?
    ");
    $stmt->execute([$userId, $semester]);
    $grades = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'semester' => $semester,
        'data' => $grades
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
