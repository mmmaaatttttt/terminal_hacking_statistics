var helpers = require('./helpers');

function closestString(arr) {
  return arr.reduce((prev, cur) => averageDistance(cur, arr) < averageDistance(prev, arr) ? cur : prev);
}

function farthestString(arr) {
  return arr.reduce((prev, cur) => averageDistance(cur, arr) > averageDistance(prev, arr) ? cur : prev);
}

function highestAverageEliminations(arr) {
  var averageElims = arr.map(function(guessStr) {
    return arr.map(function(answerStr) {
      var eliminated = arr.filter(function(testStr) { 
        return helpers.stringDistance(guessStr, answerStr) !== helpers.stringDistance(guessStr, testStr);
      });
      return (guessStr === answerStr) ? arr.length : eliminated.length;
    });
  }).map(function(countArr) {
    return countArr.reduce(function(s, n) { 
      return s + n
    })/countArr.length;
  });
  return arr[averageElims.indexOf(Math.max.apply(Math, averageElims))]
}



function randomString(arr) {
  return arr[~~(arr.length * Math.random())];
}

module.exports = {
  closestString,
  farthestString,
  highestAverageEliminations,
  randomString
}