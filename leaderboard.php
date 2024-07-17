<?php
session_start();

if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = [];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $player = $data['player'] ?? '';
    $score = $data['score'] ?? 0;

    $_SESSION['leaderboard'][] = ['player' => $player, 'score' => $score];

    usort($_SESSION['leaderboard'], function ($a, $b) {
        return $b['score'] <=> $a['score'];
    });
    $_SESSION['leaderboard'] = array_slice($_SESSION['leaderboard'], 0, 10);

    echo json_encode(['status' => 'success']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($_SESSION['leaderboard']);
    exit;
}
?>
