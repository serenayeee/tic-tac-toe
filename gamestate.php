<?php
session_start();

if (!isset($_SESSION['gameState'])) {
    $_SESSION['gameState'] = [
        'board' => ['', '', '', '', '', '', '', '', ''],
        'currentPlayer' => 'X',
        'isGameActive' => true
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $board = $data['board'] ?? $_SESSION['gameState']['board'];
    $currentPlayer = $data['currentPlayer'] ?? $_SESSION['gameState']['currentPlayer'];
    $isGameActive = $data['isGameActive'] ?? $_SESSION['gameState']['isGameActive'];

    if (is_array($board) && count($board) === 9) {
        $_SESSION['gameState']['board'] = $board;
    }
    
    $_SESSION['gameState']['currentPlayer'] = $currentPlayer;
    $_SESSION['gameState']['isGameActive'] = $isGameActive;

    echo json_encode(['status' => 'success']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($_SESSION['gameState']);
    exit;
}
?>
