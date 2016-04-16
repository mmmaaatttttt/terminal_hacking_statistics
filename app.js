var strategies = require('./strategies');
var words = require('./words');
var helpers = require('./helpers');

function solvePuzzle(arr, answer, algorithm, count) {
  var guessCount = count || 1;
  var testString = algorithm(arr);
  if (testString === answer) {
    return guessCount;
  } else {
    var newArr = arr.filter(function(el) {
      return helpers.stringDistance(el, testString) === helpers.stringDistance(answer, testString)
    });
    return solvePuzzle(newArr, answer, algorithm, guessCount + 1);
  }
}

var algorithms = [strategies.randomString, strategies.closestString, strategies.farthestString, strategies.highestAverageEliminations] 

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
var guessAverage = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
var winCount = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
var totalTrials = [1e3, 1, 1, 1];
var guessCounts;
for (var j = 0; j < 1e4; j++) {
  console.log(j);
  var list1 = helpers.createArrayOfRandomStrings(12, 5);
  var list2 = helpers.createArrayOfRandomStrings(12, 6);
  var list3 = helpers.createArrayOfRandomStrings(12, 7);
  [list1, list2, list3].forEach(function(wordList, listIdx) { // 3
    algorithms.forEach(function(algo, algoIdx) {
      for (var i = 0; i < totalTrials[algoIdx]; i++) {
        guessCounts = wordList.map(function(ans) { return solvePuzzle(wordList, ans, algo )});
        guessAverage[algoIdx][listIdx] += guessCounts.reduce(function(p, c) { return p + c; }, 0)/(guessCounts.length * totalTrials[algoIdx] * 1e4);
        winCount[algoIdx][listIdx] += guessCounts.filter(function(count) { return count < 5 }).length;
      }
    });
  });
}
algorithms.forEach(function(algo, idx) {
  [5, 6, 7].forEach(function(word, widx) {
    console.log(algo.name + ": length " + word, 
      "\n", "Average number of guesses " + guessAverage[idx][widx], 
      "\n", "Win Percentage: " + winCount[idx][widx]/(12 * totalTrials[idx] * 1e4)
    );
  })
});

process.exit(1)