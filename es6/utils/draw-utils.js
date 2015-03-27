
// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
module.exports.getRandomColor = function() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// scale from domain [0, 1] to range [270, 0] to consume in
// hsl(x, 100%, 50%) color scheme
module.exports.getHue = function(x) {
  var domainMin = 0;
  var domainMax = 1;
  var rangeMin = 270;
  var rangeMax = 0;

  return (((rangeMax - rangeMin) * (x - domainMin)) / (domainMax - domainMin)) + rangeMin;
};

// http://www.javascripter.net/faq/hextorgb.htm
// function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
// function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
// function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
// function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
module.exports.hexToRGB = function(hex) {
  hex = hex.substring(1, 7);
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
};