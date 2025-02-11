<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type"); 
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "127.0.0.1";
$username = "root"; 
$password = ""; 
$dbname = "expense_tracker"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        die(json_encode(["error" => "Invalid JSON input"]));
    }

    $type = $data['type'];
    $amount = $data['amount'];
    $category = $data['category'];
    $date = $data['date'];

    $stmt = $conn->prepare("INSERT INTO expenses (type, amount, category, date) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sdss", $type, $amount, $category, $date);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Expense added successfully!"]);
    } 
    else {
        echo json_encode(["error" => "Error: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} 
else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
}
?>
