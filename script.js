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
      var grid = [];
      this.isMerged = [];

      for (var i = 0; i < this.size; i++) {
        grid[i] = [];
        this.isMerged[i] = [];

        for (var j = 0; j < this.size; j++) {
          grid[i][j] = null;
          this.isMerged[i][j] = false;
        }
      }

      return grid;
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
              if (k >= 0 && self.tiles[i][k] === currentTile && !self.isMerged[i][k]) {
                self.tiles[i][k] *= 2;
                self.tiles[i][k + 1] = null;
                self.isMerged[i][k] = true;
                self.score += self.tiles[i][k];
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
              if (k < self.size && self.tiles[i][k] === currentTile && !self.isMerged[i][k]) {
                self.tiles[i][k] *= 2;
                self.tiles[i][k - 1] = null;
                self.isMerged[i][k] = true;
                self.score += self.tiles[i][k];
                moved = true;
              }
            }
          }
        }
      };

      var moveUp = function () {
        for (var j = 0; j < self.size; j++) {
          for (var i = 1; i < self.size; i++) {
            var currentTile = self.tiles[i][j];
            if (currentTile !== null) {
              var k = i - 1;
              while (k >= 0 && self.tiles[k][j] === null) {
                self.tiles[k][j] = currentTile;
                self.tiles[k + 1][j] = null;
                k--;
                moved = true;
              }
              if (k >= 0 && self.tiles[k][j] === currentTile && !self.isMerged[k][j]) {
                self.tiles[k][j] *= 2;
                self.tiles[k + 1][j] = null;
                self.isMerged[k][j] = true;
                self.score += self.tiles[k][j];
                moved = true;
              }
            }
          }
        }
      };

      var moveDown = function () {
        for (var j = 0; j < self.size; j++) {
          for (var i = self.size - 2; i >= 0; i--) {
            var currentTile = self.tiles[i][j];
            if (currentTile !== null) {
              var k = i + 1;
              while (k < self.size && self.tiles[k][j] === null) {
                self.tiles[k][j] = currentTile;
                self.tiles[k - 1][j] = null;
                k++;
                moved = true;
              }
              if (k < self.size && self.tiles[k][j] === currentTile && !self.isMerged[k][j]) {
                self.tiles[k][j] *= 2;
                self.tiles[k - 1][j] = null;
                self.isMerged[k][j] = true;
                self.score += self.tiles[k][j];
                moved = true;
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
        if (!this.canMove()) {
          this.gameOver = true;
          alert("Game Over! Your score: " + this.score);
        }
      }
    },

    handleTouchStart: function (event) {
      var touch = event.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    },

    handleTouchMove: function (event) {
      event.preventDefault();
    },

    handleTouchEnd: function (event) {
      var touch = event.changedTouches[0];
      var deltaX = touch.clientX - this.touchStartX;
      var deltaY = touch.clientY - this.touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          this.moveTiles("right");
        } else {
          this.moveTiles("left");
        }
      } else {
        if (deltaY > 0) {
          this.moveTiles("down");
        } else {
          this.moveTiles("up");
        }
      }
    },

    handleKeyDown: function (event) {
      var keyMap = {
        ArrowLeft: "left",
        ArrowUp: "up",
        ArrowRight: "right",
        ArrowDown: "down",
      };

      var direction = keyMap[event.key];
      if (direction) {
        event.preventDefault();
        this.moveTiles(direction);
      }
    },

    canMove: function () {
      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          if (this.tiles[i][j] === null) {
            return true;
          }
          if (
            j < this.size - 1 &&
            this.tiles[i][j] === this.tiles[i][j + 1]
          ) {
            return true;
          }
          if (
            i < this.size - 1 &&
            this.tiles[i][j] === this.tiles[i + 1][j]
          ) {
            return true;
          }
        }
      }
      return false;
    },
  };

  Game.init();
});
