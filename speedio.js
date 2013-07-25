(function() {
  var FPS = 30;

  var c = document.querySelector('#race');
  var ctx = c.getContext('2d');

  var track = document.querySelector('#track');
  var trackCtx = track.getContext('2d');

  var debugBox = document.querySelector('#debug');

  var canvasWidth = c.width;
  var canvasHeight = c.height;

  var laneWidth = 150;
  var laneLength = canvasWidth / 2;
  var startX = 0;
  var startY = 0;

  var bikes = [];

  function Bike(context, x, y, color, keyCode){
    this.ctx = context;
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.turn = false;
    this.angle = 90;
    this.speed = 10;
    this.keyCode = keyCode;
    this.color = color;
    this.crashed = false;

    this.drive = function() {
      if (this.speed > 0) {
        if (this.turn) {
          this.angle -= 5;
        };

        var velocityX = Math.sin(this.angle * Math.PI / 180) * this.speed;
        var velocityY = -Math.cos(this.angle * Math.PI / 180) * this.speed;

        this.x += velocityX;
        this.y += velocityY;
      }
    };

    this.tick = function() {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;

      this.drive();

      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      if (!this.onTrack()) {
        this.crash();
      }
    };

    this.crash = function() {
      this.speed = 0;
      this.crashed = true;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0 * Math.PI, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.lineWidth = 1;
      ctx.fill();
    };

    this.keydown = function(keyCode) {
      this.turn = this.turn || (keyCode === this.keyCode);
    };

    this.keyup = function(keyCode) {
      if (keyCode === this.keyCode) {
        this.turn = false;
      }
    };

    this.init = function() {
      ctx.moveTo(this.startX, this.startY);
      this.x = this.startX;
      this.y = this.startY;
      this.angle = 90;
    };

    this.onTrack = function() {
      var imageData = trackCtx.getImageData(this.x, this.y, 1, 1);
      var alpha = imageData.data[3];

      return (alpha === 255);
    };

    this.reset = this.init;

    this.init();
  }

  function tick() {
    bikes.forEach(function(bike) { bike.tick(); });
    debug();
  }

  function debug() {
    debugBox.innerText = '';
    bikes.forEach(function(bike) {
      debugBox.innerText += "BIKE " + bike.color + "\nspeed: "+bike.speed + "\n" +
                                "angle: " + bike.angle + "\n" +
                                "start: " + parseInt(bike.startX) + "," + parseInt(bike.startY) + "\n" +
                                "pos: ("+ parseInt(bike.x) + "," + parseInt(bike.y) +")\n" +
                                (bike.turn == true ? "turning" : "") + "\n" +
                                (bike.crashed == true ? "crashed" : "") + "\n";
    });
  };

  function paintTrack() {

    trackCtx.beginPath();

    trackCtx.moveTo(startX, startY);
    trackCtx.strokeStyle = 'black'
    trackCtx.lineWidth = laneWidth;

    paintTrackCurve(trackCtx);

    trackCtx.stroke();
  };

  function paintTrackCurve(context) {
    context.lineTo(startX + laneLength, startY);
    context.bezierCurveTo(startX + laneLength + 200, startY, startX + laneLength + 200, startY - (2 * laneWidth), startX + laneLength, startY - (2 * laneWidth));
    context.lineTo(startX, startY - (2 * laneWidth));
    context.bezierCurveTo(startX - 200, startY - (2 * laneWidth), startX - 200, startY, startX, startY);
  };

  function init() {
    ctx.translate(0.5, 0.5);

    c.width = window.innerWidth;
    c.height = window.innerHeight;
    track.width = window.innerWidth;
    track.height = window.innerHeight;

    canvasWidth = c.width;
    canvasHeight = c.height;
    laneLength = canvasWidth / 2;

    startX = canvasWidth / 2 - (laneLength / 2);
    startY = canvasHeight / 2 + laneWidth;

    paintTrack();

    bikes.push(new Bike(ctx, canvasWidth / 2, canvasHeight / 2 + laneWidth - 10, 'red', 65));
    bikes.push(new Bike(ctx, canvasWidth / 2, canvasHeight / 2 + laneWidth + 10, 'green', 76));

    setInterval(tick, 1000 / FPS);
    setInterval(darken, 1000);
  };

  function darken() {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = laneWidth;

    paintTrackCurve(ctx);

    ctx.stroke();
  }

  function reset() {
    c.width = c.width;
    paintTrack();
    bikes.forEach(function(bike) { bike.reset(); });
  };

  function keydown(key) {
    bikes.forEach(function(bike) { bike.keydown(key.which); });

    //if (key.which == 83) {
      //bike.speed = 0;
    //} else if (key.which == 65) {
      //bike.speed = bike.speed + 1;
    //} else if (key.which == 68) {
      //debugBox.hidden = !debugBox.hidden;
    //} else if (key.which == 82) {
      //reset();
    //}
  };

  function keyup(key) {
    bikes.forEach(function(bike) { bike.keyup(key.which); });

    //if (key.which == 37) {
      //bike.turn = false;
    //}
  }

  window.addEventListener('load', init, false);
  window.addEventListener('keyup', keyup, false);
  window.addEventListener('keydown', keydown, false);
})();
