function duplicateString (word) {
  let result = '';

  for (let letter of word.toLowerCase()) {
    word.indexOf(letter) === word.lastIndexOf(letter) ? result += '1' : result += '*';
  }

  return result
}

console.log(duplicateString('Hello'))
console.log(duplicateString('din'))
console.log(duplicateString('recede'))
console.log(duplicateString('Success'))
console.log(duplicateString('11*2'))