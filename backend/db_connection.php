<?php
$servername = "127.0.0.1";
$username = "SamP231004";
$password = "password";
$dbname = "expense_tracker";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>