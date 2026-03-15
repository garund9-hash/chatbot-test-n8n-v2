import { describe, it, expect } from 'vitest';
import { MessageFactory } from './messageFactory.js';

describe('MessageFactory', () => {
  it('userMessage — correct shape', () => {
    const msg = MessageFactory.userMessage('hello');
    expect(msg.sender).toBe('user');
    expect(msg.text).toBe('hello');
    expect(msg.id).toBeTruthy();
    expect(msg.isError).toBeUndefined();
    expect(msg.isSystem).toBeUndefined();
  });

  it('botMessage — correct shape', () => {
    const msg = MessageFactory.botMessage('hello');
    expect(msg.sender).toBe('bot');
    expect(msg.text).toBe('hello');
    expect(msg.id).toBeTruthy();
    expect(msg.isError).toBeUndefined();
    expect(msg.isSystem).toBeUndefined();
  });

  it('errorMessage — sets isError flag', () => {
    const msg = MessageFactory.errorMessage('oops');
    expect(msg.isError).toBe(true);
    expect(msg.sender).toBe('bot');
    expect(msg.text).toBe('oops');
  });

  it('systemMessage — sets isSystem flag', () => {
    const msg = MessageFactory.systemMessage('note');
    expect(msg.isSystem).toBe(true);
    expect(msg.sender).toBe('bot');
    expect(msg.isError).toBeUndefined();
  });

  it('welcomeMessage — uses constant text', () => {
    const msg = MessageFactory.welcomeMessage();
    expect(msg.text).toMatch(/AI assistant/i);
    expect(msg.sender).toBe('bot');
    expect(msg.isError).toBeUndefined();
    expect(msg.isSystem).toBeUndefined();
  });

  it('each call produces a unique id', () => {
    const a = MessageFactory.userMessage('x');
    const b = MessageFactory.userMessage('x');
    expect(a.id).not.toBe(b.id);
  });

  it('preserves empty string text', () => {
    expect(MessageFactory.userMessage('').text).toBe('');
  });

  it('handles non-string input (pass-through)', () => {
    const obj = { data: 'test' };
    const msg = MessageFactory.userMessage(obj);
    expect(msg.text).toBe(obj);
  });
});
