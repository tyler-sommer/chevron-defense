require(['game/board', 'game/wave'],
  function(Game, Wave) {
    var width  = 30;
    var height = 20;
    var board = new Game.GameBoard(document.getElementById('container'), width, height);

    var delayBetweenWaves = 1;
    var maxWaveHeight     = 5;
    var generator = new Wave.WaveGenerator(board, delayBetweenWaves, maxWaveHeight);

    board.run();
  });