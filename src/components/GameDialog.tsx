import { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { computerMove, getWinner, type Square } from '../domain/game';
import { Modal } from './Modal';
export function GameDialog({ onClose }: { onClose: () => void }) {
  const [board, setBoard] = useState<Square[]>(Array(9).fill(null));
  const winner = getWinner(board);
  function play(index: number) {
    if (board[index] || winner) return;
    const next = [...board]; next[index] = 'X';
    if (!getWinner(next)) { const move = computerMove(next); if (move >= 0) next[move] = 'O'; }
    setBoard(next);
  }
  return <Modal title="A friendly little competition" onClose={onClose}><div className="game-content">
    <Gamepad2 size={32} /><h3>Tic-tac-toe</h3><p>You’re X. Your local computer opponent is O.</p>
    <div className="game-board">{board.map((square, index) => <button key={index} aria-label={`Square ${index + 1}${square ? `: ${square}` : ''}`}
      disabled={!!square || !!winner} className={square === 'O' ? 'opponent' : ''} onClick={() => play(index)}>{square}</button>)}</div>
    <p role="status">{winner === 'draw' ? 'A draw! Great minds think alike.' : winner === 'X' ? 'You won! Bragging rights unlocked.' : winner === 'O' ? 'The computer wins. One more round?' : 'Your turn. Make your move.'}</p>
    <button className="primary-button" onClick={() => setBoard(Array(9).fill(null))}>New game</button>
  </div></Modal>;
}
