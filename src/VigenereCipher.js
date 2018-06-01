/* This is the advanced version of the Vigenère Cipher Helper kata. The
 following assumes that you have already completed that kata -- if you haven't
 done it yet, you should start there.

 The basic concept is the same as in the previous kata (see the detailed
 explanation there). However, there is a major difference:

 With the basic Vigenère Cipher, we assume the key is repeated for the length of
 the text. In this kata, the key is only used once, and then complemented by the
 decoded text. Thus every encoding and decoding is independent (still using the
 same key to begin with). Furthermore, the key index is only incremented if the
 current letter is in the provided alphabet.

 Visual representation:

 "password" // original key "my secret code i want to secure" // message "pa
 ssword myse c retc od eiwant" // full key used Write a class that, when given a
 key and an alphabet, can be used to encode and decode from the cipher.

 Examples Any character not in the alphabet should be left alone. For example
 (following from above):

 c.encode('CODEWARS'); // returns 'CODEWARS' */

const DECODE = -1
const ENCODE = 1

const modulus = (a, b) => (((a % b) + b) % b)
const range = (a, b) => Array.from({length: b - a + 1}, (_, i) => a + i)
const getTokenAtIndex = (str, tokenSize, index) => str.slice(tokenSize * index, tokenSize * (index + 1))
const shiftLetter = (index, shift, arr) => arr[modulus(index + shift, arr.length)]

const mergeWithTemplate = (key, template, alphabet) => {
  key = key.split('')

  return template.split('').reduce((merged, ch) =>
    merged + (!~alphabet.indexOf(ch)
      ? ch
      : (key.push(ch), key.shift()))
    , '')
}

const transform = (str, key, alphabet, direction) => {
  const shifts = mergeWithTemplate(key, str, alphabet)
    .split('')
    .map(ch => alphabet.indexOf(ch))

  return str.split('').map((ch, i) => {
    let indexInAlphabet = alphabet.indexOf(ch)
    return !~indexInAlphabet
      ? ch
      : shiftLetter(
        indexInAlphabet,
        direction * shifts[i % shifts.length],
        alphabet)
  }).join('')
}

function VigenèreAutokeyCipher (key, alphabet) {
  this.encode = decodedStr => transform(decodedStr, key, alphabet, ENCODE)
  this.decode = encodedStr => {
    let numberOfTokens = ~~(encodedStr.length / key.length)

    return range(0, numberOfTokens).reduce((decodedResult, i) => {
      let substrToDecode = decodedResult + getTokenAtIndex(encodedStr, key.length, i)
      let substrDecoded = transform(substrToDecode, key, alphabet, DECODE)
      return decodedResult + getTokenAtIndex(substrDecoded, key.length, i)
    }, '')
  }
}
