const board = document.querySelector(".game-board");
board.addEventListener("click", (e) => gameManager.playRound(e));

const announcer = document.querySelector(".announcer");

const Player = function (sign, name) {
  return { name, sign };
};

const Tile = function () {
  let element = document.createElement("div");
  element.classList.add("tile");
  element.setAttribute("data-sign", "");

  let sign = "";

  return { element, sign };
};

const player1 = Player("X", "Player 1");
const player2 = Player("O", "Player 2");

const gameManager = ((player1, player2) => {
  let currentPlayer = player1;
  let tiles = null;
  let tilesArray = Array(9).fill("");
  let gameEnded = false;

  const _updateTilesArray = () => {
    tilesArray = [...tiles].map((element) => {
      return element.getAttribute("data-sign");
    });
  };

  const _setupBoard = () => {
    for (let i = 0; i < 9; i++) {
      let tile = Tile.call(currentPlayer);
      board.append(tile.element);
    }
    tiles = board.querySelectorAll(".tile");
  };

  const _findWinPattern = (tilesArray, step, wideness) => {
    for (let i = 0; i < tilesArray.length; i += wideness) {
      const tile1 = tilesArray[i];
      const tile2 = tilesArray[i + step];
      const tile3 = tilesArray[i + step * 2];
      if (
        ![tile1, tile2, tile3].includes("") &&
        tile1 === tile2 &&
        tile2 === tile3
      ) {
        return true;
      }
    }
    return false;
  };

  const _checkRow = (tilesArray) => {
    return _findWinPattern(tilesArray, 1, 3);
  };

  const _checkColumn = (tilesArray) => {
    return _findWinPattern(tilesArray, 3, 1);
  };

  const _checkBasicConditions = (tilesArray) => {
    const leftDiagonal = [tilesArray[0], tilesArray[4], tilesArray[8]];
    const rightDiagonal = [tilesArray[2], tilesArray[4], tilesArray[6]];

    const allSameLeftDiagonal =
      leftDiagonal[0] === leftDiagonal[1] &&
      leftDiagonal[1] === leftDiagonal[2];
    const allSameRightDiagonal =
      rightDiagonal[0] === rightDiagonal[1] &&
      rightDiagonal[1] === rightDiagonal[2];

    return (
      (!leftDiagonal.includes("") && allSameLeftDiagonal) ||
      (!rightDiagonal.includes("") && allSameRightDiagonal)
    );
  };

  const _checkDraw = (won) => {
    return !won && !tilesArray.includes("");
  };

  const _checkWin = () => {
    let winConditions = [
      _checkBasicConditions(tilesArray),
      _checkRow(tilesArray),
      _checkColumn(tilesArray),
    ];

    return winConditions.includes(true);
  };

  const _setTile = (e) => {
    element = e.target;

    const signLiteral = document.createElement("span");
    signLiteral.textContent = currentPlayer.sign;

    element.append(signLiteral);
    element.setAttribute("data-sign", currentPlayer.sign);
    currentPlayer = currentPlayer === player1 ? player2 : player1;

    _updateTilesArray();
  };

  const _announceTurn = () => {
    announcer.textContent = `${currentPlayer.name}'s turn`;
  };

  const _announceDraw = () => {
    announcer.textContent = `It's a draw!`;
  };

  const _announceWinner = () => {
    announcer.textContent = `Congratulations! ${currentPlayer.name} has won!`;
  };

  const startGame = () => {
    _setupBoard();
    _announceTurn();
  };

  const playRound = (e) => {
    if (
      !gameEnded &&
      e.target.classList.contains("tile") &&
      e.target.children.length === 0
    ) {
      _setTile(e);

      const hasCurrentPlayerWon = _checkWin();

      if (hasCurrentPlayerWon) {
        _announceWinner();
        gameEnded = true;
      } else if (_checkDraw(hasCurrentPlayerWon)) {
        _announceDraw();
        gameEnded = true;
      } else {
        _announceTurn();
      }
    }
  };

  return { playRound, startGame };
})(player1, player2);

gameManager.startGame();
