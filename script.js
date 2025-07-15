document.addEventListener("DOMContentLoaded", function () {
  var Game = {
    size: 10,
    tiles: [],
    score: 0,
    gameOver: false,
    shapes: [
      [[1]],
      [[1, 1]],
      [[1], [1]],
      [[1, 1, 1]],
      [[1], [1], [1]],
      [[1, 1], [1, 0]],
      [[1, 1], [0, 1]],
      [[1, 0], [1, 1]],
      [[0, 1], [1, 1]],
      [[1, 1, 1, 1]],
      [[1], [1], [1], [1]],
      [[1, 1], [1, 1]],
    ],
    currentShapes: [],
    draggedShape: null,
    draggedShapeIndex: -1,

    init: function () {
      this.gameOver = false;
      this.score = 0;
      this.createGrid();
      this.updateGrid();
      this.generateShapes();
      this.addDropListeners();
    },

    createGrid: function () {
      for (var i = 0; i < this.size; i++) {
        this.tiles[i] = [];
        for (var j = 0; j < this.size; j++) {
          this.tiles[i][j] = null;
        }
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
          tileElement.dataset.row = i;
          tileElement.dataset.col = j;
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

    generateShapes: function () {
      var shapeContainer = document.querySelector(".shape-container");
      shapeContainer.innerHTML = "";
      this.currentShapes = [];

      for (var s = 0; s < 3; s++) {
        var shape = this.shapes[
          Math.floor(Math.random() * this.shapes.length)
        ];
        this.currentShapes.push(shape);

        var shapeElement = document.createElement("div");
        shapeElement.className = "shape";
        shapeElement.draggable = true;
        shapeElement.dataset.shapeIndex = s;

        for (var i = 0; i < shape.length; i++) {
          for (var j = 0; j < shape[i].length; j++) {
            var tile = shape[i][j];
            var tileElement = document.createElement("div");
            tileElement.className = "tile";
            if (tile === 1) {
              tileElement.style.backgroundColor = this.getTileColor(2);
            } else {
              tileElement.style.backgroundColor = "transparent";
            }
            shapeElement.appendChild(tileElement);
          }
        }

        shapeContainer.appendChild(shapeElement);
        this.addDragListeners(shapeElement);
      }

      if (this.isGameOver()) {
        this.gameOver = true;
        alert("Game Over! Your score: " + this.score);
      }
    },

    addDragListeners: function (element) {
      var self = this;
      element.addEventListener("dragstart", function (event) {
        self.draggedShapeIndex = parseInt(event.target.dataset.shapeIndex);
        self.draggedShape = self.currentShapes[self.draggedShapeIndex];
      });
    },

    addDropListeners: function () {
      var self = this;
      var gridContainer = document.querySelector(".grid-container");

      gridContainer.addEventListener("dragover", function (event) {
        event.preventDefault();
      });

      gridContainer.addEventListener("drop", function (event) {
        event.preventDefault();
        var row = event.target.dataset.row;
        var col = event.target.dataset.col;
        if (row !== undefined && col !== undefined) {
          self.dropShape(parseInt(row), parseInt(col));
        }
      });
    },

    dropShape: function (row, col) {
      if (this.draggedShape) {
        var shape = this.draggedShape;
        var shapeWidth = shape[0].length;
        var shapeHeight = shape.length;

        var canPlace = this.canPlaceShape(shape, row, col);

        if (canPlace) {
          for (var i = 0; i < shapeHeight; i++) {
            for (var j = 0; j < shapeWidth; j++) {
              if (shape[i][j] === 1) {
                this.tiles[row + i][col + j] = 2;
              }
            }
          }
          this.updateGrid();

          var cleared = true;
          while (cleared) {
            var clearedLines = this.clearLines();
            var clearedMatches = this.clearMatches();
            cleared = clearedLines || clearedMatches;
          }

          this.currentShapes.splice(this.draggedShapeIndex, 1);
          var shapeContainer = document.querySelector(".shape-container");
          var shapeElements = shapeContainer.querySelectorAll(".shape");
          shapeElements[this.draggedShapeIndex].remove();

          if (this.currentShapes.length === 0) {
            this.generateShapes();
          }
        }
        this.draggedShape = null;
        this.draggedShapeIndex = -1;
      }
    },

    canPlaceShape: function (shape, row, col) {
      var shapeWidth = shape[0].length;
      var shapeHeight = shape.length;

      if (row + shapeHeight > this.size || col + shapeWidth > this.size) {
        return false;
      }

      for (var i = 0; i < shapeHeight; i++) {
        for (var j = 0; j < shapeWidth; j++) {
          if (shape[i][j] === 1 && this.tiles[row + i][col + j] !== null) {
            return false;
          }
        }
      }
      return true;
    },

    isGameOver: function () {
      for (var s = 0; s < this.currentShapes.length; s++) {
        var shape = this.currentShapes[s];
        if (shape) {
          for (var r = 0; r <= this.size - shape.length; r++) {
            for (var c = 0; c <= this.size - shape[0].length; c++) {
              if (this.canPlaceShape(shape, r, c)) {
                return false;
              }
            }
          }
        }
      }
      return true;
    },

    clearLines: function () {
      var rowsToClear = [];
      for (var i = 0; i < this.size; i++) {
        var isRowFull = true;
        for (var j = 0; j < this.size; j++) {
          if (this.tiles[i][j] === null) {
            isRowFull = false;
            break;
          }
        }
        if (isRowFull) {
          rowsToClear.push(i);
        }
      }

      var colsToClear = [];
      for (var j = 0; j < this.size; j++) {
        var isColFull = true;
        for (var i = 0; i < this.size; i++) {
          if (this.tiles[i][j] === null) {
            isColFull = false;
            break;
          }
        }
        if (isColFull) {
          colsToClear.push(j);
        }
      }

      for (var i = 0; i < rowsToClear.length; i++) {
        var row = rowsToClear[i];
        for (var j = 0; j < this.size; j++) {
          this.tiles[row][j] = null;
        }
      }

      for (var i = 0; i < colsToClear.length; i++) {
        var col = colsToClear[i];
        for (var j = 0; j < this.size; j++) {
          this.tiles[j][col] = null;
        }
      }

      if (rowsToClear.length > 0 || colsToClear.length > 0) {
        this.score += (rowsToClear.length + colsToClear.length) * this.size;
        this.updateGrid();
        return true;
      }
      return false;
    },

    clearMatches: function () {
      var matches = [];
      var cleared = false;

      // Check for horizontal matches
      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size - 2; j++) {
          var tile1 = this.tiles[i][j];
          var tile2 = this.tiles[i][j + 1];
          var tile3 = this.tiles[i][j + 2];
          if (tile1 && tile1 === tile2 && tile2 === tile3) {
            matches.push({ row: i, col: j });
            matches.push({ row: i, col: j + 1 });
            matches.push({ row: i, col: j + 2 });
          }
        }
      }

      // Check for vertical matches
      for (var i = 0; i < this.size - 2; i++) {
        for (var j = 0; j < this.size; j++) {
          var tile1 = this.tiles[i][j];
          var tile2 = this.tiles[i + 1][j];
          var tile3 = this.tiles[i + 2][j];
          if (tile1 && tile1 === tile2 && tile2 === tile3) {
            matches.push({ row: i, col: j });
            matches.push({ row: i + 1, col: j });
            matches.push({ row: i + 2, col: j });
          }
        }
      }

      if (matches.length > 0) {
        cleared = true;
        for (var i = 0; i < matches.length; i++) {
          this.tiles[matches[i].row][matches[i].col] = null;
        }
        this.score += matches.length * 10;
        this.updateGrid();
      }

      return cleared;
    },
  };

  Game.init();

  document.querySelector(".restart-button").addEventListener("click", function () {
    Game.init();
  });
});
