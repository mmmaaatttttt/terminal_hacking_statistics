'use strict'

const strategies = require('./strategies');
const words = require('./words');
const helpers = require('./helpers');
const prompt = require('prompt');
const TOTAL_GUESSES = 4;

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

let algorithms = {
  "r": strategies.randomString,
  "c": strategies.closestString,
  "f": strategies.farthestString,
  "m": strategies.maximumAverageEliminations
}

prompt.get(schema, (err, res) => {
  if (err) {
    console.log("Sorry, looks like there was an error: ", err);
    process.exit(1);
  } else {
    // grab the algorithm and number of trials (only > 1 for random algorithm)
    let algorithm = algorithms[res.algorithm.toLowerCase()];
    let numTrials = res.algorithm.toLowerCase() === "r" ? +res.numTrials : 1;

    // get the list of words to be used
    let wordList = [];
    if (res.listType === '1') {
      let singleList = res.singleList.toLowerCase().trim();
      if (singleList === 'sample5' || singleList === 'sample6' || singleList === 'sample7') {
        wordList = words[singleList];
      } else {
        wordList = singleList.split(",").map(word => word.trim());
      }
    } else if (res.listType === '2') {
      let key = "all" + res.wordLength;
      wordList = helpers.grabRandomElementsFromAnArray(words[key], +res.wordListLength);
    } else {
      wordList = helpers.createArrayOfRandomStrings(+res.wordListLength, +res.randomWordLength);
    }

    // run the test
    console.log("Crunching the numbers...")
    let guessAverage = 0;
    let winCount = 0
    let guessCounts = [];
    for (let i = 0; i < numTrials; i++) {
      guessCounts = wordList.map(ans => solvePuzzle(wordList, ans, algorithm));
      guessAverage += helpers.average(guessCounts);
      winCount += guessCounts.filter(count => count <= TOTAL_GUESSES).length
    }
    console.log(`${algorithm.name}, tested on ${wordList}: \n\n Average number of guesses: ${guessAverage/numTrials}, \n Win Percentage: ${winCount/(wordList.length * numTrials)}`);
  }
  process.exit(0);
})