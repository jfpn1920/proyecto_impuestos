<?php
header('Content-Type: application/json; charset=utf-8');
include 'conexion.php';

// Ajusta $conn según tu conexion.php (aquí asumo $conn)
$sql = "SELECT id, nombre_municipio, archivo_excel FROM datos_de_municipio ORDER BY fecha_registro DESC";
$result = $conn->query($sql);

$rows = [];
if ($result) {
    while ($r = $result->fetch_assoc()) {
        $rows[] = $r;
    }
}

echo json_encode($rows);

$conn->close();
