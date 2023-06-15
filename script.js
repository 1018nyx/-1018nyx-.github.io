document.addEventListener("DOMContentLoaded", function () {
  var Game = {
    size: 4,
    tiles: [],
    score: 0,
    gameOver: false,

    init: function () {
      this.createGrid();
      this.addRandomTile();
      this.addRandomTile();
      this.updateGrid();
    },

    createGrid: function () {
      for (var i = 0; i < this.size; i++) {
        this.tiles[i] = [];
        for (var j = 0; j < this.size; j++) {
          this.tiles[i][j] = null;
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

    isGameOver: function () {
      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          var currentTile = this.tiles[i][j];
          if (currentTile === null) {
            return false;
          }
          if (
            (i < this.size - 1 && currentTile === this.tiles[i + 1][j]) ||
            (j < this.size - 1 && currentTile === this.tiles[i][j + 1])
          ) {
            return false;
          }
        }
      }
      return true;
    },

    moveTiles: function (direction) {
      if (this.gameOver) {
        return;
      }

      var self = this;
      var moved = false;

      // Create a copy of the current grid
      var previousTiles = JSON.parse(JSON.stringify(this.tiles));

      // Perform the move based on the direction
      switch (direction) {
        case "up":
          moved = this.moveUp();
          break;
        case "down":
          moved = this.moveDown();
          break;
        case "left":
          moved = this.moveLeft();
          break;
        case "right":
          moved = this.moveRight();
          break;
        default:
          break;
      }

      if (moved) {
        this.addRandomTile();
        this.updateGrid();
        if (this.isGameOver()) {
          this.gameOver = true;
          setTimeout(function () {
            alert("Game over!");
          }, 100);
        }
      } else {
        // If no tiles moved, restore the previous grid
        this.tiles = previousTiles;
      }
    },

    moveUp: function () {
      var moved = false;
      for (var j = 0; j < this.size; j++) {
        for (var i = 1; i < this.size; i++) {
          if (this.tiles[i][j] !== null) {
            var k = i;
            while (k > 0 && this.tiles[k - 1][j] === null) {
              this.tiles[k - 1][j] = this.tiles[k][j];
              this.tiles[k][j] = null;
              k--;
              moved = true;
            }
            if (
              k > 0 &&
              this.tiles[k - 1][j] === this.tiles[k][j] &&
              !this.tilesMerged[k - 1][j] &&
              !this.tilesMerged[k][j]
            ) {
              this.tiles[k - 1][j] *= 2;
              this.tiles[k][j] = null;
              this.tilesMerged[k - 1][j] = true;
              this.score += this.tiles[k - 1][j];
              moved = true;
            }
          }
        }
      }
      this.resetMergeFlags();
      return moved;
    },

    // Implement the moveDown, moveLeft, and moveRight functions similarly

    resetMergeFlags: function () {
      this.tilesMerged = [];
      for (var i = 0; i < this.size; i++) {
        this.tilesMerged[i] = [];
        for (var j = 0; j < this.size; j++) {
          this.tilesMerged[i][j] = false;
        }
      }
    },
  };

  Game.init();

  var touchStartX = 0;
  var touchStartY = 0;
  var touchEndX = 0;
  var touchEndY = 0;

  document.addEventListener("touchstart", function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  });

  document.addEventListener("touchmove", function (event) {
    event.preventDefault();
  });

  document.addEventListener("touchend", function (event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    var direction = getSwipeDirection();
    if (direction) {
      Game.moveTiles(direction);
    }
  });

  function getSwipeDirection() {
    var deltaX = touchEndX - touchStartX;
    var deltaY = touchEndY - touchStartY;
    var minDistance = 50; // Minimum distance required for a swipe

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minDistance) {
      if (deltaX > 0) {
        return "right";
      } else {
        return "left";
      }
    } else if (Math.abs(deltaY) > minDistance) {
      if (deltaY > 0) {
        return "down";
      } else {
        return "up";
      }
    }

    return null;
  }
});
