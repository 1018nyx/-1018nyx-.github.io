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
      this.tiles = [];
      this.isMerged = [];
      for (var i = 0; i < this.size; i++) {
        var row = [];
        var isMergedRow = [];
        for (var j = 0; j < this.size; j++) {
          row.push(null);
          isMergedRow.push(false);
        }
        this.tiles.push(row);
        this.isMerged.push(isMergedRow);
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
            if (self.tiles[i][j] !== null) {
              for (var k = j; k > 0; k--) {
                if (self.tiles[i][k - 1] === null) {
                  self.tiles[i][k - 1] = self.tiles[i][k];
                  self.tiles[i][k] = null;
                  moved = true;
                } else if (
                  self.tiles[i][k - 1] === self.tiles[i][k] &&
                  !self.isMerged[i][k - 1] &&
                  !self.isMerged[i][k]
                ) {
                  self.tiles[i][k - 1] *= 2;
                  self.score += self.tiles[i][k - 1];
                  self.tiles[i][k] = null;
                  self.isMerged[i][k - 1] = true;
                  moved = true;
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }
      };

      var moveRight = function () {
        for (var i = 0; i < self.size; i++) {
          for (var j = self.size - 2; j >= 0; j--) {
            if (self.tiles[i][j] !== null) {
              for (var k = j; k < self.size - 1; k++) {
                if (self.tiles[i][k + 1] === null) {
                  self.tiles[i][k + 1] = self.tiles[i][k];
                  self.tiles[i][k] = null;
                  moved = true;
                } else if (
                  self.tiles[i][k + 1] === self.tiles[i][k] &&
                  !self.isMerged[i][k + 1] &&
                  !self.isMerged[i][k]
                ) {
                  self.tiles[i][k + 1] *= 2;
                  self.score += self.tiles[i][k + 1];
                  self.tiles[i][k] = null;
                  self.isMerged[i][k + 1] = true;
                  moved = true;
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }
      };

      var moveUp = function () {
        for (var j = 0; j < self.size; j++) {
          for (var i = 1; i < self.size; i++) {
            if (self.tiles[i][j] !== null) {
              for (var k = i; k > 0; k--) {
                if (self.tiles[k - 1][j] === null) {
                  self.tiles[k - 1][j] = self.tiles[k][j];
                  self.tiles[k][j] = null;
                  moved = true;
                } else if (
                  self.tiles[k - 1][j] === self.tiles[k][j] &&
                  !self.isMerged[k - 1][j] &&
                  !self.isMerged[k][j]
                ) {
                  self.tiles[k - 1][j] *= 2;
                  self.score += self.tiles[k - 1][j];
                  self.tiles[k][j] = null;
                  self.isMerged[k - 1][j] = true;
                  moved = true;
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }
      };

      var moveDown = function () {
        for (var j = 0; j < self.size; j++) {
          for (var i = self.size - 2; i >= 0; i--) {
            if (self.tiles[i][j] !== null) {
              for (var k = i; k < self.size - 1; k++) {
                if (self.tiles[k + 1][j] === null) {
                  self.tiles[k + 1][j] = self.tiles[k][j];
                  self.tiles[k][j] = null;
                  moved = true;
                } else if (
                  self.tiles[k + 1][j] === self.tiles[k][j] &&
                  !self.isMerged[k + 1][j] &&
                  !self.isMerged[k][j]
                ) {
                  self.tiles[k + 1][j] *= 2;
                  self.score += self.tiles[k + 1][j];
                  self.tiles[k][j] = null;
                  self.isMerged[k + 1][j] = true;
                  moved = true;
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }
      };

      switch (direction) {
        case "left":
          moveLeft();
          break;
        case "right":
          moveRight();
          break;
        case "up":
          moveUp();
          break;
        case "down":
          moveDown();
          break;
      }

      if (moved) {
        this.addRandomTile();
        this.updateGrid();
        this.checkGameOver();
      }
    },

    handleKeyDown: function (event) {
      var keyCode = event.keyCode;
      var direction = "";

      switch (keyCode) {
        case 37:
          direction = "left";
          break;
        case 38:
          direction = "up";
          break;
        case 39:
          direction = "right";
          break;
        case 40:
          direction = "down";
          break;
      }

      if (direction !== "") {
        this.moveTiles(direction);
      }
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

      var dx = touchEndX - this.touchStartX;
      var dy = touchEndY - this.touchStartY;

      var absDx = Math.abs(dx);
      var absDy = Math.abs(dy);

      var direction = "";

      if (Math.max(absDx, absDy) > 10) {
        if (absDx > absDy) {
          direction = dx > 0 ? "right" : "left";
        } else {
          direction = dy > 0 ? "down" : "up";
        }
      }

      if (direction !== "") {
        this.moveTiles(direction);
      }
    },

    checkGameOver: function () {
      var movesAvailable = false;

      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          if (this.tiles[i][j] === null) {
            movesAvailable = true;
            break;
          }
          if (i > 0 && this.tiles[i][j] === this.tiles[i - 1][j]) {
            movesAvailable = true;
            break;
          }
          if (i < this.size - 1 && this.tiles[i][j] === this.tiles[i + 1][j]) {
            movesAvailable = true;
            break;
          }
          if (j > 0 && this.tiles[i][j] === this.tiles[i][j - 1]) {
            movesAvailable = true;
            break;
          }
          if (j < this.size - 1 && this.tiles[i][j] === this.tiles[i][j + 1]) {
            movesAvailable = true;
            break;
          }
        }
      }

      if (!movesAvailable) {
        this.gameOver = true;
        alert("Game Over!");
      }
    },
  };

  Game.init();
});
