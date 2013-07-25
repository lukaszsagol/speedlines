(function() {
  var FPS = 30;

  var c = document.querySelector('canvas');
  var ctx = c.getContext('2d');
  var debugBox = document.querySelector('#debug');

  var canvasWidth = c.width;
  var canvasHeight = c.height;

  var bike = null;

  function Bike(x, y){
    this.x = x;
    this.y = y;
    this.turn = false;
    this.angle = 90;
    this.speed = 5;
  }

  function tick() {
    if (bike.speed > 0) {
      if (bike.turn) {
        bike.angle = bike.angle - 10;
      }
      var vX = Math.sin(bike.angle * Math.PI / 180) * bike.speed;
      var vY = -Math.cos(bike.angle * Math.PI / 180) * bike.speed;

      bike.x = bike.x + vX;
      bike.y = bike.y + vY;

      ctx.lineTo(bike.x, bike.y);
      color = 255 - (bike.speed * 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bike.x, bike.y);
      ctx.lineWidth = '1';
      colorR = '255';
      colorG = bike.speed * 10;
      colorB = bike.speed * 10;
      ctx.strokeStyle = 'rgb('+colorR+','+colorG+','+colorB+');';
    }
    debug();
  }

  function debug() {
    debugBox.innerText = "BIKE\nspeed: "+bike.speed + "\n" +
                              "angle: " + bike.angle + "\n" +
                              "pos: ("+ parseInt(bike.x) + "," + parseInt(bike.y) +")\n" + (bike.turn == true ? "turning" : "");
  };

  function init() {
    ctx.translate(0.5, 0.5);

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    canvasWidth = c.width;
    canvasHeight = c.height;

    ctx.beginPath();
    ctx.lineWidth = '1';
    ctx.strokeStyle = 'rgb(255, 0, 0)';

    bike = new Bike(canvasWidth / 2, canvasHeight / 2);
    ctx.moveTo(bike.x, bike.y);

    setInterval(tick, 1000 / FPS);
  };

  function reset() {
    c.width = c.width;
    bike = new Bike(canvasWidth / 2, canvasHeight / 2);
    ctx.beginPath();
    ctx.lineWidth = '1';
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.moveTo(bike.x, bike.y);
  };

  function keydown(key) {
    if (key.which == 37) {
      bike.turn = true;
    } else if (key.which == 83) {
      bike.speed = 0;
    } else if (key.which == 65) {
      bike.speed = bike.speed + 1;
    } else if (key.which == 68) {
      debugBox.hidden = !debugBox.hidden;
    } else if (key.which == 82) {
      reset();
    }
  };

  function keyup(key) {
    if (key.which == 37) {
      bike.turn = false;
    }
  }

  window.addEventListener('load', init, false);
  window.addEventListener('keyup', keyup, false);
  window.addEventListener('keydown', keydown, false);
})();
