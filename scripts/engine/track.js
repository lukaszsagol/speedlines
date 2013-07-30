define(function() {
  function Track(canvas) {
    this.canvas = canvas;
    this.color = '#2c3e50';
    this.ctx = canvas.getContext('2d');

    this.laneWidth = 150;
    this.laneLength = canvas.width / 2;
    this.startX = canvas.width / 2 - (this.laneLength / 2);
    this.startY = canvas.height / 2 + this.laneWidth;
    this.startLineX = canvas.width / 2;

    this.paint = function() {
      this.paintTrack();
      this.paintStartLine();
    };

    this.paintTrack = function() {
      this.ctx.beginPath();

      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.laneWidth;
      this.paintTrackCurve();

      this.ctx.stroke();
    };

    this.paintStartLine = function() {
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 3;
      this.ctx.moveTo(this.startLineX-1, this.startY - (this.laneWidth/2));
      this.ctx.lineTo(this.startLineX-1, this.startY + (this.laneWidth/2));
      this.ctx.stroke();
    };

    this.paintTrackCurve = function() {
      this.ctx.lineTo(this.startX + this.laneLength, this.startY);
      this.ctx.bezierCurveTo(this.startX + this.laneLength + 200, this.startY, this.startX + this.laneLength + 200, this.startY - (2 * this.laneWidth), this.startX + this.laneLength, this.startY - (2 * this.laneWidth));
      this.ctx.lineTo(this.startX, this.startY - (2 * this.laneWidth));
      this.ctx.bezierCurveTo(this.startX - 200, this.startY - (2 * this.laneWidth), this.startX - 200, this.startY, this.startX, this.startY);
    };

    this.isOnTrack = function(x,y) {
      var alpha = this.ctx.getImageData(x, y, 1, 1).data[3];
      return (alpha === 255);
    };

    this.startPosition = function(position) {
      var x = this.startLineX;
      var offset = [-30, -10, 10, 30];
      var y = this.canvas.height / 2 + this.laneWidth + offset[position - 1];

      var point = { x: x, y: y };

      return point;
    };

    this.passedStartLine = function(previousX, currentX) {
      return ((previousX < this.startLineX) && (currentX > this.startLineX));
    };
  };

  return Track;
});
