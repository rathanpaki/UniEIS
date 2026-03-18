<?php
session_start();
require_once '../../config/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle both JSON payload and standard form submission
    $data = json_decode(file_get_contents('php://input'), true);
    $userIdentifier = $data['user'] ?? $_POST['user'] ?? '';
    $password = $data['password'] ?? $_POST['password'] ?? '';

    if (empty($userIdentifier) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Please provide both ID/Email and Password.']);
        exit;
    }

    $pdo = getDBConnection();
    
    // Check if user exists by student_id or email
    $stmt = $pdo->prepare("SELECT * FROM users WHERE student_id = ? OR email = ?");
    $stmt->execute([$userIdentifier, $userIdentifier]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        // Login successful
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['student_id'] = $user['student_id'];
        $_SESSION['first_name'] = $user['first_name'];
        $_SESSION['last_name'] = $user['last_name'];
        $_SESSION['program'] = $user['program'];
        
        echo json_encode([
            'success' => true, 
            'message' => 'Login successful',
            'user' => [
                'name' => $user['first_name'] . ' ' . $user['last_name'],
                'student_id' => $user['student_id'],
                'program' => $user['program'],
                'faculty' => $user['faculty'],
                'year' => $user['year'],
                'current_semester' => $user['current_semester']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials. Please try again.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
