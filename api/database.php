<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

$databaseFile = __DIR__ . "/../database.json";

function readDatabase($file) {
    $fp = fopen($file, "r");
    if (!$fp) return null;

    flock($fp, LOCK_SH);
    $content = fread($fp, filesize($file));
    flock($fp, LOCK_UN);
    fclose($fp);

    return json_decode($content, true);
}

function writeDatabase($file, $data) {
    $fp = fopen($file, "c+");
    if (!$fp) return false;

    flock($fp, LOCK_EX);
    ftruncate($fp, 0);
    fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    return true;
}

$db = readDatabase($databaseFile);
if (!$db) {
    echo json_encode(["error" => "No se pudo leer la base de datos"]);
    exit;
}

$action = $_GET["action"] ?? null;

switch ($action) {

    case "get":
        echo json_encode($db);
        break;

    case "save":
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) {
            echo json_encode(["error" => "Datos inválidos"]);
            exit;
        }

        if (writeDatabase($databaseFile, $input)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["error" => "No se pudo guardar"]);
        }
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
}
