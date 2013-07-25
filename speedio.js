(function() {
  var FPS = 30;

  var c = document.querySelector('#race');
  var ctx = c.getContext('2d');

  var trackCanvas = document.querySelector('#track');
  var track = null;

  var debugBox = document.querySelector('#debug');

  var bikes = [];

  function Track(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.laneWidth = 150;
    this.laneLength = canvas.width / 2;
    this.startX = canvas.width / 2 - (this.laneLength / 2);
    this.startY = canvas.height / 2 + this.laneWidth;
    this.startLineX = canvas.width / 2;

    this.paint = function() {
      this.paintTrack();
      this.paintStartLine();
    };

    this.paintTrack = function() {
      this.ctx.beginPath();

      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = this.laneWidth;
      this.paintTrackCurve();

      this.ctx.stroke();
    };

    this.paintStartLine = function() {
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 3;
      this.ctx.moveTo(this.startLineX-1, this.startY - (this.laneWidth/2));
      this.ctx.lineTo(this.startLineX-1, this.startY + (this.laneWidth/2));
      this.ctx.stroke();
    };

    this.paintTrackCurve = function() {
      this.ctx.lineTo(this.startX + this.laneLength, this.startY);
      this.ctx.bezierCurveTo(this.startX + this.laneLength + 200, this.startY, this.startX + this.laneLength + 200, this.startY - (2 * this.laneWidth), this.startX + this.laneLength, this.startY - (2 * this.laneWidth));
      this.ctx.lineTo(this.startX, this.startY - (2 * this.laneWidth));
      this.ctx.bezierCurveTo(this.startX - 200, this.startY - (2 * this.laneWidth), this.startX - 200, this.startY, this.startX, this.startY);
    };

    this.isOnTrack = function(x,y) {
      var alpha = this.ctx.getImageData(x, y, 1, 1).data[3];
      return (alpha === 255);
    };

    this.startPosition = function(position) {
      var x = this.startLineX;
      var offset = [-30, -10, 10, 30];
      var y = this.canvas.height / 2 + this.laneWidth + offset[position - 1];

      var point = { x: x, y: y };

      return point;
    };

    this.passedStartLine = function(previousX, currentX) {
      return ((previousX < this.startLineX) && (currentX > this.startLineX));
    };
  };

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
    this.lap = 1;

    this.drive = function() {
      if (this.speed > 0) {
        if (this.turn) {
          this.angle -= 5;
        };

        var velocityX = Math.sin(this.angle * Math.PI / 180) * this.speed;
        var velocityY = -Math.cos(this.angle * Math.PI / 180) * this.speed;

        this.previousX = this.x;
        this.previousY = this.y;

        this.x += velocityX;
        this.y += velocityY;
      }
    };

    this.tick = function() {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.strokeStyle = 'rgba(0,0,0,0.7)';
      ctx.lineWidth = 20;

      this.drive();
      this.checkLap();

      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      ctx.moveTo(this.previousX, this.previousY);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.lineTo(this.x, this.y);
      ctx.stroke();


      if (!this.onTrack()) {
        this.crash();
      }
    };

    this.checkLap = function() {
      if (track.passedStartLine(this.previousX, this.x)) {
        this.lap += 1;
      };
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

    this.stop = function() {
      this.speed = 0;
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
      return track.isOnTrack(this.x, this.y);
    };

    this.reset = this.init;

    this.init();
  }

  function tick() {
    bikes.forEach(function(bike) { bike.tick(); });
    checkForWinners();
    debug();
  }

  function checkForWinners() {
    bikes.forEach(function(bike) { 
      if (bike.lap > 4) {
        console.log('Biker '+bike.color+' is a winner');
        bikes.forEach(function(bike) { bike.stop(); });
      }
    });
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
                                (bike.crashed == true ? "crashed" : "") + "\n";
    });
  };

  function init() {
    ctx.translate(0.5, 0.5);

    c.width = window.innerWidth;
    c.height = window.innerHeight;
    trackCanvas.width = window.innerWidth;
    trackCanvas.height = window.innerHeight;

    track = new Track(trackCanvas);
    track.paint();

    bikes.push(new Bike(ctx, track.startPosition(1)['x'], track.startPosition(1)['y'],  'red', 65));
    bikes.push(new Bike(ctx, track.startPosition(2)['x'], track.startPosition(2)['y'], 'green', 76));
    bikes.push(new Bike(ctx, track.startPosition(3)['x'], track.startPosition(3)['y'],  'blue', 65));
    bikes.push(new Bike(ctx, track.startPosition(4)['x'], track.startPosition(4)['y'], 'pink', 76));

    setInterval(tick, 1000 / FPS);
    //setInterval(darken, 1000);
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
