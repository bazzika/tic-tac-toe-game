$(function() {

  function Game() {
    var currentPosition = this,
      moveCount,
      running,
      playerPiece,
      computerPiece,
      playerTurn,
      playerMoves,
      computerMoves,
      winner,
      overlay = $(".overlay"),
      chooseButtons = $(".overlay button"),
      spaces = $(".ttt-space"),
      announce = $(".game-title"),
      winConditions = [[1,2,3], [4,5,6], [7,8,9],
        [1,4,7], [2,5,8], [3,6,9],
        [1,5,9], [3,5,7]];

    this.go = function() {
      moveCount = 9;
      running = false;
      playerPiece = "";
      computerPiece = "";
      playerMoves = [];
      computerMoves = [];
      playerTurn = false;
      winner = "";
      chooseButtons.off("click");
      spaces.off("click");
      spaces.html("");
      choosePiece();
    };

    function startGame() {
      running = true;
      if (!playerTurn) {
        setTimeout(makeComputerMove, 400);
      }
      spaces.click(function() {
        if (occupiedSpaces().indexOf(positionNumber($(this))) !== -1 ) return;

        if (running && playerTurn) {
          $(this).html("<p class='player'>" + playerPiece + "<p/>");
          playerMoves.push(positionNumber($(this)));
          if (checkForWin(playerMoves)) {
            setTimeout(function() {
              winner = "player";
              running = false;
              announce.text("You won!");
              currentPosition.go();
            }, 600);
            return;
          }
          moveCount --;
          if (moveCount === 0) {
            setTimeout(function() {
              winner = "draw";
              running = false;
              announce.text("Draw!");
              currentPosition.go();
            }, 600);
            return;
          }
          playerTurn = false;
          setTimeout(makeComputerMove, 600);
        }
      });
    }

    function makeComputerMove() {
      if (running && !playerTurn) {
        var avail = openSpaces();
        var movedYet = false;
        var win_test = [];
        var block_test = [];
        var potentials = [];
        for (var i = 0; i < avail.length; i++) {
          computerMoves.forEach(function(num) {
            win_test.push(num);
          });
          win_test.push(avail[i]);
          if (checkForWin(win_test)) {
            movedYet = true;
            placeComputerPiece(avail[i]);
            break;
          }
          win_test = [];
        }
        if (!movedYet) {
          for (var j = 0; j < avail.length; j++) {
            playerMoves.forEach(function(num) {
              block_test.push(num);
            });
            block_test.push(avail[j]);
            if (checkForWin(block_test)) {
              movedYet = true;
              placeComputerPiece(avail[j]);
              break;
            }
            block_test = [];
          }
        }
        if (!movedYet) {
          if (computerMoves.length > 0) {
            computerMoves.forEach(function(compMove) {
              winConditions.forEach(function(winCond) {
                if (winCond.indexOf(compMove) > -1) potentials.push(winCond);
              });
            });
          } else {
            potentials = winConditions;
          }

          if (potentials.length > 0) {
            potentials = potentials.reduce(function(a,b) {
              return a.concat(b);
            });
            potentials = potentials.filter(function(potential) {
              return avail.includes(potential);
            });
          }
          placeComputerPiece(sortByFreq(potentials)[0]);
        }

        if (checkForWin(computerMoves)) {
          setTimeout(function() {
            winner = "computer";
            running = false;
            announce.text("Computer Wins!");
            currentPosition.go();
          }, 600);
          return;
        }
        moveCount --;
        if (moveCount === 0) {
          setTimeout(function() {
            winner = "draw";
            running = false;
            announce.text("Draw!");
            currentPosition.go();
          }, 600);
          return;
        }
        playerTurn = true;
      }

      function sortByFreq(arr) {
        var frequency = {};
        arr.forEach(function(value) {
          frequency[value] = 0;
        });
        var uniques = arr.filter(function(value) {
          return ++frequency[value] == 1;
        });
        return uniques.sort(function(a, b) {
          return frequency[b] - frequency[a];
        });
      }

      function placeComputerPiece(num) {
        var location = $(".position-" + num);
        location.html("<p class='computer'>" + computerPiece + "</p>");
        computerMoves.push(num);
      }
    }

    function checkForWin(moves) {
      var result = false;
      if (moves.length < 3) return false;
      winConditions.forEach(function(winArr) {
        var tmpArr = winArr.filter(function(winNum) {
          if (moves.indexOf(winNum) > -1) return false;
          return true;
        });
        if (tmpArr.length === 0) result = true;
      });
      return result;
    }

    function choosePiece() {
      if (!running) {
        overlay.toggle("clip");
        chooseButtons.on("click", function() {
          playerPiece = $(this).text();
          computerPiece = ["X", "O"].filter(function(elem) { return elem !== playerPiece })[0];
          if (playerPiece === "X") playerTurn = true;
          overlay.toggle("clip");
          startGame();
        });
      }
    }

    function openSpaces() {
      var possible = [1,2,3,4,5,6,7,8,9];
      occupiedSpaces().forEach(function(num) {
        possible = possible.filter(function(val) {
          if (val === num) return false;
          return true;
        });
      });
      return possible;
    }

    function occupiedSpaces() {
      return playerMoves.concat(computerMoves);
    }

    function positionNumber(div) {
      return parseInt(div.attr('class').split(' ')[1].split('-')[1]);
    }

  }

  function displayBoard() {
    var margin;
    var winHeight = $(window).height();
    var boardWidth = $('.gameboard').width();
    $('.gameboard').height(boardWidth);
    if ( winHeight > boardWidth) {
      margin = (winHeight - boardWidth) / 2;
      $('.gameboard').css('margin-top', margin + 'px');
    } else {
      $('.gameboard').css('margin-top', '20px');
    }
  }

  displayBoard();

  $(window).resize(function() {
    displayBoard();
  });

  var ticTacToe = new Game();
  ticTacToe.go();

});