<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$servername = "127.0.0.1";
$username = "SamP231004";
$password = "password"; 
$dbname = "expense_tracker";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

if (isset($_GET['email'])) {
    $userEmail = $_GET['email'];

    $stmtUser = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmtUser->bind_param("s", $userEmail);
    $stmtUser->execute();
    $stmtUser->bind_result($userId);
    $stmtUser->fetch();
    $stmtUser->close();

    if (!isset($userId)) {
        echo json_encode(["error" => "User not found"]);
        exit();
    }

    $stmt = $conn->prepare("SELECT type, amount, category, date FROM expenses WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $expenses = array();
    while ($row = $result->fetch_assoc()) {
        $expenses[] = $row;
    }

    echo json_encode($expenses);

    $stmt->close();
    $conn->close();
} 
else {
    echo json_encode(["error" => "User email not provided"]);
}
?>