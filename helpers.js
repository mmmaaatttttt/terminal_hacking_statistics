function createRandomString(length) {
  return new Array(length).fill(0).map(el => {
    return String.fromCharCode(Math.floor(Math.random() * 26 + 97))
  }).join('');
}

function createArrayOfRandomStrings(arrLen, strLen) {
  return new Array(arrLen).fill(0).map(el => createRandomString(strLen));
}

function stringDistance(str1, str2) {
  if (typeof str1 !== 'string' || typeof str2 !== 'string') return 'Both inputs must be strings!';
  if (str2.length !== str1.length) return 'Strings must have the same length!';
  var distance = str1.length;
  for (var i = 0; i < str1.length; i++) {
    if (str1[i].toLowerCase() === str2[i].toLowerCase()) distance--;
  }
  return distance;
}

function averageDistance(str, arr) {
  return arr.reduce((prev, cur) => prev + stringDistance(str, cur), 0)/arr.length;
}

function grabRandomElementsFromAnArray(array, numEls) {
  var arr = [];
  var randIdx;
  if (numEls >= array.length) return array;
  while (arr.length < numEls) {
    randIdx = Math.floor(Math.random() * array.length);
    if (arr.indexOf(array[randIdx]) === -1) arr.push(array[randIdx]);
  }
  return arr;
}

module.exports = {
  createRandomString,
  createArrayOfRandomStrings,
  stringDistance,
  averageDistance,
  averageAverageDistance,
  grabRandomElementsFromAnArray
}