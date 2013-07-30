require(['engine/race', 'modal'], function(Race, modal) {
  document.querySelector('#start-game-button').addEventListener('click', function() {
    document.querySelector('#menu').style.display = 'none';
    document.querySelector('#container').style.display = 'block';
    new Race();

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
