<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

$databaseFile = __DIR__ . "/../database.json";

function readDatabase($file) {
    if (!file_exists($file)) return null;

    $fp = fopen($file, "r");
    flock($fp, LOCK_SH);
    $content = fread($fp, filesize($file));
    flock($fp, LOCK_UN);
    fclose($fp);

    return json_decode($content, true);
}

function writeDatabase($file, $data) {
    $fp = fopen($file, "c+");
    flock($fp, LOCK_EX);
    ftruncate($fp, 0);
    fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
}

$action = $_GET["action"] ?? null;
$db = readDatabase($databaseFile);

if ($action === "get") {
    echo json_encode($db);
    exit;
}

if ($action === "save") {
    $input = json_decode(file_get_contents("php://input"), true);
    writeDatabase($databaseFile, $input);
    echo json_encode(["success" => true]);
    exit;
}

echo json_encode(["error" => "Acción no válida"]);
