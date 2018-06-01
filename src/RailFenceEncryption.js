 /* Create two functions to encode and then decode a string using the Rail Fence
 Cipher. This cipher is used to encode a string by placing each character
 successively in a diagonal along a set of "rails". First start off moving
 diagonally and down. When you reach the bottom, reverse direction and move
 diagonally and up until you reach the top rail. Continue until you reach the
 end of the string. Each "rail" is then read left to right to derive the encoded
 string. You can optionally include or dis-include punctuation.

 For example, this string: "WE ARE DISCOVERED. FLEE AT ONCE" would be mapped to
 a three rail system as follows (omitting punctuation and spaces):

 W . . . E . . . C . . . R . . . L . . . T . . . E . E . R . D . S . O . E . E .
 F . E . A . O . C . . . A . . . I . . . V . . . D . . . E . . . N . . The
 encoded string would be:

 WECRLTEERDSOEEFEAOCAIVDEN Write a function/method that takes 2 arguments, a
 string and the number of rails, and returns the ENCODED string.

 Write a second function/method that takes 2 arguments, an encoded string and
 the number of rails, and returns the DECODED string.

 For both encoding and decoding, assume number of rails >= 2 and that passing an
 empty string will return an empty string.

 Note that the example above excludes the punctuation and spaces just for
 simplicity. There are, however, tests that include punctuation. Don't filter
 out the punctuation as they are a part of the string. */

const repeat = a => Array.from({length: a}, (_, i) => i)
const insert = (xs, i, x) => { xs[i] = x; return xs }
const push = (xs, ...x) => { xs.push(...x); return xs }
const pushAtIndex = (xs, i, ...x) => { xs[i].push(...x); return xs }
const flatten = xs => xs.reduce((acc, val) => push(acc, ...val), [])

const zigzagSequence = function (period) {
  let n = 0
  const generator = function * () {
    while (true) yield Math.abs(n - 2 * period * Math.round(n++ / (period * 2)))
  }
  return {getNext: () => generator().next().value}
}

const getRailFenceMatrix = (numberRails, count) => {
  const matrix = [...Array(numberRails)].map(_ => [])
  const rowIndex = zigzagSequence(numberRails - 1)
  return flatten(repeat(count).reduce((acc, n) => pushAtIndex(acc, rowIndex.getNext(), n), matrix))
}

const encodeRailFenceCipher = (string, numberRails) => {
  const flatMatrix = getRailFenceMatrix(numberRails, string.length)
  return flatMatrix.map(index => string[index]).join('')
}

const decodeRailFenceCipher = (string, numberRails) => {
  const flatMatrix = getRailFenceMatrix(numberRails, string.length)
  const chars = string.split('').reverse()
  return flatMatrix.reduce((acc, railIndex) => insert(acc, railIndex, chars.pop()), []).join('')
}
