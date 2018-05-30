 /* Write a method that takes a field for well-known board game "Battleship" as
 an argument and returns true if it has a valid disposition of ships, false
 otherwise. Argument is guaranteed to be 10*10 two-dimension array. Elements in
 the array are numbers, 0 if the cell is free and 1 if occupied by ship.

 Battleship (also Battleships or Sea Battle) is a guessing game for two players.
 Each player has a 10x10 grid containing several "ships" and objective is to
 destroy enemy's forces by targetting individual cells on his field. The ship
 occupies one or more cells in the grid. Size and number of ships may differ
 from version to version. In this kata we will use Soviet/Russian version of the
 game.

 Before the game begins, players set up the board and place the ships
 accordingly to the following rules: There must be single battleship (size of 4
 cells), 2 cruisers (size 3), 3 destroyers (size 2) and 4 submarines (size 1).
 Any additional ships are not allowed, as well as missing ships. Each ship must
 be a straight line, except for submarines, which are just single cell.

 The ship cannot overlap or be in contact with any other ship, neither by edge
 nor by corner. */

const objectsAreEqual = (a, b) => Object.keys(a).every(x => a[x] === b[x]) && Object.keys(b).every(x => b[x] == a[x])
const verifyCell = (rowIndex, cellIndex, field) => field[rowIndex][cellIndex] === 1 ? [rowIndex, cellIndex] : false
const removeShipFromField = (cells, field) => cells.forEach(cell => field[cell[0]][cell[1]] = 0)

const findAdjacentOnes = (rowIndex, cellIndex, field) => {
  const DIRECTIONS_TO_SEARCH = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ]
  return DIRECTIONS_TO_SEARCH.map(([rowInc, cellInc]) => {
    return (field[rowIndex + rowInc] !== undefined)
      ? verifyCell(rowIndex + rowInc, cellIndex + cellInc, field)
      : false
  }).filter(cell => !!cell)
}

const getAllHorizontalOnes = (rowIndex, cellIndex, field) => {
  let zeroFound = false // toggle to short-circuit reduce
  return field[rowIndex].slice(cellIndex + 1).reduce((acc, cell, index) => {
    return (!cell || zeroFound)
      ? (zeroFound = true, acc)
      : (acc.push([rowIndex, cellIndex + 1 + index]), acc)
  }, [])
}

const getAllVerticalOnes = (rowIndex, cellIndex, field) => {
  let zeroFound = false
  return field.slice(rowIndex + 1).reduce((acc, row, index) => {
    return (!row[cellIndex] || zeroFound)
      ? (zeroFound = true, acc)
      : (acc.push([rowIndex + 1 + index, cellIndex]), acc)
  }, [])
}

const getDirection = (rowIndex1, rowIndex2, cellIndex1, cellIndex2) => {
  const DIRECTIONS = {
    '10': 'isVertical',
    '01': 'isHorizontal',
    '11': 'isDiagonal',
    '1-1': 'isBackwardDiagonal'
  }
  return DIRECTIONS[(rowIndex1 - rowIndex2).toString() + (cellIndex1 - cellIndex2).toString()]
}

const getShipAtCell = (rowIndex, cellIndex, field) => {
  const ship = [[rowIndex, cellIndex]]
  const adjacentOnes = findAdjacentOnes(rowIndex, cellIndex, field)
  if (!adjacentOnes[0]) return ship // 1 cell ship found
  if (adjacentOnes.length > 1) return false
  const direction = getDirection(adjacentOnes[0][0], rowIndex, adjacentOnes[0][1], cellIndex)
  if (direction === 'isDiagonal') return false
  if (direction === 'isBackwardDiagonal') return false
  if (direction === 'isVertical') ship.push([rowIndex + 1, cellIndex], ...getAllVerticalOnes(rowIndex + 1, cellIndex, field))
  if (direction === 'isHorizontal') ship.push([rowIndex, cellIndex + 1], ...getAllHorizontalOnes(rowIndex, cellIndex + 1, field))
  return ship
}

// Has side effects, it will remove found ships from field
const getShipsAtRow = (rowIndex, field) => {
  return field[rowIndex].reduce((ships, cell, cellIndex) => {
    if (!ships || !cell) return ships
    const shipFound = getShipAtCell(rowIndex, cellIndex, field)
    if (!shipFound) return false
    removeShipFromField(shipFound, field)
    return ships.push(shipFound), ships
  }, [])
}

const updateShipQuantities = (shipsFound, shipQuantities) => {
  const updatedQuantities = Object.assign({}, shipQuantities)
  return shipsFound.reduce((shipQuantities, ship) => {
    shipQuantities[ship.length] = (shipQuantities[ship.length] || 0) + 1
    return shipQuantities
  }, updatedQuantities)
}

const validateShipQuantity = ships => {
  const VALID_SHIP_QUANTITIES = {
    '1': 4,
    '2': 3,
    '3': 2,
    '4': 1
  }
  return objectsAreEqual(VALID_SHIP_QUANTITIES, ships)
}

function validateBattlefield (field) {
  return validateShipQuantity(field.reduce((shipQuantities, row, rowIndex) => {
    if (!shipQuantities) return false
    const shipsFound = getShipsAtRow(rowIndex, field)
    if (!shipsFound) return false
    return updateShipQuantities(shipsFound, shipQuantities)
  }, {}))
}
