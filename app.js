choices = {
  0:'#cell_1',
  1:'#cell_2',
  2:'#cell_3',
  3:'#cell_4',
  4:'#cell_5',
  5:'#cell_6',
  6:'#cell_7',
  7:'#cell_8',
  8:'#cell_9'
}

function getGrid() {
  var divs = [];
  for (var i=0;i<9;i++) {
    divs.push($(choices[i]).html());
  }
  return divs;
}

function getGame() {
  var divs = [];
  for (var i=0;i<9;i++) {
    divs.push([$(choices[i]).html(),i]);
  }
  return divs;
}

function convertGameToGrid(game) {
  var divs = [];
  for (var i=0;i<game.length;i++) {
    divs.push(game[i][0]);
  }
  return divs;
}

function checkGrid(divs) {
  var options = [[divs[0],divs[1],divs[2]],
    [divs[3],divs[4],divs[5]],
    [divs[6],divs[7],divs[8]],
    [divs[0],divs[3],divs[6]],
    [divs[1],divs[4],divs[7]],
    [divs[2],divs[5],divs[8]],
    [divs[0],divs[4],divs[8]],
    [divs[2],divs[4],divs[6]]];

  for (var i=0;i<options.length;i++) {
    if (options[i][0] == 'X' && options[i][1] == 'X' && options[i][2] == 'X') {
      return 'X';
    } else if (options[i][0] == 'O' && options[i][1] == 'O' && options[i][2] == 'O') {
      return 'O';
    }
  }
  for (var i=0;i<9;i++) {
    if (divs[i]=='') {
      return false;
    }
  }
  return 'Draw';
}

function resetGrid() {
  for (var i=0;i<9;i++) {
    $(choices[i]).html('');
  }
  $('#result').html('');
  if (ai=='X') {
    $('#mm').html('X');
  }
}

function displayLine(divs) {
  var options = [[divs[0],divs[1],divs[2]],
    [divs[3],divs[4],divs[5]],
    [divs[6],divs[7],divs[8]],
    [divs[0],divs[3],divs[6]],
    [divs[1],divs[4],divs[7]],
    [divs[2],divs[5],divs[8]],
    [divs[0],divs[4],divs[8]],
    [divs[2],divs[4],divs[6]]];

  for (var i=0;i<options.length;i++) {
    if ((options[i][0] == 'X' && options[i][1] == 'X' && options[i][2] == 'X') || (options[i][0] == 'O' && options[i][1] == 'O' && options[i][2] == 'O')){
      if (i==0) {
        $('#win4').show();
        setTimeout(function(){$('#win4').hide()},1000);
        break;
      } else if (i==1) {
        $('#win5').show();
        setTimeout(function(){$('#win5').hide()},1000);
        break;
      } else if (i==2) {
        $('#win6').show()
        setTimeout(function(){$('#win6').hide()},1000);
        break;
      } else if (i==3) {
        $('#win1').show();
        setTimeout(function(){$('#win1').hide()},1000);
        break;
      } else if (i==4) {
        $('#win2').show();
        setTimeout(function(){$('#win2').hide()},1000);
        break;
      } else if (i==5) {
        $('#win3').show();
        setTimeout(function(){$('#win3').hide()},1000);
        break;
      } else if (i==6) {
        $('#win7').show();
        setTimeout(function(){$('#win7').hide()},1000);
        break;
      } else if (i==7) {
        $('#win8').show();
        setTimeout(function(){$('#win8').hide()},1000);
        break;
      }
    }
  }
}

function playerTurn(i){
  return function() {
    var g = getGrid();
    var cG = checkGrid(g);
    if (!cG) {
      if ($(choices[i]).html()=='') {
        $(choices[i]).html(player);
        var g = getGrid();
        var cG = checkGrid(g);
        if (cG==player) {
          $('#result').html('You Win!');
          displayLine(g);
          setTimeout(function(){resetGrid()},1000);
          console.log('You win');
        } else if (cG=='Lose') {
          $('#result').html('You Lose!');
          setTimeout(function(){resetGrid()},1000);
          console.log('Lose');
        } else {
          aiTurn();
        }
      }
    }
  }
}

function score(g, depth) {
  var cG = checkGrid(g);
  if (cG == ai) {
    return 10-depth;
  } else if (cG == player) {
    return depth-10;
  } else {
    return 0;
  }
}

function minimax(game,depth) {
  var g = convertGameToGrid(game);
  if (checkGrid(g)) {
    var s = score(g,depth);
    return s;
  }
  depth += 1;
  var scores = [];
  var moves = [];

  var availMoves = getAvailMoves(game);
  for (var i=0;i<availMoves.length;i++) {
    var possibleGame = [];
    for (var j=0;j<9;j++) {
      possibleGame.push(game[j]);
    }

    if (depth%2==0) {
      possibleGame.splice(availMoves[i],1,[ai,availMoves[i]]);
    } else {
      possibleGame.splice(availMoves[i],1,[player,availMoves[i]]);
    }
    var m = minimax(possibleGame,depth);
    scores.push(m);
    moves.push(availMoves[i]);
  }

  if (depth%2==0) {
    var max_score_index = 0;
    var max_score = -100000000;
    for (var i=0;i<scores.length;i++) {
      if (scores[i] > max_score) {
        max_score_index = i;
        max_score = scores[i];
      }
    }
    if (depth==0) {
      return moves[max_score_index];
    } else {
      return scores[max_score_index];
    }
  } else {
    var min_score_index = 0;
    var min_score = 100000000;
    for (var i=0;i<scores.length;i++) {
      if (scores[i] < min_score) {
        min_score_index = i;
        min_score = scores[i];
      }
    }
    return scores[min_score_index];
  }
}

function getAvailMoves(game) {
  var moves = [];
  for (var i=0;i<game.length;i++) {
    if (game[i][0] == '') {
      moves.push(game[i][1]);
    }
  }
  return moves;
}

function aiTurn () {

  console.log('ai');
  var c;
  game = getGame();
  c = minimax(game,-1);

  $(choices[c]).html(ai);
  var g = getGrid();
  var cG = checkGrid(g);
  if (cG==ai) {
    $('#result').html('You Lose :(');
    displayLine(g);
    setTimeout(function(){resetGrid()},1000);
    console.log('You lose');
  } else if (cG=='Lose') {
    $('#result').html('You Win!');
    setTimeout(function(){resetGrid()},1000);
    console.log('Win');
  }
}


var player='X';
var ai = 'O';

$(document).ready(function () {

  for(var i = 0; i < 9; i++) {
    $(choices[i]).on('click', playerTurn(i));
  }

  $('#myModal').modal('show');

  $('#chooseX').on('click',function() {
    player='X';
    ai='O';
    $('#myModal').modal('hide');
  });
  $('#chooseO').on('click',function() {
    player='O';
    ai='X';
    $('#myModal').modal('hide');
    $('#mm').html('X');
  });
});