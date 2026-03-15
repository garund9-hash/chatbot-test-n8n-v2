import { describe, it, expect, vi } from 'vitest';
import { isCommand, executeCommand } from './commandRegistry.js';

const makeCtx = () => ({
  clearChat: vi.fn(),
  addSystemMessage: vi.fn(),
  sessionId: 'test-session-id',
});

describe('isCommand', () => {
  it('recognises /clear', () => {
    expect(isCommand('/clear')).toBe(true);
  });

  it('recognises /help', () => {
    expect(isCommand('/help')).toBe(true);
  });

  it('rejects unknown command', () => {
    expect(isCommand('/foo')).toBe(false);
  });

  it('rejects plain text (no slash)', () => {
    expect(isCommand('hello')).toBe(false);
  });

  it('normalises case and whitespace', () => {
    expect(isCommand('  /CLEAR  ')).toBe(true);
    expect(isCommand('  /HELP  ')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isCommand('')).toBe(false);
  });

  it('rejects whitespace-only input', () => {
    expect(isCommand('   ')).toBe(false);
  });
});

describe('executeCommand', () => {
  it('/clear calls clearChat()', () => {
    const ctx = makeCtx();
    executeCommand('/clear', ctx);
    expect(ctx.clearChat).toHaveBeenCalledOnce();
  });

  it('/help calls addSystemMessage with available commands', () => {
    const ctx = makeCtx();
    executeCommand('/help', ctx);
    expect(ctx.addSystemMessage).toHaveBeenCalledOnce();
    const msg = ctx.addSystemMessage.mock.calls[0][0];
    expect(msg).toContain('/clear');
    expect(msg).toContain('/help');
  });

  it('unknown command throws with helpful message', () => {
    const ctx = makeCtx();
    expect(() => executeCommand('/nope', ctx)).toThrow('Unknown command: /nope');
  });

  it('normalises mixed-case and whitespace input', () => {
    const ctx = makeCtx();
    executeCommand('  /CLEAR  ', ctx);
    expect(ctx.clearChat).toHaveBeenCalledOnce();
  });

  it('/help does not execute other commands', () => {
    const ctx = makeCtx();
    executeCommand('/help', ctx);
    expect(ctx.clearChat).not.toHaveBeenCalled();
  });
});
