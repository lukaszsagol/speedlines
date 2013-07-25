(function() {
  var FPS = 30;

  var c = document.querySelector('canvas');
  var ctx = c.getContext('2d');
  var debugBox = document.querySelector('#debug');

  var canvasWidth = c.width;
  var canvasHeight = c.height;

  var bikes = [];

  function Bike(context, x, y, color, keyCode){
    this.ctx = context;
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.turn = false;
    this.angle = 90;
    this.speed = 5;
    this.keyCode = keyCode;
    this.color = color;

    this.drive = function() {
      if (this.speed > 0) {
        if (this.turn) {
          this.angle -= 10;
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

      this.drive();

      ctx.lineTo(this.x, this.y);
      ctx.stroke();
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
                                "pos: ("+ parseInt(bike.x) + "," + parseInt(bike.y) +")\n" + (bike.turn == true ? "turning" : "") + "\n";
    });
  };

  function init() {
    ctx.translate(0.5, 0.5);

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    canvasWidth = c.width;
    canvasHeight = c.height;

    bikes.push(new Bike(ctx, canvasWidth / 2, canvasHeight / 2, 'red', 65));
    bikes.push(new Bike(ctx, canvasWidth / 2, canvasHeight / 2 + 20, 'green', 83));
    setInterval(tick, 1000 / FPS);
  };

  function reset() {
    c.width = c.width;
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
