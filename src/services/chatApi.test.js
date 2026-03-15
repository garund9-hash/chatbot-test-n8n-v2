import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chatApi } from './chatApi.js';

const mockFetch = (ok, body) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 400,
    statusText: ok ? 'OK' : 'Bad Request',
    json: () => Promise.resolve(body),
  }));
};

beforeEach(() => vi.unstubAllGlobals());

describe('chatApi.sendMessage', () => {
  describe('successful responses', () => {
    it('returns extracted string on success with output', async () => {
      mockFetch(true, { output: 'hello there' });
      const result = await chatApi.sendMessage('hi', 'session-1');
      expect(result).toBe('hello there');
    });

    it('returns plain string response', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve('plain string'),
      }));
      const result = await chatApi.sendMessage('hi', 'session-1');
      expect(result).toBe('plain string');
    });

    it('returns message key when output is missing', async () => {
      mockFetch(true, { message: 'fallback reply' });
      const result = await chatApi.sendMessage('hi', 'session-1');
      expect(result).toBe('fallback reply');
    });
  });

  describe('request payload', () => {
    it('sends correct POST body with message and sessionId', async () => {
      mockFetch(true, { output: 'ok' });
      await chatApi.sendMessage('my message', 'my-session');
      expect(fetch).toHaveBeenCalledOnce();
      const [url, options] = fetch.mock.calls[0];
      expect(url).toBe('/api/chat');
      expect(options.method).toBe('POST');
      const body = JSON.parse(options.body);
      expect(body).toEqual({ message: 'my message', sessionId: 'my-session' });
    });

    it('sends correct Content-Type header', async () => {
      mockFetch(true, { output: 'ok' });
      await chatApi.sendMessage('hi', 'sid');
      const [, options] = fetch.mock.calls[0];
      expect(options.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('error handling', () => {
    it('throws with server error message on non-ok response', async () => {
      mockFetch(false, { error: 'Server exploded' });
      await expect(chatApi.sendMessage('hi', 'sid')).rejects.toThrow('Server exploded');
    });

    it('throws with status fallback when response body is not JSON', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: () => Promise.reject(new SyntaxError('bad json')),
      }));
      await expect(chatApi.sendMessage('hi', 'sid')).rejects.toThrow(/503|Service Unavailable/);
    });

    it('throws with status code when error body has no error key', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: () => Promise.resolve({ message: 'rate limited' }),
      }));
      await expect(chatApi.sendMessage('hi', 'sid')).rejects.toThrow(/429|Too Many Requests/);
    });

    it('propagates network errors', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
      await expect(chatApi.sendMessage('hi', 'sid')).rejects.toThrow('Failed to fetch');
    });

    it('handles unrecognized response shape from adapter', async () => {
      mockFetch(true, { unknown: 'shape' });
      await expect(chatApi.sendMessage('hi', 'sid')).rejects.toThrow('Unrecognized');
    });
  });

  describe('edge cases', () => {
    it('handles very long message', async () => {
      mockFetch(true, { output: 'ok' });
      const longMsg = 'a'.repeat(10000);
      await chatApi.sendMessage(longMsg, 'sid');
      const [, options] = fetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.message).toBe(longMsg);
    });

    it('handles empty message (server-side validation)', async () => {
      mockFetch(true, { output: 'ok' });
      await chatApi.sendMessage('', 'sid');
      const [, options] = fetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.message).toBe('');
    });

    it('handles special characters in message', async () => {
      mockFetch(true, { output: 'ok' });
      const special = '{"test": "value"}\n\t<>&"';
      await chatApi.sendMessage(special, 'sid');
      const [, options] = fetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.message).toBe(special);
    });
  });
});
