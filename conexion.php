<?php
$host = "localhost";     
$user = "root";          
$password = "";          
$dbname = "proyecto_impuestos"; 
$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die("❌ Conexión fallida: " . $conn->connect_error);
} else {
}
?>