<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'unieis_db');
define('DB_USER', 'root'); // Change this to your database username
define('DB_PASS', 'Paki@0104');     // Change this to your database password

/**
 * Get Database Connection
 *
 * @return PDO|null
 */
function getDBConnection() {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (\PDOException $e) {
        // For security reasons in a real app, do not echo actual error to the user
        die("Connection failed: " . $e->getMessage());
    }
}
?>
