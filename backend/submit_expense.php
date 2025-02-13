<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require __DIR__ . '/db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

error_log("Received data: " . print_r($data, true));

if (!isset($data['email'], $data['type'], $data['amount'], $data['category'], $data['date'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields", "data" => $data]);
    exit();
}

$email = $data['email'];
$type = $data['type'];
$amount = $data['amount'];
$category = $data['category'];
$date = $data['date'];

error_log("Received email: " . $email);

$stmtUser = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmtUser->bind_param("s", $email);
$stmtUser->execute();
$stmtUser->bind_result($userId);
$stmtUser->fetch();
$stmtUser->close();

if (!$userId) {
    echo json_encode(["success" => false, "message" => "User not found", "userId" => $userId]);
    exit();
}

error_log("User ID retrieved: " . $userId);

$stmt = $conn->prepare("INSERT INTO expenses (user_id, type, amount, category, date) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("isdss", $userId, $type, $amount, $category, $date);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Expense added successfully!"]);
} 
else {
    echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>