define(function() {
  /**
   * A game board
   *
   * @param container
   * @param width
   * @param height
   * @constructor
   */
  function GameBoard(container, width, height) {
    this.container = container;
    this.map = [];
    this.listeners = {};

    for (var i = 0; i < height; i++) {
      var row = [];
      for (var j = 0; j < width; j++) {
        row.push(new GameTile(0));
      }
      this.map.push(row);
    }

    container.innerHTML = '';
    this.map.forEach(function(row) {
      var rowEl = document.createElement('div');
      rowEl.className = 'row';
      row.forEach(function(gameTile) {
        rowEl.appendChild(gameTile.render().el);
      });

      container.appendChild(rowEl);
    });
  }

  /**
   * Bind a handler to the given event by name
   *
   * @param name    The name of the event
   * @param handler A Function to be called when the event is triggered
   */
  GameBoard.prototype.on = function(name, handler) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }

    this.listeners[name].push(handler);
  };

  /**
   * Trigger an event by name
   *
   * @param name The name of the event
   * @param args Any data to pass to the object
   */
  GameBoard.prototype.trigger = function(name, args) {
    if (!this.listeners[name]) {
      return;
    }

    this.listeners[name].slice(0).forEach(function(handler) {
      handler(args);
    });
  };

  GameBoard.prototype.getHeight = function() {
    return this.map.length;
  };

  GameBoard.prototype.getWidth = function() {
    return this.map[0].length;
  };

  GameBoard.prototype.getTile = function(x, y) {
    if (this.map[y] && this.map[y][x]) {
      return this.map[y][x];
    }

    return null;
  };

  /**
   * Start the game
   *
   * Ticks update game logic like positions, scores, etc.
   * Rendering draws the current state to the viewport
   */
  GameBoard.prototype.run = function() {
    var loops = 0, skipTicks = 1000 / 10,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime();

    var self = this;
    var _tick = function() {
      loops = 0;

      while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
        self.trigger('tick');
        nextGameTick += skipTicks;
        loops++;
      }

      self.trigger('render');
    };

    setInterval(_tick, 0);
  };

  /**
   * A tile on the game board
   *
   * @param height
   * @constructor
   */
  function GameTile(height) {
    function _makeTile(gameTile) {
      var el = document.createElement('div');
      el.className = 'tile';

      el.addEventListener('click', function(e) {
        gameTile.setHeight(gameTile.getHeight() + 5);
      });

      return el;
    }

    var _height;
    this.setHeight = function(height) {
      if (height < 0) {
        height = 0;
      }

      _height = height;

      var hexColor = (height == 0 ? 255 : 225 - _height).toString(16);
      this.el.style.backgroundColor = "#" + hexColor + hexColor + hexColor;
    };
    this.getHeight = function() {
      return _height;
    };

    this.el = _makeTile(this);
    this.setHeight(height);
  }

  GameTile.prototype.render = function() {
    // does nothing for now

    return this;
  };
  
  return {
    GameBoard: GameBoard,
    GameTile:  GameTile
  };
});