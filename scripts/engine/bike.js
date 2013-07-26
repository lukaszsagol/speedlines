define(function() {

  function Bike(context, x, y, color, keyCode, track){
    this.ctx = context;
    this.historyX = [];
    this.historyY = [];
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.turn = false;
    this.angle = 90;
    this.speed = 10;
    this.keyCode = keyCode;
    this.color = color;
    this.lap = 1;
    this.crashed = false;
    this.winner = false;
    this.track = track;

    this.drive = function() {
      if (!this.crashed) {
        if (this.turn) {
          this.angle -= 5;
        };

        var velocityX = Math.sin(this.angle * Math.PI / 180) * this.speed;
        var velocityY = -Math.cos(this.angle * Math.PI / 180) * this.speed;

        this.historyX.unshift(this.x);
        this.historyY.unshift(this.y);

        this.previousX = this.x;
        this.previousY = this.y;

        this.x += velocityX;
        this.y += velocityY;
      }
    };

    this.tick = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;

      this.drive();
      this.checkLap();

      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      if (this.historyX[50]) {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.moveTo(this.historyX[50], this.historyY[50]);
        ctx.lineTo(this.historyX[49], this.historyY[49]);
        ctx.stroke();
      };

      if (!this.onTrack()) {
        this.crash();
      }
    };

    this.checkLap = function() {
      if (this.track.passedStartLine(this.previousX, this.x)) {
        this.lap += 1;
      };
    };

    this.crash = function() {
      this.speed = 0;
      this.crashed = true;
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, 5, 0 * Math.PI, 2 * Math.PI);
      this.ctx.fillStyle = this.color;
      this.ctx.lineWidth = 1;
      this.ctx.fill();
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
      this.ctx.moveTo(this.startX, this.startY);
      this.x = this.startX;
      this.y = this.startY;
      this.angle = 90;
      Bike.prototype.bikes.push(this);
    };

    this.onTrack = function() {
      return this.track.isOnTrack(this.x, this.y);
    };

    this.win = function() {
      if (!this.winner) {
        this.winner = true;
        game_write(this.color + ' has won!');
        Bike.others(this, function(bike) { bike.stop(); });
      }
    };

    this.reset = this.init;

    this.init();
  };

  Bike.prototype.bikes = [];

  Bike.checkForWinners = function() {
    Bike.prototype.bikes.forEach(function(bike) {
      if (bike.lap > 4) {
        bike.win();
        clearInterval(mainTick);
      }
    });

    var stillRacing = Bike.prototype.bikes.filter(function(bike) { return !bike.crashed });

    if (stillRacing.length == 1) {
      stillRacing[0].win();
    }
  };

  Bike.each = function(fn) {
    Bike.prototype.bikes.forEach(function(bike) { fn(bike); });
  };

  Bike.others = function(current_bike, fn) {
    Bike.prototype.bikes.forEach(function(bike) {
      if (bike !== current_bike) {
        fn(bike);
      };
    });
  };

  Bike.tick = function() {
    Bike.prototype.bikes.forEach(function(bike) {
      bike.tick();
    });
  };

  Bike.keydown = function(key) {
    Bike.prototype.bikes.forEach(function(bike) {
      bike.keydown(key);
    });
  };

  Bike.keyup = function(key) {
    Bike.prototype.bikes.forEach(function(bike) {
      bike.keyup(key);
    });
  };

  Bike.stop = function() {
    Bike.prototype.bikes.forEach(function(bike) {
      bike.stop();
    });
  };

  return Bike;
});
