(function() {
  var FPS = 30;

  var c = document.querySelector('canvas');
  var ctx = c.getContext('2d');

  var canvasWidth = c.width;
  var canvasHeight = c.height;

  var pointX = 0;
  var pointY = 0;

  var turn = false;
  var angle = 90;
  var speed = 5;

  function tick() {
    if (speed > 0) {
      if (turn) {
        angle = angle - 10;
      }
      var vX = Math.sin(angle * Math.PI / 180) * speed;
      var vY = -Math.cos(angle * Math.PI / 180) * speed;

      pointX = pointX + vX;
      pointY = pointY + vY;

      ctx.lineTo(pointX, pointY);
      ctx.stroke();
      console.log(pointX, pointY);
    }
  }

  function init() {
    //ctx.translate(0.5, 0.5);

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    canvasWidth = c.width;
    canvasHeight = c.height;

    ctx.beginPath();
    ctx.lineWidth = '1';
    ctx.strokeStyle = 'green';

    pointX = canvasWidth / 2;
    pointY = canvasHeight / 2;

    ctx.moveTo(pointX, pointY);

    setInterval(tick, 1000 / FPS);
    console.log(pointX, pointY);
  };

  function keydown(key) {
    if (key.which == 37) {
      turn = true;
    } else if (key.which == 83) {
      speed = 0;
    } else if (key.which == 65) {
      speed = 5;
    }
  };

  function keyup(key) {
    if (key.which == 37) {
      turn = false;
    }
  }

  window.addEventListener('load', init, false);
  window.addEventListener('keyup', keyup, false);
  window.addEventListener('keydown', keydown, false);
})();
