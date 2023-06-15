// game.js

var Game = {
  size: 5,
  tiles: [],
  isMerged: [],
  score: 0,
  gameOver: false,

  init: function () {
    this.createGrid();
    this.addRandomTile();
    this.addRandomTile();
    this.updateGrid();

    var self = this;

    document.addEventListener("keydown", function (event) {
      self.handleKeyDown(event);
    });

    var touchArea = document.querySelector(".grid-container");

    var touchStartX = 0;
    var touchStartY = 0;

    touchArea.addEventListener("touchstart", function (event) {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    });

    touchArea.addEventListener("touchmove", function (event) {
      event.preventDefault();
    });

    touchArea.addEventListener("touchend", function (event) {
      var touchEndX = event.changedTouches[0].clientX;
      var touchEndY = event.changedTouches[0].clientY;

      var dx = touchEndX - touchStartX;
      var dy = touchEndY - touchStartY;

      var absDx = Math.abs(dx);
      var absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 10) {
        var direction;

        if (absDx > absDy) {
          direction = dx > 0 ? "right" : "left";
        } else {
          direction = dy > 0 ? "down" : "up";
        }

        self.moveTiles(direction);
      }
    });
  },

  createGrid: function () {
    for (var i = 0; i < this.size; i++) {
      this.tiles.push(new Array(this.size).fill(null));
      this.isMerged.push(new Array(this.size).fill(false));
    }
  },

  updateGrid: function () {
    var gridContainer = document.querySelector(".grid-container");
    gridContainer.innerHTML = "";

    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        var tileValue = this.tiles[i][j];
        var tile = document.createElement("div");
        tile.className = "tile";
        tile.innerHTML = tileValue ? tileValue : "";
        tile.setAttribute("data-row", i);
        tile.setAttribute("data-col", j);
        gridContainer.appendChild(tile);
      }
    }

    var scoreElement = document.querySelector(".score");
    scoreElement.innerHTML = "Score: " + this.score;
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

    // Swipe event handlers
    var touchStartX = 0;
    var touchStartY = 0;
    var touchEndX = 0;
    var touchEndY = 0;

    var swipeThreshold = 50;

    var handleSwipeStart = function (event) {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    };

    var handleSwipeMove = function (event) {
      event.preventDefault();
      touchEndX = event.touches[0].clientX;
      touchEndY = event.touches[0].clientY;
    };

    var handleSwipeEnd = function (event) {
      var dx = touchEndX - touchStartX;
      var dy = touchEndY - touchStartY;

      if (Math.abs(dx) > Math.abs(dy)) {
        // horizontal swipe
        if (Math.abs(dx) > swipeThreshold) {
          if (dx > 0) {
            // swipe right
            moveRight();
          } else {
            // swipe left
            moveLeft();
          }
        }
      } else {
        // vertical swipe
        if (Math.abs(dy) > swipeThreshold) {
          if (dy > 0) {
            // swipe down
            moveDown();
          } else {
            // swipe up
            moveUp();
          }
        }
      }

      if (moved) {
        self.addRandomTile();
        self.updateGrid();
        self.resetMergeStatus();

        if (self.isGameOver()) {
          self.gameOver = true;
          alert("Game Over! Your score: " + self.score);
        }
      }
    };

    // Add swipe event listeners
    document.addEventListener("touchstart", handleSwipeStart, false);
    document.addEventListener("touchmove", handleSwipeMove, false);
    document.addEventListener("touchend", handleSwipeEnd, false);
  },

  isGameOver: function () {
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        if (
          this.tiles[i][j] === null ||
          (j < this.size - 1 && this.tiles[i][j] === this.tiles[i][j + 1]) ||
          (i < this.size - 1 && this.tiles[i][j] === this.tiles[i + 1][j])
        ) {
          return false;
        }
      }
    }
    return true;
  },

  resetMergeStatus: function () {
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        this.isMerged[i][j] = false;
      }
    }
  },
};

Game.init();
