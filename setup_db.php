<?php
// Setup Database and Insert Seed Data
// Run this script ONCE through your browser or CLI to setup the database.

define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // Change if your user is different
define('DB_PASS', 'Paki@0104');     // Change if your password is different

echo "Starting Database Setup...<br>";

try {
    // 1. Connect without DB selected to create the DB if it doesn't exist
    $pdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $dbName = 'unieis_db';
    
    echo "Creating database tracking...<br>";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$dbName`");

    // 2. Create Tables
    echo "Creating tables...<br>";

    // Users table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id VARCHAR(50) UNIQUE NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            program VARCHAR(255),
            faculty VARCHAR(255),
            current_semester VARCHAR(50),
            year VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Courses table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(20) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            credits INT NOT NULL
        )
    ");

    // User Courses (Enrollments & Grades) table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            course_id INT NOT NULL,
            semester VARCHAR(50) NOT NULL,
            academic_year VARCHAR(50) NOT NULL,
            midterm_score FLOAT DEFAULT NULL,
            final_score FLOAT DEFAULT NULL,
            assignment_score FLOAT DEFAULT NULL,
            total_score FLOAT DEFAULT NULL,
            grade VARCHAR(10),
            status VARCHAR(50),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        )
    ");

    // Attendance table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS attendance (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_course_id INT NOT NULL,
            total_sessions INT NOT NULL,
            attended_sessions INT NOT NULL,
            FOREIGN KEY (user_course_id) REFERENCES user_courses(id) ON DELETE CASCADE
        )
    ");

    // Schedule table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS schedule (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            course_id INT NOT NULL,
            day_of_week VARCHAR(10) NOT NULL,
            start_time TIME NOT NULL,
            room VARCHAR(100),
            color_code VARCHAR(10),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        )
    ");

    // Deadlines table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS deadlines (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            course_id INT NOT NULL,
            task_name VARCHAR(255) NOT NULL,
            due_date DATETIME NOT NULL,
            weight VARCHAR(50),
            status VARCHAR(50) DEFAULT 'Pending',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        )
    ");

    // Notifications table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            icon VARCHAR(50),
            title VARCHAR(255) NOT NULL,
            body TEXT,
            time_label VARCHAR(100),
            tag VARCHAR(50),
            is_unread BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");

    // 3. Clear Existing Data to avoid duplicates if run multiple times
    echo "Clearing existing data...<br>";
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $pdo->exec("TRUNCATE TABLE notifications");
    $pdo->exec("TRUNCATE TABLE deadlines");
    $pdo->exec("TRUNCATE TABLE schedule");
    $pdo->exec("TRUNCATE TABLE attendance");
    $pdo->exec("TRUNCATE TABLE user_courses");
    $pdo->exec("TRUNCATE TABLE courses");
    $pdo->exec("TRUNCATE TABLE users");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

    // 4. Insert DB Data (Based on Ahmad Fauzi's mockup)
    echo "Inserting seed data...<br>";

    // User Ahmad Fauzi
    $passwordHash = password_hash('password123', PASSWORD_DEFAULT);
    $stmtUser = $pdo->prepare("INSERT INTO users (student_id, first_name, last_name, email, password_hash, program, faculty, current_semester, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmtUser->execute(['U2024-IT-0042', 'Ahmad', 'Fauzi', 'ahmad@unieis.edu', $passwordHash, 'Bachelor of Computer Science (Hons)', 'IT Faculty', 'Semester 2, 2024-2025', 'Year 3']);
    $userId = $pdo->lastInsertId();

    // Courses Setup (Sem 2, 2025)
    $coursesData = [
        ['IT301', 'Data Structures & Algorithms', 4],
        ['IT302', 'Network Security', 3],
        ['IT303', 'Machine Learning', 4],
        ['IT304', 'Software Engineering', 3],
        ['MPU3102', 'Co-curriculum I', 2],
        ['MPU2143', 'Ethnic Relations', 2]
    ];
    $courseIds = [];
    $stmtCourse = $pdo->prepare("INSERT INTO courses (code, name, credits) VALUES (?, ?, ?)");
    foreach ($coursesData as $c) {
        $stmtCourse->execute([$c[0], $c[1], $c[2]]);
        $courseIds[$c[0]] = $pdo->lastInsertId();
    }

    // Insert Grades for Sem 2 (User Courses)
    $gradesSem2 = [
        // code, midterm, final, assign, total, grade, status
        ['IT301', 82, 79, 88, 83, 'A-', 'Pass'],
        ['IT302', 74, 80, 85, 79, 'B+', 'Pass'],
        ['IT303', 91, 88, 92, 90, 'A', 'Pass'],
        ['IT304', 68, 72, 76, 71, 'B', 'Pass'],
        ['MPU3102', null, null, 88, 88, 'A-', 'Pass'],
        ['MPU2143', 55, 62, 70, 61, 'C+', 'Pass']
    ];
    $stmtUserCourse = $pdo->prepare("INSERT INTO user_courses (user_id, course_id, semester, academic_year, midterm_score, final_score, assignment_score, total_score, grade, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $userCourseIds = [];
    foreach ($gradesSem2 as $g) {
        $cId = $courseIds[$g[0]];
        $stmtUserCourse->execute([$userId, $cId, 'sem2', '2024-2025', $g[1], $g[2], $g[3], $g[4], $g[5], $g[6]]);
        $userCourseIds[$g[0]] = $pdo->lastInsertId();
    }

    // Attendance
    $attendanceData = [
        ['IT301', 40, 38], ['IT302', 36, 31], ['IT303', 40, 40],
        ['IT304', 36, 28], ['MPU3102', 20, 14], ['MPU2143', 32, 26]
    ];
    $stmtAtt = $pdo->prepare("INSERT INTO attendance (user_course_id, total_sessions, attended_sessions) VALUES (?, ?, ?)");
    foreach ($attendanceData as $a) {
        $ucId = $userCourseIds[$a[0]];
        $stmtAtt->execute([$ucId, $a[1], $a[2]]);
    }

    // Schedule
    $scheduleData = [
        ['IT301', 'MON', '08:00:00', 'Lab A-201', '#1D3461'],
        ['IT303', 'MON', '10:00:00', 'Lecture Hall 3', '#2E7D52'],
        ['IT302', 'TUE', '09:00:00', 'Lab B-102', '#C9A84C'],
        ['MPU2143', 'TUE', '14:00:00', 'Dewan Besar', '#7C3AED'],
        ['IT303', 'WED', '08:00:00', 'ML Lab-01', '#2E7D52'],
        ['IT304', 'WED', '11:00:00', 'Tutorial Rm 4', '#2563EB'],
        ['IT301', 'THU', '10:00:00', 'Tutorial Rm 2', '#1D3461'],
        ['MPU3102', 'THU', '15:00:00', 'Sports Hall', '#B7791F'],
        ['IT302', 'FRI', '08:00:00', 'Lab B-103', '#C9A84C'],
        ['IT304', 'FRI', '11:00:00', 'Tutorial Rm 5', '#2563EB']
    ];
    $stmtSched = $pdo->prepare("INSERT INTO schedule (user_id, course_id, day_of_week, start_time, room, color_code) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($scheduleData as $s) {
        $cId = $courseIds[$s[0]];
        $stmtSched->execute([$userId, $cId, $s[1], $s[2], $s[3], $s[4]]);
    }

    // Deadlines
    $deadlinesData = [
        ['IT303', 'Machine Learning Lab Report 3', '2025-02-22 23:59:00', '10%', 'Pending'],
        ['IT301', 'Assignment 2 — Sorting Algorithms', '2025-02-25 23:59:00', '15%', 'Pending'],
        ['IT302', 'Network Security Quiz 2', '2025-03-01 23:59:00', '5%', 'Pending'],
        ['IT304', 'Group Project Milestone 2', '2025-03-05 23:59:00', '20%', 'Pending'],
        ['MPU2143', 'Essay Submission', '2025-03-10 23:59:00', '15%', 'Submitted'],
    ];
    $stmtDeadline = $pdo->prepare("INSERT INTO deadlines (user_id, course_id, task_name, due_date, weight, status) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($deadlinesData as $d) {
        $cId = $courseIds[$d[0]];
        $stmtDeadline->execute([$userId, $cId, $d[1], $d[2], $d[3], $d[4]]);
    }

    // Notifications
    $notifData = [
        ['⚠️', 'Attendance Warning — MPU3102', 'Your attendance in Co-curriculum I is at 70%, below the required 80%. Please attend the next 3 sessions to avoid being barred.', 'Today, 9:14 AM', 'urgent', 1],
        ['📢', 'Grade Released — IT303', 'Your Machine Learning midterm grade is now available: 91/100. Excellent work!', 'Yesterday, 3:42 PM', 'success', 1],
        ['📅', 'Assignment Due — IT301', 'Data Structures Assignment 2 is due in 2 days (25 Feb). Upload your submission before 11:59 PM.', 'Yesterday, 10:00 AM', 'info', 1],
        ['🏆', "Dean's List Nomination", "Congratulations! Based on your Semester 1 results, you have been nominated for the Dean's List. Results will be announced on 28 Feb.", '20 Feb 2025', 'success', 0],
        ['📋', 'Final Exam Timetable Released', 'Your final exam schedule for Semester 2, 2025 has been published. Check your exam dates under Schedule.', '18 Feb 2025', 'info', 0],
    ];
    $stmtNotif = $pdo->prepare("INSERT INTO notifications (user_id, icon, title, body, time_label, tag, is_unread) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($notifData as $n) {
        $stmtNotif->execute([$userId, $n[0], $n[1], $n[2], $n[3], $n[4], $n[5]]);
    }

    // Add some random historical grades for Sem 1
    $coursesSem1 = [
        ['IT201', 'Database Systems', 4],
        ['IT202', 'Operating Systems', 3],
        ['IT203', 'Computer Architecture', 3],
        ['IT204', 'Web Technologies', 4],
        ['MPU2113', 'English for Academic Purposes', 3],
    ];
    foreach ($coursesSem1 as $c) {
        $stmtCourse->execute([$c[0], $c[1], $c[2]]);
        $cId = $pdo->lastInsertId();
        
        // Just mock some random total scores for history
        $score = rand(70, 95);
        $grade = $score >= 90 ? 'A' : ($score >= 80 ? 'A-' : ($score >= 75 ? 'B+' : 'B'));
        
        $stmtUserCourse->execute([$userId, $cId, 'sem1', '2024-2025', null, null, null, $score, $grade, 'Pass']);
    }

    echo "<b>Database Setup Completed Successfully!</b><br>";
    echo "You can now log in using:<br>";
    echo "Username/Email: U2024-IT-0042 (or ahmad@unieis.edu)<br>";
    echo "Password: password123<br>";

} catch (\PDOException $e) {
    echo "<b>Error during setup:</b> " . $e->getMessage() . "<br>";
    echo "Make sure your MySQL server is running and the DB_USER/DB_PASS in this script are correct for your environment.";
}
?>
