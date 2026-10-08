import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Composer } from '../components/Composer';
it('sends on Enter and preserves line breaks with Shift+Enter', async () => {
  const send = jest.fn(async () => true); const user = userEvent.setup();
  render(<Composer contactId="jamie" disabled={false} onSend={send} onError={jest.fn()} />);
  await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Hey{Shift>}{Enter}{/Shift}friend');
  expect(send).not.toHaveBeenCalled();
  await user.keyboard('{Enter}');
  expect(send).toHaveBeenCalledWith('Hey\nfriend', 'text', { bold: false });
  expect(screen.getByRole('textbox')).toHaveValue('');
});
it('retains the draft after a failed send', async () => {
  const user = userEvent.setup();
  render(<Composer contactId="jamie" disabled={false} onSend={async () => false} onError={jest.fn()} />);
  await user.type(screen.getByRole('textbox'), 'Please keep this{Enter}');
  expect(screen.getByRole('textbox')).toHaveValue('Please keep this');
});
it('inserts an emoticon and applies bold formatting', async () => {
  const send = jest.fn(async () => true); const user = userEvent.setup();
  render(<Composer contactId="jamie" disabled={false} onSend={send} onError={jest.fn()} />);
  await user.click(screen.getByRole('button', { name: 'Choose an emoticon' }));
  await user.click(screen.getByRole('button', { name: 'Insert 😊' }));
  await user.click(screen.getByRole('button', { name: 'Bold text' }));
  await user.click(screen.getByRole('button', { name: /^Send$/ }));
  expect(send).toHaveBeenCalledWith('😊', 'text', { bold: true });
});
it('disables messaging controls for a blocked contact', () => {
  render(<Composer contactId="jamie" disabled onSend={jest.fn()} onError={jest.fn()} />);
  expect(screen.getByRole('textbox')).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Send a nudge' })).toBeDisabled();
});
