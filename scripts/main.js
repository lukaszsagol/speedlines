require(['game', 'engine/bike', 'engine/track'], function(Game, Bike, Track) {
  var FPS = 30;

  var c = document.querySelector('#race');
  var ctx = c.getContext('2d');

  var trackCanvas = document.querySelector('#track');
  var track = null;

  var debugBox = document.querySelector('#debug');

  var bikes = [];
  var mainTick = null;

  function tick() {
    Bike.tick();
    Bike.checkForWinners();
    debug();
  }

  function debug() {
    debugBox.innerText = '';
    bikes.forEach(function(bike) {
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

  function init() {
    console.log('init');
    ctx.translate(0.5, 0.5);

    c.width = window.innerWidth;
    c.height = window.innerHeight;
    trackCanvas.width = window.innerWidth;
    trackCanvas.height = window.innerHeight;

    track = new Track(trackCanvas);
    track.paint();

    //bikes.push(new Bike(ctx, track.startPosition(1)['x'], track.startPosition(1)['y'],  'red', 65, track));
    bikes.push(new Bike(ctx, track.startPosition(2)['x'], track.startPosition(2)['y'], 'green', 76, track));
    bikes.push(new Bike(ctx, track.startPosition(3)['x'], track.startPosition(3)['y'],  'blue', 70, track));
    //bikes.push(new Bike(ctx, track.startPosition(4)['x'], track.startPosition(4)['y'], 'pink', 74, track));
    //

    mainTick = setInterval(tick, 1000 / FPS);
  };

  function reset() {
    c.width = c.width;
    paintTrack();
    bikes.forEach(function(bike) { bike.reset(); });
  };

  function stop_game() {
    clearInterval(mainTick);
  };

  function game_write(text) {
   document.querySelector('#banner').innerText = text;
  };

  function keydown(key) {
    Bike.keydown(key.which);
  };

  function keyup(key) {
    Bike.keyup(key.which);
  }

  window.addEventListener('load', init, false);
  window.addEventListener('keyup', keyup, false);
  window.addEventListener('keydown', keydown, false);
});
