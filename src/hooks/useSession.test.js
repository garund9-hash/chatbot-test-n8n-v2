import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSession } from './useSession.js';

const STORAGE_KEY = 'chat_session_id';
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

beforeEach(() => localStorage.clear());

describe('useSession', () => {
  describe('initial mount', () => {
    it('generates a UUID v4 on first mount', () => {
      const { result } = renderHook(() => useSession());
      expect(result.current.sessionId).toMatch(UUID_V4_REGEX);
    });

    it('persists generated ID in localStorage', () => {
      const { result } = renderHook(() => useSession());
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBe(result.current.sessionId);
      expect(stored).toMatch(UUID_V4_REGEX);
    });

    it('ID is a non-empty string', () => {
      const { result } = renderHook(() => useSession());
      expect(result.current.sessionId).toBeTruthy();
      expect(typeof result.current.sessionId).toBe('string');
      expect(result.current.sessionId.length).toBeGreaterThan(0);
    });
  });

  describe('reusing existing session', () => {
    it('reuses existing ID from localStorage', () => {
      const existingId = 'test-id-12345';
      localStorage.setItem(STORAGE_KEY, existingId);
      const { result } = renderHook(() => useSession());
      expect(result.current.sessionId).toBe(existingId);
    });

    it('does not overwrite localStorage on reuse', () => {
      const existingId = '12345678-1234-4123-8123-123456789012';
      localStorage.setItem(STORAGE_KEY, existingId);
      renderHook(() => useSession());
      expect(localStorage.getItem(STORAGE_KEY)).toBe(existingId);
    });

    it('multiple mounts return same ID from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'same-id');
      const { result: result1 } = renderHook(() => useSession());
      const { result: result2 } = renderHook(() => useSession());
      expect(result1.current.sessionId).toBe('same-id');
      expect(result2.current.sessionId).toBe('same-id');
    });
  });

  describe('resetSession', () => {
    it('resetSession returns a new ID', () => {
      const { result } = renderHook(() => useSession());
      const oldId = result.current.sessionId;
      let newId;
      act(() => {
        newId = result.current.resetSession();
      });
      expect(newId).not.toBe(oldId);
      expect(newId).toMatch(UUID_V4_REGEX);
    });

    it('resetSession updates state', () => {
      const { result } = renderHook(() => useSession());
      const oldId = result.current.sessionId;
      act(() => {
        result.current.resetSession();
      });
      expect(result.current.sessionId).not.toBe(oldId);
      expect(result.current.sessionId).toMatch(UUID_V4_REGEX);
    });

    it('resetSession updates localStorage', () => {
      const { result } = renderHook(() => useSession());
      const oldId = result.current.sessionId;
      act(() => {
        result.current.resetSession();
      });
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBe(oldId);
      expect(stored).toBe(result.current.sessionId);
    });

    it('resetSession generates a valid UUID v4', () => {
      const { result } = renderHook(() => useSession());
      let newId;
      act(() => {
        newId = result.current.resetSession();
      });
      expect(newId).toMatch(UUID_V4_REGEX);
    });

    it('multiple resets produce unique IDs', () => {
      const { result } = renderHook(() => useSession());
      let id1, id2, id3;
      act(() => {
        id1 = result.current.resetSession();
        id2 = result.current.resetSession();
        id3 = result.current.resetSession();
      });
      expect(new Set([id1, id2, id3]).size).toBe(3);
    });
  });

  describe('localStorage edge cases', () => {
    it('handles garbage value in localStorage gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'not-a-uuid');
      const { result } = renderHook(() => useSession());
      expect(result.current.sessionId).toBe('not-a-uuid');
    });

    it('handles null localStorage value', () => {
      localStorage.setItem(STORAGE_KEY, 'test');
      localStorage.removeItem(STORAGE_KEY);
      const { result } = renderHook(() => useSession());
      expect(result.current.sessionId).toMatch(UUID_V4_REGEX);
    });

    it('handles empty string in localStorage', () => {
      localStorage.setItem(STORAGE_KEY, '');
      const { result } = renderHook(() => useSession());
      expect(result.current.sessionId).toMatch(UUID_V4_REGEX);
    });
  });
});
