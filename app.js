'use strict'

const strategies = require('./strategies');
const words = require('./words');
const helpers = require('./helpers');
const prompt = require('prompt');

function solvePuzzle(arr, answer, algorithm, count) {
  let guessCount = count || 1;
  let testString = algorithm(arr);
  if (testString === answer) {
    return guessCount;
  } else {
    let newArr = arr.filter(function(el) {
      return helpers.stringDistance(el, testString) === helpers.stringDistance(answer, testString)
    });
    return solvePuzzle(newArr, answer, algorithm, guessCount + 1);
  }
}

let schema = {
  properties: {
    algorithm: {
      description: "Which algorithm would you like to test? Random Guess (R), Closest String (C), Farthest String (F), or Maximum Expected Eliminations (M)?",
      pattern: /^(r|c|f|m)$/i,
      message: "Please enter R, C, F, or M.",
      required: true
    },
    numTrials: {
      description: "How many trials of the random algorithm do you want to perform? (Default is 1000)",
      default: 1000,
      pattern: /^\d+$/,
      message: "Please enter a number.",
      ask: () => prompt.history('algorithm').value.toLowerCase() === 'r',
    },
    listType: {
      description: "Do you want to test your algorithm against a single list of words (1), a random sampling of words (2), or a random sampling of random characters (3)?",
      pattern: /^(1|2|3)$/i,
      message: "Please enter 1, 2, or 3.",
      required: true
    },
    singleList: {
      description: "Enter 'sample5' to use a sample list of 5 words, 'sample6' to use a sample list of 6 words, 'sample7' to use a sample list of 7 words, or enter your own list of words, comma separated",
      type: 'string',
      ask: () => +prompt.history('listType').value === 1
    },
    wordLength: {
      description: "Do you want to use words of length 5, 6, or 7?",
      pattern: /^(5|6|7)$/i,
      message: "Please enter 5, 6, or 7.",
      ask: () => +prompt.history('listType').value === 2
    },
    randomWordLength: {
      description: "How many characters do you want in each random word?",
      pattern: /^\d+$/,
      message: "Please enter a number.",
      ask: () => +prompt.history('listType').value === 3
    },
    wordListLength: {
      description: "How many words do you want in your list?",
      pattern: /^\d+$/,
      message: "Please enter a number.",
      ask: () => +prompt.history('listType').value !== 1
    }
  }
}

prompt.get(schema, (err, res) => {
  err ? console.log("ERR", err) : console.log("RES", res);
  process.exit(1);
})

// algorithm to test
  // if random, number of trials
// list type - one list, or sampling of many words, or sampling of many random strings
  // if one list, enter a list or pick
  // if sampling many, enter number of letters, length of list
  // if sampling many random strings, enter number of words, number of chars per word 

let algorithms = [strategies.randomString, strategies.closestString, strategies.farthestString, strategies.highestAverageEliminations] 

// Statistics for sample word lists
// algorithms.forEach(function(algo) {
//   [words.sample1, words.sample2, words.sample3].forEach(function(wordList) {
//     var guessAverage = 0;
//     var winCount = 0;
//     var guessCounts;
//     var totalTrials = (algo.name === "randomString") ? 1e5 : 1;
//     var listDensity = helpers.averageAverageDistance(wordList);
//     for (var i = 0; i < totalTrials; i++) {
//       guessCounts = wordList.map(function(ans) { return solvePuzzle(wordList, ans, algo )});
//       guessAverage += guessCounts.reduce(function(p, c) { return p + c; }, 0)/(guessCounts.length * totalTrials);
//       winCount += guessCounts.filter(function(count) { return count < 5 }).length;
//     }
//     console.log(algo.name + ": " + wordList, 
//       "\n", "Average number of guesses " + guessAverage, 
//       "\n", "Win Percentage: " + winCount/(wordList.length * totalTrials),
//       "\n", "List Density: " + listDensity
//     );
//   });
// });

// Statistics for exhaustive word lists
// var guessAverage = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
// var winCount = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
// var totalTrials = [1e3, 1, 1, 1];
// var guessCounts;
// for (var j = 0; j < 1e4; j++) {
//   console.log(j);
//   var list1 = helpers.grabRandomElementsFromAnArray(words.all5, 12);
//   var list2 = helpers.grabRandomElementsFromAnArray(words.all6, 12);
//   var list3 = helpers.grabRandomElementsFromAnArray(words.all7, 12);
//   [list1, list2, list3].forEach(function(wordList, listIdx) { // 3
//     algorithms.forEach(function(algo, algoIdx) {
//       for (var i = 0; i < totalTrials[algoIdx]; i++) {
//         guessCounts = wordList.map(function(ans) { return solvePuzzle(wordList, ans, algo )});
//         guessAverage[algoIdx][listIdx] += guessCounts.reduce(function(p, c) { return p + c; }, 0)/(guessCounts.length * totalTrials[algoIdx] * 1e2);
//         winCount[algoIdx][listIdx] += guessCounts.filter(function(count) { return count < 5 }).length;
//       }
//     });
//   });
// }
// algorithms.forEach(function(algo, idx) {
//   [5, 6, 7].forEach(function(word, widx) {
//     console.log(algo.name + ": length " + word, 
//       "\n", "Average number of guesses " + guessAverage[idx][widx], 
//       "\n", "Win Percentage: " + winCount[idx][widx]/(12 * totalTrials[idx] * 1e2)
//     );
//   })
// });

// Statistics for random word lists
// var guessAverage = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
// var winCount = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
// var totalTrials = [1e3, 1, 1, 1];
// var guessCounts;
// for (var j = 0; j < 1e4; j++) {
//   console.log(j);
//   var list1 = helpers.createArrayOfRandomStrings(12, 5);
//   var list2 = helpers.createArrayOfRandomStrings(12, 6);
//   var list3 = helpers.createArrayOfRandomStrings(12, 7);
//   [list1, list2, list3].forEach(function(wordList, listIdx) { // 3
//     algorithms.forEach(function(algo, algoIdx) {
//       for (var i = 0; i < totalTrials[algoIdx]; i++) {
//         guessCounts = wordList.map(function(ans) { return solvePuzzle(wordList, ans, algo )});
//         guessAverage[algoIdx][listIdx] += guessCounts.reduce(function(p, c) { return p + c; }, 0)/(guessCounts.length * totalTrials[algoIdx] * 1e4);
//         winCount[algoIdx][listIdx] += guessCounts.filter(function(count) { return count < 5 }).length;
//       }
//     });
//   });
// }
// algorithms.forEach(function(algo, idx) {
//   [5, 6, 7].forEach(function(word, widx) {
//     console.log(algo.name + ": length " + word, 
//       "\n", "Average number of guesses " + guessAverage[idx][widx], 
//       "\n", "Win Percentage: " + winCount[idx][widx]/(12 * totalTrials[idx] * 1e4)
//     );
//   })
// });

// process.exit(1)