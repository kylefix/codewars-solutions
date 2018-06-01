/* I'm sure, you know Google's "Did you mean ...?", when you entered a search
 term and mistyped a word. In this kata we want to implement something similar.

 You'll get an entered term (lowercase string) and an array of known words (also
 lowercase strings). Your task is to find out, which word from the dictionary is
 most similar to the entered one. The similarity is described by the minimum
 number of letters you have to add, remove or replace in order to get from the
 entered word to one of the dictionary. The lower the number of required
 changes, the higher the similarity between each two words.

 Same words are obviously the most similar ones. A word that needs one letter to
 be changed is more similar to another word that needs 2 (or more) letters to be
 changed. E.g. the mistyped term berr is more similar to beer (1 letter to be
 replaced) than to barrel (3 letters to be changed in total).

 Extend the dictionary in a way, that it is able to return you the most similar
 word from the list of known words.

 Code Examples: */

function Dictionary (words) {
  this.words = words
}

const range = (a, b) => Array.from({length: b}, (_, i) => i + a)

// https://en.wikipedia.org/wiki/Wagner%E2%80%93Fischer_algorithm
const wagnerFischer = function (a, b) {
  const matrix = Array.from({length: b.length + 1}, (_, row) => {
    const firstRow = (_, column) => column
    const otherRows = (_, column) => !column ? row : 0
    return Array.from({length: a.length + 1}, !row ? firstRow : otherRows)
  })
  for (const row of range(1, b.length)) {
    for (const column of range(1, a.length)) {
      matrix[row][column] = a[column] === b[row]
        ? matrix[row - 1][column - 1]
        : 1 + Math.min(matrix[row][column - 1],
          matrix[row - 1][column],
          matrix[row - 1][column - 1])
    }
  }
  return matrix[b.length][a.length]
}

Dictionary.prototype.findMostSimilar = function (term) {
  return this.words.reduce((smallestDiff, word) => {
    const diff = wagnerFischer(term, word)
    return (diff > smallestDiff[0]) ? smallestDiff : [diff, word]
  }, []).pop()
}
