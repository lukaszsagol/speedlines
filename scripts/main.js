require(['engine/race', 'modal'], function(Race, modal) {
  document.querySelector('#select-players-button').addEventListener('click', function() {
    document.querySelector('#menu').style.display = 'none';
    document.querySelector('#starting-game').style.display = 'block';

    return false;
  }, false);

  var buttons = document.querySelectorAll('.start-game-button');

  for (var i = 0; i < buttons.length; ++i) {
    buttons[i].addEventListener('click', function() {
      document.querySelector('#frontend').style.display = 'none';
      document.querySelector('#container').style.display = 'block';

      var race = new Race(this.dataset.players);

      return false;
    }, false);
  };

  document.querySelector('.back-button').addEventListener('click', function() {
    document.querySelector('#menu').style.display = 'block';
    document.querySelector('#starting-game').style.display = 'none';

    return false;
  }, false);

  window.addEventListener('keydown', function(event) {
    if (window.currentRace) {
      if (window.currentRace.finished) { 
        // race is finished
      } else {
        // race is on
      }

      window.currentRace.keydown(event);
    } else {
      // main menu
    }
  }, false);

  window.addEventListener('keyup', function(event) {
    if (window.currentRace) { window.currentRace.keyup(event) }
  }, false);
});
