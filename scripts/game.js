define(['engine/track', 'engine/bike'], function(Track, Bike) {

  function Game() {
    this.FPS = 30;
    this.banner = document.querySelector('#banner');

    this.write = function(text) {
      this.banner.innerText = text;
    };

    this.tick = function() {
      Bike.tick();
      Bike.checkForWinners();
    };

    this.start = function() {
      this.mainLoop = setInterval(this.tick, 1000 / this.FPS);
    };

    //this.start();
  };

  return Game;
});
