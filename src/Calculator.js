/* Instructions Given a mathematical expression as a string you must return the
 result as a number.

 Numbers Number may be both whole numbers and/or decimal numbers. The same goes
 for the returned result.

 Operators You need to support the following mathematical operators:

 Multiplication * Division / Addition + Subtraction - Operators are always
 evaluated from left-to-right, and * and / must be evaluated before + and -.

 Parentheses You need to support multiple levels of nested parentheses, ex. (2 /
 (2 + 3.33) * 4) - -6

 Whitespace There may or may not be whitespace between numbers and operators.

 An addition to this rule is that the minus sign (-) used for negating numbers
 and parentheses will never be separated by whitespace. I.e., all of the
 following are valid expressions.

 1-1 // 0 1 -1 // 0 1- 1 // 0 1 - 1 // 0 1- -1 // 2 1 - -1 // 2

 6 + -(4) // 2 6 + -( -4) // 10 And the following are invalid expressions

 1 - - 1 // Invalid 1- - 1 // Invalid 6 + - (4) // Invalid 6 + -(- 4) // Invalid
 Validation You do not need to worry about validation - you will only receive
 valid mathematical expressions following the above rules.

 NOTE: Both eval and Function are disabled. */

const MULTIPLY = '*'
const ADD = '+'
const SUBSTRACT = '-'
const DIVIDE = '/'
const OPERATIONS = {
  [MULTIPLY]: (a, b) => a * b,
  [ADD]: (a, b) => a + b,
  [SUBSTRACT]: (a, b) => a - b,
  [DIVIDE]: (a, b) => a / b
}
const ALL_OPERATORS = Object.keys(OPERATIONS)
const evaluatePairWith = (a, b, operator) => OPERATIONS[operator](a, b)
const evaluatePairAt = tokens =>
  index => evaluatePairWith(tokens[index - 1], tokens[index + 1], tokens[index])

const count = (arr, str) => arr.filter(ch => ch === str).length
const indexOf = (str, ...searchValues) => str.findIndex(ch => searchValues.includes(ch))
const push = (xs, ...x) => ((xs.push(...x), xs))
const isAnOperator = str => ALL_OPERATORS.includes(str)
const getSign = operators => Math.pow(-1, count(operators, SUBSTRACT))

const replaceAt = ([...xs], start, deleteCount) =>
  value => ((xs.splice(start, deleteCount, value), xs))

const compose = (...fns) =>
  initial => fns.reduceRight((args, fn) => fn(args), initial)

const findLastIndex = ([...arr], fn) => {
  const index = arr.reverse().findIndex(fn)
  return ~index ? arr.length + ~index : -1
}

const lastIndexNotIncluding = (xs, values) =>
  findLastIndex(xs, item => !values.includes(item))

// Only evaluates operators specified in the operators array
const evaluateTokensWith = (tokens, operators) => {
  const nextIndex = indexOf(tokens, ...operators)
  if (!~nextIndex) return tokens

  const evaluateWith = operators =>
    tokens => evaluateTokensWith(tokens, operators)

  const evaluateTokensWithAt = compose(
    evaluateWith(operators),
    replaceAt(tokens, nextIndex - 1, 3),
    evaluatePairAt(tokens)
  )

  return evaluateTokensWithAt(nextIndex)
}

const evaluateTokens = tokens =>
  [[MULTIPLY, DIVIDE], [ADD, SUBSTRACT]]
    .reduce(evaluateTokensWith, tokens)
    .pop()

// reduce consecutive + and/or - to a single sign
const reduceConsecutiveOperators = ([...tokens], token) => {
  if (isAnOperator(token)) return push(tokens, token)

  const extraOperatorsCount =
    tokens.length + ~lastIndexNotIncluding(tokens, ALL_OPERATORS) - 1

  if (!extraOperatorsCount) return push(tokens, +token)

  const operatorsToReduce = tokens.splice(-extraOperatorsCount)

  return push(tokens, getSign(operatorsToReduce) * token)
}

// will turn [-,5] into [0,-,5]
const fixLeadingOperator = tokens => {
  [SUBSTRACT, ADD].includes(tokens[0]) && tokens.unshift(0)
  return tokens
}

const parseTokens = expression =>
  expression
    .match(/([0-9.]+)|([-,+,*,/])/g)
    .reduce(reduceConsecutiveOperators, [])

const evaluate = compose(
  evaluateTokens,
  fixLeadingOperator,
  parseTokens
)

const evaluateInnerMost = expression =>
  expression.replace(
    /(\((?!.*\().*?\))/, // look for inner most parens
    match => evaluate(match.slice(1, -1))
  )

export const calc = expression =>
  expression.includes('(')
    ? calc(evaluateInnerMost(expression))
    : evaluate(expression)
