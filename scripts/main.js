require(['game/board', 'game/wave'],
  function(Game, Wave) {
    var width  = Math.floor(window.innerWidth / 25);
    var height = Math.floor(window.innerHeight / 25);
    var board = new Game.GameBoard(document.getElementById('container'), width, height);

    var delayBetweenWaves = 2;
    var maxWaveHeight     = 5;
    var generator = new Wave.WaveGenerator(board, delayBetweenWaves, maxWaveHeight);

    board.run();
  });