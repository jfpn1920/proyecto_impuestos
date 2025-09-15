<?php
// incluir la conexión
include("conexion.php");

// Verificar si la petición es POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Validar que se envíen los datos
    if (!isset($_POST['nombre_municipio']) || !isset($_FILES['archivo_excel'])) {
        die("❌ Datos incompletos.");
    }

    // Capturar datos del formulario
    $nombre_municipio = mysqli_real_escape_string($conn, $_POST['nombre_municipio']);
    $archivo = $_FILES['archivo_excel'];

    // Carpeta donde se guardarán los archivos
    $carpetaDestino = "uploads/";
    if (!file_exists($carpetaDestino)) {
        mkdir($carpetaDestino, 0777, true);
    }

    // Crear nombre único para evitar sobrescribir archivos
    $nombreArchivoFinal = time() . "_" . basename($archivo["name"]);
    $rutaFinal = $carpetaDestino . $nombreArchivoFinal;

    // Subir archivo al servidor
    if (move_uploaded_file($archivo["tmp_name"], $rutaFinal)) {

        // Insertar en la base de datos con sentencia preparada
        $sql = "INSERT INTO datos_de_municipio (nombre_municipio, archivo_excel) 
                VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $nombre_municipio, $nombreArchivoFinal);

        if ($stmt->execute()) {
            echo "✅ Municipio y archivo guardados correctamente.";
        } else {
            echo "❌ Error al guardar en la BD: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "❌ Error al subir el archivo.";
    }
}

$conn->close();
?>
