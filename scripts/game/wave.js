define(function() {
  /**
   * A simple wave generator
   *
   * @param gameBoard
   * @param interval  Delay in seconds between waves
   * @param maxHeight The maximum height of a wave
   */
  function WaveGenerator(gameBoard, interval, maxHeight) {
    var self = this;
    gameBoard.on('tick', function() {
      self.tick();
    });

    gameBoard.on('render', function() {
      self.render();
    });

    this.gameBoard = gameBoard;
    this.interval  = interval;
    this.maxHeight = maxHeight;
    this.waves     = [];

    function _timeout() {
      self.waveOnNextTick = true;

      setTimeout(_timeout, ((Math.random() * interval) + .25) * 1000);
    }
    
    setTimeout(_timeout, interval * 1000);
  }

  WaveGenerator.prototype.tick = function() {
    var self = this;
    this.waves.slice(0).forEach(function(wave) {
      wave.tick();

      if (!wave.valid()) {
        self.waves.splice(self.waves.indexOf(wave), 1);
      }
    });

    if (this.waveOnNextTick) {
      this.waveOnNextTick = false;

      var wave = new Wave(this.gameBoard, Math.floor(Math.random() * this.maxHeight) + 1);

      this.waves.push(wave);
    }
  };

  WaveGenerator.prototype.render = function() {
    this.waves.slice(0).forEach(function(wave) {
      wave.render();
    });
  };

  /**
   * A very simplistic wave
   *
   * A Wave is composed of many tile-sized waves
   *
   * @param gameBoard
   * @param maxHeight
   * @constructor
   */
  function Wave(gameBoard, maxHeight) {
    this.gameBoard = gameBoard;
    this.maxHeight = maxHeight;
    this.waves = [];
    this.toMake = [];

    var rows = this.gameBoard.getHeight();
    var initialX = this.gameBoard.getWidth() - 1;

    var yOffset = -1 * Math.floor(Math.random() * 6);

    var func = Math.random() >= .5 
      ? function(i) { return Math.sin(i * .80) } 
      : function(i) { return Math.cos(i * .65) };
    
    for (var i = 0; i < rows; i++) {
      var waveyX = (initialX + 5) - Math.round(func((i + yOffset) / 2) * 2);
      this.make(waveyX, i, this.maxHeight);
    }
  }

  /**
   * Makes one new wave (in a Wave) at the given coordinates
   *
   * @param x      The x coordinate
   * @param y      The y coordinate
   * @param height The height of the wave
   */
  Wave.prototype.make = function(x, y, height) {
    height = height || this.maxHeight;
    var tile = this.gameBoard.getTile(x, y);
    
    this.waves.push({
      x: x,
      y: y,
      height: height,
      tile: tile
    });
  };

  /**
   * Moves one wave (in a Wave) and performs the destruction of tile height
   *
   * @param wave A wave object
   * @param newX The new x coordinate
   * @param newY The new y coordinate
   */
  Wave.prototype.move = function(wave, newX, newY) {
    if (wave.tile) {
      wave.tile.el.className = 'tile';
    }
    
    if (newX < 0) {
      this.waves.splice(this.waves.indexOf(wave), 1);

      return false;
    }
    
    var tile = this.gameBoard.getTile(newX, newY);
    if (!tile) {
      wave.tile = null;
      wave.x = newX;
      wave.y = newY;
      
      return true;
    }

    var waveHeight = wave.height;
    var tileHeight = tile.getHeight();

    tile.setHeight(tileHeight - waveHeight);

    wave.height = waveHeight - tileHeight;
    if (wave.height <= 0) {
      this.waves.splice(this.waves.indexOf(wave), 1);

      return false;
    }

    wave.x = newX;
    wave.y = newY;
    wave.tile = tile;

    return true;
  };

  Wave.prototype.render = function() {
    this.waves.slice(0).forEach(function(wave) {
      if (wave.tile) {
        wave.tile.el.className = 'tile wave';
      }
    });

    return this;
  };

  Wave.prototype.valid = function() {
    return this.waves.length > 0;
  };

  Wave.prototype.tick = function() {
    var self = this;
    var rows = this.gameBoard.map.length;
    this.waves.slice(0).forEach(function(wave) {
      self.move(wave, wave.x - 1, wave.y);
    });

    if (this.toMake.length > 0) {
      var info = this.toMake.shift();
      for (var y = 0; y < rows; y++) {
        this.make(info.x, y, info.height);
      }
    }
  };
  
  return {
    WaveGenerator: WaveGenerator,
    Wave:          Wave
  };
});