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
                self.tiles[i][k] = null;
                self.score += self.tiles[i][k - 1];
                self.isMerged[i][k - 1] = true;
                moved = true;
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
                self.tiles[i][k] = null;
                self.score += self.tiles[i][k + 1];
                self.isMerged[i][k + 1] = true;
                moved = true;
              }
            }
          }
        }
      }
    };

    var moveUp = function () {
      for (var i = 1; i < self.size; i++) {
        for (var j = 0; j < self.size; j++) {
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
                self.tiles[k][j] = null;
                self.score += self.tiles[k - 1][j];
                self.isMerged[k - 1][j] = true;
                moved = true;
              }
            }
          }
        }
      }
    };

    var moveDown = function () {
      for (var i = self.size - 2; i >= 0; i--) {
        for (var j = 0; j < self.size; j++) {
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
                self.tiles[k][j] = null;
                self.score += self.tiles[k + 1][j];
                self.isMerged[k + 1][j] = true;
                moved = true;
              }
            }
          }
        }
      }
    };

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
      this.checkGameOver();
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

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        this.moveTiles("right");
      } else {
        this.moveTiles("left");
      }
    } else {
      if (dy > 0) {
        this.moveTiles("down");
      } else {
        this.moveTiles("up");
      }
    }
  },

  handleKeyDown: function (event) {
    if (event.key === "ArrowUp") {
      this.moveTiles("up");
    } else if (event.key === "ArrowDown") {
      this.moveTiles("down");
    } else if (event.key === "ArrowLeft") {
      this.moveTiles("left");
    } else if (event.key === "ArrowRight") {
      this.moveTiles("right");
    }
  },

  checkGameOver: function () {
    // Check if there are any empty tiles
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        if (this.tiles[i][j] === null) {
          return;
        }
      }
    }

    // Check if there are any adjacent tiles with the same value
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        if (
          (i > 0 && this.tiles[i][j] === this.tiles[i - 1][j]) ||
          (i < this.size - 1 && this.tiles[i][j] === this.tiles[i + 1][j]) ||
          (j > 0 && this.tiles[i][j] === this.tiles[i][j - 1]) ||
          (j < this.size - 1 && this.tiles[i][j] === this.tiles[i][j + 1])
        ) {
          return;
        }
      }
    }

    // Game over
    this.gameOver = true;
    alert("Game Over! Your score: " + this.score);
  },
};

document.addEventListener("DOMContentLoaded", function () {
  Game.init();
});
