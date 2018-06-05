import {calc} from '../src/Calculator'

test('', () => {
  expect(calc('--1')).toBe(1)
  expect(calc('(--31+23)')).toBe(54)
  expect(calc('(--31+23+(----90-2/3)*-+---21-33)')).toBe(1897)
  expect(calc('((((((((((--23)))))))))*200)')).toBe(4600)
})
