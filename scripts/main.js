require.config({
  urlArgs: "bust=" + (new Date()).getTime()
});
require(['game/board', 'game/wave'],
  function(Game, Wave) {
    var width  = Math.floor(window.innerWidth / 10);
    var height = Math.floor(window.innerHeight / 10);
    var board = new Game.GameBoard(document.getElementById('container'), width, height);

    var startButton = document.getElementById('start-button');
    startButton.addEventListener('click', function() {
      var maxDelayBetweenWaves = 3;
      var maxWaveHeight     = 10;
      var generator = new Wave.WaveGenerator(board, maxDelayBetweenWaves, maxWaveHeight);
      startButton.parentNode.removeChild(startButton);
    });
    
    board.run();
  });