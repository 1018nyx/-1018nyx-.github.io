document.addEventListener("DOMContentLoaded", function () {
  var Game = {
    size: 5,
    tiles: [],
    score: 0,
    gameOver: false,
    isMerged: [],

    init: function () {
      this.createGrid();
      this.addRandomTile();
      this.addRandomTile();
      this.updateGrid();
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
        4: "#ede0c
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
        this.isMerged = this.createEmptyGrid();
        if (!this.canMove()) {
          this.gameOver = true;
          alert("Game Over!");
        }
      }
    },

    createEmptyGrid: function () {
      var emptyGrid = [];
      for (var i = 0; i < this.size; i++) {
        emptyGrid[i] = [];
        for (var j = 0; j < this.size; j++) {
          emptyGrid[i][j] = false;
        }
      }
      return emptyGrid;
    },

    canMove: function () {
      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          var currentTile = this.tiles[i][j];
          if (
            currentTile === null ||
            (j > 0 && this.tiles[i][j - 1] === currentTile) ||
            (j < this.size - 1 && this.tiles[i][j + 1] === currentTile) ||
            (i > 0 && this.tiles[i - 1][j] === currentTile) ||
            (i < this.size - 1 && this.tiles[i + 1][j] === currentTile)
          ) {
            return true;
          }
        }
      }
      return false;
    },
  };

  Game.init();

  document.addEventListener("keydown", function (event) {
    var key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") {
      Game.moveTiles("left");
    } else if (key === "arrowright" || key === "d") {
      Game.moveTiles("right");
    } else if (key === "arrowup" || key === "w") {
      Game.moveTiles("up");
    } else if (key === "arrowdown" || key === "s") {
      Game.moveTiles("down");
    }
  });
});
