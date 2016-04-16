'use strict'

const helpers = require('./helpers');

function closestString(wordList) {
  return wordList.reduce((prevWord, curWord) => {
    let prevAverage = helpers.average(helpers.distanceArray(prevWord, wordList));
    let curAverage = helpers.average(helpers.distanceArray(curWord, wordList));
    return curAverage < prevAverage ? curWord : prevWord;
  });
}

function farthestString(wordList) {
  return wordList.reduce((prevWord, curWord) => {
    let prevAverage = helpers.average(helpers.distanceArray(prevWord, wordList));
    let curAverage = helpers.average(helpers.distanceArray(curWord, wordList));
    return curAverage > prevAverage ? curWord : prevWord;
  });
}

function maximumAverageEliminations(wordList) {
  return wordList.reduce((prevWord, curWord) => {
    let prevAverage = helpers.average(helpers.eliminationsArray(prevWord, wordList));
    let curAverage = helpers.average(helpers.eliminationsArray(curWord, wordList));
    return curAverage > prevAverage ? curWord : prevWord;
  });
}

function randomString(arr) {
  return arr[~~(arr.length * Math.random())];
}

module.exports = {
  closestString,
  farthestString,
  maximumAverageEliminations,
  randomString
}