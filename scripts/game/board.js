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

    function _mouseMove(e) {
      var x = e.pageX,
        y = e.pageY;

      var el = document.elementFromPoint(x, y);

      if (el.tile) {
        el.tile.setHeight(el.tile.getHeight() + 5);
      }
    }
    
    container.addEventListener('mousedown', function(e) {
      container.addEventListener('mousemove', _mouseMove);
    });

    container.addEventListener('mouseup', function(e) {
      container.removeEventListener('mousemove', _mouseMove);
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
    var loops = 0, skipTicks = 1000 / 60,
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

      if (loops > 0) {
        self.trigger('render');
      }
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
      el.tile      = gameTile;

      return el;
    }

    var _height;
    this.setHeight = function(height) {
      if (height < 0) {
        height = 0;
      }

      _height = height;

      var redHex = (height == 0 ? 253 : 253 - _height).toString(16);
      var greenHex = (height == 0 ? 245 : 245 - _height).toString(16);
      var blueHex = (height == 0 ? 239 : 239 - _height).toString(16);
      this.el.style.backgroundColor = "#" + redHex + greenHex + blueHex;
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