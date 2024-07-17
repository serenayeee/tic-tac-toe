document.addEventListener('DOMContentLoaded', () => {
    let firstMotion = 'X';
    let spaceVariables = { a: '', b: '', c: '', d: '', e: '', f: '', g: '', h: '', i: '' };
    let tictactoeFunction = true;
    let scoreOfFirstPlayer = 0;
    let scoreOfSecondPlayer = 0;

    const stage = document.getElementById('stage');
    const spaces = document.querySelectorAll('.space');
    const playerMotion = document.getElementById('playerMove');
    const scoreOfPlayerX = document.getElementById('ScoreOfPlayerX');
    const scoreOfPlayerO = document.getElementById('ScoreOfPlayerO');
    const replay = document.getElementById('replayGame');
    const leaderboardList = document.getElementById('leaderboardList');
    const victorySpaces = [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i'], ['a', 'd', 'g'], ['b', 'e', 'h'], ['c', 'f', 'i'], ['a', 'e', 'i'], ['c', 'e', 'g']];

    const fetchGameState = async () => {
        const response = await fetch('gamestate.php');
        const data = await response.json();
        if (data) {
            spaceVariables = data.board;
            firstMotion = data.currentPlayer;
            tictactoeFunction = data.isGameActive;
            updateBoard();
        }
    };

    const saveGameState = async () => {
        await fetch('gamestate.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ board: spaceVariables, currentPlayer: firstMotion, isGameActive: tictactoeFunction })
        });
    };

    const updateLeaderboard = async () => {
        const response = await fetch('leaderboard.php');
        const data = await response.json();
        leaderboardList.innerHTML = '';
        data.forEach((entry) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.player}: ${entry.score}`;
            leaderboardList.appendChild(listItem);
        });
    };

    const spaceCover = async (event) => {
        const space = event.target;
        const spaceIndex = Array.from(spaces).indexOf(space);
        const spaceKey = Object.keys(spaceVariables)[spaceIndex];
        if (spaceVariables[spaceKey] !== '' || !tictactoeFunction) return;

        space.textContent = firstMotion;
        spaceVariables[spaceKey] = firstMotion;

        if (playerVictory()) {
            playerMotion.textContent = `Player ${firstMotion} is victorious!`;
            scoreCount(firstMotion);
            await saveScore(firstMotion);  
            tictactoeFunction = false;
        } else if (tieOfGame()) {
            playerMotion.textContent = "Tie!";
            tictactoeFunction = false;
        } else {
            await saveGameState();  
            nextMove();
        }
    };

    const nextMove = () => {
        firstMotion = firstMotion === 'X' ? 'O' : 'X';
        playerMotion.textContent = `Player ${firstMotion} makes the move`;
    };

    const playerVictory = () => {
        return victorySpaces.some(condition => {
            return condition.every(index => {
                return spaceVariables[index] === firstMotion;
            });
        });
    };

    const tieOfGame = () => {
        return Object.values(spaceVariables).every(value => value !== '');
    };

    const scoreCount = (player) => {
        if (player === 'X') {
            scoreOfFirstPlayer++;
            scoreOfPlayerX.textContent = scoreOfFirstPlayer;
        } else {
            scoreOfSecondPlayer++;
            scoreOfPlayerO.textContent = scoreOfSecondPlayer;
        }
    };

    const saveScore = async (player) => {
        const score = player === 'X' ? scoreOfFirstPlayer : scoreOfSecondPlayer;
        console.log(`Saving score for ${player}: ${score}`);
        await fetch('leaderboard.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player: player, score: score })
        });
        updateLeaderboard();
    };    

    const replayGame = () => {
        firstMotion = 'X';
        spaceVariables = { a: '', b: '', c: '', d: '', e: '', f: '', g: '', h: '', i: '' };
        tictactoeFunction = true;
        playerMotion.textContent = `Player ${firstMotion} makes the move`;
        spaces.forEach(space => space.textContent = '');
        saveGameState();  
    };

    const updateBoard = () => {
        spaces.forEach((space, index) => {
            space.textContent = spaceVariables[Object.keys(spaceVariables)[index]];
        });
    };

    spaces.forEach(space => space.addEventListener('click', spaceCover));
    replay.addEventListener('click', replayGame);
    fetchGameState();  
    playerMotion.textContent = `Player ${firstMotion} makes the move`;
    updateLeaderboard();  
});
