document.addEventListener("DOMContentLoaded", function() {
  var Game = {
    size: 5,
    tiles: [],
    score: 0,
    gameOver: false,
    isMerged: [],

    init: function() {
      this.createGrid();
      this.addRandomTile();
      this.addRandomTile();
      this.updateGrid();
    },

    createGrid: function() {
      var gridContainer = document.querySelector(".grid-container");
      for (var i = 0; i < this.size; i++) {
        this.tiles[i] = [];
        this.isMerged[i] = [];
        for (var j = 0; j < this.size; j++) {
          this.tiles[i][j] = null;
          this.isMerged[i][j] = false;

          var tileElement = document.createElement("div");
          tileElement.className = "tile";
          gridContainer.appendChild(tileElement);
        }
      }
    },

    addRandomTile: function() {
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

    updateGrid: function() {
      var gridContainer = document.querySelector(".grid-container");

      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          var tile = this.tiles[i][j];
          var tileElement = gridContainer.children[i * this.size + j];
          tileElement.textContent = tile !== null ? tile : "";
          tileElement.style.backgroundColor = this.getTileColor(tile);
        }
      }
      
      document.getElementById("score").textContent = this.score;
    },

    getTileColor: function(value) {
      var colors = {
        2: "#eee4da",
        4: "#ede0c",
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

      return colors[value] || "#cdcdc1";
    },

    moveTiles: function(direction) {
      if (this.gameOver) return;

      this.resetMergeState();

      switch (direction) {
        case "up":
          this.moveUp();
          break;
        case "down":
          this.moveDown();
          break;
        case "left":
          this.moveLeft();
          break;
        case "right":
          this.moveRight();
          break;
      }

      this.addRandomTile();
      this.updateGrid();
      this.checkGameOver();
    },

    resetMergeState: function() {
      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          this.isMerged[i][j] = false;
        }
      }
    },

    moveUp: function() {
      // 移动逻辑
    },

    moveDown: function() {
      // 移动逻辑
    },

    moveLeft: function() {
      // 移动逻辑
    },

    moveRight: function() {
      // 移动逻辑
    },

    checkGameOver: function() {
      // 检查游戏结束逻辑
    },
  };

  Game.init();

  var handleMove = function(event) {
    var touch = event.touches[0];
    var startX = touch.pageX;
    var startY = touch.pageY;

    var deltaX = touch.pageX - startX;
    var deltaY = touch.pageY - startY;
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

    Game.moveTiles(direction);
  };

  document.addEventListener("touchstart", function(event) {
    event.preventDefault();
    handleMove(event);
  });

  document.addEventListener("touchend", function(event) {
    event.preventDefault();
    handleMove(event);
  });
});
