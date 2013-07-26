define(['engine/track', 'engine/bike'], function(Track, Bike) {

  function Game() {
    this.FPS = 30;

    this.gameCanvas = document.querySelector('#race');
    this.gameContext = this.gameCanvas.getContext('2d');
    this.trackCanvas = document.querySelector('#track');
    this.trackContext = this.trackCanvas.getContext('2d');

    this.banner = document.querySelector('#banner');

    this.mainLoop = null;

    this.write = function(text) {
      this.banner.innerText = text;
    };

    this.debug = function() {
      var debugBox = document.querySelector('#debug');

      debugBox.innerText = '';
      Bike.each(function(bike) {
        debugBox.innerText += "BIKE " + bike.color + "\nspeed: "+bike.speed + "\n" +
                                "angle: " + bike.angle + "\n" +
                                "start: " + parseInt(bike.startX) + "," + parseInt(bike.startY) + "\n" +
                                "pos: ("+ parseInt(bike.x) + "," + parseInt(bike.y) +")\n" +
                                "lap: "+bike.lap+"\n"+
                                (bike.turn == true ? "turning" : "") + "\n" +
                                (bike.crashed == true ? "crashed" : "") + "\n" +
                                (bike.winner == true ? "winner" : "") + "\n";
      });
    };

    this.tick = function() {
      Bike.tick();
      Bike.checkForWinners();
      window.currentGame.debug();
    };

    this.keyup = function(key) {
      Bike.keyup(key.which);
    };

    this.keydown = function(key) {
      Bike.keydown(key.which);
    };

    this.start = function() {
      with(this) {
        this.gameCanvas.width = this.trackCanvas.width = window.innerWidth;
        this.gameCanvas.height = this.trackCanvas.height = window.innerHeight;

        this.track = new Track(trackCanvas);
        this.track.paint();

        new Bike(gameContext, this.track.startPosition(2)['x'], this.track.startPosition(2)['y'], 'green', 76, track);
        new Bike(gameContext, this.track.startPosition(3)['x'], this.track.startPosition(3)['y'],  'blue', 70, track);

        mainLoop = setInterval(this.tick, 1000 / this.FPS);

        window.addEventListener('keyup', keyup, false);
        window.addEventListener('keydown', keydown, false);
      };

      window.currentGame = this;
    };

    this.start();

    this
  };

  return Game;
});
