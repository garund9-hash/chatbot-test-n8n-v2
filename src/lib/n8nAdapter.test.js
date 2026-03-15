import { describe, it, expect } from 'vitest';
import { n8nResponseAdapter, UnrecognizedResponseError } from './n8nAdapter.js';

describe('n8nResponseAdapter', () => {
  describe('happy path', () => {
    it('returns plain strings as-is', () => {
      expect(n8nResponseAdapter('hello')).toBe('hello');
    });

    it('extracts output key', () => {
      expect(n8nResponseAdapter({ output: 'bot reply' })).toBe('bot reply');
    });

    it('falls back to message key', () => {
      expect(n8nResponseAdapter({ message: 'fallback' })).toBe('fallback');
    });

    it('output wins over message', () => {
      expect(n8nResponseAdapter({ output: 'a', message: 'b' })).toBe('a');
    });

    it('coerces non-string output to string', () => {
      expect(n8nResponseAdapter({ output: 42 })).toBe('42');
      expect(n8nResponseAdapter({ output: true })).toBe('true');
      expect(n8nResponseAdapter({ output: 0 })).toBe('0');
    });
  });

  describe('fallthrough behaviour', () => {
    it('empty string output falls through to message', () => {
      expect(n8nResponseAdapter({ output: '', message: 'fallback' })).toBe('fallback');
    });

    it('null output falls through to message', () => {
      expect(n8nResponseAdapter({ output: null, message: 'fallback' })).toBe('fallback');
    });

    it('undefined output falls through to message', () => {
      expect(n8nResponseAdapter({ output: undefined, message: 'fallback' })).toBe('fallback');
    });

    it('missing output falls through to message', () => {
      expect(n8nResponseAdapter({ message: 'only-msg' })).toBe('only-msg');
    });

    it('empty string message throws when output is missing', () => {
      expect(() => n8nResponseAdapter({ message: '' })).toThrow(UnrecognizedResponseError);
    });

    it('null message throws when output is missing', () => {
      expect(() => n8nResponseAdapter({ message: null })).toThrow(UnrecognizedResponseError);
    });
  });

  describe('error cases', () => {
    it('throws for empty object', () => {
      expect(() => n8nResponseAdapter({})).toThrow(UnrecognizedResponseError);
    });

    it('throws for null', () => {
      expect(() => n8nResponseAdapter(null)).toThrow(UnrecognizedResponseError);
    });

    it('throws for undefined', () => {
      expect(() => n8nResponseAdapter(undefined)).toThrow(UnrecognizedResponseError);
    });

    it('throws for number', () => {
      expect(() => n8nResponseAdapter(42)).toThrow(UnrecognizedResponseError);
    });

    it('throws for boolean', () => {
      expect(() => n8nResponseAdapter(true)).toThrow(UnrecognizedResponseError);
    });

    it('throws for array', () => {
      expect(() => n8nResponseAdapter([])).toThrow(UnrecognizedResponseError);
    });

    it('throws for object with neither output nor message', () => {
      expect(() => n8nResponseAdapter({ foo: 'bar' })).toThrow(UnrecognizedResponseError);
    });
  });

  describe('UnrecognizedResponseError', () => {
    it('error is instance of UnrecognizedResponseError', () => {
      const bad = { weird: true };
      try {
        n8nResponseAdapter(bad);
        expect.fail('should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(UnrecognizedResponseError);
      }
    });

    it('error carries original data', () => {
      const bad = { weird: true };
      try {
        n8nResponseAdapter(bad);
        expect.fail('should have thrown');
      } catch (e) {
        expect(e.data).toBe(bad);
        expect(e.name).toBe('UnrecognizedResponseError');
      }
    });

    it('error message mentions response shape', () => {
      try {
        n8nResponseAdapter({ invalid: 'shape' });
        expect.fail('should have thrown');
      } catch (e) {
        expect(e.message).toContain('Unrecognized');
      }
    });
  });
});
