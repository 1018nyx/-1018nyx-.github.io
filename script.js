document.addEventListener("DOMContentLoaded", function () {
  var Game = {
    size: 5,
    tiles: [],
    score: 0,
    gameOver: false,
    isMerged: [],
    touchStartX: 0,
    touchStartY: 0,

    init: function () {
      this.createGrid();
      this.addRandomTile();
      this.addRandomTile();
      this.updateGrid();

      var gridContainer = document.querySelector(".grid-container");
      gridContainer.addEventListener("touchstart", this.handleTouchStart.bind(this));
      gridContainer.addEventListener("touchmove", this.handleTouchMove.bind(this));
      gridContainer.addEventListener("touchend", this.handleTouchEnd.bind(this));

      document.addEventListener("keydown", this.handleKeyDown.bind(this));
    },

    createGrid: function () {
      for (var i = 0; i < this.size; i++) {
        this.tiles[i] = [];
        this.isMerged[i] = [];
        for (var j = 0; j < this.size; j++) {
          this.tiles[i][j] = null;
          this.isMerged[i][j] = false;
        }
      }
    },

    addRandomTile: function () {
      var emptyTiles = [];
      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          if (this.tiles[i][j] === null) {
            emptyTiles.push({ row: i, col: j });
          }
        }
      }

      if (emptyTiles.length > 0) {
        var randomIndex = Math.floor(Math.random() * emptyTiles.length);
        var randomTile = emptyTiles[randomIndex];
        var newValue = Math.random() < 0.9 ? 2 : 4;
        this.tiles[randomTile.row][randomTile.col] = newValue;
      }
    },

    updateGrid: function () {
      var gridContainer = document.querySelector(".grid-container");
      gridContainer.innerHTML = "";

      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          var tile = this.tiles[i][j];
          var tileElement = document.createElement("div");
          tileElement.className = "tile";
          tileElement.textContent = tile !== null ? tile : "";
          tileElement.style.backgroundColor = this.getTileColor(tile);
          gridContainer.appendChild(tileElement);
        }
      }
    },

    getTileColor: function (value) {
      var colors = {
        2: "#eee4da",
        4: "#ede0c8",
        8: "#f2b179",
        16: "#f59563",
        32: "#f67c5f",
        64: "#f65e3b",
        128: "#edcf72",
        256: "#edcc61",
        512: "#edc850",
        1024: "#edc53f",
        2048: "#edc22e",
      };
      return colors[value] || "#cdc1b4";
    },

    moveTiles: function (direction) {
      if (this.gameOver) return;

      var self = this;
      var moved = false;

      var moveLeft = function () {
        // ...
      };

      var moveRight = function () {
        // ...
      };

      var moveUp = function () {
        // ...
      };

      var moveDown = function () {
        // ...
      };

      // Call the appropriate move function based on the direction
      if (direction === "left") {
        moveLeft();
      } else if (direction === "right") {
        moveRight();
      } else if (direction === "up") {
        moveUp();
      } else if (direction === "down") {
        moveDown();
      }

      if (moved) {
        this.addRandomTile();
        this.updateGrid();
        this.resetMergeStatus();

        if (this.isGameOver()) {
          this.gameOver = true;
          alert("Game Over! Your score: " + this.score);
        }
      }
    },

    resetMergeStatus: function () {
      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          this.isMerged[i][j] = false;
        }
      }
    },

    isGameOver: function () {
      // ...
    },

    handleTouchStart: function (event) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    },

    handleTouchMove: function (event) {
      event.preventDefault();
    },

    handleTouchEnd: function (event) {
      var touchEndX = event.changedTouches[0].clientX;
      var touchEndY = event.changedTouches[0].clientY;
      var deltaX = touchEndX - this.touchStartX;
      var deltaY = touchEndY - this.touchStartY;
      var direction = "";

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          direction = "right";
        } else {
          direction = "left";
        }
      } else {
        if (deltaY > 0) {
          direction = "down";
        } else {
          direction = "up";
        }
      }

      this.moveTiles(direction);
    },

    handleKeyDown: function (event) {
      var direction;
      switch (event.key) {
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
        default:
          return;
      }
      this.moveTiles(direction);
    },
  };

  Game.init();
});
