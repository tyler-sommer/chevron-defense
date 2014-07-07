Chevron Defense
===============

A prototype.

The project uses [require.js](http://requirejs.org) to manage javascript dependencies.

The main entry point to the app is `scripts/main.js`. Other scripts:

* `game/board.js` contains GameBoard, GameTile and related elements.
* `game/wave.js` contains Wave generation elements.

The stylesheet is all in `main.css`


Gameplay
--------

Gameplay is currently very simplistic.

Click and drag on the gameboard to raise tiles. As waves hit these tiles, they reduce in height.