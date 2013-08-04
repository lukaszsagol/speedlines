define(function() {

  function Bike(name, context, x, y, color, keyCode, track){
    this.name = name;
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
    this.totalWins = 0;
    this.raceStartTime = null;
    this.lapStartTime = null;
    this.lastSplitTime = null;
    this.bestSplitTime = null;

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

    this.paint = function(fromX, fromY, toX, toY, strokeStyle, lineWidth) {
      with(this) {
        ctx.beginPath();

        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;

        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);

        ctx.stroke();
      };
    };

    this.paintTrace = function() {
      this.paint(this.previousX, this.previousY, this.x, this.y, this.color, 2);
    };

    this.deleteTrace = function() {
      if (this.historyX[50]) {
        this.paint(this.historyX[50], this.historyY[50], this.historyX[49], this.historyY[49], this.track.color, 5);
      };
    };

    this.tick = function() {
      this.drive();

      this.paintTrace();
      this.deleteTrace();

      this.checkLap();

      if (!this.onTrack())   { this.crash(); };
    };

    this.checkLap = function() {
      if (this.track.passedStartLine(this.previousX, this.x)) {
        this.lap += 1;
        var now = Date.now();
        this.lastSplitTime = now - this.lapStartTime;
        this.lapStartTime = now;
        this.bestSplitTime = this.bestSplitTime && this.bestSplitTime < this.lastSplitTime ? this.bestSplitTime : this.lastSplitTime;
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

    this.writeStats = function() {
      var lastSplit = 'waiting';
      var bestSplit = 'waiting';

      if (this.lastSplitTime) {
        var lastSplitTimeDate = new Date(this.lastSplitTime);
        var lastSplitMilis = lastSplitTimeDate.getMilliseconds();
        if (lastSplitMilis.toString().length === 2) { lastSplitMilis = "0"+lastSplitMilis.toString(); }
        lastSplit = lastSplitTimeDate.getSeconds() + "." + lastSplitMilis;
      };

      if (this.bestSplitTime) {
        var bestSplitTimeDate = new Date(this.bestSplitTime);
        var bestSplitMilis = bestSplitTimeDate.getMilliseconds();
        if (bestSplitMilis.toString().length === 2) { bestSplitMilis = "0"+bestSplitMilis.toString(); }
        bestSplit = bestSplitTimeDate.getSeconds() + "." + bestSplitMilis;
      };

      var outputHTML = "<div class='bike' style='color: "+this.color+" '>" + 
      this.name + "<br/>" +
        this.lap + "<br/>" +
        lastSplit + "<br/>" +
        bestSplit + "<br/>" +
        this.totalWins + "<br/>" +
      "</div>";

      return outputHTML;
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
      this.restart();
      Bike.prototype.bikes.unshift(this);
    };

    this.onTrack = function() {
      return this.track.isOnTrack(this.x, this.y);
    };

    this.win = function() {
      if (!this.winner) {
        this.totalWins += 1;
        this.winner = true;
        window.currentRace.finish(this);
        Bike.others(this, function(bike) { bike.stop(); });
      }
    };

    this.start = function() {
      var now = Date.now();
      this.lapStartTime = this.raceStartTime = now;
    };

    this.restart = function() {
      this.historyX = [];
      this.historyY = [];
      this.winner = false;
      this.crashed = false;
      this.lap = 1;
      this.turn = false;
      this.angle = 90;
      this.speed = 10;

      this.x = this.startX;
      this.y = this.startY;

      this.historyX.unshift(this.x - 20);
      this.historyY.unshift(this.y);

      this.historyX.unshift(this.x);
      this.historyY.unshift(this.y);

      this.paint(this.x - 20, this.y, this.x, this.y, this.color, 2);
    };

    this.init();
  };

  Bike.prototype.bikes = [];

  Bike.checkForWinners = function() {
    if (Bike.prototype.bikes.length > 1) {
      Bike.prototype.bikes.forEach(function(bike) {
        if (bike.lap > 4 && !window.currentRace.finished) {
          bike.win();
        }
      });

      var stillRacing = Bike.prototype.bikes.filter(function(bike) { return !bike.crashed });

      if (stillRacing.length == 1) {
        stillRacing[0].win();
      }
    }
  };

  Bike.each = function(fn) {
    Bike.prototype.bikes.forEach(function(bike) { fn(bike); });
  };

  Bike.count = function() {
    return Bike.prototype.bikes.length;
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

  Bike.writeStats = function(wrapper) {
    wrapper.innerHTML = '';

    Bike.each(function(bike) {
      wrapper.innerHTML += bike.writeStats();
    });
  };

  Bike.stop = function() {
    Bike.prototype.bikes.forEach(function(bike) {
      bike.stop();
    });
  };

  return Bike;
});
