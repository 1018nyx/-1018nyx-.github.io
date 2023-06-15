document.addEventListener("DOMContentLoaded", function () {
  var Game = {
    size: 5,
    tiles: [],
    score: 0,
    gameOver: false,
    isMerged: [],
    touchStartX: 0,
    touchStartY: 0,
    touchEndX: 0,
    touchEndY: 0,

    init: function () {
      this.createGrid();
      this.addRandomTile();
      this.addRandomTile();
      this.updateGrid();
      this.addTouchListeners();
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
        for (var i = 0; i < self.size; i++) {
          for (var j = 1; j < self.size; j++) {
            var currentTile = self.tiles[i][j];
            if (currentTile !== null) {
              var k = j - 1;
              while (k >= 0 && self.tiles[i][k] === null) {
                self.tiles[i][k] = currentTile;
                self.tiles[i][k + 1] = null;
                k--;
                moved = true;
              }
              if (
                k >= 0 &&
                self.tiles[i][k] === currentTile &&
                !self.isMerged[i][k]
              ) {
                self.tiles[i][k] *= 2;
                self.tiles[i][k + 1] = null;
                self.score += self.tiles[i][k];
                self.isMerged[i][k] = true;
                moved = true;
              }
            }
          }
        }
      };

      var moveRight = function () {
        for (var i = 0; i < self.size; i++) {
          for (var j = self.size - 2; j >= 0; j--) {
            var currentTile = self.tiles[i][j];
            if (currentTile !== null) {
              var k = j + 1;
              while (k < self.size && self.tiles[i][k] === null) {
                self.tiles[i][k] = currentTile;
                self.tiles[i][k - 1] = null;
                k++;
                moved = true;
              }
              if (
                k < self.size &&
                self.tiles[i][k] === currentTile &&
                !self.isMerged[i][k]
              ) {
                self.tiles[i][k] *= 2;
                self.tiles[i][k - 1] = null;
                self.score += self.tiles[i][k];
                self.isMerged[i][k] = true;
                moved = true;
              }
            }
          }
        }
      };

      var moveUp = function () {
        for (var i = 1; i < self.size; i++) {
          for (var j = 0; j < self.size; j++) {
            var currentTile = self.tiles[i][j];
            if (currentTile !== null) {
              var k = i - 1;
              while (k >= 0 && self.tiles[k][j] === null) {
                self.tiles[k][j] = currentTile;
                self.tiles[k + 1][j] = null;
                k--;
                moved = true;
              }
              if (
                k >= 0 &&
                self.tiles[k][j] === currentTile &&
                !self.isMerged[k][j]
              ) {
                self.tiles[k][j] *= 2;
                self.tiles[k + 1][j] = null;
                self.score += self.tiles[k][j];
                self.isMerged[k][j] = true;
                moved = true;
              }
            }
          }
        }
      };

      var moveDown = function () {
        for (var i = self.size - 2; i >= 0; i--) {
          for (var j = 0; j < self.size; j++) {
            var currentTile = self.tiles[i][j];
            if (currentTile !== null) {
              var k = i + 1;
              while (k < self.size && self.tiles[k][j] === null) {
                self.tiles[k][j] = currentTile;
                self.tiles[k - 1][j] = null;
                k++;
                moved = true;
              }
              if (
                k < self.size &&
                self.tiles[k][j] === currentTile &&
                !self.isMerged[k][j]
              ) {
                self.tiles[k][j] *= 2;
                self.tiles[k - 1][j] = null;
                self.score += self.tiles[k][j];
                self.isMerged[k][j] = true;
                moved = true;
              }
            }
          }
        }
      };

      var handleMove = function () {
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
          self.addRandomTile();
          self.updateGrid();
          self.checkGameOver();
        }
      };

      handleMove();
    },

    addTouchListeners: function () {
      var gridContainer = document.querySelector(".grid-container");

      gridContainer.addEventListener("touchstart", function (event) {
        var touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
      });

      gridContainer.addEventListener("touchmove", function (event) {
        event.preventDefault();
      });

      gridContainer.addEventListener("touchend", function (event) {
        var touch = event.changedTouches[0];
        this.touchEndX = touch.clientX;
        this.touchEndY = touch.clientY;

        var deltaX = this.touchEndX - this.touchStartX;
        var deltaY = this.touchEndY - this.touchStartY;
        var swipeThreshold = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) {
              // Swipe right
              this.moveTiles("right");
            } else {
              // Swipe left
              this.moveTiles("left");
            }
          }
        } else {
          if (Math.abs(deltaY) > swipeThreshold) {
            if (deltaY > 0) {
              // Swipe down
              this.moveTiles("down");
            } else {
              // Swipe up
              this.moveTiles("up");
            }
          }
        }
      });
    },

    checkGameOver: function () {
      // Check if there are any valid moves left
      var validMoves = false;

      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          if (this.tiles[i][j] === null) {
            validMoves = true;
            break;
          }
          if (j < this.size - 1 && this.tiles[i][j] === this.tiles[i][j + 1]) {
            validMoves = true;
            break;
          }
          if (i < this.size - 1 && this.tiles[i][j] === this.tiles[i + 1][j]) {
            validMoves = true;
            break;
          }
        }
      }

      if (!validMoves) {
        this.gameOver = true;
        alert("Game Over! Your Score: " + this.score);
      }
    },
  };

  Game.init();
});
