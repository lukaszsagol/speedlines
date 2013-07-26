require(['game', 'engine/bike', 'engine/track'], function(Game, Bike, Track) {
  new Game();
  document.querySelector('#container').style.display = 'block';
});
