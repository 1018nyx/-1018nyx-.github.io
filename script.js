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
        this.isMerged = this.createEmptyArray();
        if (!this.canMove()) {
          this.gameOver = true;
          alert("Game Over! Your score: " + this.score);
        }
      }
    },

    createEmptyArray: function () {
      var arr = [];
      for (var i = 0; i < this.size; i++) {
        arr[i] = [];
        for (var j = 0; j < this.size; j++) {
          arr[i][j] = false;
        }
      }
      return arr;
    },

    canMove: function () {
      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          if (this.tiles[i][j] === null) {
            return true;
          }
          if (j > 0 && this.tiles[i][j] === this.tiles[i][j - 1]) {
            return true;
          }
          if (j < this.size - 1 && this.tiles[i][j] === this.tiles[i][j + 1]) {
            return true;
          }
          if (i > 0 && this.tiles[i][j] === this.tiles[i - 1][j]) {
            return true;
          }
          if (i < this.size - 1 && this.tiles[i][j] === this.tiles[i + 1][j]) {
            return true;
          }
        }
      }
      return false;
    },

    addTouchListeners: function () {
      var gridContainer = document.querySelector(".grid-container");
      var self = this;

      gridContainer.addEventListener("touchstart", function (event) {
        self.touchStartX = event.touches[0].clientX;
        self.touchStartY = event.touches[0].clientY;
      });

      gridContainer.addEventListener("touchmove", function (event) {
        event.preventDefault();
      });

      gridContainer.addEventListener("touchend", function (event) {
        var touchEndX = event.changedTouches[0].clientX;
        var touchEndY = event.changedTouches[0].clientY;
        var dx = touchEndX - self.touchStartX;
        var dy = touchEndY - self.touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) {
            self.moveTiles("right");
          } else if (dx < 0) {
            self.moveTiles("left");
          }
        } else {
          if (dy > 0) {
            self.moveTiles("down");
          } else if (dy < 0) {
            self.moveTiles("up");
          }
        }
      });
    },
  };

  Game.init();

  document.addEventListener("keydown", function (event) {
    var direction = "";
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
    }
    if (direction !== "") {
      Game.moveTiles(direction);
    }
  });
});
