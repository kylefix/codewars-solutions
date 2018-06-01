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
const CLOSE_PARENS = ')'
const OPEN_PARENS = '('
const OPERATIONS = {
  [MULTIPLY]: (a, b) => a * b,
  [ADD]: (a, b) => a + b,
  [SUBSTRACT]: (a, b) => a - b,
  [DIVIDE]: (a, b) => a / b
}
const ALL_OPERATORS = Object.keys(OPERATIONS)

const count = (arr, str) => arr.reduce((count, ch) => ch === str ? ++count : count, 0)
const indexOf = (str, ...searchValues) => str.findIndex(ch => searchValues.includes(ch))
const push = (xs, ...x) => (xs.push(...x), xs)
const findLastIndex = (arr, fn) => {
  const index = [...arr].reverse().findIndex(fn)
  return ~index ? arr.length + ~index : -1
}

const isAnOperator = str => ALL_OPERATORS.includes(str)

// gets the indices of all OPEN_PARENS
const allOpenParens = expression =>
  [...expression]
    .reduce((indices, ch, index) =>
      ch === OPEN_PARENS ? push(indices, index) : indices
      , [])

const indexOfNextOperator = function * (tokens, operators, result) {
  let nextIndex = indexOf(tokens, ...operators)
  while (~nextIndex) {
    yield nextIndex
    // the caller will take care of removing the found operator from tokens
    // probably not the best practice, but I think it's the clearest in this case
    nextIndex = indexOf(tokens, ...operators)
  }
}

// Only evaluates operators specified in the operators array
const evaluateWithOperators = (tokens, operators) => {
  for (const nextIndex of indexOfNextOperator(tokens, operators)) {
    const evaluatePair = OPERATIONS[tokens[nextIndex]]
    const result = evaluatePair(tokens[nextIndex - 1], tokens[nextIndex + 1])
    // we mutate tokens directly here to get the next operator
    tokens.splice(nextIndex - 1, 3, result)
  }

  return tokens
}

const getSign = operators => Math.pow(-1, count(operators, SUBSTRACT))

const countLastConsecutiveOperators = (tokens) =>
  tokens.length +
  ~findLastIndex(tokens, token => !ALL_OPERATORS.includes(token))

const reduceConsecutiveOperators = (tokens, number) => {
  const extraOperatorsCount = countLastConsecutiveOperators(tokens) - 1
  if (!extraOperatorsCount) return push(tokens, number)
  const operatorsToReduce = tokens.splice(-extraOperatorsCount)

  return push(tokens, getSign(operatorsToReduce) * number)
}

const evaluateLeadingOperators = tokens =>
  [SUBSTRACT, ADD].includes(tokens[0]) &&
    tokens.unshift(0)

const parseTokens = expression =>
  expression
    .match(/([0-9.]+)|([-,+,*,/])/g)
    .reduce((tokens, token) =>
      isAnOperator(token)
        ? push(tokens, token)
        : (evaluateLeadingOperators(tokens, +token),
          reduceConsecutiveOperators(tokens, +token))
      , [])

// evaluates an expression without parenthesis
const evaluate = expression =>
  [[MULTIPLY, DIVIDE], [ADD, SUBSTRACT]]
    .reduce(evaluateWithOperators, parseTokens(expression))
    .pop()

const evaluateSubExpressionAt = (expression, openParens) => {
  const closeParens = expression.indexOf(CLOSE_PARENS, openParens)
  const subExpression = expression.slice(openParens + 1, closeParens)
  const result = evaluate(subExpression)

  return expression.slice(0, openParens) +
         result +
         expression.slice(closeParens + 1)
}

export const calc = expression =>
  // first evaluate everything in between open and closed parenthesis
  // they have to be evaluated in reverse order to make sure to always evaluate
  // the inner most expression
  evaluate(
    allOpenParens(expression)
      .reverse()
      .reduce(evaluateSubExpressionAt, expression)
  )
