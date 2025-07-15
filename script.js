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
    currentShape: null,
    draggedShape: null,

    init: function () {
      this.createGrid();
      this.updateGrid();
      this.generateShape();
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

    generateShape: function () {
      var shapeContainer = document.querySelector(".shape-container");
      shapeContainer.innerHTML = "";
      this.currentShape = this.shapes[
        Math.floor(Math.random() * this.shapes.length)
      ];

      var shapeElement = document.createElement("div");
      shapeElement.className = "shape";
      shapeElement.draggable = true;

      for (var i = 0; i < this.currentShape.length; i++) {
        for (var j = 0; j < this.currentShape[i].length; j++) {
          var tile = this.currentShape[i][j];
          var tileElement = document.createElement("div");
          tileElement.className = "tile";
          if (tile === 1) {
            tileElement.style.backgroundColor = this.getTileColor(2);
          }
          shapeElement.appendChild(tileElement);
        }
      }

      shapeContainer.appendChild(shapeElement);
      this.addDragListeners(shapeElement);
    },

    addDragListeners: function (element) {
      var self = this;
      element.addEventListener("dragstart", function (event) {
        self.draggedShape = self.currentShape;
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

        var canPlace = true;
        for (var i = 0; i < shapeHeight; i++) {
          for (var j = 0; j < shapeWidth; j++) {
            if (
              shape[i][j] === 1 &&
              (row + i >= this.size ||
                col + j >= this.size ||
                this.tiles[row + i][col + j] !== null)
            ) {
              canPlace = false;
              break;
            }
          }
          if (!canPlace) {
            break;
          }
        }

        if (canPlace) {
          for (var i = 0; i < shapeHeight; i++) {
            for (var j = 0; j < shapeWidth; j++) {
              if (shape[i][j] === 1) {
                this.tiles[row + i][col + j] = 2;
              }
            }
          }
          this.updateGrid();
          this.clearLines();
          this.generateShape();
        }
        this.draggedShape = null;
      }
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
      }
    },
  };

  Game.init();

  document.querySelector(".restart-button").addEventListener("click", function () {
    Game.init();
  });
});
