const App = {
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetBtn: document.querySelector("[data-id=reset-btn]"),
    newRoundBtn: document.querySelector("[data-id=new-round-btn]"),
    squares: document.querySelectorAll('[data-id="square"]'),
    modal: document.querySelector('[data-id="modal"]'),
    modalText: document.querySelector('[data-id="modal-text"]'),
    modalBtn: document.querySelector('[data-id="modal-btn"]'),
    turn: document.querySelector('[data-id="turn"]'),
  },

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => move.squareId);

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;
    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress",
      winner,
    };
  },

  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    //DONE
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });

    //TODO
    App.$.resetBtn.addEventListener("click", (event) => {
      console.log("Reset the game.");
    });

    //TODO
    App.$.newRoundBtn.addEventListener("click", (event) => {
      console.log("Add a new round.");
    });

    App.$.modalBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add("hidden");
    });

    //TODO
    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };

        if (hasMove(+square.id)) {
          return;
        }

        // const lastMove = App.state.moves.at(-1);
        const currentPlayer = App.state.moves.length % 2 == 0 ? 1 : 2;
        const oppositePlayer = ((currentPlayer - 1) ^ 1) + 1;
        const nextPlayer = oppositePlayer;

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer}, you're up !`;

        if (currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnLabel.classList = "turquoise";
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnLabel.classList = "yellow";
        }

        App.$.turn.replaceChildren(turnIcon, turnLabel);

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        App.state.curretPlayer = currentPlayer === 1 ? 2 : 1;

        square.replaceChildren(squareIcon);

        //Check whether the game will be end.
        const game = App.getGameStatus(App.state.moves);
        let message = "";
        if (game.status === "complete") {
          App.$.modal.classList.remove("hidden");
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = `Tie game !`;
          }
          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

window.addEventListener("load", App.init);
