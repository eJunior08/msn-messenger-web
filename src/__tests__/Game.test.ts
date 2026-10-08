import { computerMove, getWinner } from '../domain/game';
it('recognizes horizontal, vertical and diagonal wins', () => {
  expect(getWinner(['X', 'X', 'X', null, null, null, null, null, null])).toBe('X');
  expect(getWinner(['O', null, null, 'O', null, null, 'O', null, null])).toBe('O');
  expect(getWinner(['X', null, null, null, 'X', null, null, null, 'X'])).toBe('X');
});
it('distinguishes draws from unfinished games', () => {
  expect(getWinner(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'])).toBe('draw');
  expect(getWinner(Array(9).fill(null))).toBeNull();
});
it('takes a win, blocks a loss and otherwise prefers the center', () => {
  expect(computerMove(['O', 'O', null, 'X', 'X', null, null, null, null])).toBe(2);
  expect(computerMove(['X', 'X', null, null, 'O', null, null, null, null])).toBe(2);
  expect(computerMove(Array(9).fill(null))).toBe(4);
  expect(computerMove(['X', null, null, null, 'O', null, null, null, null])).toBe(1);
  expect(computerMove(Array(9).fill('X'))).toBe(-1);
});
