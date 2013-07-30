define(['engine/track', 'engine/bike'], function(Track, Bike) {

  function Race() {
    this.FPS = 30;

    this.finished = false;

    this.gameCanvas = document.querySelector('#race');
    this.gameContext = this.gameCanvas.getContext('2d');
    this.trackCanvas = document.querySelector('#track');
    this.trackContext = this.trackCanvas.getContext('2d');

    this.banner = document.querySelector('#banner');

    this.mainLoop = null;

    this.write = function(text) {
      this.writeColor(text, '#34495e');
    };

    this.writeColor = function(text, color) {
      this.banner.innerText = text;
      this.banner.style.color = color;
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
      window.currentRace.debug();
    };

    this.keyup = function(key) {
      Bike.keyup(key.which);
    };

    this.keydown = function(key) {
      Bike.keydown(key.which);
    };

    this.startCountdown = function(second) {
      var current = second - 1;

      if (current == 0) {
        window.currentRace.write('Go!');
        window.currentRace.start();
      } else {
        window.currentRace.write(current);
        setTimeout(function() { startCountdown(current) }, 1000);
      }
    };

    var startCountdown = this.startCountdown;

    this.init = function() {
      with(this) {
        this.gameCanvas.width = this.trackCanvas.width = window.innerWidth;
        this.gameCanvas.height = this.trackCanvas.height = window.innerHeight;
        this.gameContext.translate(0.5, 0.5);

        this.track = new Track(trackCanvas);
        this.track.paint();

        new Bike(gameContext, this.track.startPosition(1)['x'], this.track.startPosition(1)['y'], '#2980b9', 77, track);
        new Bike(gameContext, this.track.startPosition(2)['x'], this.track.startPosition(2)['y'], '#f1c40f', 76, track);
        new Bike(gameContext, this.track.startPosition(3)['x'], this.track.startPosition(3)['y'],  '#c0392b', 70, track);
        new Bike(gameContext, this.track.startPosition(4)['x'], this.track.startPosition(4)['y'],  '#9b59b6', 72, track);

      };

      window.currentRace = this;

      startCountdown(4);
    };

    this.winner = function(bike) {
      this.finished = true;
      this.writeColor('Winner!', bike.color);
    };

    this.start = function() {
      this.mainLoop = setInterval(this.tick, 1000 / this.FPS);
    };

    this.init();

    this
  };

  return Race;
});
