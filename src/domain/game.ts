export type Square = 'X' | 'O' | null;
export function getWinner(board: Square[]): 'X' | 'O' | 'draw' | null {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (const [a, b, c] of lines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  return board.every(Boolean) ? 'draw' : null;
}
export function computerMove(board: Square[]): number {
  const empty = board.flatMap((value, index) => value ? [] : [index]);
  for (const player of ['O', 'X'] as const) {
    const best = empty.find(index => { const next = [...board]; next[index] = player; return getWinner(next) === player; });
    if (best !== undefined) return best;
  }
  return board[4] === null ? 4 : (empty[0] ?? -1);
}
