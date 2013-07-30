require(['engine/race'], function(Race) {
  document.querySelector('#start-game').addEventListener('click', function() {
    document.querySelector('#menu').style.display = 'none';
    document.querySelector('#container').style.display = 'block';
    new Race();

    return false;
  }, false);

  document.querySelector('#how-to-play').addEventListener('click', function() {
    alert('Soon...');
  }, false);

  document.querySelector('#share').addEventListener('click', function() {
    alert('Soon...');
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
