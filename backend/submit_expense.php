<?php
// Database connection
$servername = "127.0.0.1";
$username = "SamP231004"; // Default MySQL username
$password = "password"; // Default MySQL password (empty for XAMPP/MAMP)
$dbname = "expense_tracker"; // The database you created

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if data is submitted via POST method
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $type = $_POST['type'];
    $amount = $_POST['amount'];
    $category = $_POST['category'];
    $date = $_POST['date'];

    // SQL query to insert data into the expenses table
    $sql = "INSERT INTO expenses (type, amount, category, date) 
            VALUES ('$type', '$amount', '$category', '$date')";

    if ($conn->query($sql) === TRUE) {
        echo "Expense added successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    // Close the connection
    $conn->close();
}
?>
