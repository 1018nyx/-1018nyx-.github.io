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
            }
          }
        }
      };

      var mergeLeft = function () {
        for (var i = 0; i < self.size; i++) {
          for (var j = 1; j < self.size; j++) {
            var currentTile = self.tiles[i][j];
            var previousTile = self.tiles[i][j - 1];
            if (currentTile !== null && currentTile === previousTile && !self.isMerged[i][j - 1]) {
              self.tiles[i][j - 1] = currentTile * 2;
              self.tiles[i][j] = null;
              self.score += currentTile * 2;
              self.isMerged[i][j - 1] = true;
              moved = true;
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
            }
          }
        }
      };

      var mergeUp = function () {
        for (var i = 1; i < self.size; i++) {
          for (var j = 0; j < self.size; j++) {
            var currentTile = self.tiles[i][j];
            var previousTile = self.tiles[i - 1][j];
            if (currentTile !== null && currentTile === previousTile && !self.isMerged[i - 1][j]) {
              self.tiles[i - 1][j] = currentTile * 2;
              self.tiles[i][j] = null;
              self.score += currentTile * 2;
              self.isMerged[i - 1][j] = true;
              moved = true;
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
            }
          }
        }
      };

      var mergeRight = function () {
        for (var i = 0; i < self.size; i++) {
          for (var j = self.size - 2; j >= 0; j--) {
            var currentTile = self.tiles[i][j];
            var previousTile = self.tiles[i][j + 1];
            if (currentTile !== null && currentTile === previousTile && !self.isMerged[i][j + 1]) {
              self.tiles[i][j + 1] = currentTile * 2;
              self.tiles[i][j] = null;
              self.score += currentTile * 2;
              self.isMerged[i][j + 1] = true;
              moved = true;
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
            }
          }
        }
      };

      var mergeDown = function () {
        for (var i = self.size - 2; i >= 0; i--) {
          for (var j = 0; j < self.size; j++) {
            var currentTile = self.tiles[i][j];
            var previousTile = self.tiles[i + 1][j];
            if (currentTile !== null && currentTile === previousTile && !self.isMerged[i + 1][j]) {
              self.tiles[i + 1][j] = currentTile * 2;
              self.tiles[i][j] = null;
              self.score += currentTile * 2;
              self.isMerged[i + 1][j] = true;
              moved = true;
            }
          }
        }
      };

      switch (direction) {
        case "left":
          moveLeft();
          mergeLeft();
          break;
        case "up":
          moveUp();
          mergeUp();
          break;
        case "right":
          moveRight();
          mergeRight();
          break;
        case "down":
          moveDown();
          mergeDown();
          break;
      }

      if (moved) {
        this.addRandomTile();
        this.updateGrid();
        this.isMerged = this.isMerged.map(function (row) {
          return row.map(function () {
            return false;
          });
        });
        if (!this.canMove()) {
          this.gameOver = true;
          alert("Game Over! Your score: " + this.score);
        }
      }
    },

    canMove: function () {
      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          var currentTile = this.tiles[i][j];
          if (currentTile === null) {
            return true;
          }
          if (i > 0 && this.tiles[i - 1][j] === currentTile) {
            return true;
          }
          if (i < this.size - 1 && this.tiles[i + 1][j] === currentTile) {
            return true;
          }
          if (j > 0 && this.tiles[i][j - 1] === currentTile) {
            return true;
          }
          if (j < this.size - 1 && this.tiles[i][j + 1] === currentTile) {
            return true;
          }
        }
      }
      return false;
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
      switch (event.key) {
        case "ArrowUp":
          this.moveTiles("up");
          break;
        case "ArrowDown":
          this.moveTiles("down");
          break;
        case "ArrowLeft":
          this.moveTiles("left");
          break;
        case "ArrowRight":
          this.moveTiles("right");
          break;
      }
    },
  };

  Game.init();
});
